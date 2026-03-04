package handlers

import (
	"log"
	"net/http"
	"time"

	unstoppabledomainssdk "github.com/unstoppabledomains/reseller-sdk-go"
	"github.com/unstoppabledomains/reseller-sdk-go/models/components"

	"github.com/unstoppabledomains/reseller-go-sdk-demo/internal/auth"
	"github.com/unstoppabledomains/reseller-go-sdk-demo/internal/models"
)

type purchaseConfirmRequest struct {
	Domain    string `json:"domain"`
	ContactID string `json:"contactId"`
	Period    int    `json:"period"`
}

func (h *Handlers) HandlePurchasePreview(w http.ResponseWriter, r *http.Request) {
	domain := r.PathValue("domain")
	user := auth.UserFromContext(r.Context())

	detail, err := h.SDK.GetDomainDetail(r.Context(), domain)
	if err != nil {
		writeError(w, http.StatusBadGateway, "Failed to look up domain: "+err.Error())
		return
	}

	type contactOption struct {
		ID   string `json:"id"`
		Name string `json:"name"`
	}
	contacts := make([]contactOption, 0, len(user.ContactIDs))
	for _, id := range user.ContactIDs {
		opt := contactOption{ID: id, Name: id}
		c, err := h.SDK.GetContact(r.Context(), id)
		if err != nil {
			log.Printf("[purchase] failed to fetch contact %s: %v", id, err)
		} else if c != nil {
			opt.Name = c.FirstName + " " + c.LastName
		}
		contacts = append(contacts, opt)
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"domain":   domain,
		"detail":   detail,
		"contacts": contacts,
	})
}

func (h *Handlers) HandlePurchaseConfirm(w http.ResponseWriter, r *http.Request) {
	user := auth.UserFromContext(r.Context())

	var req purchaseConfirmRequest
	if err := readJSON(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if req.Domain == "" || req.ContactID == "" {
		writeError(w, http.StatusBadRequest, "Domain and contact are required")
		return
	}

	period := req.Period
	if period < 1 || period > 10 {
		period = 1
	}

	body := components.DomainRegistrationRequestBody{
		Name: req.Domain,
		Owner: &components.DomainRegistrationRequestBodyOwner{
			Type: components.DomainRegistrationRequestBodyOwnerTypeSelf,
			Contact: &components.DomainOwnerContactRequestBody{
				ID: unstoppabledomainssdk.String(req.ContactID),
			},
		},
		DNS: &components.DomainRegistrationRequestBodyDNS{
			Period: unstoppabledomainssdk.Float64(float64(period)),
		},
	}

	op, err := h.SDK.RegisterDomain(r.Context(), body)
	if err != nil {
		writeError(w, http.StatusBadGateway, "Registration failed: "+err.Error())
		return
	}

	_ = h.Store.Transact(func(db *models.Database) error {
		u := db.Users[user.Username]
		if u.Domains == nil {
			u.Domains = make(map[string]*models.DomainRecord)
		}
		u.Domains[req.Domain] = &models.DomainRecord{
			Name:         req.Domain,
			RegisteredAt: time.Now(),
			ContactID:    req.ContactID,
			OperationID:  op.ID,
		}
		return nil
	})

	writeJSON(w, http.StatusOK, map[string]string{
		"operationId": op.ID,
		"message":     "Domain registration initiated",
	})
}

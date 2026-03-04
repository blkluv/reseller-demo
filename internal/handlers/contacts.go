package handlers

import (
	"log"
	"net/http"

	"github.com/unstoppabledomains/reseller-go-sdk-demo/internal/auth"
	"github.com/unstoppabledomains/reseller-go-sdk-demo/internal/models"
	"github.com/unstoppabledomains/reseller-sdk-go/models/components"
)

type contactCreateRequest struct {
	FirstName     string `json:"firstName"`
	LastName      string `json:"lastName"`
	Email         string `json:"email"`
	CountryCode   string `json:"countryCode"`
	Street        string `json:"street"`
	City          string `json:"city"`
	PostalCode    string `json:"postalCode"`
	StateProvince string `json:"stateProvince"`
	PhonePrefix   string `json:"phonePrefix"`
	PhoneNumber   string `json:"phoneNumber"`
	Organization  string `json:"organization,omitempty"`
}

func (h *Handlers) HandleContactList(w http.ResponseWriter, r *http.Request) {
	user := auth.UserFromContext(r.Context())

	type contactInfo struct {
		ID        string `json:"id"`
		FirstName string `json:"firstName,omitempty"`
		LastName  string `json:"lastName,omitempty"`
		Email     string `json:"email,omitempty"`
		Error     string `json:"error,omitempty"`
	}

	contacts := make([]contactInfo, 0, len(user.ContactIDs))
	for _, id := range user.ContactIDs {
		info := contactInfo{ID: id}
		detail, err := h.SDK.GetContact(r.Context(), id)
		if err != nil {
			log.Printf("[contacts] failed to fetch contact %s: %v", id, err)
			info.Error = "Could not fetch details"
		} else if detail != nil {
			info.FirstName = detail.FirstName
			info.LastName = detail.LastName
			info.Email = detail.Email
		}
		contacts = append(contacts, info)
	}

	writeJSON(w, http.StatusOK, map[string]any{"contacts": contacts})
}

func (h *Handlers) HandleContactDelete(w http.ResponseWriter, r *http.Request) {
	user := auth.UserFromContext(r.Context())
	contactID := r.PathValue("id")

	found := false
	_ = h.Store.Transact(func(db *models.Database) error {
		u := db.Users[user.Username]
		for i, id := range u.ContactIDs {
			if id == contactID {
				u.ContactIDs = append(u.ContactIDs[:i], u.ContactIDs[i+1:]...)
				found = true
				break
			}
		}
		return nil
	})

	if !found {
		writeError(w, http.StatusNotFound, "Contact not found in your account")
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{"message": "Contact removed"})
}

func (h *Handlers) HandleContactCreate(w http.ResponseWriter, r *http.Request) {
	user := auth.UserFromContext(r.Context())

	var req contactCreateRequest
	if err := readJSON(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	body := components.ContactCreateRequestBody{
		FirstName:     req.FirstName,
		LastName:      req.LastName,
		Email:         req.Email,
		CountryCode:   req.CountryCode,
		Street:        req.Street,
		City:          req.City,
		PostalCode:    req.PostalCode,
		StateProvince: req.StateProvince,
		Phone: components.ContactPhoneRequestBody{
			DialingPrefix: req.PhonePrefix,
			Number:        req.PhoneNumber,
		},
	}
	if req.Organization != "" {
		body.Organization = &req.Organization
	}

	contactID, err := h.SDK.CreateContact(r.Context(), body)
	if err != nil {
		writeError(w, http.StatusBadGateway, "Failed to create contact: "+err.Error())
		return
	}

	_ = h.Store.Transact(func(db *models.Database) error {
		u := db.Users[user.Username]
		u.ContactIDs = append(u.ContactIDs, contactID)
		return nil
	})

	writeJSON(w, http.StatusCreated, map[string]string{"contactId": contactID})
}

package handlers

import (
	"net/http"

	"github.com/unstoppabledomains/reseller-go-sdk-demo/internal/auth"
	"github.com/unstoppabledomains/reseller-go-sdk-demo/internal/models"
)

func (h *Handlers) HandleDashboard(w http.ResponseWriter, r *http.Request) {
	user := auth.UserFromContext(r.Context())

	var domains []*models.DomainRecord
	for _, d := range user.Domains {
		domains = append(domains, d)
	}
	if domains == nil {
		domains = []*models.DomainRecord{}
	}

	writeJSON(w, http.StatusOK, map[string]any{"domains": domains})
}

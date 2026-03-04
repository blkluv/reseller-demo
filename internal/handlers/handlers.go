package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/unstoppabledomains/reseller-go-sdk-demo/internal/auth"
	"github.com/unstoppabledomains/reseller-go-sdk-demo/internal/models"
	"github.com/unstoppabledomains/reseller-go-sdk-demo/internal/sdk"
	"github.com/unstoppabledomains/reseller-go-sdk-demo/internal/store"
)

type Handlers struct {
	Store *store.Store
	SDK   *sdk.Client
}

func New(s *store.Store, c *sdk.Client) *Handlers {
	return &Handlers{Store: s, SDK: c}
}

func writeJSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, map[string]string{"error": message})
}

func readJSON(r *http.Request, dst any) error {
	defer r.Body.Close()
	return json.NewDecoder(r.Body).Decode(dst)
}

func (h *Handlers) requireDomainOwner(w http.ResponseWriter, r *http.Request) (*models.User, string, bool) {
	name := r.PathValue("name")
	user := auth.UserFromContext(r.Context())
	if _, ok := user.Domains[name]; !ok {
		writeError(w, http.StatusForbidden, "Domain not found in your account")
		return nil, "", false
	}
	return user, name, true
}

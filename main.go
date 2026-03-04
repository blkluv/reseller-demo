package main

import (
	"io/fs"
	"log"
	"net/http"
	"os"

	"github.com/unstoppabledomains/reseller-go-sdk-demo/internal/auth"
	"github.com/unstoppabledomains/reseller-go-sdk-demo/internal/config"
	"github.com/unstoppabledomains/reseller-go-sdk-demo/internal/handlers"
	"github.com/unstoppabledomains/reseller-go-sdk-demo/internal/sdk"
	"github.com/unstoppabledomains/reseller-go-sdk-demo/internal/store"
)

func main() {
	cfg := config.Load()

	s := store.New(cfg.DBPath)
	c := sdk.New(cfg.BearerToken, cfg.UseSandbox)
	h := handlers.New(s, c)

	mux := http.NewServeMux()

	// Auth routes (public)
	mux.HandleFunc("POST /api/v1/register", h.HandleRegister)
	mux.HandleFunc("POST /api/v1/login", h.HandleLogin)
	mux.HandleFunc("POST /api/v1/logout", h.HandleLogout)

	// Auth routes (authenticated)
	mux.HandleFunc("GET /api/v1/me", auth.RequireAuth(s, h.HandleMe))

	// Dashboard
	mux.HandleFunc("GET /api/v1/dashboard", auth.RequireAuth(s, h.HandleDashboard))

	// Search
	mux.HandleFunc("GET /api/v1/search", auth.RequireAuth(s, h.HandleSearch))
	mux.HandleFunc("GET /api/v1/suggestions", auth.RequireAuth(s, h.HandleSuggestions))

	// Contacts
	mux.HandleFunc("GET /api/v1/contacts", auth.RequireAuth(s, h.HandleContactList))
	mux.HandleFunc("POST /api/v1/contacts", auth.RequireAuth(s, h.HandleContactCreate))
	mux.HandleFunc("DELETE /api/v1/contacts/{id}", auth.RequireAuth(s, h.HandleContactDelete))

	// Purchase
	mux.HandleFunc("GET /api/v1/purchase/{domain}", auth.RequireAuth(s, h.HandlePurchasePreview))
	mux.HandleFunc("POST /api/v1/purchase", auth.RequireAuth(s, h.HandlePurchaseConfirm))

	// Domain management
	mux.HandleFunc("GET /api/v1/domains/{name}/pending", auth.RequireAuth(s, h.HandlePendingOps))
	mux.HandleFunc("GET /api/v1/domains/{name}", auth.RequireAuth(s, h.HandleDomainOverview))
	mux.HandleFunc("GET /api/v1/domains/{name}/dns", auth.RequireAuth(s, h.HandleDNSList))
	mux.HandleFunc("POST /api/v1/domains/{name}/dns", auth.RequireAuth(s, h.HandleDNSCreate))
	mux.HandleFunc("DELETE /api/v1/domains/{name}/dns/{id}", auth.RequireAuth(s, h.HandleDNSDelete))
	mux.HandleFunc("GET /api/v1/domains/{name}/flags", auth.RequireAuth(s, h.HandleFlagsGet))
	mux.HandleFunc("PUT /api/v1/domains/{name}/flags", auth.RequireAuth(s, h.HandleFlagsUpdate))
	mux.HandleFunc("GET /api/v1/domains/{name}/renewal", auth.RequireAuth(s, h.HandleRenewalInfo))
	mux.HandleFunc("POST /api/v1/domains/{name}/renew", auth.RequireAuth(s, h.HandleRenew))

	// SPA static files
	mux.Handle("/", spaHandler("frontend/dist"))

	log.Printf("Starting server on %s", cfg.ListenAddr)
	log.Fatal(http.ListenAndServe(cfg.ListenAddr, mux))
}

func spaHandler(dir string) http.Handler {
	fsys := os.DirFS(dir)
	fileServer := http.FileServerFS(fsys)

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		path := r.URL.Path
		if path == "/" {
			path = "index.html"
		} else {
			path = path[1:]
		}

		if _, err := fs.Stat(fsys, path); err != nil {
			r.URL.Path = "/"
		}
		fileServer.ServeHTTP(w, r)
	})
}

package handlers

import (
	"net/http"
	"time"

	"github.com/unstoppabledomains/reseller-go-sdk-demo/internal/auth"
	"github.com/unstoppabledomains/reseller-go-sdk-demo/internal/models"
	"golang.org/x/crypto/bcrypt"
)

type registerRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Confirm  string `json:"confirm"`
}

type loginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func (h *Handlers) HandleMe(w http.ResponseWriter, r *http.Request) {
	user := auth.UserFromContext(r.Context())
	contactIDs := user.ContactIDs
	if contactIDs == nil {
		contactIDs = []string{}
	}
	writeJSON(w, http.StatusOK, map[string]any{
		"username":   user.Username,
		"contactIds": contactIDs,
	})
}

func (h *Handlers) HandleRegister(w http.ResponseWriter, r *http.Request) {
	var req registerRequest
	if err := readJSON(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if req.Username == "" || req.Password == "" {
		writeError(w, http.StatusBadRequest, "Username and password are required")
		return
	}
	if req.Password != req.Confirm {
		writeError(w, http.StatusBadRequest, "Passwords do not match")
		return
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Internal error")
		return
	}

	err = h.Store.Transact(func(db *models.Database) error {
		if _, exists := db.Users[req.Username]; exists {
			return errUserExists
		}
		db.Users[req.Username] = &models.User{
			Username:       req.Username,
			HashedPassword: string(hashed),
			CreatedAt:      time.Now(),
			Domains:        make(map[string]*models.DomainRecord),
		}
		return nil
	})
	if err == errUserExists {
		writeError(w, http.StatusConflict, "Username already taken")
		return
	}
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Internal error")
		return
	}

	writeJSON(w, http.StatusCreated, map[string]string{"message": "Account created"})
}

func (h *Handlers) HandleLogin(w http.ResponseWriter, r *http.Request) {
	var req loginRequest
	if err := readJSON(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	db, err := h.Store.Load()
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Internal error")
		return
	}

	user, ok := db.Users[req.Username]
	if !ok {
		writeError(w, http.StatusUnauthorized, "Invalid username or password")
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.HashedPassword), []byte(req.Password)); err != nil {
		writeError(w, http.StatusUnauthorized, "Invalid username or password")
		return
	}

	token, err := auth.GenerateToken()
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Internal error")
		return
	}

	err = h.Store.Transact(func(db *models.Database) error {
		db.Sessions[token] = &models.Session{
			Token:     token,
			Username:  req.Username,
			CreatedAt: time.Now(),
			ExpiresAt: time.Now().Add(24 * time.Hour),
		}
		return nil
	})
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Internal error")
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "session",
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		MaxAge:   86400,
	})
	writeJSON(w, http.StatusOK, map[string]string{"username": req.Username})
}

func (h *Handlers) HandleLogout(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("session")
	if err == nil {
		_ = h.Store.Transact(func(db *models.Database) error {
			delete(db.Sessions, cookie.Value)
			return nil
		})
	}
	http.SetCookie(w, &http.Cookie{
		Name:   "session",
		Path:   "/",
		MaxAge: -1,
	})
	writeJSON(w, http.StatusOK, map[string]string{"message": "Logged out"})
}

var errUserExists = &userExistsError{}

type userExistsError struct{}

func (e *userExistsError) Error() string { return "user exists" }

package models

import "time"

type Database struct {
	Users    map[string]*User    `json:"users"`
	Sessions map[string]*Session `json:"sessions"`
}

func NewDatabase() *Database {
	return &Database{
		Users:    make(map[string]*User),
		Sessions: make(map[string]*Session),
	}
}

type User struct {
	Username       string                   `json:"username"`
	HashedPassword string                   `json:"hashedPassword"`
	CreatedAt      time.Time                `json:"createdAt"`
	ContactIDs     []string                 `json:"contactIds"`
	Domains        map[string]*DomainRecord `json:"domains"`
}

type DomainRecord struct {
	Name         string    `json:"name"`
	RegisteredAt time.Time `json:"registeredAt"`
	ContactID    string    `json:"contactId"`
	OperationID  string    `json:"operationId"`
}

type Session struct {
	Token     string    `json:"token"`
	Username  string    `json:"username"`
	CreatedAt time.Time `json:"createdAt"`
	ExpiresAt time.Time `json:"expiresAt"`
}

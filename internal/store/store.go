package store

import (
	"encoding/json"
	"fmt"
	"os"
	"sync"

	"github.com/unstoppabledomains/reseller-go-sdk-demo/internal/models"
)

type Store struct {
	path string
	mu   sync.Mutex
}

func New(path string) *Store {
	return &Store{path: path}
}

func (s *Store) Load() (*models.Database, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.loadLocked()
}

func (s *Store) loadLocked() (*models.Database, error) {
	data, err := os.ReadFile(s.path)
	if err != nil {
		if os.IsNotExist(err) {
			return models.NewDatabase(), nil
		}
		return nil, fmt.Errorf("store: read: %w", err)
	}
	var db models.Database
	if err := json.Unmarshal(data, &db); err != nil {
		return nil, fmt.Errorf("store: unmarshal: %w", err)
	}
	if db.Users == nil {
		db.Users = make(map[string]*models.User)
	}
	if db.Sessions == nil {
		db.Sessions = make(map[string]*models.Session)
	}
	return &db, nil
}

func (s *Store) saveLocked(db *models.Database) error {
	data, err := json.MarshalIndent(db, "", "  ")
	if err != nil {
		return fmt.Errorf("store: marshal: %w", err)
	}
	tmpPath := s.path + ".tmp"
	if err := os.WriteFile(tmpPath, data, 0600); err != nil {
		return fmt.Errorf("store: write tmp: %w", err)
	}
	if err := os.Rename(tmpPath, s.path); err != nil {
		return fmt.Errorf("store: rename: %w", err)
	}
	return nil
}

func (s *Store) Transact(fn func(db *models.Database) error) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	db, err := s.loadLocked()
	if err != nil {
		return err
	}
	if err := fn(db); err != nil {
		return err
	}
	return s.saveLocked(db)
}

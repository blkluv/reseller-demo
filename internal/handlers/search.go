package handlers

import (
	"log"
	"net/http"
	"strings"
	"time"
)

func parseTLDs(tldsStr string) []string {
	if tldsStr == "" {
		return nil
	}
	var tlds []string
	for _, t := range strings.Split(tldsStr, ",") {
		t = strings.TrimSpace(t)
		if t != "" {
			tlds = append(tlds, t)
		}
	}
	return tlds
}

func (h *Handlers) HandleSearch(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("q")
	tldsStr := r.URL.Query().Get("tlds")

	if query == "" {
		writeJSON(w, http.StatusOK, map[string]any{
			"query":   "",
			"tlds":    "",
			"results": []any{},
		})
		return
	}

	start := time.Now()
	log.Printf("[search] SDK SearchDomains start q=%q tlds=%q", query, tldsStr)
	results, err := h.SDK.SearchDomains(r.Context(), query, parseTLDs(tldsStr))
	log.Printf("[search] SDK SearchDomains done q=%q took=%s err=%v", query, time.Since(start), err)
	if err != nil {
		writeError(w, http.StatusBadGateway, err.Error())
		return
	}
	if results == nil {
		results = nil
	}

	resp := map[string]any{
		"query":   query,
		"tlds":    tldsStr,
		"results": results,
	}
	if results == nil {
		resp["results"] = []any{}
	}

	writeJSON(w, http.StatusOK, resp)
}

func (h *Handlers) HandleSuggestions(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("q")
	tldsStr := r.URL.Query().Get("tlds")

	if query == "" {
		writeJSON(w, http.StatusOK, map[string]any{"suggestions": []any{}})
		return
	}

	start := time.Now()
	log.Printf("[suggestions] SDK GetSuggestions start q=%q tlds=%q", query, tldsStr)
	suggestions, err := h.SDK.GetSuggestions(r.Context(), query, parseTLDs(tldsStr))
	log.Printf("[suggestions] SDK GetSuggestions done q=%q took=%s err=%v", query, time.Since(start), err)
	if err != nil {
		writeError(w, http.StatusBadGateway, err.Error())
		return
	}
	if suggestions == nil {
		writeJSON(w, http.StatusOK, map[string]any{"suggestions": []any{}})
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{"suggestions": suggestions})
}

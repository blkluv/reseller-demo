package handlers

import (
	"net/http"
	"strings"

	"github.com/unstoppabledomains/reseller-go-sdk-demo/internal/sdk"
	"github.com/unstoppabledomains/reseller-sdk-go/models/components"
)

func (h *Handlers) HandlePendingOps(w http.ResponseWriter, r *http.Request) {
	_, name, ok := h.requireDomainOwner(w, r)
	if !ok {
		return
	}
	ops, _ := h.SDK.GetPendingOperations(r.Context(), name)
	if ops == nil {
		ops = []sdk.PendingOperation{}
	}
	writeJSON(w, http.StatusOK, map[string]any{"pendingOperations": ops})
}

func (h *Handlers) HandleDomainOverview(w http.ResponseWriter, r *http.Request) {
	_, name, ok := h.requireDomainOwner(w, r)
	if !ok {
		return
	}

	// Check for pending operations first
	pendingOps, _ := h.SDK.GetPendingOperations(r.Context(), name)

	detail, err := h.SDK.GetDomainDetail(r.Context(), name)
	if err != nil {
		// If domain isn't ready for management yet, return pending status
		errMsg := err.Error()
		if strings.Contains(errMsg, "not valid for management") ||
			strings.Contains(errMsg, "not found") {
			writeJSON(w, http.StatusOK, map[string]any{
				"detail":            nil,
				"pendingOperations": pendingOps,
				"message":           "Domain registration is still being processed. This may take a few minutes.",
			})
			return
		}
		writeError(w, http.StatusBadGateway, errMsg)
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"detail":            detail,
		"pendingOperations": pendingOps,
	})
}

func (h *Handlers) HandleDNSList(w http.ResponseWriter, r *http.Request) {
	_, name, ok := h.requireDomainOwner(w, r)
	if !ok {
		return
	}

	records, err := h.SDK.ListDNSRecords(r.Context(), name)
	if err != nil {
		writeError(w, http.StatusBadGateway, err.Error())
		return
	}
	if records == nil {
		records = []components.DomainDNSRecordResponse{}
	}

	writeJSON(w, http.StatusOK, map[string]any{"records": records})
}

func (h *Handlers) HandleDNSCreate(w http.ResponseWriter, r *http.Request) {
	_, name, ok := h.requireDomainOwner(w, r)
	if !ok {
		return
	}

	var req struct {
		Type    string   `json:"type"`
		SubName string   `json:"subName,omitempty"`
		Values  []string `json:"values"`
		TTL     float64  `json:"ttl"`
	}
	if err := readJSON(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if req.TTL < 60 {
		req.TTL = 3600
	}

	body := components.DomainDNSRecordCreateRequestBody{
		Type:   components.DomainDNSRecordCreateRequestBodyType(req.Type),
		Values: req.Values,
		TTL:    req.TTL,
	}
	if req.SubName != "" {
		body.SubName = &req.SubName
	}

	if err := h.SDK.CreateDNSRecord(r.Context(), name, body); err != nil {
		writeError(w, http.StatusBadGateway, "Failed to create record: "+err.Error())
		return
	}

	writeJSON(w, http.StatusCreated, map[string]string{"message": "DNS record created"})
}

func (h *Handlers) HandleDNSDelete(w http.ResponseWriter, r *http.Request) {
	_, name, ok := h.requireDomainOwner(w, r)
	if !ok {
		return
	}

	recordID := r.PathValue("id")
	if err := h.SDK.DeleteDNSRecord(r.Context(), name, recordID); err != nil {
		writeError(w, http.StatusBadGateway, "Failed to delete record: "+err.Error())
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{"message": "DNS record deleted"})
}

func (h *Handlers) HandleFlagsGet(w http.ResponseWriter, r *http.Request) {
	_, name, ok := h.requireDomainOwner(w, r)
	if !ok {
		return
	}

	flags, err := h.SDK.GetFlags(r.Context(), name)
	if err != nil {
		writeError(w, http.StatusBadGateway, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{"flags": flags})
}

func (h *Handlers) HandleFlagsUpdate(w http.ResponseWriter, r *http.Request) {
	_, name, ok := h.requireDomainOwner(w, r)
	if !ok {
		return
	}

	var req struct {
		DNSResolution  *string `json:"dnsResolution,omitempty"`
		DNSTransferOut *string `json:"dnsTransferOut,omitempty"`
		DNSDelete      *string `json:"dnsDelete,omitempty"`
		DNSUpdate      *string `json:"dnsUpdate,omitempty"`
		DNSRenew       *string `json:"dnsRenew,omitempty"`
		DNSWhoisProxy  *string `json:"dnsWhoisProxy,omitempty"`
	}
	if err := readJSON(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	flagStatus := func(val *string) *components.DomainFlagUpdateRequestBodyFlag {
		if val == nil {
			return nil
		}
		status := components.DomainFlagStatusDisabled
		if *val == "ENABLED" {
			status = components.DomainFlagStatusEnabled
		}
		return &components.DomainFlagUpdateRequestBodyFlag{Status: status}
	}

	body := components.DomainFlagUpdateRequestBody{
		DNSResolution:  flagStatus(req.DNSResolution),
		DNSTransferOut: flagStatus(req.DNSTransferOut),
		DNSDelete:      flagStatus(req.DNSDelete),
		DNSUpdate:      flagStatus(req.DNSUpdate),
		DNSRenew:       flagStatus(req.DNSRenew),
		DNSWhoisProxy:  flagStatus(req.DNSWhoisProxy),
	}

	if err := h.SDK.UpdateFlags(r.Context(), name, body); err != nil {
		writeError(w, http.StatusBadGateway, "Failed to update flags: "+err.Error())
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{"message": "Flags updated"})
}

func (h *Handlers) HandleRenewalInfo(w http.ResponseWriter, r *http.Request) {
	_, name, ok := h.requireDomainOwner(w, r)
	if !ok {
		return
	}

	info, err := h.SDK.GetRenewalInfo(r.Context(), name)
	if err != nil {
		writeError(w, http.StatusBadGateway, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{"renewal": info})
}

func (h *Handlers) HandleRenew(w http.ResponseWriter, r *http.Request) {
	_, name, ok := h.requireDomainOwner(w, r)
	if !ok {
		return
	}

	var req struct {
		Period float64 `json:"period"`
	}
	if err := readJSON(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if req.Period < 1 {
		req.Period = 1
	}

	if err := h.SDK.RenewDomain(r.Context(), name, req.Period); err != nil {
		writeError(w, http.StatusBadGateway, "Renewal failed: "+err.Error())
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{"message": "Domain renewal initiated"})
}

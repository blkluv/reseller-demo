package sdk

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"strings"
	"time"

	unstoppabledomainssdk "github.com/unstoppabledomains/reseller-sdk-go"
	"github.com/unstoppabledomains/reseller-sdk-go/models/apierrors"
	"github.com/unstoppabledomains/reseller-sdk-go/models/components"
)

type Client struct {
	SDK *unstoppabledomainssdk.UnstoppableDomainsSDK
}

func New(bearerToken string, useSandbox bool) *Client {
	opts := []unstoppabledomainssdk.SDKOption{
		unstoppabledomainssdk.WithSecurity(bearerToken),
	}
	if useSandbox {
		opts = append(opts, unstoppabledomainssdk.WithServerIndex(1))
	}
	return &Client{SDK: unstoppabledomainssdk.New(opts...)}
}

type SDKError struct {
	StatusCode int
	Code       string
	Message    string
	Err        error
}

func (e *SDKError) Error() string { return e.Message }
func (e *SDKError) Unwrap() error { return e.Err }

func wrapErr(err error) error {
	if err == nil {
		return nil
	}
	var errResp *apierrors.ErrorResponse
	if errors.As(err, &errResp) {
		msg := errResp.Code
		if errResp.Message != nil {
			msg = *errResp.Message
		}
		return &SDKError{Code: errResp.Code, Message: msg, Err: err}
	}
	var apiErr *apierrors.APIError
	if errors.As(err, &apiErr) {
		return &SDKError{StatusCode: apiErr.StatusCode, Message: apiErr.Message, Err: err}
	}
	return err
}

func (c *Client) SearchDomains(ctx context.Context, query string, tlds []string) ([]components.DomainSearchResponse, error) {
	queries := strings.Fields(query)
	if len(queries) == 0 {
		return nil, nil
	}
	res, err := c.SDK.DomainSearch.Lookup(ctx, tlds, queries,
		[]components.DomainExpandField{components.DomainExpandFieldRegistration})
	if err != nil {
		return nil, wrapErr(err)
	}
	if res.MultipleDomainSearchResponse == nil {
		return nil, nil
	}
	return res.MultipleDomainSearchResponse.Items, nil
}

func (c *Client) GetSuggestions(ctx context.Context, query string, tlds []string) ([]components.SuggestionsResponseItem, error) {
	queries := strings.Fields(query)
	if len(queries) == 0 {
		return nil, nil
	}
	res, err := c.SDK.Suggestions.Get(ctx, queries, tlds)
	if err != nil {
		return nil, wrapErr(err)
	}
	if res.SuggestionsResponse == nil {
		return nil, nil
	}
	return res.SuggestionsResponse.Items, nil
}

func (c *Client) GetDomainDetail(ctx context.Context, name string) (*components.DomainSearchResponse, error) {
	res, err := c.SDK.DomainSearch.GetSingle(ctx, name,
		[]components.DomainExpandField{
			components.DomainExpandFieldRegistration,
			components.DomainExpandFieldFlags,
		})
	if err != nil {
		return nil, wrapErr(err)
	}
	return res.DomainSearchResponse, nil
}

func extractContactID(op *components.OperationCheckResponse) string {
	for _, dep := range op.Dependencies {
		if dep.PlatformOperationContactCreate != nil && dep.PlatformOperationContactCreate.Result != nil {
			return dep.PlatformOperationContactCreate.Result.ID
		}
	}
	return ""
}

func (c *Client) CreateContact(ctx context.Context, body components.ContactCreateRequestBody) (string, error) {
	res, err := c.SDK.Contacts.Create(ctx, false, body)
	if err != nil {
		return "", wrapErr(err)
	}
	if res.ContactCreateOperationResponse == nil {
		return "", fmt.Errorf("no operation response")
	}
	op := res.ContactCreateOperationResponse.Operation
	raw, _ := json.Marshal(op)
	log.Printf("[contacts] CreateContact operation: status=%s id=%s response=%s", op.Status, op.ID, raw)

	// Try to extract contact ID from immediate response
	if id := extractContactID(&op); id != "" {
		return id, nil
	}

	// Operation not yet complete — poll until done
	log.Printf("[contacts] Result not yet available, polling operation %s", op.ID)
	for i := 0; i < 10; i++ {
		time.Sleep(time.Duration(i+1) * 500 * time.Millisecond)

		checkRes, err := c.SDK.Operations.Get(ctx, op.ID)
		if err != nil {
			log.Printf("[contacts] poll error: %v", err)
			continue
		}
		if checkRes.OperationCheckResponse == nil {
			continue
		}
		polled := checkRes.OperationCheckResponse
		log.Printf("[contacts] poll attempt %d: status=%s", i+1, polled.Status)

		if polled.Status == components.OperationCheckResponseStatusFailed ||
			polled.Status == components.OperationCheckResponseStatusCancelled {
			return "", fmt.Errorf("contact creation operation %s", polled.Status)
		}

		if id := extractContactID(polled); id != "" {
			return id, nil
		}

		if polled.Status == components.OperationCheckResponseStatusCompleted {
			break
		}
	}

	return "", fmt.Errorf("could not extract contact ID from operation %s", op.ID)
}

func (c *Client) GetContact(ctx context.Context, contactID string) (*components.ContactResponse, error) {
	res, err := c.SDK.Contacts.Get(ctx, contactID)
	if err != nil {
		return nil, wrapErr(err)
	}
	return res.ContactResponse, nil
}

func (c *Client) RegisterDomain(ctx context.Context, body components.DomainRegistrationRequestBody) (*components.OperationCheckResponse, error) {
	res, err := c.SDK.DomainRegistration.RegisterOrTransfer(ctx, false, body)
	if err != nil {
		return nil, wrapErr(err)
	}
	if res.DomainOperationResponse == nil {
		return nil, fmt.Errorf("no operation response")
	}
	op := res.DomainOperationResponse.Operation
	return &op, nil
}

func (c *Client) PreviewRegistration(ctx context.Context, body components.DomainRegistrationRequestBody) (*components.OperationCheckResponse, error) {
	res, err := c.SDK.DomainRegistration.RegisterOrTransfer(ctx, true, body)
	if err != nil {
		return nil, wrapErr(err)
	}
	if res.DomainOperationResponse == nil {
		return nil, fmt.Errorf("no operation response")
	}
	op := res.DomainOperationResponse.Operation
	return &op, nil
}

func (c *Client) ListDNSRecords(ctx context.Context, domain string) ([]components.DomainDNSRecordResponse, error) {
	res, err := c.SDK.DNSRecords.List(ctx, domain, nil, nil, nil)
	if err != nil {
		return nil, wrapErr(err)
	}
	if res.DomainDNSRecordsResponse == nil {
		return nil, nil
	}
	return res.DomainDNSRecordsResponse.Items, nil
}

func (c *Client) CreateDNSRecord(ctx context.Context, domain string, body components.DomainDNSRecordCreateRequestBody) error {
	_, err := c.SDK.DNSRecords.Create(ctx, domain, false, body)
	return wrapErr(err)
}

func (c *Client) DeleteDNSRecord(ctx context.Context, domain string, recordID string) error {
	_, err := c.SDK.DNSRecords.Delete(ctx, domain, recordID, false)
	return wrapErr(err)
}

func (c *Client) GetFlags(ctx context.Context, domain string) (*components.DomainFlagsStandaloneResponse, error) {
	res, err := c.SDK.DomainFlags.Get(ctx, domain)
	if err != nil {
		return nil, wrapErr(err)
	}
	return res.DomainFlagsStandaloneResponse, nil
}

func (c *Client) UpdateFlags(ctx context.Context, domain string, body components.DomainFlagUpdateRequestBody) error {
	_, err := c.SDK.DomainFlags.Update(ctx, domain, false, body)
	return wrapErr(err)
}

func (c *Client) GetRenewalInfo(ctx context.Context, domain string) (*components.IcannDomainRenewalInfoResponse, error) {
	res, err := c.SDK.DomainRegistration.GetRenewalInfo(ctx, domain)
	if err != nil {
		return nil, wrapErr(err)
	}
	return res.IcannDomainRenewalInfoResponse, nil
}

func (c *Client) RenewDomain(ctx context.Context, domain string, period float64) error {
	_, err := c.SDK.DomainRegistration.Renew(ctx, domain, false, components.DomainRenewalRequestBody{
		Period: period,
	})
	return wrapErr(err)
}

type PendingOperation struct {
	ID   string `json:"id"`
	Type string `json:"type"`
}

func (c *Client) GetPendingOperations(ctx context.Context, domain string) ([]PendingOperation, error) {
	res, err := c.SDK.Operations.GetPending(ctx, domain)
	if err != nil {
		return nil, wrapErr(err)
	}
	if res.DomainPendingOperationsListResponse == nil {
		return nil, nil
	}
	var ops []PendingOperation
	for _, item := range res.DomainPendingOperationsListResponse.Items {
		op := PendingOperation{}
		if item.ID != nil {
			op.ID = *item.ID
		}
		if item.Type != nil {
			op.Type = string(*item.Type)
		}
		ops = append(ops, op)
	}
	return ops, nil
}

func (c *Client) GetAccount(ctx context.Context) (*components.AccountSummaryResponse, error) {
	res, err := c.SDK.Account.Get(ctx)
	if err != nil {
		return nil, wrapErr(err)
	}
	return res.AccountSummaryResponse, nil
}

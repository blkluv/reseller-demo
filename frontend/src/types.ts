export interface DomainRecord {
  name: string;
  registeredAt: string;
  contactId: string;
  operationId: string;
}

export interface PriceItem {
  usdCents: number;
}

export interface DomainPrice {
  type?: string;
  listPrice?: PriceItem;
  subTotal?: PriceItem;
}

export interface DomainAvailability {
  status: string;
  price?: DomainPrice;
}

export interface DomainSearchResult {
  name: string;
  availability?: DomainAvailability;
  registration?: Record<string, unknown>;
  flags?: Record<string, unknown>;
}

export interface SuggestionItem {
  name: string;
  price?: DomainPrice;
}

export interface SearchResponse {
  query: string;
  tlds: string;
  results: DomainSearchResult[];
}

export interface ContactOption {
  id: string;
  name: string;
}

export interface PurchasePreview {
  domain: string;
  detail: DomainSearchResult;
  contacts: ContactOption[];
}

export interface DNSRecord {
  id: string;
  subName?: string;
  type: string;
  values: string[];
  ttl: number;
  readonly?: boolean;
}

export interface DomainFlag {
  status: string;
  readonly?: boolean;
}

export interface DomainFlags {
  dnsResolution?: DomainFlag;
  dnsTransferOut?: DomainFlag;
  dnsDelete?: DomainFlag;
  dnsUpdate?: DomainFlag;
  dnsRenew?: DomainFlag;
  dnsWhoisProxy?: DomainFlag;
}

export interface RenewalInfo {
  isEligible?: boolean;
  expirationDate?: string;
  price?: DomainPrice;
  period?: number;
}

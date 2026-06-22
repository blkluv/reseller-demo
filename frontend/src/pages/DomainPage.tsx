import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import { api, ApiError } from "../api";
import type { DomainSearchResult, DNSRecord, RenewalInfo } from "../types";

type Tab = "overview" | "dns" | "flags" | "renewal";

interface PendingOp {
  id: string;
  type: string;
}

function PendingOpsBanner({ ops }: { ops: PendingOp[] }) {
  if (ops.length === 0) return null;
  return (
    <article style={{ borderLeft: "4px solid orange", paddingLeft: "1em" }}>
      <header>
        <strong>Pending Operations</strong>
      </header>
      <p>
        This domain has {ops.length} pending operation
        {ops.length > 1 ? "s" : ""}. Updates are blocked until{" "}
        {ops.length > 1 ? "they complete" : "it completes"}.
      </p>
      <ul>
        {ops.map((op) => (
          <li key={op.id}>
            <strong>{op.type.replace(/_/g, " ")}</strong>{" "}
            <code style={{ fontSize: "0.85em" }}>{op.id}</code>
          </li>
        ))}
      </ul>
      <small aria-busy="true">Checking for completion...</small>
    </article>
  );
}

export default function DomainPage() {
  const { name } = useParams<{ name: string }>();
  const [tab, setTab] = useState<Tab>("overview");
  const [pendingOps, setPendingOps] = useState<PendingOp[]>([]);

  const pending = pendingOps.length > 0;

  const refreshPendingOps = useCallback(() => {
    if (!name) return;
    api
      .pendingOps(name)
      .then((d) => setPendingOps(d.pendingOperations || []))
      .catch(() => {});
  }, [name]);

  // Fetch pending ops on mount so tabs are blocked immediately
  useEffect(refreshPendingOps, [refreshPendingOps]);

  // Poll pending ops every 3s while there are active operations
  useEffect(() => {
    if (!pending || !name) return;
    const id = setInterval(() => {
      api
        .pendingOps(name)
        .then((d) => setPendingOps(d.pendingOperations || []))
        .catch(() => {});
    }, 3000);
    return () => clearInterval(id);
  }, [pending, name]);

  if (!name) return <p>Domain not found</p>;

  const tabs = ["overview", "dns", "flags", "renewal"] as Tab[];

  return (
    <>
      <h2>{name}</h2>
      <nav>
        <ul>
          {tabs.map((t) => (
            <li key={t}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (!pending || t === "overview") setTab(t);
                }}
                className={t === tab ? "" : "secondary"}
                aria-disabled={pending && t !== "overview"}
                style={
                  pending && t !== "overview"
                    ? { opacity: 0.5, cursor: "not-allowed" }
                    : undefined
                }
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <PendingOpsBanner ops={pendingOps} />

      {tab === "overview" && (
        <OverviewTab name={name} onPendingOps={setPendingOps} />
      )}
      {tab === "dns" && (
        <DNSTab name={name} pending={pending} onMutation={refreshPendingOps} />
      )}
      {tab === "flags" && <FlagsTab name={name} />}
      {tab === "renewal" && (
        <RenewalTab name={name} onMutation={refreshPendingOps} />
      )}
    </>
  );
}

function OverviewTab({
  name,
  onPendingOps,
}: {
  name: string;
  onPendingOps: (ops: PendingOp[]) => void;
}) {
  const [detail, setDetail] = useState<DomainSearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingMessage, setPendingMessage] = useState("");
  const [hasPending, setHasPending] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .domainOverview(name)
      .then((d: any) => {
        const ops: PendingOp[] = d.pendingOperations || [];
        onPendingOps(ops);
        setHasPending(ops.length > 0);
        if (d.message) {
          setPendingMessage(d.message);
        }
        if (d.detail) {
          setDetail(d.detail);
        }
      })
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Failed to load")
      )
      .finally(() => setLoading(false));
  }, [name]);

  if (loading) return <p aria-busy="true">Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <>
      {pendingMessage && (
        <p style={{ color: "orange" }}>{pendingMessage}</p>
      )}

      {detail ? (
        <OverviewDetail detail={detail} />
      ) : (
        !hasPending && <p>No details available</p>
      )}
    </>
  );
}

function OverviewDetail({ detail }: { detail: DomainSearchResult }) {
  const reg = detail.registration as Record<string, unknown> | undefined;

  return (
    <article>
      <p>
        <strong>Name:</strong> {detail.name}
      </p>
      {/* FIXED: Use reg && reg.property instead of reg && reg.property && */}
      {reg && reg.status && (
        <p>
          <strong>Status:</strong> {String(reg.status)}
        </p>
      )}
      {reg && reg.expirationDate && (
        <p>
          <strong>Expires:</strong>{" "}
          {new Date(String(reg.expirationDate)).toLocaleDateString()}
        </p>
      )}
      {reg && reg.expirationGracePeriodDate && (
        <p>
          <strong>Grace period ends:</strong>{" "}
          {new Date(String(reg.expirationGracePeriodDate)).toLocaleDateString()}
        </p>
      )}
      {(reg && reg.pricing as any)?.renewal?.subTotal?.usdCents != null && (
        <p>
          <strong>Renewal price:</strong> $
          {((reg.pricing as any).renewal.subTotal.usdCents / 100).toFixed(2)}
          /year
        </p>
      )}
      {(reg && reg.icann as any)?.ownershipVerification && (
        <p>
          <strong>ICANN verification:</strong>{" "}
          {String((reg.icann as any).ownershipVerification)}
        </p>
      )}
      {(reg && reg.icann as any)?.registrar?.type && (
        <p>
          <strong>Registrar type:</strong>{" "}
          {String((reg.icann as any).registrar.type)}
        </p>
      )}
    </article>
  );
}

function DNSTab({
  name,
  pending,
  onMutation,
}: {
  name: string;
  pending: boolean;
  onMutation: () => void;
}) {
  const [records, setRecords] = useState<DNSRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    type: "A",
    subName: "",
    values: "",
    ttl: "3600",
  });
  const [submitting, setSubmitting] = useState(false);
  const prevPending = useRef(pending);

  const loadRecords = useCallback(() => {
    setLoading(true);
    api
      .dnsList(name)
      .then((d) => setRecords(d.records))
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Failed to load")
      )
      .finally(() => setLoading(false));
  }, [name]);

  useEffect(loadRecords, [loadRecords]);

  // Reload records when pending ops complete
  useEffect(() => {
    if (prevPending.current && !pending) {
      loadRecords();
    }
    prevPending.current = pending;
  }, [pending, loadRecords]);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.dnsCreate(name, {
        type: form.type,
        subName: form.subName || undefined,
        values: form.values
          .split("\n")
          .map((v) => v.trim())
          .filter(Boolean),
        ttl: Number(form.ttl) || 3600,
      });
      setForm({ type: "A", subName: "", values: "", ttl: "3600" });
      onMutation();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.dnsDelete(name, id);
      onMutation();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to delete"
      );
    }
  };

  if (loading) return <p aria-busy="true">Loading...</p>;

  return (
    <>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {records.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Name</th>
              <th>Values</th>
              <th>TTL</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td>{r.type}</td>
                <td>{r.subName || "@"}</td>
                <td>{r.values?.join(", ")}</td>
                <td>{r.ttl}</td>
                <td>
                  {!r.readonly && (
                    <button
                      className="outline secondary"
                      style={{ padding: "0.25em 0.75em" }}
                      disabled={pending}
                      onClick={() => handleDelete(r.id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <details open>
        <summary>Add DNS Record</summary>
        <fieldset disabled={pending}>
          <form onSubmit={handleCreate}>
            <div className="grid">
              <label>
                Type
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  {["A", "AAAA", "CNAME", "MX", "TXT", "NS", "SRV"].map(
                    (t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    )
                  )}
                </select>
              </label>
              <label>
                Subdomain (optional)
                <input
                  type="text"
                  value={form.subName}
                  onChange={(e) =>
                    setForm({ ...form, subName: e.target.value })
                  }
                  placeholder="www"
                />
              </label>
              <label>
                TTL
                <input
                  type="number"
                  value={form.ttl}
                  onChange={(e) => setForm({ ...form, ttl: e.target.value })}
                  min="60"
                />
              </label>
            </div>
            <label>
              Values (one per line)
              <textarea
                value={form.values}
                onChange={(e) => setForm({ ...form, values: e.target.value })}
                rows={3}
                required
              />
            </label>
            <button
              type="submit"
              aria-busy={submitting}
              disabled={submitting || pending}
            >
              Add Record
            </button>
          </form>
        </fieldset>
      </details>
    </>
  );
}

function FlagsTab({ name }: { name: string }) {
  const [flags, setFlags] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .flagsGet(name)
      .then((d) => setFlags(d.flags))
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Failed to load")
      )
      .finally(() => setLoading(false));
  }, [name]);

  const flagNames = [
    { key: "dnsResolution", label: "DNS Resolution" },
    { key: "dnsTransferOut", label: "Transfer Out" },
    { key: "dnsDelete", label: "Delete" },
    { key: "dnsUpdate", label: "Update" },
    { key: "dnsRenew", label: "Renew" },
    { key: "dnsWhoisProxy", label: "WHOIS Proxy" },
  ];

  if (loading) return <p aria-busy="true">Loading...</p>;

  return (
    <>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Flag</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {flagNames.map(({ key, label }) => {
            const flag = flags[key];
            const currentStatus = flag?.status || "UNKNOWN";
            return (
              <tr key={key}>
                <td>{label}</td>
                <td>
                  <span
                    style={{
                      color: currentStatus === "ENABLED" ? "green" : "gray",
                    }}
                  >
                    {currentStatus}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

function RenewalTab({
  name,
  onMutation,
}: {
  name: string;
  onMutation: () => void;
}) {
  const [renewal, setRenewal] = useState<RenewalInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .renewalInfo(name)
      .then((d) => setRenewal(d.renewal))
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Failed to load")
      )
      .finally(() => setLoading(false));
  }, [name]);

  const handleRenew = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.renew(name, { period });
      onMutation();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Renewal failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p aria-busy="true">Loading...</p>;
  if (error && !renewal) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <>
      {renewal && (
        <article>
          <p>
            <strong>Eligible for renewal:</strong>{" "}
            {renewal.isEligible ? "Yes" : "No"}
          </p>
          {renewal.expirationDate && (
            <p>
              <strong>Expires:</strong>{" "}
              {new Date(renewal.expirationDate).toLocaleDateString()}
            </p>
          )}
          {renewal.price?.subTotal && (
            <p>
              <strong>Renewal price:</strong> $
              {(renewal.price.subTotal.usdCents / 100).toFixed(2)} / year
            </p>
          )}
        </article>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {renewal?.isEligible && (
        <form onSubmit={handleRenew}>
          <label>
            Renewal Period (years)
            <select
              value={period}
              onChange={(e) => setPeriod(Number(e.target.value))}
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((y) => (
                <option key={y} value={y}>
                  {y} year{y > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" aria-busy={submitting} disabled={submitting}>
            Renew Domain
          </button>
        </form>
      )}
    </>
  );
}

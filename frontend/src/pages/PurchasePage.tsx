import { useEffect, useState, type FormEvent } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import { api, ApiError } from "../api";
import type { PurchasePreview } from "../types";

function formatUSD(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

type Step = "details" | "payment";

export default function PurchasePage() {
  const { domain } = useParams<{ domain: string }>();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const preselectedContact = params.get("contact") || "";

  const [preview, setPreview] = useState<PurchasePreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contactId, setContactId] = useState(preselectedContact);
  const [period, setPeriod] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<Step>("details");

  const [card, setCard] = useState({
    number: "4242 4242 4242 4242",
    expiry: "12/28",
    cvc: "123",
    name: "Test Cardholder",
  });

  useEffect(() => {
    if (!domain) return;
    api
      .purchasePreview(domain)
      .then((data) => {
        setPreview(data);
        if (!contactId && data.contacts.length > 0) {
          setContactId(data.contacts[0].id);
        }
      })
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Failed to load")
      )
      .finally(() => setLoading(false));
  }, [domain]);

  const handleContinueToPayment = (e: FormEvent) => {
    e.preventDefault();
    if (!contactId) return;
    setStep("payment");
  };

  const handlePay = async (e: FormEvent) => {
    e.preventDefault();
    if (!domain || !contactId) return;
    setError("");
    setSubmitting(true);
    try {
      await api.purchaseConfirm({ domain, contactId, period });
      navigate("/dashboard");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Registration failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p aria-busy="true">Loading...</p>;
  if (error && !preview)
    return <p style={{ color: "red" }}>{error}</p>;

  const pricePerYear =
    preview?.detail?.availability?.price?.subTotal?.usdCents;
  const totalCents = pricePerYear ? pricePerYear * period : null;

  if (step === "payment") {
    return (
      <>
        <h2>Payment</h2>

        <article>
          <header>Order Summary</header>
          <p>
            <strong>Domain:</strong> {domain}
          </p>
          <p>
            <strong>Period:</strong> {period} year{period > 1 ? "s" : ""}
          </p>
          {pricePerYear && (
            <p>
              <strong>Price:</strong> {formatUSD(pricePerYear)} / year
            </p>
          )}
          {totalCents && (
            <p style={{ fontSize: "1.2em" }}>
              <strong>Total:</strong> {formatUSD(totalCents)}
            </p>
          )}
        </article>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <article>
          <header>Payment Details</header>
          <small style={{ color: "gray" }}>
            This is a demo — no real payment will be charged.
          </small>
          <form onSubmit={handlePay} style={{ marginTop: "1em" }}>
            <label>
              Card Number
              <input
                type="text"
                value={card.number}
                onChange={(e) => setCard({ ...card, number: e.target.value })}
                placeholder="4242 4242 4242 4242"
              />
            </label>
            <div className="grid">
              <label>
                Expiry
                <input
                  type="text"
                  value={card.expiry}
                  onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                  placeholder="MM/YY"
                />
              </label>
              <label>
                CVC
                <input
                  type="text"
                  value={card.cvc}
                  onChange={(e) => setCard({ ...card, cvc: e.target.value })}
                  placeholder="123"
                />
              </label>
            </div>
            <label>
              Name on Card
              <input
                type="text"
                value={card.name}
                onChange={(e) => setCard({ ...card, name: e.target.value })}
                placeholder="Name on card"
              />
            </label>
            <div className="grid">
              <button
                type="button"
                className="outline secondary"
                onClick={() => {
                  setError("");
                  setStep("details");
                }}
              >
                Back
              </button>
              <button
                type="submit"
                aria-busy={submitting}
                disabled={submitting}
              >
                Pay & Register
              </button>
            </div>
          </form>
        </article>
      </>
    );
  }

  return (
    <>
      <h2>Register {domain}</h2>

      {preview?.detail?.availability && (
        <article>
          <header>Domain Details</header>
          <p>
            <strong>Status:</strong> {preview.detail.availability.status}
          </p>
          {pricePerYear && (
            <p>
              <strong>Price:</strong> {formatUSD(pricePerYear)} / year
            </p>
          )}
        </article>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleContinueToPayment}>
        <label>
          ICANN Contact
          {preview?.contacts && preview.contacts.length > 0 ? (
            <select
              value={contactId}
              onChange={(e) => setContactId(e.target.value)}
              required
            >
              <option value="">Select a contact</option>
              {preview.contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          ) : (
            <p>
              No contacts found.{" "}
              <Link to={`/contacts/new?return=/purchase/${domain}`}>
                Create one first
              </Link>
            </p>
          )}
        </label>

        <label>
          Registration Period (years)
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

        <button type="submit" disabled={!contactId}>
          Continue to Payment
        </button>
      </form>
    </>
  );
}

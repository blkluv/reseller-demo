import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api, ApiError } from "../api";

export default function ContactFormPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const returnTo = params.get("return") || "";

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "",
    street: "",
    city: "",
    postalCode: "",
    stateProvince: "",
    phonePrefix: "",
    phoneNumber: "",
    organization: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [field]: e.target.value });

  const fillDemo = () => {
    setForm({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane.doe@example.com",
      countryCode: "US",
      street: "123 Main St",
      city: "San Francisco",
      postalCode: "94105",
      stateProvince: "CA",
      phonePrefix: "1",
      phoneNumber: "5551234567",
      organization: "",
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { contactId } = await api.createContact(form);
      if (returnTo) {
        navigate(`${returnTo}?contact=${contactId}`);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to create contact"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <h2>Create ICANN Contact</h2>
      <button type="button" className="outline secondary" onClick={fillDemo}>
        Fill with demo data
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="grid">
          <label>
            First Name
            <input
              type="text"
              value={form.firstName}
              onChange={set("firstName")}
              required
            />
          </label>
          <label>
            Last Name
            <input
              type="text"
              value={form.lastName}
              onChange={set("lastName")}
              required
            />
          </label>
        </div>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={set("email")}
            required
          />
        </label>
        <div className="grid">
          <label>
            Phone Prefix
            <input
              type="text"
              value={form.phonePrefix}
              onChange={set("phonePrefix")}
              placeholder="1"
              required
            />
          </label>
          <label>
            Phone Number
            <input
              type="text"
              value={form.phoneNumber}
              onChange={set("phoneNumber")}
              required
            />
          </label>
        </div>
        <label>
          Country Code
          <input
            type="text"
            value={form.countryCode}
            onChange={set("countryCode")}
            placeholder="US"
            required
          />
        </label>
        <label>
          Street
          <input
            type="text"
            value={form.street}
            onChange={set("street")}
            required
          />
        </label>
        <div className="grid">
          <label>
            City
            <input
              type="text"
              value={form.city}
              onChange={set("city")}
              required
            />
          </label>
          <label>
            State / Province
            <input
              type="text"
              value={form.stateProvince}
              onChange={set("stateProvince")}
              required
            />
          </label>
          <label>
            Postal Code
            <input
              type="text"
              value={form.postalCode}
              onChange={set("postalCode")}
              required
            />
          </label>
        </div>
        <label>
          Organization (optional)
          <input
            type="text"
            value={form.organization}
            onChange={set("organization")}
          />
        </label>
        <button type="submit" aria-busy={submitting} disabled={submitting}>
          Create Contact
        </button>
      </form>
    </>
  );
}

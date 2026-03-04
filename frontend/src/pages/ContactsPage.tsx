import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, ApiError } from "../api";

interface ContactInfo {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  error?: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    api
      .listContacts()
      .then((data) => setContacts(data.contacts))
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Failed to load")
      )
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id: string) => {
    if (!confirm(`Remove contact ${id} from your account?`)) return;
    try {
      await api.deleteContact(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete");
    }
  };

  if (loading) return <p aria-busy="true">Loading contacts...</p>;

  return (
    <>
      <hgroup>
        <h2>Contacts</h2>
        <p>Manage your ICANN contacts for domain registration</p>
      </hgroup>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {contacts.length === 0 ? (
        <p>
          No contacts yet. <Link to="/contacts/new">Create one</Link>
        </p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>ID</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr key={c.id}>
                <td>
                  {c.error
                    ? c.error
                    : `${c.firstName || ""} ${c.lastName || ""}`.trim() ||
                      "—"}
                </td>
                <td>{c.email || "—"}</td>
                <td>
                  <small>
                    <code>{c.id}</code>
                  </small>
                </td>
                <td>
                  <button
                    className="outline secondary"
                    onClick={() => handleDelete(c.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Link to="/contacts/new" role="button">
        Create New Contact
      </Link>
    </>
  );
}

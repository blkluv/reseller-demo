import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, ApiError } from "../api";
import type { DomainRecord } from "../types";

export default function DashboardPage() {
  const [domains, setDomains] = useState<DomainRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .dashboard()
      .then((data) => setDomains(data.domains))
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Failed to load")
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p aria-busy="true">Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <>
      <h2>Your Domains</h2>
      {domains.length === 0 ? (
        <p>
          You haven't registered any domains yet.{" "}
          <Link to="/search">Search for domains</Link>
        </p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Domain</th>
              <th>Registered</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {domains.map((d) => (
              <tr key={d.name}>
                <td>
                  <strong>{d.name}</strong>
                </td>
                <td>{new Date(d.registeredAt).toLocaleDateString()}</td>
                <td>
                  <Link
                    to={`/domain/${d.name}`}
                    role="button"
                    className="outline"
                    style={{ padding: "0.25em 0.75em" }}
                  >
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Link to="/search" role="button">
        Search for Domains
      </Link>
    </>
  );
}

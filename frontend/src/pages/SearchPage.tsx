import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api, ApiError } from "../api";
import type { DomainSearchResult, SuggestionItem } from "../types";

function formatUSD(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function statusColor(status: string): string {
  if (status === "AVAILABLE") return "green";
  if (status === "REGISTERED") return "gray";
  return "";
}

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [tlds, setTlds] = useState(params.get("tlds") || "");
  const [results, setResults] = useState<DomainSearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setError("");
    setLoading(true);
    setSearched(true);
    setSuggestions([]);
    setParams({ q: query, tlds });

    // Fire search immediately
    try {
      const data = await api.search(query, tlds);
      setResults(data.results || []);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }

    // Load suggestions in background
    setLoadingSuggestions(true);
    api
      .suggestions(query, tlds)
      .then((data) => setSuggestions(data.suggestions || []))
      .catch(() => {})
      .finally(() => setLoadingSuggestions(false));
  };

  return (
    <>
      <h2>Search Domains</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid">
          <label>
            Keyword(s)
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. coffee shop"
              required
            />
          </label>
          <label>
            TLDs (optional)
            <input
              type="text"
              value={tlds}
              onChange={(e) => setTlds(e.target.value)}
              placeholder="com,net,io"
            />
          </label>
        </div>
        <button type="submit" aria-busy={loading} disabled={loading}>
          Search
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {searched && !loading && results.length > 0 && (
        <>
          <h3>Search Results</h3>
          <table>
            <thead>
              <tr>
                <th>Domain</th>
                <th>Status</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.name}>
                  <td>{r.name}</td>
                  <td>
                    <span
                      style={{
                        color: statusColor(r.availability?.status || ""),
                      }}
                    >
                      {r.availability?.status}
                    </span>
                  </td>
                  <td>
                    {r.availability?.price?.subTotal
                      ? formatUSD(r.availability.price.subTotal.usdCents)
                      : "-"}
                  </td>
                  <td>
                    {r.availability?.status === "AVAILABLE" && (
                      <Link
                        to={`/purchase/${r.name}`}
                        role="button"
                        className="outline"
                        style={{ padding: "0.25em 0.75em" }}
                      >
                        Register
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {searched && !loading && (
        <>
          <h3>
            Suggestions{" "}
            {loadingSuggestions && (
              <span aria-busy="true" style={{ fontSize: "0.7em" }} />
            )}
          </h3>
          {suggestions.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Domain</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {suggestions.map((s) => (
                  <tr key={s.name}>
                    <td>{s.name}</td>
                    <td>
                      {s.price?.subTotal
                        ? formatUSD(s.price.subTotal.usdCents)
                        : "-"}
                    </td>
                    <td>
                      <Link
                        to={`/purchase/${s.name}`}
                        role="button"
                        className="outline"
                        style={{ padding: "0.25em 0.75em" }}
                      >
                        Register
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            !loadingSuggestions && <p>No suggestions available.</p>
          )}
        </>
      )}
    </>
  );
}

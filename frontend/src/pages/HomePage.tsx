import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) return <p aria-busy="true">Loading...</p>;
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <article style={{ maxWidth: "720px", margin: "0 auto", padding: "2rem 1rem" }}>
      <header style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "2.4rem", lineHeight: 1.2 }}>
          🌟 Manifest the new you <br />
          <span style={{ color: "var(--primary)" }}>
            starting with your I AM name.
          </span>
        </h1>
        <p style={{ fontSize: "1.2rem", marginTop: "0.5rem" }}>
          Your name is your power. Own it. Live it. Login with it.
        </p>
      </header>

      {/* ——— CORE PITCH ——— */}
      <section style={{ marginTop: "2.5rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "1rem",
            textAlign: "center",
          }}
        >
          <div style={{ background: "var(--card-background)", padding: "1rem", borderRadius: "12px" }}>
            <div style={{ fontSize: "2.2rem" }}>📬</div>
            <h4>Forwarding Address</h4>
            <p style={{ fontSize: "0.9rem", margin: 0 }}>
              One name. All your accounts. No more "lost in the shuffle."
            </p>
          </div>
          <div style={{ background: "var(--card-background)", padding: "1rem", borderRadius: "12px" }}>
            <div style={{ fontSize: "2.2rem" }}>🔑</div>
            <h4>Yours Forever</h4>
            <p style={{ fontSize: "0.9rem", margin: 0 }}>
              No renewals. No rent. No one can take it away. Ever.
            </p>
          </div>
          <div style={{ background: "var(--card-background)", padding: "1rem", borderRadius: "12px" }}>
            <div style={{ fontSize: "2.2rem" }}>🌐</div>
            <h4>Your Digital You</h4>
            <p style={{ fontSize: "0.9rem", margin: 0 }}>
              One identity for your socials, your payments, and your vibe.
            </p>
          </div>
        </div>
      </section>

      {/* ——— WHAT IT SOLVES ——— */}
      <section style={{ marginTop: "2.5rem" }}>
        <h3>✨ What your I AM name fixes (no tech talk, just real life)</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ padding: "0.5rem 0", borderBottom: "1px solid var(--border)" }}>
            <span style={{ fontSize: "1.4rem" }}>🔐</span>{" "}
            <strong>Passwords are a headache.</strong> Use your I AM name to log into apps—one click, no remembering 47 passwords.
          </li>
          <li style={{ padding: "0.5rem 0", borderBottom: "1px solid var(--border)" }}>
            <span style={{ fontSize: "1.4rem" }}>💸</span>{" "}
            <strong>Venmo-ing friends is awkward.</strong> Send money to <code>@yourname</code> instead of a 32-character mess.
          </li>
          <li style={{ padding: "0.5rem 0", borderBottom: "1px solid var(--border)" }}>
            <span style={{ fontSize: "1.4rem" }}>📱</span>{" "}
            <strong>Your social handles don't match.</strong> One name across TikTok, IG, X, and your own site—no more <code>@johndoe2847</code>.
          </li>
          <li style={{ padding: "0.5rem 0" }}>
            <span style={{ fontSize: "1.4rem" }}>❤️</span>{" "}
            <strong>Dating is confusing.</strong> Imagine matching with someone and they just say *"I'm @soulmate.x — find me there."* Clean. Direct. No ghosting.
          </li>
        </ul>
      </section>

      {/* ——— THE "I AM" CONCEPT ——— */}
      <section
        style={{
          marginTop: "2.5rem",
          background: "var(--card-background)",
          padding: "1.5rem",
          borderRadius: "16px",
          borderLeft: "4px solid var(--primary)",
        }}
      >
        <h3 style={{ marginTop: 0 }}>🧘 What does "I AM" mean?</h3>
        <p>
          <strong>I AM</strong> is your digital soul. It's not a wallet. It's not a URL. It's <em>you</em>—manifested online.
        </p>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>✅ <strong>Your name</strong> (not a number)</li>
          <li>✅ <strong>Your address</strong> for money, messages, and connections</li>
          <li>✅ <strong>Your login</strong> for every app that matters</li>
          <li>✅ <strong>Your brand</strong> that nobody can delete, freeze, or take away</li>
        </ul>
        <p style={{ marginBottom: 0, fontSize: "0.95rem", opacity: 0.8 }}>
          ⚡ Example: <code style={{ fontWeight: "bold" }}>iam.blkluv.org</code> is your portal. Login with your I AM name—and you're in.
        </p>
      </section>

      {/* ——— WHY NOW ——— */}
      <section style={{ marginTop: "2.5rem" }}>
        <h3>📈 Why the smartest people are claiming their I AM name right now</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", fontSize: "0.9rem" }}>
            <thead>
              <tr>
                <th>What happened</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Someone bought a name for <strong>$12</strong> and later sold it</td>
                <td><strong>$8,500</strong> (that's a <span style={{ color: "green" }}>+70,700%</span> glow-up)</td>
              </tr>
              <tr>
                <td>Average domain investor profit</td>
                <td><strong>$1,000 – $5,000</strong> per flip</td>
              </tr>
              <tr>
                <td>Market grew in 2024</td>
                <td><strong>+32.8%</strong> to <strong>$185 million</strong></td>
              </tr>
              <tr>
                <td>Beginner-friendly potential</td>
                <td><strong>$100 – $10,000</strong> starting out</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: "0.85rem", opacity: 0.7, marginTop: "0.5rem" }}>
          ⚠️ Not a get-rich-quick thing. It takes strategy, research, and a little patience—but the door is wide open.
        </p>
      </section>

      {/* ——— CALL TO ACTION ——— */}
      <footer
        style={{
          marginTop: "3rem",
          paddingTop: "2rem",
          borderTop: "1px solid var(--border)",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
          🚀 Ready to become your I AM name?
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/login" role="button" style={{ minWidth: "140px" }}>
            Login with I AM
          </Link>
          <Link to="/register" role="button" className="outline" style={{ minWidth: "140px" }}>
            Claim Your Name
          </Link>
        </div>
        <p style={{ fontSize: "0.85rem", opacity: 0.6, marginTop: "1rem" }}>
          Already have an I AM name? Login above. New here? Claim yours—it's a one-time thing. Forever.
        </p>
      </footer>
    </article>
  );
}
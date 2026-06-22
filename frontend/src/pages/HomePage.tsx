import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
export default function HomePage() {
  const { user, loading } = useAuth();
  if (loading) return <p aria-busy="true">Loading...</p>;
  if (user) return <Navigate to="/dashboard" replace />;
  return (
    <article
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "2rem 1rem 6rem",
      }}
    >
      {/* HERO */}
      <header
        style={{
          textAlign: "center",
          padding: "5rem 0",
        }}
      >
        <p
          style={{
            fontSize: ".95rem",
            fontWeight: 700,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            opacity: 0.7,
          }}
        >
          I AM Identity
        </p>
        <h1
          style={{
            fontSize: "4rem",
            lineHeight: 1,
            marginBottom: "1.5rem",
          }}
        >
          Stop renting
          <br />
          your identity.
        </h1>
        <p
          style={{
            maxWidth: "650px",
            margin: "0 auto",
            fontSize: "1.35rem",
            opacity: 0.8,
          }}
        >
          Your username. Your login. Your payment address.
          One name that works everywhere.
        </p>
        <div
          style={{
            marginTop: "2.5rem",
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/register"
            role="button"
            style={{
              background: "#000",
              color: "#fff",
              padding: "18px 34px",
              borderRadius: "999px",
              fontWeight: 700,
            }}
          >
            Claim Your I AM
          </Link>
          <Link
            to="/login"
            role="button"
            className="outline"
            style={{
              padding: "18px 34px",
              borderRadius: "999px",
            }}
          >
            Login
          </Link>
        </div>
      </header>
      {/* GEN Z SECTION */}
      <section style={{ marginTop: "3rem" }}>
        <h2 style={{ fontSize: "2.4rem" }}>
          Everyone has a username.
          <br />
          Why don't you own yours?
        </h2>
        <p style={{ fontSize: "1.1rem", opacity: 0.75 }}>
          TikTok has @handles. Cash App has $cashtags.
          Instagram has usernames.
          I AM gives you one identity for everything.
        </p>
      </section>
      {/* FEATURES */}
      <section
        style={{
          marginTop: "4rem",
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
        }}
      >
        <div style={{ background: "#f6f6f6", padding: "2rem", borderRadius: "24px" }}>
          <div style={{ fontSize: "2rem" }}>🔑</div>
          <h3>Login</h3>
          <p>Forget passwords. Sign in with your I AM everywhere.</p>
        </div>
        <div style={{ background: "#f6f6f6", padding: "2rem", borderRadius: "24px" }}>
          <div style={{ fontSize: "2rem" }}>💸</div>
          <h3>Get Paid</h3>
          <p>People send money to your name, not random numbers.</p>
        </div>
        <div style={{ background: "#f6f6f6", padding: "2rem", borderRadius: "24px" }}>
          <div style={{ fontSize: "2rem" }}>🌎</div>
          <h3>Share Yourself</h3>
          <p>One identity for TikTok, Instagram, X and your website.</p>
        </div>
        <div style={{ background: "#f6f6f6", padding: "2rem", borderRadius: "24px" }}>
          <div style={{ fontSize: "2rem" }}>♾️</div>
          <h3>Keep It Forever</h3>
          <p>No monthly fees. No renting your identity.</p>
        </div>
      </section>
      {/* COMPARISON */}
      <section
        style={{
          marginTop: "5rem",
          background: "#000",
          color: "#fff",
          padding: "4rem",
          borderRadius: "32px",
        }}
      >
        <h2 style={{ fontSize: "3rem" }}>
          You're not buying a domain.
          <br />
          You're claiming yourself.
        </h2>
        <div
          style={{
            marginTop: "2rem",
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "1fr 1fr",
          }}
        >
          <div>
            <h3>I AM</h3>
            <p>✅ Built for people</p>
            <p>✅ Login with your name</p>
            <p>✅ Payments + messages + identity</p>
            <p>✅ Human-first</p>
          </div>
          <div>
            <h3>Traditional domains</h3>
            <p>• Websites</p>
            <p>• Wallet addresses</p>
            <p>• Technical setup</p>
            <p>• Domain-first</p>
          </div>
        </div>
      </section>
      {/* EXAMPLE */}
      <section style={{ marginTop: "5rem" }}>
        <h2 style={{ fontSize: "2.8rem" }}>
          Imagine having one name
          for everything.
        </h2>
        <div
          style={{
            background: "#f8f8f8",
            padding: "2rem",
            borderRadius: "24px",
            marginTop: "2rem",
          }}
        >
          <h3>@maya</h3>
          <p>✓ Login</p>
          <p>✓ Receive payments</p>
          <p>✓ Creator profile</p>
          <p>✓ Website</p>
          <p>✓ Social links</p>
          <p>✓ Messages</p>
        </div>
      </section>
      {/* CTA */}
      <footer
        style={{
          textAlign: "center",
          marginTop: "6rem",
        }}
      >
        <h2
          style={{
            fontSize: "3rem",
            lineHeight: 1.1,
          }}
        >
          One name.
          <br />
          Everything.
        </h2>
        <p
          style={{
            maxWidth: "600px",
            margin: "1rem auto 2rem",
            opacity: 0.7,
          }}
        >
          Everyone owns usernames.
          Very few people own themselves.
        </p>
        <Link
          to="/register"
          role="button"
          style={{
            background: "#000",
            color: "#fff",
            padding: "20px 40px",
            borderRadius: "999px",
            fontWeight: 700,
          }}
        >
          Claim Your I AM
        </Link>
      </footer>
    </article>
  );
}

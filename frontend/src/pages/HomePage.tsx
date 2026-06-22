import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) return <p aria-busy="true">Loading...</p>;
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <article
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "2rem 1rem",
      }}
    >
      {/* HERO */}
      <header
        style={{
          minHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.06)",
            marginBottom: "1.5rem",
            fontWeight: 600,
          }}
        >
          ✨ Identity is the new internet
        </div>

        <h1
          style={{
            fontSize: "clamp(4rem,10vw,8rem)",
            fontWeight: 800,
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
            marginBottom: "1.5rem",
          }}
        >
          I AM
        </h1>

        <p
          style={{
            maxWidth: "650px",
            fontSize: "1.25rem",
            opacity: 0.9,
            marginBottom: "2rem",
          }}
        >
          The most powerful words you will ever speak.
          <br />
          Claim a digital identity that reflects who you are becoming.
        </p>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link to="/register" role="button">
            Claim My Name
          </Link>
          <Link to="/login" role="button" className="outline">
            Login
          </Link>
        </div>
      </header>

      {/* MANIFESTATION */}
      <section
        style={{
          padding: "7rem 1rem",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "2.5rem", marginBottom: "2rem" }}>
          Before anything is created, it is declared.
        </h2>

        <p style={{ maxWidth: "650px", margin: "0 auto", fontSize: "1.2rem" }}>
          I AM wealthy. I AM healed. I AM loved. I AM free. I AM powerful.
          <br />
          Identity comes first. Everything follows.
        </p>
      </section>

      {/* IDENTITY STATEMENT */}
      <section
        style={{
          padding: "7rem 1rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "clamp(3rem,8vw,6rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
          }}
        >
          I AM __________
        </div>
      </section>

      {/* WHY IT MATTERS */}
      <section
        style={{
          padding: "7rem 1rem",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "2.5rem", marginBottom: "2rem" }}>
          The internet changed. Identity is now the product.
        </h2>

        <p style={{ maxWidth: "700px", margin: "0 auto", fontSize: "1.2rem" }}>
          Websites gave us pages.
          <br />
          Social media gave us usernames.
          <br />
          The next layer is ownership of identity itself.
        </p>
      </section>

      {/* CORE FEATURES */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
          gap: "1rem",
          padding: "3rem 0",
          textAlign: "center",
        }}
      >
        {[
          ["🔑", "Universal Login", "One identity across everything."],
          ["💸", "Digital Payments", "Send and receive using your name."],
          ["🌐", "Identity Layer", "Your presence across the internet."],
          ["🔒", "Owned Forever", "No rent. No expiration. Ever."],
        ].map(([icon, title, desc]) => (
          <div
            key={title}
            style={{
              padding: "2rem",
              borderRadius: "20px",
              background: "var(--card-background)",
            }}
          >
            <div style={{ fontSize: "2rem" }}>{icon}</div>
            <h3>{title}</h3>
            <p style={{ opacity: 0.85 }}>{desc}</p>
          </div>
        ))}
      </section>

      {/* DIGITAL LAND RUSH */}
      <section
        style={{
          padding: "7rem 1rem",
          textAlign: "center",
          background: "var(--card-background)",
          borderRadius: "24px",
          margin: "3rem 0",
        }}
      >
        <h2 style={{ fontSize: "2.5rem", marginBottom: "2rem" }}>
          Early Identity Names Being Claimed
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
            gap: "1rem",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          {[
            ["iam.wealth", "Wealth & finance identity"],
            ["iam.love", "Relationships & wellness"],
            ["iam.healer", "Spiritual practitioners"],
            ["iam.freedom", "Entrepreneurs & creators"],
          ].map(([name, desc]) => (
            <div
              key={name}
              style={{
                padding: "1.5rem",
                borderRadius: "16px",
                background: "rgba(255,255,255,0.04)",
              }}
            >
              <strong>{name}</strong>
              <p style={{ marginTop: "0.5rem", opacity: 0.85 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SPIRITUAL CORE */}
      <section
        style={{
          padding: "7rem 1rem",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "2.5rem", marginBottom: "2rem" }}>
          Identity creates reality
        </h2>

        <p style={{ maxWidth: "650px", margin: "0 auto", fontSize: "1.2rem" }}>
          You do not attract what you want.
          <br />
          You attract what you are.
          <br />
          Your I AM name anchors that identity digitally.
        </p>
      </section>

      {/* FINAL CTA */}
      <footer
        style={{
          padding: "8rem 1rem",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>
          Who do you choose to become?
        </h2>

        <div
          style={{
            fontSize: "3rem",
            fontWeight: 800,
            marginBottom: "2rem",
            color: "var(--primary)",
          }}
        >
          I AM __________
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/register" role="button">
            Claim My Name
          </Link>
          <Link to="/login" role="button" className="outline">
            Login
          </Link>
        </div>
      </footer>
    </article>
  );
}
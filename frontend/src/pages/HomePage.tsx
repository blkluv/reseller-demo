import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
export default function HomePage() {
  const { user, loading } = useAuth();
  if (loading) return <p aria-busy="true">Loading...</p>;
  if (user) return <Navigate to="/dashboard" replace />;
  return (
    <article
style={{
maxWidth: "1200px",
margin: "0 auto",
padding: "1.5rem",
}}
>
{/* HERO */}

  <header
    style={{
      textAlign: "center",
      padding: "3rem 0",
      position: "relative",
    }}
  >
    <div
      style={{
        display: "inline-block",
        padding: "0.5rem 1rem",
        borderRadius: "999px",
        background: "rgba(255,255,255,.06)",
        marginBottom: "1rem",
        fontWeight: 600,
      }}
    >
      ✨ Own Your Name. Own Your Future.
    </div>

    <h1
      style={{
        fontSize: "clamp(3rem,8vw,5.5rem)",
        lineHeight: 1,
        marginBottom: "1rem",
      }}
    >
      The Future Begins With
      <br />
      <span style={{ color: "var(--primary)" }}>I AM</span>
    </h1>

    <p
      style={{
        fontSize: "1.3rem",
        maxWidth: "850px",
        margin: "0 auto",
        opacity: 0.9,
      }}
    >
      Every transformation begins with two powerful words:
      <strong> I AM.</strong>
      Your thoughts become your identity. Your identity becomes
      your reality. Claim a digital name that reflects who you
      choose to become.
    </p>

    <div
      style={{
        display: "flex",
        gap: "1rem",
        justifyContent: "center",
        flexWrap: "wrap",
        marginTop: "2rem",
      }}
    >
      <Link to="/register" role="button">
        Claim Your I AM Name
      </Link>

      <Link
        to="/login"
        role="button"
        className="outline"
      >
        Login
      </Link>
    </div>
  </header>

  {/* MANIFESTATION */}

  <section
    style={{
      background: "var(--card-background)",
      padding: "2rem",
      borderRadius: "24px",
      marginBottom: "1.5rem",
    }}
  >
    <h2>🌟 Manifest A New Reality</h2>

    <p>
      For thousands of years, people have used the words
      <strong> I AM</strong> to declare who they are becoming.
    </p>

    <p>
      Every dream, vision, and transformation begins with a
      declaration:
    </p>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
        gap: "1rem",
        marginTop: "1rem",
      }}
    >
      <div>✨ I AM Abundant</div>
      <div>❤️ I AM Loved</div>
      <div>🚀 I AM Successful</div>
      <div>🕊️ I AM Free</div>
      <div>🌎 I AM Limitless</div>
      <div>💎 I AM Wealthy</div>
    </div>

    <p style={{ marginTop: "1.5rem" }}>
      Your I AM name transforms that declaration into a permanent
      digital identity that can follow you everywhere online.
    </p>

    <p>
      This is more than a username.
      It's your manifestation portal.
    </p>
  </section>

  {/* FEATURES */}

  <section
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
      gap: "1rem",
      marginBottom: "1.5rem",
    }}
  >
    <div
      style={{
        background: "var(--card-background)",
        padding: "1.5rem",
        borderRadius: "20px",
      }}
    >
      <div style={{ fontSize: "2rem" }}>🔑</div>
      <h3>Universal Login</h3>
      <p>
        One identity. One login. Access the future with your I AM
        name.
      </p>
    </div>

    <div
      style={{
        background: "var(--card-background)",
        padding: "1.5rem",
        borderRadius: "20px",
      }}
    >
      <div style={{ fontSize: "2rem" }}>💸</div>
      <h3>Digital Address</h3>
      <p>
        Receive payments, messages, opportunities, and
        connections through a name people remember.
      </p>
    </div>

    <div
      style={{
        background: "var(--card-background)",
        padding: "1.5rem",
        borderRadius: "20px",
      }}
    >
      <div style={{ fontSize: "2rem" }}>🌐</div>
      <h3>Your Digital Identity</h3>
      <p>
        One identity across social media, communities,
        businesses, and the future internet.
      </p>
    </div>

    <div
      style={{
        background: "var(--card-background)",
        padding: "1.5rem",
        borderRadius: "20px",
      }}
    >
      <div style={{ fontSize: "2rem" }}>🔒</div>
      <h3>Yours Forever</h3>
      <p>
        No monthly rent. No yearly renewals. No company can take
        your identity away.
      </p>
    </div>
  </section>

  {/* WHAT IS I AM */}

  <section
    style={{
      background: "var(--card-background)",
      padding: "2rem",
      borderRadius: "24px",
      borderLeft: "4px solid var(--primary)",
      marginBottom: "1.5rem",
    }}
  >
    <h2>🧘 What Is An I AM Name?</h2>

    <p>
      An I AM name is a digital identity rooted in the most
      powerful statement a human can make:
      <strong> I AM.</strong>
    </p>

    <ul>
      <li>✅ Your Name</li>
      <li>✅ Your Login</li>
      <li>✅ Your Payment Address</li>
      <li>✅ Your Digital Reputation</li>
      <li>✅ Your Personal Brand</li>
      <li>✅ Your Manifestation Identity</li>
    </ul>

    <p>
      Imagine introducing yourself online with a name that
      represents your purpose rather than a random username.
    </p>

    <p style={{ opacity: 0.8 }}>
      Example:
      <strong> iam.blkluv.org</strong>
    </p>
  </section>

  {/* DIGITAL LAND RUSH */}

  <section
    style={{
      background: "var(--card-background)",
      padding: "2rem",
      borderRadius: "24px",
      marginBottom: "1.5rem",
    }}
  >
    <h2>📈 Why Early Name Owners Are Paying Attention</h2>

    <p>
      Every digital revolution begins with ownership.
    </p>

    <p>
      Today, the next evolution isn't websites.
      It's identity.
    </p>

    <p>
      I AM names are designed to become the foundation of your
      digital presence, reputation, payments, and community.
    </p>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
        gap: "1rem",
        marginTop: "1.5rem",
      }}
    >
      <div
        style={{
          padding: "1rem",
          borderRadius: "16px",
          background: "rgba(255,255,255,.04)",
        }}
      >
        <strong>iam.wealth</strong>
        <p>
          Ideal for wealth creators, investors, and financial
          communities.
        </p>
      </div>

      <div
        style={{
          padding: "1rem",
          borderRadius: "16px",
          background: "rgba(255,255,255,.04)",
        }}
      >
        <strong>iam.love</strong>
        <p>
          Perfect for relationship experts, coaches, and wellness
          brands.
        </p>
      </div>

      <div
        style={{
          padding: "1rem",
          borderRadius: "16px",
          background: "rgba(255,255,255,.04)",
        }}
      >
        <strong>iam.freedom</strong>
        <p>
          A memorable identity for entrepreneurs and visionaries.
        </p>
      </div>

      <div
        style={{
          padding: "1rem",
          borderRadius: "16px",
          background: "rgba(255,255,255,.04)",
        }}
      >
        <strong>iam.healer</strong>
        <p>
          A powerful name for spiritual leaders and wellness
          practitioners.
        </p>
      </div>
    </div>

    <p style={{ marginTop: "1.5rem" }}>
      Some people claim names because they represent who they are.
      Others claim names because they represent who they are
      becoming.
    </p>

    <p>
      As adoption grows, meaningful names become increasingly
      difficult to acquire.
    </p>

    <p style={{ opacity: 0.7, fontSize: ".9rem" }}>
      Not investment advice. Name values may increase, decrease,
      or never gain value.
    </p>
  </section>

  {/* CTA */}

  <footer
    style={{
      textAlign: "center",
      padding: "3rem 0",
    }}
  >
    <h2
      style={{
        fontSize: "clamp(2rem,5vw,3.5rem)",
        marginBottom: "1rem",
      }}
    >
      Who Do You Choose To Become?
    </h2>

    <p
      style={{
        maxWidth: "700px",
        margin: "0 auto 2rem",
        fontSize: "1.15rem",
      }}
    >
      Every manifestation begins with a declaration.
      Every declaration begins with a name.
    </p>

    <div
      style={{
        fontSize: "2.5rem",
        fontWeight: 700,
        color: "var(--primary)",
        marginBottom: "2rem",
      }}
    >
      I AM __________
    </div>

    <div
      style={{
        display: "flex",
        gap: "1rem",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <Link to="/register" role="button">
        Claim Your I AM Name
      </Link>

      <Link
        to="/login"
        role="button"
        className="outline"
      >
        Login With I AM
      </Link>
    </div>
  </footer>
</article>
);
}

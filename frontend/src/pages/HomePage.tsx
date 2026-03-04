import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) return <p aria-busy="true">Loading...</p>;
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <article>
      <header>
        <h2>Welcome to Domain Manager</h2>
      </header>
      <p>Search, register, and manage your domains in one place.</p>
      <footer>
        <Link to="/login" role="button">
          Login
        </Link>{" "}
        <Link to="/register" role="button" className="outline">
          Register
        </Link>
      </footer>
    </article>
  );
}

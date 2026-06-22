import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Layout() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <nav className="container">
        <ul>
          <li>
            <Link to="/">
              <strong>I AM</strong>
            </Link>
          </li>
        </ul>
        <ul>
          {user ? (
            <>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/search">Search</Link>
              </li>
              <li>
                <Link to="/contacts">Contacts</Link>
              </li>
              <li>
                <small>{user.username}</small>
              </li>
              <li>
                <a
                  href="#"
                  role="button"
                  className="outline secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                  }}
                >
                  Logout
                </a>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register" role="button">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}

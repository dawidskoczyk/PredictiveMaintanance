import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { useMsal,useIsAuthenticated  } from '@azure/msal-react';
import { loginRequest } from '../azure/AuthConfig';
export function Menu() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated(); // Sprawdzenie, czy użytkownik jest zalogowany

  const handleLogin = () => {
    instance.loginRedirect(loginRequest)
  };

  // Funkcja obsługująca wylogowanie
  const handleLogout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: "http://localhost:3000", // Po wylogowaniu przekierowanie na stronę główną
    });
  };

  return (
    <Navbar className="bg-body-tertiary" style={{ width: "100%" }}>
      <Container>
        <Navbar.Brand style={{ marginLeft: "-4%" }} as={Link} to="/home">🏠 Home</Navbar.Brand>
        <Navbar.Brand as={Link} to="/history">🗄️ Anomaly History</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {isAuthenticated ? (
            <>
              <Navbar.Text style={{ marginRight: "5%" }}>
                Signed in as: {accounts[0]?.name || 'User'}
              </Navbar.Text>
              <Navbar.Brand style={{ marginRight: "-5%", cursor: 'pointer' }} onClick={handleLogout}>
                🚪 Log Out
              </Navbar.Brand>
            </>
          ) : (
            <Navbar.Brand style={{ marginRight: "-5%", cursor: 'pointer' }} onClick={handleLogin}>
              🔑 Log In
            </Navbar.Brand>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
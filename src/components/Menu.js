import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';

export function Menu() {
  const { instance, accounts } = useMsal();
  const handleLogout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: window.location.origin
    });
  };
  return (
    <Navbar className="bg-body-tertiary" style={{ width: "100%" }}>
      <Container>
        <Navbar.Brand style={{ marginLeft: "-4%" }} as={Link} to="/home">🏠 Home</Navbar.Brand>
        <Navbar.Brand as={Link} to="/history">🗄️ Anomaly History</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text style={{ marginRight: "5%" }}>
            Signed in as: {accounts.length > 0 ? accounts[0].name : 'Guest'}
          </Navbar.Text>
          <Navbar.Brand style={{ marginRight: "-5%" }} onClick={handleLogout}>
            🚪 Log Out
          </Navbar.Brand>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
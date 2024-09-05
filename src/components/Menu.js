import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../login/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
export function Menu() {
  // Define custom login and logout handlers
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const { isAuthenticated, logout , username } = useAuth(); // Use useAuth to get authentication state and username


  const handleLogin = () => {
    // Redirect to login page or show login form
    navigate('/login'); // Programmatically navigate to the login page
  };

  const handleLogout = () => {
    logout(); // Wywołujemy funkcję logout z AuthContext
    toast.success('Logged out successfully');
    navigate('/login');  
  };

  const handleUserManagement = () => {
    navigate('/user-management'); // Przejdź do strony zarządzania użytkownikami
  };

  const handleSignUp = () => {
    // Redirect to signup page or show signup form
    navigate('/register'); // Programmatically navigate to the signup page
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
               <Navbar.Text 
                style={{ marginRight: "1rem", cursor: 'pointer' }} onClick={handleUserManagement}>
                Witaj: {username}!
              </Navbar.Text>
              <Navbar.Brand style={{ marginRight: "-5%", cursor: 'pointer' }} onClick={handleLogout}>
                🚪 Log Out
              </Navbar.Brand>
            </>
          ) : (
            <>
              <Navbar.Brand style={{ marginRight: "-5%", cursor: 'pointer' }} onClick={handleSignUp}>
                ✍️ Sign Up
              </Navbar.Brand>
              <Navbar.Brand style={{ marginLeft: "10%", cursor: 'pointer' }} onClick={handleLogin}>
                🔑 Log In
              </Navbar.Brand>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
export function Menu() {
  return (
    <Navbar className="bg-body-tertiary" style={{width:"100%"}}>
      <Container>
        <Navbar.Brand style={{marginLeft:"-4%"}} as={Link} to="/home">🏠 Home</Navbar.Brand>
        <Navbar.Brand as={Link} to="/history">🗄️ Anomaly History</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end" >
          <Navbar.Text   style={{marginRight:"5%"}}>
            Signed in as: <a as={Link} to="/login">Mark Otto</a>
          </Navbar.Text>
          <Navbar.Brand style={{marginRight:"-5%"}} as={Link} to="/logout">🚪 Log Out</Navbar.Brand>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

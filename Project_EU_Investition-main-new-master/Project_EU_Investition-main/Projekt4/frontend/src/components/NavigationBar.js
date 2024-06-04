import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../logo.png';

const NavigationBar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    <img
                        src={logo}
                        width="64"
                        height="64"
                        className="d-inline-block align-top"
                        alt="Logo"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        {isLoggedIn && <Nav.Link as={Link} to="/projectlist">Lista Projektów</Nav.Link>}
                        {isLoggedIn && <Nav.Link as={Link} to="/charts">Wykresy</Nav.Link>}
                    </Nav>
                    <Nav className="ml-auto" style={{ marginLeft: 'auto' }}>
                        {isLoggedIn ? (
                            <Button variant="outline-danger" onClick={handleLogout}>Wyloguj się</Button>
                        ) : (
                            <>
                                <Button variant="outline-success" as={Link} to="/login">Zaloguj się</Button>
                                <Button variant="outline-primary" as={Link} to="/register" className="ml-2">Zarejestruj się</Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;

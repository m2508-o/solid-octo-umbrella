import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Hasła nie są zgodne');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/auth/register', { username, password });
      setSuccess('Rejestracja zakończona sukcesem');
      setError('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      setError('Błąd podczas rejestracji');
      setSuccess('');
    }
  };

  return (
      <Container>
        <Row className="justify-content-md-center">
          <Col md="4">
            <h2>Rejestracja</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formUsername">
                <Form.Label>Nazwa użytkownika</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Wprowadź nazwę użytkownika"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
              </Form.Group>
              <Form.Group controlId="formPassword">
                <Form.Label>Hasło</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Wprowadź hasło"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
              </Form.Group>
              <Form.Group controlId="formConfirmPassword">
                <Form.Label>Potwierdź hasło</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Potwierdź hasło"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Zarejestruj się
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
  );
};

export default Register;

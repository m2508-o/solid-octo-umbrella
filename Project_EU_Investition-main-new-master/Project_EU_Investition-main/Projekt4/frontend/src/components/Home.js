import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaReact, FaNodeJs, FaDatabase, FaChartLine } from 'react-icons/fa';
import { SiMongodb, SiExpress, SiBootstrap } from 'react-icons/si';
import 'animate.css/animate.min.css';
import '../Home.css';

const Home = () => {
    return (
        <Container className="my-5">
            <Card className="text-center shadow-lg p-3 mb-5 bg-white rounded animate__animated animate__fadeIn">
                <Card.Body>
                    <Card.Title className="display-4">Witamy w aplikacji</Card.Title>
                    <Card.Text>
                        Aplikacja umożliwia wizualizację i przeglądanie realizowanych inwestycji.
                    </Card.Text>
                </Card.Body>
            </Card>
            <Card className="mt-4 shadow p-3 mb-5 bg-white rounded animate__animated animate__fadeInUp">
                <Card.Body>
                    <Card.Title className="h3">Użyte Technologie</Card.Title>
                    <Row>
                        <Col md={6}>
                            <h5>Frontend <FaReact className="text-primary" /></h5>
                            <ul>
                                <li><FaReact className="text-primary" /> React</li>
                                <li><SiBootstrap className="text-info" /> Bootstrap</li>
                                <li><FaChartLine className="text-warning" /> Recharts</li>
                            </ul>
                        </Col>
                        <Col md={6}>
                            <h5>Backend <FaNodeJs className="text-success" /></h5>
                            <ul>
                                <li><FaNodeJs className="text-success" /> Node.js</li>
                                <li><SiExpress className="text-dark" /> Express.js</li>
                                <li><SiMongodb className="text-success" /> MongoDB</li>
                            </ul>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            <Card className="mt-4 shadow p-3 mb-5 bg-white rounded animate__animated animate__fadeInUp">
                <Card.Body>
                    <Card.Title className="h3">Źródło Bazy Danych <FaDatabase className="text-secondary" /></Card.Title>
                    <Card.Text>
                        Dane do tego projektu pochodzą z bazy danych MongoDB hostowanej online.
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Home;

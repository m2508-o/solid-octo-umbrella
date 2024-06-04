import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';

const ProjectDetail = ({ projects }) => {
    const { id } = useParams();

    if (!Array.isArray(projects) || projects.length === 0) {
        return <Container>Loading...</Container>;
    }

    const project = projects.find(p => p._id === id);

    if (!project) {
        return <Container>Projekt nie znaleziony</Container>;
    }

    return (
        <Container className="my-3">
            <Card>
                <Card.Body>
                    <Card.Title>{project.projectName}</Card.Title>
                    <Card.Text as="div">
                        <div><strong>Opis:</strong> {project.projectSummary}</div>
                        <div><strong>Numer Umowy:</strong> {project.contractNumber}</div>
                        <div><strong>Nazwa Beneficjenta:</strong> {project.beneficiaryName}</div>
                        <div><strong>Fundusz:</strong> {project.fund}</div>
                        <div><strong>Cel Szczegółowy:</strong> {project.specificObjective}</div>
                        <div><strong>Program:</strong> {project.program}</div>
                        <div><strong>Priorytet:</strong> {project.priority}</div>
                        <div><strong>Działanie:</strong> {project.measure}</div>
                        <div><strong>Całkowita Wartość Projektu (PLN):</strong> {project.totalProjectValuePLN}</div>
                        <div><strong>Wskaźnik Współfinansowania UE (%):</strong> {project.unionCoFinancingRate}</div>
                        <div><strong>Współfinansowanie UE (PLN):</strong> {project.euCoFinancingPLN}</div>
                        <div><strong>Kurs Wymiany EURO:</strong> {project.euroExchangeRate}</div>
                        <div><strong>Lokalizacja Projektu:</strong> {project.projectLocation}</div>
                        <div><strong>Data Rozpoczęcia Projektu:</strong> {new Date(project.projectStartDate).toLocaleDateString()}</div>
                        <div><strong>Data Zakończenia Projektu:</strong> {new Date(project.projectEndDate).toLocaleDateString()}</div>
                        <div><strong>Kategoria:</strong> {project.category}</div>
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ProjectDetail;

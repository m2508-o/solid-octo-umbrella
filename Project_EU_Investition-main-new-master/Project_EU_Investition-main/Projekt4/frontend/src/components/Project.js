import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';

const Project = ({ project }) => {
    return (
        <Card className="mb-3">
            <Card.Body>
                <Card.Title>
                    <Link to={`/projects/${project._id}`}>
                        {project.projectName}
                    </Link>
                </Card.Title>
                <Card.Text>
                    <p><strong>Contract Number:</strong> {project.contractNumber}</p>
                    <p><strong>Beneficiary Name:</strong> {project.beneficiaryName}</p>
                    <p><strong>Fund:</strong> {project.fund}</p>
                    <p><strong>Specific Objective:</strong> {project.specificObjective}</p>
                    <p><strong>Program:</strong> {project.program}</p>
                    <p><strong>Priority:</strong> {project.priority}</p>
                    <p><strong>Measure:</strong> {project.measure}</p>
                    <p><strong>Total Project Value (PLN):</strong> {project.totalProjectValuePLN}</p>
                    <p><strong>Union Co-Financing Rate (%):</strong> {project.unionCoFinancingRate}</p>
                    <p><strong>EU Co-Financing (PLN):</strong> {project.euCoFinancingPLN}</p>
                    <p><strong>EURO Exchange Rate:</strong> {project.euroExchangeRate}</p>
                    <p><strong>Project Location:</strong> {project.projectLocation}</p>
                    <p><strong>Project Start Date:</strong> {new Date(project.projectStartDate).toLocaleDateString()}</p>
                    <p><strong>Project End Date:</strong> {new Date(project.projectEndDate).toLocaleDateString()}</p>
                    <p><strong>Type of Intervention:</strong> {project.typeOfIntervention}</p>
                </Card.Text>
                <Button as={Link} to={`/projects/${project._id}`} variant="primary">View Details</Button>
            </Card.Body>
        </Card>
    );
};

export default Project;

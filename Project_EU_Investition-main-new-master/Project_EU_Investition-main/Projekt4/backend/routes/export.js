const express = require('express');
const router = express.Router();
const xml = require('xml-js');
const { Parser } = require('json2csv');
const Project = require('../models/Project');
const mongoose = require('mongoose');

// Eksport w JSON
router.get('/export/json', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const projects = await Project.find().session(session);
        await session.commitTransaction();
        session.endSession();
        res.setHeader('Content-Disposition', 'attachment; filename="projects.json"');
        res.json(projects);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error exporting JSON:', error);
        res.status(500).send('Server Error');
    }
});

// Eksport w  XML
router.get('/export/xml', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const projects = await Project.find().session(session);
        const xmlData = xml.json2xml(JSON.stringify(projects), { compact: true, spaces: 4 });
        await session.commitTransaction();
        session.endSession();
        res.setHeader('Content-Disposition', 'attachment; filename="projects.xml"');
        res.setHeader('Content-Type', 'application/xml');
        res.send(xmlData);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error exporting XML:', error);
        res.status(500).send('Server Error');
    }
});

// Eksport w  CSV
router.get('/export/csv', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const projects = await Project.find().session(session);

        if (!projects || projects.length === 0) {
            await session.commitTransaction();
            session.endSession();
            console.error('No projects found');
            return res.status(404).send('No projects found');
        }
        const fields = ['projectName', 'projectSummary', 'contractNumber',
            'beneficiaryName', 'fund', 'specificObjective', 'program',
            'priority', 'measure', 'totalProjectValuePLN', 'unionCoFinancingRate',
            'euCoFinancingPLN', 'euroExchangeRate', 'projectLocation',
            'projectStartDate', 'projectEndDate', 'category'];

        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(projects);

        await session.commitTransaction();
        session.endSession();

        res.setHeader('Content-Disposition', 'attachment; filename="projects.csv"');
        res.setHeader('Content-Type', 'text/csv');
        res.send(csv);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error exporting CSV:', error);
        res.status(500).send('Server Error');
    }
});

//Eksport w TXT
router.get('/export/txt', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const projects = await Project.find().session(session); if (!projects || projects.length === 0) {
            await session.commitTransaction();
            session.endSession();
            console.error('No projects found');
            return res.status(404).send('No projects found');
        }

        const txtContent = projects.map(project => {
            return `Project Name: ${project.projectName}\n` +
                `Description: ${project.projectSummary}\n` +
                `Contract Number: ${project.contractNumber}\n` +
                `Beneficiary Name: ${project.beneficiaryName}\n` +
                `Fund: ${project.fund}\n` +
                `Specific Objective: ${project.specificObjective}\n` +
                `Program: ${project.program}\n` +
                `Priority: ${project.priority}\n` +
                `Measure: ${project.measure}\n` +
                `Total Project Value (PLN): ${project.totalProjectValuePLN}\n` +
                `Union Co-Financing Rate: ${project.unionCoFinancingRate}\n` +
                `EU Co-Financing (PLN): ${project.euCoFinancingPLN}\n` +
                `Euro Exchange Rate: ${project.euroExchangeRate}\n` +
                `Project Location: ${project.projectLocation}\n` +
                `Project Start Date: ${project.projectStartDate}\n` +
                `Project End Date: ${project.projectEndDate}\n` +
                `Category: ${project.category}\n\n`;
        }).join('');

        await session.commitTransaction();
        session.endSession();

        res.setHeader('Content-Disposition', 'attachment; filename="projects.txt"');
        res.setHeader('Content-Type', 'text/plain');
        res.send(txtContent);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error exporting TXT:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

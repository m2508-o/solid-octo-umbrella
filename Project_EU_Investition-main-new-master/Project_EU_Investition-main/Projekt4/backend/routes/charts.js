const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Project = require("../models/Project");
const categories = require("../models/Categories");

router.get('/chart-data', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Start date and end date are required' });
        }

        const start = new Date(startDate).toISOString();
        const end = new Date(endDate).toISOString();

        console.log(`Fetching projects between ${start} and ${end}`);

        const projects = await Project.find({
            projectStartDate: { $gte: start },
            projectEndDate: { $lte: end }
        }).session(session);

        console.log(`Fetched ${projects.length} projects`);

        if (projects.length === 0) {
            await session.commitTransaction();
            session.endSession();
            return res.json([]);
        }

        const wojewodztwa = [
            "DOLNOŚLĄSKIE", "KUJAWSKO-POMORSKIE", "LUBELSKIE", "LUBUSKIE",
            "ŁÓDZKIE", "MAŁOPOLSKIE", "MAZOWIECKIE", "OPOLSKIE",
            "PODKARPACKIE", "PODLASKIE", "POMORSKIE", "ŚLĄSKIE",
            "ŚWIĘTOKRZYSKIE", "WARMIŃSKO-MAZURSKIE", "WIELKOPOLSKIE", "ZACHODNIOPOMORSKIE"
        ];

        const result = [];

        for (const woj of wojewodztwa) {
            const projectsInWoj = projects.filter(project => project.projectLocation.includes(woj));
            for (const category of Object.keys(categories)) {
                const totalValue = projectsInWoj
                    .filter(project => project.category === category)
                    .reduce((acc, curr) => acc + parseFloat(curr.totalProjectValuePLN) || 0, 0);

                if (totalValue > 0) {
                    result.push({
                        wojewodztwo: woj,
                        category,
                        value: totalValue
                    });
                }
            }
        }

        console.log("Result:", result);

        await session.commitTransaction();
        session.endSession();
        res.json(result);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error generating chart data', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/line-chart-data', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        console.log(`Fetching all projects`);

        const projects = await Project.find({}, 'projectStartDate totalProjectValuePLN euCoFinancingPLN').sort({ projectStartDate: 1 }).session(session);

        console.log(`Fetched ${projects.length} projects`);

        if (projects.length === 0) {
            await session.commitTransaction();
            session.endSession();
            return res.json([]);
        }

        const result = projects.map(project => ({
            date: project.projectStartDate,
            totalProjectValuePLN: parseFloat(project.totalProjectValuePLN),
            euCoFinancingPLN: parseFloat(project.euCoFinancingPLN)
        }));

        console.log("Result:", result);

        await session.commitTransaction();
        session.endSession();
        res.json(result);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error generating line chart data', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

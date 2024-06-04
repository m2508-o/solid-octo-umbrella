const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Project = require('../models/Project');

router.get('/', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { page = 1, limit = 100, type = '', location = '' } = req.query;
        const projects = await Project.find({
            type: { $regex: type, $options: 'i' },
            projectLocation: { $regex: '.*' + location + '.*', $options: 'i' }
        })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Project.countDocuments({
            type: { $regex: type, $options: 'i' },
            projectLocation: { $regex: '.*' + location + '.*', $options: 'i' }
        });

        await session.commitTransaction();
        session.endSession();

        res.json({
            projects,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/:id', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const project = await Project.findById(req.params.id).session(session);
        if (!project) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Cannot find project' });
        }
        await session.commitTransaction();
        session.endSession();
        res.json(project);
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
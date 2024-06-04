const mongoose = require('mongoose');
const Project = require('../models/Project');

const projects = [
  {
    title: 'Project 1',
    description: 'Description for project 1',
    region: 'Region 1',
    budget: 100000,
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-12-31'),
  },
  {
    title: 'Project 2',
    description: 'Description for project 2',
    region: 'Region 2',
    budget: 200000,
    startDate: new Date('2023-02-01'),
    endDate: new Date('2023-11-30'),
  },

];

mongoose.connect('mongodb://localhost/eu_projects', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    return Project.insertMany(projects);
  })
  .then(() => {
    console.log('Test data added');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error adding test data', err);
    mongoose.connection.close();
  });

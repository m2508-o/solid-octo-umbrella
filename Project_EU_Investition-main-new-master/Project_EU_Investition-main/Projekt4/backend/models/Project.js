const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  projectName: String,
  projectSummary: String,
  contractNumber: String,
  beneficiaryName: String,
  fund: String,
  specificObjective: String,
  program: String,
  priority: String,
  measure: String,
  totalProjectValuePLN: Number,
  unionCoFinancingRate: Number,
  euCoFinancingPLN: Number,
  euroExchangeRate: Number,
  projectLocation: String,
  projectStartDate: String,
  projectEndDate: String,
  typeOfIntervention: String,
  category: String
});

module.exports = mongoose.model('Project', ProjectSchema);
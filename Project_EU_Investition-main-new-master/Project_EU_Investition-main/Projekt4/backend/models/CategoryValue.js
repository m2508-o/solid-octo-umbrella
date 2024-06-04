const mongoose = require('mongoose');

const categoryValueSchema = new mongoose.Schema({
    wojewodztwo: String,
    category: String,
    totalValue: Number
});

const CategoryValue = mongoose.model('CategoryValue', categoryValueSchema);

module.exports = CategoryValue;

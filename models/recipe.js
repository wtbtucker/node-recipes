const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    ingredients: {
        type: Map,
        of: String,
        required: true
    },
    instructions: {
        type: [String],
        required: true
    },
    creator: {
        type: String,
        required: false
    }
}, { timestamps: true });

const Recipe = mongoose.model('recipe', recipeSchema);
module.exports = Recipe;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ingredientSchema = new Schema({ ingredient: String, quantity: String }, { noID: true, required: true });
const recipeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    ingredients: [ingredientSchema],
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
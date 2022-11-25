const Recipe = require('../models/recipe');

const recipe_index = (req, res) => {
    Recipe.find().sort({ createdAt: -1 })
        .then(result => {
            res.render('index', { recipes: result, title: 'All recipes' });
        })
        .catch(err => console.log(err));
}

const recipe_details = (req, res) => {
    const id = req.params.id;
    Recipe.findById(id)
        .then(result => {
            res.render('details', { recipe: result, title: 'Recipe Details' });
        })
        .catch(err => console.log(err));
}

const recipe_create_get = (req, res) => {
    res.render('create', { title: 'Create new recipe' })
}

// change new recipe form to fit model structure
    // create form with user data and error message if not valid
    // recipe schema to better reflect the data structure of ingredients (ingredient: units: quantity)
    // Instructions: text area for each step
    // numbered when displayed on details page
    // Ingredients: Matrix with ingredient and quantity columns

const recipe_create_post = (req, res) => {
    const recipeRequest = req.body;
    const recipe = new Recipe({ title: recipeRequest["title"], instructions: recipeRequest["instructions"], ingredients: {} });
    for (let i=0; i<recipeRequest["ingredient-quantity"].length; i++){
        recipe.ingredients.set(recipeRequest["ingredient-name"][i], recipeRequest["ingredient-quantity"][i]);
    }
    recipe.save()
        .then(result => {
            res.redirect('/recipes');
        })
        .catch(err => console.log(err));
}

const recipe_delete = (req, res) => {
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/recipes' });
        })
        .catch(err => console.log(err));
}

module.exports = {
    recipe_index,
    recipe_details,
    recipe_create_get,
    recipe_create_post,
    recipe_delete
}
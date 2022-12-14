const Recipe = require('../models/recipe');

const recipe_index = (req, res) => {
    Recipe.find().sort({ createdAt: -1 })
        .then(result => {
            res.render('index', { recipes: result, title: 'All recipes' });
        })
        .catch(err => console.log(err));
};


const recipe_details = (req, res) => {
    const id = req.params.id;
    Recipe.findById(id)
        .then(result => {
            res.render('details', { recipe: result, title: 'Recipe Details' });
        })
        .catch(err => console.log(err));
};


const recipe_create_get = (req, res) => {
    res.render('create', { title: 'Create new recipe' })
};


const recipe_create_post = (req, res) => {
    const recipeRequest = req.body;

    // Set the creator field to the username of the user making the request
    const recipe = new Recipe({ title: recipeRequest["title"], instructions: recipeRequest["instructions"], ingredients: {}, creator: req.session.userid });
    for (let i=0; i<recipeRequest["ingredient-quantity"].length; i++){
        recipe.ingredients.set(recipeRequest["ingredient-name"][i], recipeRequest["ingredient-quantity"][i]);
    }
    recipe.save()
        .then(result => {
            res.redirect('/recipes');
        })
        .catch(err => console.log(err));
};


// Find recipe using the id from the request parameters and delete it
// Check that user is the same as the user that created the recipe
const recipe_delete = (req, res) => {
    const id = req.params.id;
    Recipe.findById(id, 'creator', function(err, creator) {
        if (creator !== req.session.userid) return res.redirect('/recipes')
    });
    Recipe.findByIdAndDelete(id)
        .then(result => {
            res.redirect('/recipes');
        })
        .catch(err => console.log(err));
};

module.exports = {
    recipe_index,
    recipe_details,
    recipe_create_get,
    recipe_create_post,
    recipe_delete
}
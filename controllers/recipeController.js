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
    res.render('create', { title: 'Create new recipe', recipe: null })
};


const recipe_create_post = (req, res) => {
    const recipeRequest = req.body;
    console.log(recipeRequest)

    // Create list of ingredients from the request
    const ingredients = recipeRequest['ingredients']
    let ingredient_list = [];
    for (let i=0; i<ingredients.quantity.length; i++){
        ingredient_list.push({ ingredient: ingredients.ingredient[i], quantity: ingredients.quantity[i] });
    }

    // Remove blank entries for both ingredients and instructions
    ingredient_list = ingredient_list.filter(element => element.ingredient !== '');
    let instructions = recipeRequest['instructions'].filter(step => step !== '');

    // If the recipe does not already exist create a new document
    if (!recipeRequest["id"]) {

        // Set the creator field to the username of the user making the request
        const recipe = new Recipe({ 
            title: recipeRequest["title"], 
            instructions: instructions,
            ingredients: [],
            creator: req.session.userid 
        });

        // Insert the list of ingredients into the ingregients field of the document
        recipe.updateOne({$push: {ingredients: {$each: ingredient_list}}}, {upsert: false}, function(err){
            if(err){ console.log(err); }
            else { console.log("Successfully added") }
        });

        // Save the new recipe document and redirect the user to the main index
        recipe.save()
        .then(result => {
            res.redirect('/recipes');
        })
        .catch(err => console.log(err));

    // If the recipe exists edit the corresponding document
    } else {
        const old_recipe = Recipe.findById(recipeRequest['id'])
        old_recipe.updateOne(
            {title: recipeRequest["title"]}, 
            {instructions: instructions},
            {ingredients: ingredient_list},
            {upsert: true},
            function(err){
                if(err){
                    console.log(err);
                } else {
                    console.log("Successfully edited")
                }
            })
            .then(result => {
                res.redirect('/recipes');
            })
            .catch(err => console.log(err));
    }   
};



const recipe_delete = (req, res) => {

    // Find recipe using the id from the request parameters
    const id = req.params.id;

    // Check that user is the same as the user that created the recipe
    Recipe.findById(id, 'creator', function(err, creator) {
        if (creator !== req.session.userid) return res.redirect('/recipes')
    });

    // Delete the recipe
    Recipe.findByIdAndDelete(id)
        .then(result => {
            res.redirect('/recipes');
        })
        .catch(err => console.log(err));
};

// Find recipe using the id from the request parameters
async function recipe_edit(req, res) {
    const id = req.params.id;

    await Recipe.findById(id)
        .then(result => {
            res.render('create', {title: 'Edit Recipe', recipe: result})
        })
        .catch(err => console.log(err));
};

module.exports = {
    recipe_index,
    recipe_details,
    recipe_create_get,
    recipe_create_post,
    recipe_delete,
    recipe_edit
}
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
    const ingredients = recipeRequest['ingredients']
    console.log(recipeRequest)

    // If the recipe does not already exist create a new document
    if (!recipeRequest["id"]) {

        // Set the creator field to the username of the user making the request
        const recipe = new Recipe({ 
            title: recipeRequest["title"], 
            instructions: recipeRequest["instructions"],
            ingredients: [],
            creator: req.session.userid 
        });

        let ingredient_list = [];

        for (let i=0; i<ingredients.quantity.length; i++){
            ingredient_list.push({ ingredient: ingredients.ingredient[i], quantity: ingredients.quantity[i] });
        }
        console.log(ingredient_list);
        recipe.update({$push: {ingredients: {$each: ingredient_list}}}, {upsert: true}, function(err){
            if(err){
                console.log(err);
            } else {
                console.log("Successfully added")
            }
        })
        recipe.save()
        .then(result => {
            res.redirect('/recipes');
        })
        .catch(err => console.log(err));

    // If the recipe exists edit the corresponding document
    } else {
        const filter = { _id: recipeRequest["id"] }
        const update = { 
            title: recipeRequest["title"], 
            instructions: recipeRequest["instructions"], 
        }
        Recipe.findOneAndUpdate(filter, update, { new: false })
            .then(() => {
                res.redirect('/recipes');
            })
            .catch(err => console.log(err));
    }

        // Set ingredients
        // Will this function overide the existing ingredients?
        // for (let i=0; i<recipeRequest["ingredient-quantity"].length; i++){
        //     recipe.ingredients.set(recipeRequest["ingredient-name"][i], recipeRequest["ingredient-quantity"][i]);
        // }
    
    
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
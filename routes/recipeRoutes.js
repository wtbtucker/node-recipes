const express = require('express');
const recipeController = require('../controllers/recipeController');

const router = express.Router();

router.get('/create', recipeController.recipe_create_get);
router.get('/', recipeController.recipe_index);
router.post('/', recipeController.recipe_create_post);
router.get('/:id', recipeController.recipe_details);
router.get('/remove/:id', recipeController.recipe_delete);
router.get('/edit/:id', recipeController.recipe_edit);

module.exports = router;
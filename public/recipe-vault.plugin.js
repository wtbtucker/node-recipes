addEventListener('DOMContentLoaded', () => {
    addIngredient();
    addInstruction();
});

// add two new fields for ingredient and quantity
function addIngredient(){
    const newIngredientButton = document.querySelector('#new-ingredient');
    const ingredientTable = document.querySelector('#ingredient-table');

    newIngredientButton.onclick = function() {
        const ingredientField = document.createElement('input');
        ingredientField.setAttribute('type', 'text');
        ingredientField.setAttribute('id', 'ingredient-name');
        ingredientField.setAttribute('name', 'ingredient-name');
        ingredientField.setAttribute('form', 'create-recipe');
        const quantityField = document.createElement('input');
        quantityField.setAttribute('type', 'text');
        quantityField.setAttribute('id', 'ingredient-quantity');
        quantityField.setAttribute('name', 'ingredient-quantity');
        quantityField.setAttribute('form', 'create-recipe');
        const row = ingredientTable.insertRow(-1);
        const ingredientCell = row.insertCell(0);
        const quantityCell = row.insertCell(1);
        ingredientCell.appendChild(ingredientField);
        quantityCell.appendChild(quantityField);
    }
}

// add another step to the instructions
function addInstruction(){
    const newInstructionButton = document.querySelector('#new-instruction');
    const instructionContainer = document.querySelector('#instructions-container');

    newInstructionButton.onclick = function() {
        const instructionField = document.createElement('input');
        instructionField.setAttribute('type', 'text');
        instructionField.setAttribute('id', 'instructions');
        instructionField.setAttribute('name', 'instructions[]');
        instructionField.setAttribute('form', 'create-recipe');
        instructionContainer.appendChild(instructionField);
    }
}



// const trashcan = document.querySelector('a.delete');

//     trashcan.addEventListener('click', (e) => {
//       const endpoint = `/recipes/${trashcan.dataset.doc}`;

//       fetch(endpoint, {
//         method: 'DELETE',
//       })
//       .then(response => response.json())
//       .then(data => window.location.href = data.redirect)
//       .catch(err => console.log(err));
//     });
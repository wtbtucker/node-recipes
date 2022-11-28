addEventListener('DOMContentLoaded', () => {
    addIngredient();
    addInstruction();
});

// add two new fields for ingredient and quantity
function addIngredient(){
    const newIngredientButton = document.querySelector('#new-ingredient');
    const ingredientTable = document.querySelector('#ingredient-table');

    newIngredientButton.onclick = function() {
        const ingredientField = createTextInput('ingredient-name', 'ingredient-name');
        const quantityField = createTextInput('ingredient-quantity', 'ingredient-quantity');
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
        const instructionID = 'instructions';
        const instructionName = 'instructions[]'
        const instructionField = createTextInput(instructionID, instructionName);
        instructionContainer.appendChild(instructionField);
    }
}

function createTextInput(id, name){
    const textField = document.createElement('input');
    textField.setAttribute('type', 'text');
    textField.setAttribute('form', 'create-recipe');
    textField.setAttribute('id', id);
    textField.setAttribute('name', name);
    return textField;
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
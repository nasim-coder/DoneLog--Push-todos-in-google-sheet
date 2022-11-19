// greeting, quote, and date time // top bar




// to do creation logic
let createTodoButton = document.querySelector(".btn");
let todoInput = document.querySelector(".input");
let todoContainer = document.querySelector('.todos-container');

createTodoButton.addEventListener('click', function () {
    if (todoInput.value) {
        let todoElement = document.createElement('p');
        todoElement.innerText = todoInput.value;
        todoElement.classList.add("mytodo");
        todoContainer.appendChild(todoElement);
    }
});





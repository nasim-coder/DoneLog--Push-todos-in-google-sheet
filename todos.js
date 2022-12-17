// greeting
(function showGreeting() {
    function getGreetings(currentHours) {
        if (currentHours <= 12) {
            return "Good Morning";
        }
        else if (currentHours <= 18 && currentHours > 12) {
            return "Good After Noon";
        } else {
            return "Good Evening";
        }
    }

    let today = new Date();
    let currentHours = today.getHours();
    let greeting = getGreetings(currentHours);
    let name = localStorage.getItem("name");
    
    if (!name) {
        name = prompt("Plase enter your name:");
        localStorage.setItem('name', name);
    }

    document.querySelector(".greeting").innerHTML = greeting + " " + name;
    document.querySelector(".time").innerHTML = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.querySelector('.date').innerHTML = new Date().toDateString();
})();

(async function showQuote() {
        let response = await fetch("https://N451M-coder.github.io/staticjsondata/quote.json");
        let data = await response.json();
        let arrlength = data.length;
        let rnum = Math.floor(Math.random() * arrlength);
        document.querySelector('.quote').innerText = data[rnum].text;
        document.querySelector('.author').innerText = "-" + data[rnum].author;
})();


// to do creation logic
let createTodoButton = document.querySelector(".btn");
let todoInput = document.querySelector(".input");
let todoContainer = document.querySelector('.todos-container');
createTodoButton.addEventListener('click', function (event) {
    event.preventDefault();
    if (todoInput.value) {
        let divele = document.createElement('div')
        let todoElement = document.createElement('span');
        todoElement.innerText = todoInput.value;
        todoElement.classList.add("mytodo");
        divele.appendChild(todoElement);
        let doneBtn = document.createElement('button');
        doneBtn.classList.add('done');
        doneBtn.innerText = 'DONE';
        divele.appendChild(doneBtn);
        todoContainer.appendChild(divele);
        divele.classList.add('mytodo-container')
        setTodos(todoInput.value, false, new Date());
        todoInput.value = '';
    }
});

// insert todos in local storage
function setTodos(todo, isDone, date ) {
    let todos = getTodos();
    todos.push({todo:todo, isDone:isDone, date:date});
    localStorage.setItem("mytodos", JSON.stringify(todos));
}

// get todos from local storage
function getTodos() {
    let todos;
    if (localStorage.getItem("mytodos") === null) {
      todos = [];
    } else {
      todos = JSON.parse(localStorage.getItem("mytodos"));
    }
    return todos;
  }

// create already available todo on loading the page
function createTodoOnLoad() {
    let todos = getTodos();
    todos.forEach(todoObj => {
        let completeClasss = 'uncomplete';
        if (todoObj.isDone) {
            completeClasss="completed"
        }
        createTodoElements(todoObj.todo, completeClasss);
    });
}

function createTodoElements(todo, compClass) {
        let divele = document.createElement('div');
        let todoElement = document.createElement('span');
        todoElement.innerText = todo;
        todoElement.classList.add("mytodo");
        todoElement.classList.add(compClass);
        divele.appendChild(todoElement);
        let doneBtn = document.createElement('button');
        doneBtn.classList.add('done');
        doneBtn.innerText = 'DONE';
        divele.appendChild(doneBtn);
        divele.classList.add('mytodo-container')
        todoContainer.appendChild(divele);
}

window.addEventListener('load', createTodoOnLoad);

// when user clicks on done
todoContainer.addEventListener('click', todoComplete);

function todoComplete(event) {
    const doneBtn = event.target;
    if (doneBtn.classList[0] == 'done') {
        const mytodo = doneBtn.previousElementSibling;
        console.log(mytodo.innerText);
        let todos = getTodos();
        todos.forEach(ele => {
            if (ele.todo == mytodo.innerText) {
                ele.isDone = true;
            }
        });
        localStorage.setItem("mytodos", JSON.stringify(todos));
        mytodo.classList.add('completed');
    }
}


import { URL } from './scripturl.js';

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
        name = prompt("Plase enter your first name:");
        localStorage.setItem('name', name);
    }

    document.querySelector(".greeting").innerHTML = greeting + " " + name;
    document.querySelector(".time").innerHTML = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.querySelector('.date').innerHTML = new Date().toDateString();
})();

(async function showQuote() {
        let response = await fetch("https://N451M4K.github.io/staticjsondata/quote.json");
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
let minuteInput = document.querySelector('.minutes');
console.log(minuteInput.value);
// let hrformat = minuteToHour(minuteInput.value)
// console.log('hrformat',hrformat);
//crete todo manually by entering the details
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
        doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
        divele.appendChild(doneBtn);
        todoContainer.appendChild(divele);
        divele.classList.add('mytodo-container')
        
        // create delete buton
        let deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete');
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
        divele.appendChild(deleteBtn);
        // create span element to show duration
        let durationSpan = document.createElement('span')
        durationSpan.innerText = minuteToHour(minuteInput.value);
        durationSpan.classList.add("duration");
        divele.appendChild(durationSpan);
        setTodos(todoInput.value.trim(), false, minuteInput.value.trim(), new Date());
        todoInput.value = '';
        minuteInput.value = '';
    }
});

// insert todos in local storage
function setTodos(todo, isDone, duration, date ) {
    let todos = getTodos();
    todos.push({todo:todo, isDone:isDone, duration:duration, date:date});
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
        createTodoElements(todoObj.todo, completeClasss, todoObj.duration);
    });
}

function createTodoElements(todo, compClass, duration) {
        let divele = document.createElement('div');
        let todoElement = document.createElement('span');
        todoElement.innerText = todo;
        todoElement.classList.add("mytodo");
        todoElement.classList.add(compClass);
        divele.appendChild(todoElement);
        let doneBtn = document.createElement('button');
        doneBtn.classList.add('done');
        doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
        divele.appendChild(doneBtn);
        divele.classList.add('mytodo-container')
        todoContainer.appendChild(divele);
        let deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete');
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
        divele.appendChild(deleteBtn);
        // create span element to show duration
        let durationSpan = document.createElement('span')
        durationSpan.innerText = minuteToHour(duration);
        durationSpan.classList.add("duration");
        divele.appendChild(durationSpan);
}

window.addEventListener('load', createTodoOnLoad);

// when user clicks on done or delete
todoContainer.addEventListener('click', deleteOrMarkAsComplete);

function deleteOrMarkAsComplete(event) {
    const doneBtn = event.target;
    let parent = doneBtn.parentElement;
    if (parent.classList[0] == 'done') {
        const mytodo = parent.previousElementSibling;
        let todos = getTodos();
        todos.forEach(ele => {
            if (ele.todo == mytodo.innerText) {
                ele.isDone = true;
            }
        });
        localStorage.setItem("mytodos", JSON.stringify(todos));
        mytodo.classList.add('completed');
    } else if (parent.classList[0] == 'delete') {
        const mytodo = parent.previousElementSibling.previousElementSibling;
        deleteOneTodoFromLocalStorage(mytodo.innerText)
        parent.parentElement.remove();
    }
}

function deleteOneTodoFromLocalStorage(todo) {
    let todos = getTodos();
    todos.forEach((elem, ind) => {
        if (elem.todo == todo) {
            todos.splice(ind, 1);
        }
    });
    localStorage.setItem("mytodos", JSON.stringify(todos));
}

// delete previous days already done todos
(function deleteOldAlreadyDoneTodo() {
    let checkdate = localStorage.getItem('checkdate');
    if (!checkdate) {
        localStorage.setItem('checkdate', new Date());
    }
    if (new Date().getDate() - new Date(checkdate).getDate() > 0) {
        let todos = getTodos();
        todos.forEach(elem => {
            if (elem.isDone == true && (new Date().getDate() - new Date(elem.date).getDate()) > 0) {
                deleteOneTodoFromLocalStorage(elem.todo);
            }
        });
        localStorage.setItem('checkdate', new Date());
    }
})()

// return time in hour format
function minuteToHour(time) {
    let minutes = parseInt(time);
    if (minutes) {
        let hr = Math.trunc(minutes / 60);
        let minute = minutes % 60;
        return `${hr}:${minute}`
    } else {
        return '0:00';
    }
}


async function pushTodoInSpreadSheet(todo, duration, date, done_date) {
    const resp = await fetch(`${URL}?todo=${todo}&duration=${duration}&date=${date}&done_date=${done_date}`);
}

console.log(URL);





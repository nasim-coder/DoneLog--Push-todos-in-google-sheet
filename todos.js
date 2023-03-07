import { URL } from './scripturl.js';

var apiKey = "";
var clientId = "";



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
let startInput = document.querySelector('.start-time');
let endInput = document.querySelector('.end-time');
console.log(endInput.value);
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
        // create span element to show start time
        let startSpan = document.createElement('span')
        startSpan.innerText = startInput.value;
        startSpan.classList.add("show-start");
        divele.appendChild(startSpan);
        //create span element to show end time
        let endSpan = document.createElement('span')
        endSpan.innerText = endInput.value;
        endSpan.classList.add("show-end");
        divele.appendChild(endSpan);

        setTodos(todoInput.value.trim(), false, startInput.value, endInput.value, new Date());
        
        todoInput.value = '';
        startInput.value = '';
        endInput.value = '';
    }
});

// insert todos in local storage
function setTodos(todo, isDone, startTime, endTime, createdAt ) {
    let todos = getTodos();
    todos.push({todo:todo, isDone:isDone, startTime:startTime,endTime:endTime, createdAt:createdAt});
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
        createTodoElements(todoObj.todo, completeClasss, todoObj.startTime, todoObj.endTime);
    });
}

function createTodoElements(todo, compClass, startTime, endTime) {
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
        // create span element to show start time
        let startSpan = document.createElement('span');
        startSpan.innerText = startTime;
        startSpan.classList.add("show-start");
        divele.appendChild(startSpan);
        // create span element to to show end time
        let endSpan = document.createElement('span')
        endSpan.innerText = endTime;
        endSpan.classList.add("show-end");
        divele.appendChild(endSpan);

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
                ele.doneAt = new Date();
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
      let myTaskArr = [];
        todos.forEach(elem => {
          if (elem.isDone == true && (new Date().getDate() - new Date(elem.createdAt).getDate()) > 0) {
            myTaskArr.push([elem.todo, elem.startTime, elem.endTime, elem.doneAt, elem.createdAt])
                // pushTodoInSpreadSheet(elem.todo, elem.startTime, elem.endTime, elem.doneAt, elem.createdAt);
                deleteOneTodoFromLocalStorage(elem.todo);
            }
        });
      pushTodoInSpreadSheet(myTaskArr);
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

// async function pushTodoInSpreadSheet(todo, startTime, endTime, doneAt, createdAt) {
//     const resp = await fetch(`${URL}?todo=${todo}&startTime=${startTime}&endTime=${endTime}&doneAt=${doneAt}&createdAt=${createdAt}`);
//     console.log(resp);
// }



async function pushTodoInSpreadSheet(task) {
let tasks = JSON.stringify(task)
  console.log(URL);
  const resp = await fetch(`${URL}?tasks=${tasks}`);
  console.log(1, await resp.json());
}

// const tasks = [["todo1", "startTime1", "endTime1", "doneAt1", "createdAt1"],["todo2", "startTime2", "endTime2", "doneAt2", "createdAt2"],["todo3", "startTime3", "endTime3", "doneAt3", "createdAt3"]]
// await pushTodoInSpreadSheet(tasks)

/////////////////////////////////////
//Google logic below



// function addTaskToSheet(task) {
//     var spreadsheetName = "My Tasks";
//     var sheetName = "Sheet1";
  
//     // Get the Google Sheets API client
//     var client = getClient();
  
//     // Check if the spreadsheet already exists
//     var spreadsheets = client.sheets.spreadsheets.list({
//       q: "name='" + spreadsheetName + "'",
//     });
//     if (spreadsheets.result.files.length > 0) {
//       // The spreadsheet already exists, so get the ID
//       var spreadsheetId = spreadsheets.result.files[0].id;
//     } else {
//       // The spreadsheet doesn't exist, so create a new one
//       var spreadsheet = client.sheets.spreadsheets.create({
//         properties: {
//           title: spreadsheetName,
//         },
//       });
//       var spreadsheetId = spreadsheet.result.spreadsheetId;
//     }
  
//     // Check if the sheet already exists
//     var sheets = client.sheets.spreadsheets.sheets.list({
//       spreadsheetId: spreadsheetId,
//       q: "name='" + sheetName + "'",
//     });
//     if (sheets.result.sheets.length > 0) {
//       // The sheet already exists, so get the ID
//       var sheetId = sheets.result.sheets[0].properties.sheetId;
//     } else {
//       // The sheet doesn't exist, so create a new one
//       var sheet = client.sheets.spreadsheets.sheets.addSheet({
//         spreadsheetId: spreadsheetId,
//         resource: {
//           properties: {
//             title: sheetName,
//           },
//         },
//       });
//       var sheetId = sheet.result.properties.sheetId;
//     }
  
//     // Add the task to the sheet
//     var rowValues = [task.todo, task.createdAt, task.startTime, task.endTime, task.doneAt];
//     var range = sheetName + "!A1:E1";
//     var body = {
//       range: range,
//       values: [rowValues],
//     };
//     var result = client.sheets.spreadsheets.values.update({
//       spreadsheetId: spreadsheetId,
//       range: range,
//       valueInputOption: "USER_ENTERED",
//       resource: body,
//     });
//   }
  

//   gapi.client.init({
//     apiKey: apiKey,
//     clientId: clientId,
//     discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
//   }).then(function() {
//     // API initialization succeeded
//   }, function(error) {
//     // API initialization failed
//     console.log(error);
//   });
  

//   var request = gapi.client.sheets.spreadsheets.list({
//     q: "mimeType='application/vnd.google-apps.spreadsheet'",
//     fields: "files(id, name)",
//   });
  
//   request.execute(function(response) {
//     console.log(response);
//   });
  

//   // same logic as above different code by chatgpt

// var discoveryDocs = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
// var scopes = "https://www.googleapis.com/auth/spreadsheets";

// function handleClientLoad() {
//   gapi.load('client:auth2', initClient);
// }

// function initClient() {
//   gapi.client.init({
//     apiKey: apiKey,
//     clientId: clientId,
//     discoveryDocs: discoveryDocs,
//     scope: scopes
//   }).then(function() {
//     // Listen for sign-in state changes.
//     gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

//     // Handle the initial sign-in state.
//     updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
//   });
// }

// function updateSigninStatus(isSignedIn) {
//   if (isSignedIn) {
//     // User is signed in, make API requests.
//     listSpreadsheets();
//   } else {
//     // User is not signed in, display login button.
//     var authorizeButton = document.getElementById('authorize-button');
//     authorizeButton.style.display = 'block';
//     authorizeButton.onclick = handleAuthClick;
//   }
// }

// function handleAuthClick(event) {
//   gapi.auth2.getAuthInstance().signIn();
// }

// function listSpreadsheets() {
//   gapi.client.sheets.spreadsheets.list({
//     q: "mimeType='application/vnd.google-apps.spreadsheet'",
//     fields: "files(id, name)",
//   }).then(function(response) {
//     console.log(response);
//   });
// }

// handleClientLoad()
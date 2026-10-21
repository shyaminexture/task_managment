const taskInput = document.querySelector("#task-input");
const taskForm = document.querySelector("form");
const taskList = document.querySelector("#task-list");

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();
 
    if (taskText === "") {
         return;
      }

    const newTask = document.createElement("li");

    newTask.textContent = taskText;

    taskList.appendChild(newTask);
});
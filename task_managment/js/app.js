const taskInput = document.querySelector("#task-input");
const taskForm = document.querySelector("form");
const taskList = document.querySelector("#task-list");

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get the task text and remove extra spaces
    const taskText = taskInput.value.trim();

    // Prevent empty tasks
    if (taskText === "") {
        return;
    }

    // Create a new task
    const newTask = document.createElement("li");

    // Create the checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    // Create the task text
    const taskLabel = document.createElement("span");
    taskLabel.textContent = taskText;

    // Add checkbox and text to the task
    newTask.appendChild(checkbox);
    newTask.appendChild(taskLabel);

    // Create the Delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.type = "button";

    newTask.appendChild(deleteButton);

    // Mark the task as completed or incomplete
    checkbox.addEventListener("change", function () {
        taskLabel.classList.toggle("completed");
    });

    // Delete the task when the button is clicked
    deleteButton.addEventListener("click", function () {
        newTask.remove();
    });

    // Add the task to the list
    taskList.appendChild(newTask);

    // Clear the input and focus it again
    taskInput.value = "";
    taskInput.focus();
});

localStorage.setItem("task", "Learn JavaScript");

console.log(localStorage.getItem("task"));
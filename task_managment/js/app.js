const taskInput = document.querySelector("#task-input");
const taskForm = document.querySelector("form");
const taskList = document.querySelector("#task-list");

// Load saved tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Function to display a task
function displayTask(taskText, isCompleted = false) {
    const newTask = document.createElement("li");

    // Create checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = isCompleted;

    // Create task text
    const taskLabel = document.createElement("span");
    taskLabel.textContent = taskText;

    if (isCompleted) {
        taskLabel.classList.add("completed");
    }

    newTask.appendChild(checkbox);
    newTask.appendChild(taskLabel);

    // Create Delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.type = "button";

    newTask.appendChild(deleteButton);

    // Mark task as completed or incomplete
    checkbox.addEventListener("change", function () {
        taskLabel.classList.toggle("completed", checkbox.checked);

        saveTasks();
    });

    // Delete task
    deleteButton.addEventListener("click", function () {
        newTask.remove();

        tasks = tasks.filter(function (task) {
            return task.id !== newTask.dataset.taskId;
        });

        saveTasks();
    });

    // Store a unique ID on the list item
    newTask.dataset.taskId = crypto.randomUUID();

    taskList.appendChild(newTask);

    return newTask;
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display all saved tasks
function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach(function (task) {
        const newTask = displayTask(task.text, task.completed);
        newTask.dataset.taskId = task.id;
    });
}

// Add a new task
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();

    // Prevent empty tasks
    if (taskText === "") {
        return;
    }

    const task = {
        id: crypto.randomUUID(),
        text: taskText,
        completed: false
    };

    tasks.push(task);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
});

// Load tasks when the page opens
renderTasks();
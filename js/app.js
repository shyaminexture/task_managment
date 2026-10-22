
const taskInput = document.querySelector("#task-input");
const taskForm = document.querySelector("form");
const taskList = document.querySelector("#task-list");
const filterButtons = document.querySelectorAll("#task-filters button");
const taskPriority = document.querySelector("#task-priority");

// Remember the selected filter
let currentFilter = "all";

// Load saved tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Display one task
function displayTask(task) {
    const newTask = document.createElement("li");
    newTask.dataset.taskId = task.id;

    // Create checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    // Create task text
    const taskLabel = document.createElement("span");
    taskLabel.textContent = task.text;

    if (task.completed) {
        taskLabel.classList.add("completed");
    }

    newTask.appendChild(checkbox);
    newTask.appendChild(taskLabel);

    // Create priority label
    const priorityLabel = document.createElement("span");
    const priority = task.priority || "medium";

    priorityLabel.textContent =
        priority.charAt(0).toUpperCase() + priority.slice(1);

    priorityLabel.classList.add("priority", `priority-${priority}`);

    newTask.appendChild(priorityLabel);

    // Create Edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.type = "button";

    newTask.appendChild(editButton);

    // Create Delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.type = "button";

    newTask.appendChild(deleteButton);

    // Update completion status
    checkbox.addEventListener("change", function () {
        task.completed = checkbox.checked;

        saveTasks();
        renderTasks();
    });
// Edit task text and priority
// Edit task using an inline form
editButton.addEventListener("click", function () {
    // Prevent opening the same edit form multiple times
    if (newTask.querySelector(".edit-form")) {
        return;
    }

    // Create the editing form
    const editForm = document.createElement("form");
    editForm.classList.add("edit-form");

    // Create task name input
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = task.text;
    editInput.required = true;

    // Create priority dropdown
    const editPriority = document.createElement("select");

    ["low", "medium", "high"].forEach(function (priority) {
        const option = document.createElement("option");

        option.value = priority;
        option.textContent =
            priority.charAt(0).toUpperCase() + priority.slice(1);

        if (priority === (task.priority || "medium")) {
            option.selected = true;
        }

        editPriority.appendChild(option);
    });

    // Create Save button
    const saveButton = document.createElement("button");
    saveButton.type = "submit";
    saveButton.textContent = "Save Changes";

    // Create Cancel button
    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.textContent = "Cancel";

    // Add controls to the editing form
    editForm.append(
        editInput,
        editPriority,
        saveButton,
        cancelButton
    );

    // Show the form below the task
    newTask.appendChild(editForm);

    // Save the updated task
    editForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const updatedText = editInput.value.trim();

        if (updatedText === "") {
            alert("Task cannot be empty.");
            return;
        }

        task.text = updatedText;
        task.priority = editPriority.value;

        saveTasks();
        renderTasks();
    });

    // Cancel editing
    cancelButton.addEventListener("click", function () {
        editForm.remove();
    });
});

    // Delete task
    deleteButton.addEventListener("click", function () {
        tasks = tasks.filter(function (item) {
            return item.id !== task.id;
        });

        saveTasks();
        renderTasks();
    });

    // Add task to the page
    taskList.appendChild(newTask);
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display tasks according to the selected filter
function renderTasks() {
    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(function (task) {
        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    // Show a message when no tasks match
    if (filteredTasks.length === 0) {
        const message = document.createElement("li");

        if (tasks.length === 0) {
            message.textContent =
                "No tasks yet. Add your first task!";
        } else if (currentFilter === "active") {
            message.textContent =
                "No active tasks. Great job!";
        } else if (currentFilter === "completed") {
            message.textContent =
                "No completed tasks yet.";
        }

        taskList.appendChild(message);
        return;
    }

    // Display matching tasks
    filteredTasks.forEach(function (task) {
        displayTask(task);
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

    // Create a task object
    const task = {
        id: crypto.randomUUID(),
        text: taskText,
        completed: false,
        priority: taskPriority.value
    };

    tasks.push(task);

    saveTasks();
    renderTasks();

    // Clear the input
    taskInput.value = "";
    taskInput.focus();
});

// Handle filter button clicks
filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        currentFilter = button.dataset.filter;

        renderTasks();
    });
});

// Display saved tasks when the page opens
renderTasks();

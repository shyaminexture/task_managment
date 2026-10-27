
// ========================================
// 1. Select Navigation Elements
// ========================================

const menuToggle = document.getElementById("menu-toggle");
const moreMenu = document.getElementById("more-menu");

const themeToggle = document.getElementById("theme-toggle");

const exportButton = document.getElementById("export-tasks");
const importTrigger = document.getElementById("import-trigger");
const importFile = document.getElementById("import-file");
const clearButton = document.getElementById("clear-tasks");
const settingsButton = document.getElementById("settings-trigger");

// ========================================
// 2. Three-Dot Menu
// ========================================

function closeMenu() {
    moreMenu.hidden = true;
    menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", function () {
    const isOpen = !moreMenu.hidden;

    moreMenu.hidden = isOpen;
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
});

// Close menu when clicking outside it
document.addEventListener("click", function (event) {
    if (!event.target.closest(".menu-container")) {
        closeMenu();
    }
});

// Close menu using Escape
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeMenu();
    }
});

// ========================================
// 3. Light and Dark Theme
// ========================================

function applyTheme(isDark) {
    document.body.classList.toggle("dark-theme", isDark);

    themeToggle.textContent = isDark ? "☀" : "☾";

    localStorage.setItem(
        "taskflow-dark-theme",
        String(isDark)
    );
}

const savedTheme = localStorage.getItem("taskflow-dark-theme");

applyTheme(savedTheme === "true");

themeToggle.addEventListener("click", function () {
    const isDark =
        !document.body.classList.contains("dark-theme");

    applyTheme(isDark);
});

// ========================================
// 4. Export Tasks
// ========================================

exportButton.addEventListener("click", function () {
    const tasks = JSON.parse(
        localStorage.getItem("tasks") || "[]"
    );

    const file = new Blob(
        [JSON.stringify(tasks, null, 2)],
        { type: "application/json" }
    );

    const downloadURL = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = downloadURL;
    link.download = "taskflow-backup.json";
    link.click();

    URL.revokeObjectURL(downloadURL);
    closeMenu();
});

// ========================================
// 5. Import Tasks
// ========================================

importTrigger.addEventListener("click", function () {
    importFile.click();
    closeMenu();
});

importFile.addEventListener("change", async function () {
    const file = importFile.files[0];

    if (!file) {
        return;
    }

    try {
        const importedTasks = JSON.parse(await file.text());

        const isValid =
            Array.isArray(importedTasks) &&
            importedTasks.every(function (task) {
                return (
                    task &&
                    typeof task.id === "string" &&
                    typeof task.text === "string" &&
                    typeof task.completed === "boolean" &&
                    typeof task.priority === "string" &&
                    ["low", "medium", "high"].includes(task.priority)
                );
            });

        if (!isValid) {
            alert("Please select a valid TaskFlow JSON backup.");
            return;
        }

        const confirmed = confirm(
            "Import " + importedTasks.length +
            " tasks? This will replace your current tasks."
        );

        if (!confirmed) {
            return;
        }

        localStorage.setItem(
            "tasks",
            JSON.stringify(importedTasks)
        );

        alert("Tasks imported successfully!");

        window.location.reload();

    } catch (error) {
        alert("Could not read the file. Please select a valid JSON backup.");
    } finally {
        importFile.value = "";
    }
});

// ========================================
// 6. Clear All Tasks
// ========================================

clearButton.addEventListener("click", function () {
    const confirmed = confirm(
        "Delete all tasks? This action cannot be undone unless you have a backup."
    );

    if (!confirmed) {
        return;
    }

    localStorage.setItem("tasks", JSON.stringify([]));

    closeMenu();
    window.location.reload();
});

// ========================================
// 7. Settings Placeholder
// ========================================

settingsButton.addEventListener("click", function () {
    closeMenu();

    alert(
        "TaskFlow Settings\n\n" +
        "You can change the theme using the moon/sun button.\n" +
        "More settings can be added later."
    );
});

// ========================================
// 8. Navigation Buttons
// ========================================

document.querySelectorAll(".nav-link").forEach(function (button) {
    button.addEventListener("click", function () {
        document.querySelectorAll(".nav-link").forEach(function (link) {
            link.classList.remove("active");
        });

        button.classList.add("active");

        const view = button.dataset.view;

        closeMenu();

        if (view === "tasks") {
            document.getElementById("task-list").scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        } else if (view === "dashboard") {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        } else {
            alert(
                button.textContent.trim() +
                " will be implemented in a future update."
            );
        }
    });
});

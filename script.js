
document.addEventListener("DOMContentLoaded", loadTasks);

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => displayTask(task.text, task.completed));
}

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();
    
    if (taskText) {
        displayTask(taskText, false);
        saveTask(taskText, false);
        taskInput.value = ""; 
    }
}

function displayTask(text, completed) {
    const taskList = document.getElementById("taskList");

    const li = document.createElement("li");
    li.className = completed ? "completed" : "";

    const taskText = document.createElement("span");
    taskText.textContent = text;
    taskText.addEventListener("click", () => toggleComplete(taskText, text));
    li.appendChild(taskText);

    const editButton = document.createElement("button");
    editButton.textContent = "Editar";
    editButton.className = "edit";
    editButton.addEventListener("click", () => editTask(li, text));
    li.appendChild(editButton);

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remover";
    removeButton.addEventListener("click", () => removeTask(li, text));
    li.appendChild(removeButton);

    taskList.appendChild(li);
}

function saveTask(text, completed) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({ text, completed });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function toggleComplete(taskText, text) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const task = tasks.find(t => t.text === text);
    if (task) {
        task.completed = !task.completed;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        taskText.parentElement.classList.toggle("completed");
    }
}

function removeTask(li, text) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const updatedTasks = tasks.filter(task => task.text !== text);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    li.remove();
}

function editTask(li, oldText) {
    const taskText = li.querySelector("span");
    const editButton = li.querySelector(".edit");
    
    const input = document.createElement("input");
    input.type = "text";
    input.value = oldText;
    input.className = "edit-input";
    li.insertBefore(input, taskText);
    li.removeChild(taskText);
    
    editButton.textContent = "Salvar";
    editButton.removeEventListener("click", () => editTask(li, oldText));
    editButton.addEventListener("click", () => saveEditedTask(li, input, oldText));
}

function saveEditedTask(li, input, oldText) {
    const newText = input.value.trim();
    if (newText && newText !== oldText) {
        const taskText = document.createElement("span");
        taskText.textContent = newText;
        taskText.addEventListener("click", () => toggleComplete(taskText, newText));
        li.insertBefore(taskText, input);
        li.removeChild(input);

        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const task = tasks.find(t => t.text === oldText);
        if (task) {
            task.text = newText;
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }

        const editButton = li.querySelector(".edit");
        editButton.textContent = "Editar";
        editButton.removeEventListener("click", () => saveEditedTask(li, input, oldText));
        editButton.addEventListener("click", () => editTask(li, newText));
    } else {
        input.value = oldText;
    }
}

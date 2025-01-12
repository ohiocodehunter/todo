let todos = JSON.parse(localStorage.getItem("todos")) || [];

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodos() {
  const todoList = document.getElementById("todoList");
  todoList.innerHTML = "";

  todos.forEach((todo, index) => {
    const todoItem = document.createElement("div");
    todoItem.className = `todo-item ${todo.status || ""}`;

    if (todo.isEditing) {
      todoItem.innerHTML = `
                        <input type="text" value="${todo.text}" class="todo-text" id="edit-${index}">
                        <div class="todo-actions">
                            <button onclick="saveTodoEdit(${index})" class="edit-btn">
                                <i class="fas fa-save"></i> Save
                            </button>
                            <button onclick="cancelEdit(${index})" class="delete-btn">
                                <i class="fas fa-times"></i> Cancel
                            </button>
                        </div>
                    `;
    } else {
      const statusBadge = getStatusBadge(todo.status);
      todoItem.innerHTML = `
                        <span class="todo-text">${todo.text}</span>
                        ${statusBadge}
                        <div class="todo-actions">
                            <button onclick="toggleStatus(${index}, 'done')" class="status-btn done-btn" title="Mark as Done">
                                <i class="fas fa-check"></i>
                            </button>
                            <button onclick="toggleStatus(${index}, 'cancelled')" class="status-btn cancel-btn" title="Mark as Cancelled">
                                <i class="fas fa-ban"></i>
                            </button>
                            <button onclick="editTodo(${index})" class="edit-btn">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button onclick="deleteTodo(${index})" class="delete-btn">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    `;
    }

    todoList.appendChild(todoItem);
  });
}

function getStatusBadge(status) {
  if (!status)
    return '<span class="status-indicator status-pending">Pending</span>';
  return `<span class="status-indicator status-${status}">${
    status.charAt(0).toUpperCase() + status.slice(1)
  }</span>`;
}

function toggleStatus(index, newStatus) {
  if (todos[index].status === newStatus) {
    todos[index].status = ""; // Reset to pending
  } else {
    todos[index].status = newStatus;
  }
  saveTodos();
  renderTodos();
}

function addTodo() {
  const input = document.getElementById("todoInput");
  const text = input.value.trim();

  if (text) {
    todos.push({ text, isEditing: false, status: "" });
    input.value = "";
    saveTodos();
    renderTodos();
  }
}

function deleteTodo(index) {
  todos.splice(index, 1);
  saveTodos();
  renderTodos();
}

function editTodo(index) {
  todos[index].isEditing = true;
  renderTodos();
}

function saveTodoEdit(index) {
  const input = document.getElementById(`edit-${index}`);
  const newText = input.value.trim();

  if (newText) {
    todos[index].text = newText;
    todos[index].isEditing = false;
    saveTodos();
    renderTodos();
  }
}

function cancelEdit(index) {
  todos[index].isEditing = false;
  renderTodos();
}

// Add todo when Enter key is pressed
document.getElementById("todoInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTodo();
  }
});

// Initial render
renderTodos();

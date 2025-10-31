//// Wait for the DOM to load
window.addEventListener('DOMContentLoaded', (event) => {
    const todoForm = document.getElementById('todo-form');
    if (todoForm) {
        todoForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent form submission
            addTodo(); // Call addTodo function
        });
    }
});

/// Form validation function
function validateForm(todoText, todoDueDate) {
    // Simple validation: check if inputs are not empty
    if (todoText === '') {
        alert('Todo text cannot be empty.');
        return false;
    }

    // Validate due date
    if (todoDueDate === '') {
        alert('Due date cannot be empty.');
        return false;
    }
    
    return true;

}

// Global todos array
let todos = [];

//// Add Todo function
function addTodo() {
    // Get input elements
    const todoInput = document.getElementById('todo-input');
    const todoDate = document.getElementById('todo-date');

    // Get input values
    const todoText = todoInput.value.trim();
    const todoDueDate = todoDate.value; // Get the due date value

    // Validate form inputs
    if (!validateForm(todoText, todoDueDate)) {
        return;
    }   

    //// Create new todo object
    const newTodo = {
        id: Date.now(),
        text: todoText,
        dueDate: todoDueDate,
        status: 'pending',
        isEditing: false
    };

    //// Add new todo to the list (assuming todos is a global array)
    todos.push(newTodo);

    // Clear input fields
    todoInput.value = '';
    todoDate.value = '';

    // Re-render the todo list
    renderTodos();

    // Log the new todo for debugging
    console.log('Added Todo:', newTodo);
}

//// Render Todos function
function renderTodos() {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = ''; // Kosongkan list
    
    todos.forEach(todo => {
        const listItem = document.createElement('li');
        listItem.className = 'todo-item';
        
        if (todo.status === 'completed') {
            listItem.classList.add('completed');
        }

        // --- INI ADALAH LOGIKA UTAMA ---
        if (todo.isEditing) {
            // Tampilan "Mode Edit" (menggunakan <input>)
            listItem.innerHTML = `
                <div class="todo-details edit-mode">
                    <input type="text" id="edit-text-${todo.id}" class="edit-input-text" value="${todo.text}">
                    <input type="date" id="edit-date-${todo.id}" class="edit-input-date" value="${todo.dueDate}">
                </div>
                <div class="todo-actions">
                    <button onclick="saveTodo(${todo.id})" class="btn btn-save">Save</button>
                    <button onclick="cancelEdit(${todo.id})" class="btn btn-cancel">Cancel</button>
                </div>
            `;
        } else {
            // Tampilan "Mode Baca" (kode Anda sebelumnya)
            const isCompleted = todo.status === 'completed';
            const toggleButtonText = isCompleted ? 'Undo' : 'Mark Done';
            const toggleButtonClasses = isCompleted ? 'btn btn-toggle-undo' : 'btn btn-toggle-done';
            const statusBadgeClasses = `todo-status ${isCompleted ? 'completed' : 'pending'}`;

            listItem.innerHTML = `
                <div class="todo-details">
                    <span class="todo-text">${todo.text}</span>
                    <span class="todo-date">Due: ${todo.dueDate}</span>
                    <span class="${statusBadgeClasses}">${todo.status}</span>
                </div>
                <div class="todo-actions">
                    <button onclick="editTodo(${todo.id})" class="btn btn-edit">Edit</button>
                    <button onclick="toggleDone(${todo.id})" class="${toggleButtonClasses}">${toggleButtonText}</button>
                    <button onclick="deleteTodo(${todo.id})" class="btn btn-delete">Delete</button>
                </div>
            `;
        }
        
        todoList.appendChild(listItem);
    });
}

//// Delete Todo function
function deleteTodo(id) {
    // Filter out the todo with the given id
    todos = todos.filter(todo => todo.id !== id);

    // Re-render the todo list
    renderTodos();  

    // Log the deletion for debugging
    console.log('Deleted Todo with ID:', id);
    console.log('Updated Todos:', todos);
}

function toggleDone(id) {
    // Find the todo by id and toggle its status
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        todo.status = (todo.status === 'pending') ? 'completed' : 'pending';
    }
    renderTodos();
    console.log('Toggled Todo with ID:', id);

}

function editTodo(id) {
    // Pertama, pastikan tidak ada item lain yang sedang diedit
    todos.forEach(t => { t.isEditing = false; });
    
    // Temukan todo yang akan diedit dan set 'isEditing' jadi true
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.isEditing = true;
    }
    
    // Render ulang list untuk menampilkan input field
    renderTodos();
}

function saveTodo(id) {
    // 1. Dapatkan nilai baru dari input field (yang punya ID unik)
    const newTextInput = document.getElementById(`edit-text-${id}`);
    const newDateInput = document.getElementById(`edit-date-${id}`);
    
    const newText = newTextInput.value.trim();
    const newDate = newDateInput.value;

    // 2. Validasi nilai baru
    if (validateForm(newText, newDate) === false) {
        return; // Hentikan jika tidak valid
    }

    // 3. Temukan todo di array dan perbarui datanya
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.text = newText;
        todo.dueDate = newDate;
        todo.isEditing = false; // KELUAR dari mode edit
    }

    // 4. Render ulang list untuk menampilkan data yang sudah diperbarui
    renderTodos();
    console.log('Saved Todo ID:', id);
}

function cancelEdit(id) {
    // Temukan todo dan set 'isEditing' kembali ke false
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.isEditing = false;
    }
    // Render ulang (perubahan di input akan terbuang)
    renderTodos();
}

// Initial render
renderTodos();  
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
        status: 'pending'
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

    // Provide user feedback
    alert('Todo added successfully.');
}

//// Render Todos function
function renderTodos() {
    // Get the todo list container
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = ''; // Clear existing list

    // Loop through todos and create list items
    todos.forEach(todo => {
        // Create list item
        const listItem = document.createElement('li');

        listItem.className = 'flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-gray-200 gap-2';
        
        if (todo.status === 'completed') {
            listItem.classList.add('opacity-60', 'bg-gray-50');
        }

        const toggleButtonText = (todo.status === 'completed') ? 'Undo' : 'Mark as Completed';
        const toggleButtonClass = (todo.status === 'completed') ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600';
        
        const statusBadgeClass = (todo.status === 'completed') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';

        listItem.textContent = `${todo.text} (Due: ${todo.dueDate}) `;
        listItem.innerHTML = `
            <div class="flex-1 min-w-0">
                <span class="todo-text font-semibold break-words ${todo.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}">
                    ${todo.text}
                </span>
                
                <span class="todo-status text-xs font-medium px-2.5 py-0.5 rounded-full ${statusBadgeClass} ml-0 sm:ml-2 mt-1 sm:mt-0 inline-block">
                    ${todo.status}
                </span>

                <span class="todo-date text-sm text-gray-500 block mt-1">
                    Due: ${todo.dueDate}
                </span>
            </div>
            
            <div class="todo-actions flex-shrink-0 flex flex-col sm:flex-row sm:items-center gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
                <button onclick="editTodo(${todo.id})" 
                        class="bg-blue-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-600 w-full sm:w-auto">
                    Edit
                </button>
                <button onclick="toggleDone(${todo.id})" 
                        class="mark-done-btn ${toggleButtonClass} text-white px-3 py-1 rounded-md text-sm font-medium w-full sm:w-auto">
                    ${toggleButtonText}
                </button>
                <button onclick="deleteTodo(${todo.id})" 
                        class="delete-btn bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-red-600 w-full sm:w-auto">
                    Delete
                </button>
            </div>
        `;
        // Append list item to the todo list
        todoList.appendChild(listItem);
    });
}

//// Delete Todo function
function deleteTodo(id) {
    // Filter out the todo with the given id
    todos = todos.filter(todo => todo.id !== id);

    // Provide user feedback
    alert('Todo deleted successfully.');

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
    const todo = todos.find(t => t.id === id); // Cari todo
    if (todo) {
        const newText = prompt('Enter new text for your todo:', todo.text);
        
        if (newText !== null && newText.trim() !== '') {
            todo.text = newText.trim(); // Update teksnya
            renderTodos(); // Render ulang
            console.log('Edited Todo ID:', id);
        }
    }
}

// Initial render
renderTodos();  

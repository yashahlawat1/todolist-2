document.addEventListener("DOMContentLoaded", function () {
    const todoInput = document.getElementById("todo-input");
    const todoList = document.querySelector(".todo-list");
    const clearCompletedButton = document.querySelector(".clear-completed");
    const filters = document.querySelectorAll(".filters a");
    const todoCount = document.querySelector(".todo-count");
    const toggleAllButton = document.querySelector(".toggle-all");

    // Event listener for adding new todo item
    todoInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            addTodo();
        }
    });

    // Event listener for clearing completed todos
    clearCompletedButton.addEventListener("click", clearCompleted);

    // Event listener for selecting all items
    toggleAllButton.addEventListener("click", toggleAllItems);

    // Event listeners for filter buttons
    filters.forEach(filter => {
        filter.addEventListener("click", filterTodoItems);
    });

    // Function to add new todo item
    function addTodo() {
        const todoText = todoInput.value.trim();
        if (todoText !== "") {
            const li = document.createElement("li");
            li.className = "todo-list-item";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "toggle";

            const label = document.createElement("label");
            label.textContent = todoText;

            const deleteButton = document.createElement("button");
            deleteButton.className = "destroy";
            deleteButton.textContent = "×";

            li.appendChild(checkbox);
            li.appendChild(label);
            li.appendChild(deleteButton);
            todoList.appendChild(li);

            todoInput.value = "";

            updateItemsLeftDisplay();
            makeEditable(li); // Make the new todo item editable
        }
    }

    // Function to make a todo item editable
    function makeEditable(item) {
        const label = item.querySelector("label");
        label.addEventListener("dblclick", function () {
            label.contentEditable = true;
            label.focus(); // Focus on the label to enable editing
            label.addEventListener("keypress", function (event) {
                if (event.key === "Enter") {
                    label.blur(); // Save the new text when Enter is pressed
                }
            });
            label.addEventListener("blur", function () {
                label.contentEditable = false; // Toggle off contentEditable attribute when blurred
            });
        });
    }
    // Event listeners for filter buttons
filters.forEach(filter => {
    filter.addEventListener("click", function () {
        filters.forEach(btn => btn.classList.remove("clicked")); // Remove "clicked" class from all buttons
        this.classList.add("clicked"); // Add "clicked" class to the clicked button
        filterTodoItems(event);
    });
});


    // Function to clear completed todos
    function clearCompleted() {
        const completedItems = todoList.querySelectorAll("input[type='checkbox']:checked");
        completedItems.forEach(function (item) {
            item.closest("li").remove();
        });
    
        // Update items left count after clearing completed items
        updateItemsLeftDisplay();
    
        // Filter items to ensure completed items are removed from the DOM
        filterTodoItems({ target: document.querySelector('.filters a[href="#/"]') });
    }

    // Function to update items left display
    function updateItemsLeftDisplay() {
        const itemsLeft = todoList.querySelectorAll("input[type='checkbox']:not(:checked)").length;
        const itemText = itemsLeft === 1 ? 'item' : 'items'; // Adjust text based on the number of items left
        todoCount.textContent = `${itemsLeft -1} ${itemText} left`;
    }

    // Function to toggle all items
    function toggleAllItems() {
        const checkboxes = todoList.querySelectorAll("input[type='checkbox']");
        const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
        checkboxes.forEach(checkbox => {
            checkbox.checked = !allChecked;
        });
        updateItemsLeftDisplay();
    }

    // Function to filter todo items
    function filterTodoItems(event) {
        const filterType = event.target.getAttribute("href").slice(2); // Get filter type from href attribute
        const todoItems = todoList.querySelectorAll(".todo-list-item");

        todoItems.forEach(item => {
            switch (filterType) {
                case "":
                    item.style.display = "flex"; // Show all items
                    break;
                case "active":
                    item.querySelector(".toggle").checked ? item.style.display = "none" : item.style.display = "flex"; // Show only active items
                    break;
                case "completed":
                    item.querySelector(".toggle").checked ? item.style.display = "flex" : item.style.display = "none"; // Show only completed items
                    break;
            }
        });
    }

    // Event delegation for dynamically added delete buttons
    todoList.addEventListener("click", function (event) {
        if (event.target.classList.contains("destroy")) {
            event.target.closest("li").remove();
            updateItemsLeftDisplay();
        }
    });

    // Event delegation for making todo items editable on double click
    todoList.addEventListener("dblclick", function (event) {
        if (event.target.tagName === "LABEL") {
            makeEditable(event.target.closest("li"));
        }
    });
});

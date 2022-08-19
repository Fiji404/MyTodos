class App {
    addNewTodoFormEl;
    userTodos = [];
    addTodoBtn = document.getElementById('add-todo-btn');
    todosContainer = document.getElementById('todo-container');
    constructor() {
        this.registerClickEventsInTodoContainer();
        window.addEventListener('DOMContentLoaded', this.getUserTodosFromLS.bind(this));
    }

    registerClickEventsInTodoContainer() {
        this.todosContainer.addEventListener('click', ({ target }) => {
            if (target === this.todosContainer) return;
            if (target === this.addTodoBtn) this.addNewTodoForm();
            if (target.closest('#cancel-add-todo-btn')) this.cancelAddNewTodoAction();
        });
    }

    addNewTodoForm() {
        this.addTodoBtn.setAttribute('disabled', '');
        const todoFormHTMLTemplate = `
        <form
                id="add-todo-form"
                class="flex flex-col gap-3 bg-neutral-500 p-5 rounded-md border border-neutral-400 transition-transform relative"
            >
                <button
                    id="cancel-add-todo-btn"
                    type="button"
                    aria-label="close add todo form"
                    class="w-8 h-8 rounded-full bg-neutral-400 absolute right-0 top-0 translate-x-1/2 -translate-y-1/2 text-red-800 border border-red-800"
                >
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <div class="flex flex-col gap-1">
                    <label class="label-style" for="title">Title</label>
                    <input class="input-style" id="title" type="text" required/>
                </div>
                <div class="flex flex-col gap-1">
                    <label class="label-style" for="description">Description</label>
                    <textarea
                        class="input-style h-40 resize-none scroll-pt-60 scrollbar scrollbar-track-{red} scrollbar-thumb-{red}"
                        id="description" required
                    ></textarea>
                </div>
                <div class="flex flex-col gap-1">
                    <label class="label-style" for="description">Finish date</label>
                    <input id="finish-date" class="p-1 rounded-sm" type="date" required>
                </div>
                <div class="flex flex-col gap-1">
                    <label class="label-style" for="todo-importance">Importance</label>
                    <select class="rounded-sm focus:outline-neutral-800 focus:outline-offset-2" id="todo-importance">
                        <option value="null" class="option-style">Choose one below or left blank</option>
                        <option value="less" class="option-style">less important</option>
                        <option value="more" class="option-style">more important</option>
                        <option value="very" class="option-style">very important</option>
                    </select>
                </div>
                <button
                    id="submit-todo-btn"
                    class="w-fit mx-auto mt-3 border border-green-500 px-4 py-1 rounded-md text-green-500 bg-neutral-600 flex gap-2 items-center hover:-translate-y-1 transition-transform"
                >
                    Add Todo <i class="fa-solid fa-check"></i>
                </button>
            </form>`;
        this.addTodoBtn.insertAdjacentHTML('beforebegin', todoFormHTMLTemplate);
        this.addNewTodoFormEl = document.getElementById('add-todo-form');
        this.addNewTodoFormEl.addEventListener('submit', this.handleNewAddedTodo.bind(this));
    }

    cancelAddNewTodoAction() {
        this.addNewTodoFormEl.remove();
        this.addTodoBtn.removeAttribute('disabled', '');
    }

    handleNewAddedTodo(e) {
        e.preventDefault();
        const todoTitle = document.getElementById('title').value;
        const todoDescription = document.getElementById('description').value;
        const finishTodoDateObject = new Date(document.getElementById('finish-date').value.split('-').join());
        const todoPriority = document.getElementById('todo-importance').value;
        if (!this.checkProvidedValuesForNewTodo(todoTitle, todoDescription))
            return alert('Check your title and description fields');
        const todo = new Todo(todoTitle, todoDescription, finishTodoDateObject, todoPriority);
        const userTodosFromLS = JSON.parse(localStorage.getItem('todos')) || [];
        userTodosFromLS.push(todo);
        localStorage.setItem('todos', JSON.stringify(userTodosFromLS));
        this.addNewTodoFormEl.remove();
        this.addTodoBtn.removeAttribute('disabled');
        e.target.reset();
    }

    checkProvidedValuesForNewTodo(...inputs) {
        return inputs.every(el => el.length > 0);
    }

    getUserTodosFromLS() {
        const localStorageTodos = JSON.parse(localStorage.getItem('todos'));
        if (!localStorageTodos) return;
        this.renderUserTodos(localStorageTodos);
    }

    renderUserTodos = todos => {
        todos.forEach(({ title, description, date, importance }) => new Todo(title, description, date, importance));
    };
}

class Navbar {
    navbarEl = document.getElementById('navbar');
    searchBar = document.getElementById('search-input');
    searchTodoBtn = document.getElementById('search-btn');
    constructor() {
        this.navbarEl.addEventListener('click', this.registerClickEventsInNavbar);
        this.searchBar.addEventListener('input', this.registerInputEventsInSearchBar.bind(this));
    }

    registerClickEventsInNavbar({ target }) {
        const targetElement = target.closest('#search-btn') || target.closest('#button-app-options');
        if (!targetElement) return;
        if (target.matches('#search-btn'))
            targetElement.nextElementSibling.value || targetElement.nextElementSibling.focus();
        if (target.matches('#button-app-options')) {
            targetElement.classList.toggle('button-hamburger--active-state');
            targetElement.previousElementSibling.classList.toggle('app-option--hidden');
        }
    }

    registerInputEventsInSearchBar({ target: { value } }) {
        this.searchTodoBtn.classList.toggle('search--active', !!value);
    }
}

class Todo {
    constructor(title, description, date, importance) {
        this.title = title;
        this.description = description;
        this.date = date;
        this.importance = importance || null;
        this.renderTodo(title, description, date, importance);
    }

    renderTodo(title, description, date) {
        const addTodoBtn = document.getElementById('add-todo-btn');
        const dateToObject = new Date(date);
        const todoHTMLTemplate = `
        <section
        class="bg-neutral-500 rounded-md overflow-hidden todo-container__item border border-neutral-300 pb-4 todo-container__item grow"
    >
        <header class="py-3 bg-neutral-600">
            <h2 class="text-2xl text-center font-semibold text-neutral-200">${title}</h2>
        </header>
        <div class="px-2">
            <p class="mt-4 text-neutral-300 text-xl">${description}</p>
            <time class="bg-neutral-600 px-3 py-2 rounded-full block w-fit ml-auto text-blue-400 border-2 border-neutral-400 font-medium select-none mt-4" datetime="17.04.2022">${dateToObject.getDate()}.${dateToObject.getMonth()}.${dateToObject.getFullYear()}</time>
        </div>
    </section>
        `;
        addTodoBtn.insertAdjacentHTML('beforebegin', todoHTMLTemplate);
    }
}

const app = new App();
const navbar = new Navbar();
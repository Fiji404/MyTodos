import datepicker from 'js-datepicker';
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
                autocomplete="off"
                class="flex flex-col gap-3 bg-neutral-500 p-5 rounded-md border-2 border-neutral-400 transition-colors dark:bg-neutral-100 dark:border-neutral-300 relative"
            >
                <button
                    id="cancel-add-todo-btn"
                    type="button"
                    aria-label="close add todo form"
                    class="w-8 h-8 rounded-full bg-neutral-400 absolute right-0 top-0 translate-x-1/2 -translate-y-1/2 text-red-800 border border-red-800 dark:bg-neutral-100 dark:text-red-500 dark:border-red-500"
                >
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <div class="flex flex-col gap-1">
                    <label class="label-style dark:text-neutral-900" for="title">Title</label>
                    <input class="input-style dark:input-style--dark" id="title" type="text" required />
                </div>
                <div class="flex flex-col gap-1">
                    <label class="label-style dark:text-neutral-900" for="description">Description</label>
                    <textarea
                        class="input-style h-40 resize-none scroll-pt-60 dark:input-style--dark"
                        id="description"
                        required
                    ></textarea>
                </div>
                <div class="flex flex-col gap-1">
                    <label class="label-style dark:text-neutral-900" for="finish-date">Finish date (optional)</label>
                    <input id="finish-date" class="p-1 rounded-sm" />
                </div>
                <div class="flex flex-col gap-1">
                    <label class="label-style dark:text-neutral-900" for="todo-importance">Importance (optional)</label>
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
        this.replaceFormDatepicker();
        this.addNewTodoFormEl = document.getElementById('add-todo-form');
        this.addNewTodoFormEl.addEventListener('submit', this.handleNewAddedTodo.bind(this));
    }

    replaceFormDatepicker() {
        const dateInputElement = document.querySelector('#finish-date');
        const newDatepicker = datepicker(dateInputElement, {
            minDate: new Date(),
        });
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
        this.navbarEl.addEventListener('click', this.registerClickEventsInNavbar.bind(this));
        this.searchBar.addEventListener('input', this.registerInputEventsInSearchBar.bind(this));
        this.getUserThemeFromLS();
    }

    registerClickEventsInNavbar({ target }) {
        const targetElement =
            target.closest('#search-btn') || target.closest('#button-app-options') || target.closest('#theme-btn');
        if (!targetElement) return;
        if (targetElement.matches('#search-btn'))
            targetElement.nextElementSibling.value || targetElement.nextElementSibling.focus();
        if (targetElement.matches('#button-app-options')) {
            targetElement.classList.toggle('button-hamburger--active-state');
            targetElement.previousElementSibling.classList.toggle('app-option--hidden');
        }
        if (targetElement.matches('#theme-btn')) this.changeUserTheme(targetElement);
    }

    registerInputEventsInSearchBar({ target: { value } }) {
        this.searchTodoBtn.classList.toggle('search--active', !!value);
    }

    getUserThemeFromLS() {
        const themePreferenceInLS = localStorage.getItem('Theme');
        if (!themePreferenceInLS) return;
        const themeBtn = document.getElementById('theme-btn');
        const setButtonThemeIcon =
            themePreferenceInLS === 'dark' ? themeBtn.classList.add('active') : themeBtn.classList.remove('active');
        document.documentElement.classList.add(themePreferenceInLS);
    }

    changeUserTheme(changeThemeBtn) {
        const rootElement = document.documentElement;
        changeThemeBtn.classList.toggle('active');
        if (rootElement.classList.contains('dark')) rootElement.classList.replace('dark', 'light');
        else if (rootElement.classList.contains('light')) rootElement.classList.replace('light', 'dark');
        else {
            rootElement.classList.add('dark');
        }

        localStorage.setItem('Theme', document.documentElement.className);
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
    class="bg-neutral-500 dark:bg-neutral-200 rounded-md overflow-hidden todo-container__item border border-neutral-300 pb-4 todo-container__item grow dark:border-neutral-400 max-h-44
     transition-colors"
>
    <header class="py-3 border-b border-b-neutral-400 bg-neutral-600 dark:bg-neutral-300 transition-colors">
        <h2 class="text-2xl text-center font-semibold text-neutral-100 dark:text-neutral-900 transition-colors">${title}</h2>
    </header>
    <div class="px-2">
        <p class="mt-4 text-neutral-50 font-medium text-xl dark:text-neutral-900 transition-colors">${description}</p>
        <div class="mt-8 ml-auto w-fit">
            <p class="inline text-neutral-100 dark:text-neutral-900 transition-colors">Ends on</p>
            <time 
                class="bg-neutral-600 px-3 py-1 rounded-md w-fit ml-auto text-neutral-100 border border-neutral-400 select-none dark:bg-neutral-100 dark:text-neutral-900 transition-colors"
                datetime="17.04.2022"
                >${dateToObject.getDate()}.${dateToObject.getMonth()}.${dateToObject.getFullYear()}</time
            >
        </div>
    </div>
</section>
        `;
        addTodoBtn.insertAdjacentHTML('beforebegin', todoHTMLTemplate);
    }
}

const app = new App();
const navbar = new Navbar();

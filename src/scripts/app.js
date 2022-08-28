import datepicker from 'js-datepicker';
import { createNotyficationElement } from './utils/notyficationPopUp';
import { createPopper } from '@popperjs/core';

class App {
    #addTodoForm;
    #addTodoBtn = document.getElementById('add-todo-btn');
    #todosContainer = document.getElementById('todo-container');
    #datepickerEl;
    #todoElements;
    #initialDraggedElement;
    constructor() {
        this.listenClickEventsInTodoContainer();
        window.addEventListener('DOMContentLoaded', this.getUserTodosFromLS.bind(this));
        document.querySelector('#change-order-btn').addEventListener('click', this.enableTodosReOrder.bind(this));
    }

    listenClickEventsInTodoContainer() {
        this.#todosContainer.addEventListener('click', ({ target }) => {
            if (target === this.#todosContainer) return;
            if (target === this.#addTodoBtn) this.showTodoForm();
            if (target.closest('#cancel-add-todo-btn')) this.cancelFromAddingNewTodo();
        });
    }

    showTodoForm() {
        this.#addTodoBtn.setAttribute('disabled', '');
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
                    <input class="input-style dark:input-style--dark" id="title" type="text"  />
                </div>
                <div class="flex flex-col gap-1">
                    <label class="label-style dark:text-neutral-900" for="description">Description</label>
                    <textarea
                        class="input-style h-40 resize-none scroll-pt-60 dark:input-style--dark"
                        id="description"
                        
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
        this.#addTodoBtn.insertAdjacentHTML('beforebegin', todoFormHTMLTemplate);
        this.insertDatepickerElement();
        this.#addTodoForm = document.getElementById('add-todo-form');
        this.#addTodoForm.addEventListener('submit', this.appendNewTodo.bind(this));
    }

    insertDatepickerElement() {
        const dateInputEl = document.querySelector('#finish-date');
        this.#datepickerEl = datepicker(dateInputEl, { minDate: new Date() });
    }

    cancelFromAddingNewTodo() {
        this.#addTodoForm.remove();
        this.#addTodoBtn.removeAttribute('disabled');
    }

    appendNewTodo(e) {
        e.preventDefault();
        const todoTitle = document.getElementById('title');
        const todoDesc = document.getElementById('description');
        const finishTodoDate = this.#datepickerEl.dateSelected?.toISOString();
        const todoPriority = document.getElementById('todo-importance').value;
        if (!this.validateFormData(todoTitle, todoDesc)) return createNotyficationElement('Check provided data !');
        const todo = new Todo(todoTitle.value, todoDesc.value, finishTodoDate, todoPriority);
        const userTodosFromLS = JSON.parse(localStorage.getItem('todos')) || [];
        userTodosFromLS.push(todo);
        localStorage.setItem('todos', JSON.stringify(userTodosFromLS));
        this.#addTodoForm.remove();
        this.#addTodoBtn.removeAttribute('disabled');
    }

    validateFormData(...inputs) {
        return inputs.every(input => {
            if (!input.value) {
                input.style.borderColor = 'red';
                return false;
            }
            input.removeAttribute('style');
            return true;
        });
    }

    getUserTodosFromLS() {
        const localStorageTodos = JSON.parse(localStorage.getItem('todos'));
        if (!localStorageTodos) return;
        this.appendTodosFromLS(localStorageTodos);
    }

    appendTodosFromLS(todos) {
        todos.forEach(({ title, description, date, importance }) => new Todo(title, description, date, importance));
        this.#todoElements = document.querySelectorAll('.todo-container__item');
    }

    enableTodosReOrder() {
        if (document.body.dataset.disabled) return this.removeDragEventsOnTodos();
        document.body.dataset.disabled = true;
        this.setDragEventsOnTodos();
    }

    setDragEventsOnTodos() {
        this.#todoElements.forEach(todo => {
            todo.classList.add('dragging-enabled');
            todo.setAttribute('draggable', 'true');
        });
        this.#todosContainer.addEventListener('dragstart', this.todoDragStart.bind(this));
        this.#todosContainer.addEventListener('dragend', this.todoDragEnd.bind(this));
        this.#todosContainer.addEventListener('dragleave', this.handleDragLeave.bind(this));
        this.#todosContainer.addEventListener('dragover', this.handleDragOver.bind(this));
        this.#todosContainer.addEventListener('dragenter', this.handleDragEnter.bind(this));
        this.#todosContainer.addEventListener('drop', this.handleDrop.bind(this));
    }

    removeDragEventsOnTodos() {
        this.#todoElements.forEach(todo => {
            todo.classList.remove('dragging-enabled');
            todo.removeAttribute('draggable');
        });
        this.#todosContainer.removeEventListener('dragstart', this.todoDragStart);
        this.#todosContainer.removeEventListener('dragend', this.todoDragEnd);
        this.#todosContainer.removeEventListener('dragleave', this.handleDragLeave);
        this.#todosContainer.removeEventListener('dragover', this.handleDragOver);
        this.#todosContainer.removeEventListener('dragenter', this.handleDragEnter);
        this.#todosContainer.removeEventListener('drop', this.handleDrop);
        document.body.removeAttribute('data-disabled')
    }

    todoDragStart(e) {
        e.target.classList.add('dragging');
        e.dataTransfer.clearData();
        this.#initialDraggedElement = '';
        this.#initialDraggedElement = e.target;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.#initialDraggedElement.innerHTML);
    }

    todoDragEnd(e) {
        e.target.classList.remove('dragging');
    }

    handleDragLeave(e) {
        e.target.classList.remove('over');
    }

    handleDragOver(e) {
        e.preventDefault();
        return false;
    }

    handleDragEnter(e) {
        if (e.target === this.#initialDraggedElement) return;
        e.target.classList.add('over');
    }

    handleDrop(e) {
        e.target.classList.remove('over');
        this.#initialDraggedElement.innerHTML = e.target.innerHTML;
        e.target.innerHTML = e.dataTransfer.getData('text/html');
    }
}

class Navbar {
    #navbarEl = document.getElementById('navbar');
    #searchBar = document.getElementById('search-input');
    #searchTodoBtn = document.getElementById('search-btn');
    #popperElement;
    constructor() {
        this.#navbarEl.addEventListener('click', this.listenClickEventsInNavbar.bind(this));
        this.#searchBar.addEventListener('input', this.listenInputEventsInSearchBar.bind(this));
        this.#navbarEl.addEventListener('mouseover', this.listenOnHoverEventsInNavbar.bind(this));
        this.#navbarEl.addEventListener('mouseout', this.listenOnMouseOutEventsInNavbar.bind(this));
        this.checkUserPreferences();
    }

    listenClickEventsInNavbar({ target }) {
        const navbarTargetElement =
            target.closest('#search-btn') || target.closest('#button-app-options') || target.closest('#theme-btn');
        if (!navbarTargetElement) return;
        if (navbarTargetElement.matches('#search-btn')) {
            if (navbarTargetElement.nextElementSibling.value)
                this.searchTodoItem(navbarTargetElement.nextElementSibling.value);
            else navbarTargetElement.nextElementSibling.focus();
        }
        if (navbarTargetElement.matches('#button-app-options')) {
            navbarTargetElement.classList.toggle('button-hamburger--active-state');
            navbarTargetElement.previousElementSibling.classList.toggle('app-option--hidden');
        }
        if (navbarTargetElement.matches('#theme-btn')) this.changeUserTheme(navbarTargetElement);
    }

    listenInputEventsInSearchBar({ target: { value } }) {
        this.#searchTodoBtn.classList.toggle('search--active', !!value);
    }

    listenOnHoverEventsInNavbar({ target }) {
        const navTargetOptionElement = target.closest('#theme-btn') || target.closest('#change-order-btn');
        if (!navTargetOptionElement) return;
        this.#popperElement = this.createTooltipElement(navTargetOptionElement.dataset.optionName);
        document.body.append(this.#popperElement);
        createPopper(navTargetOptionElement, this.#popperElement, {
            modifiers: [
                {
                    name: 'offset',
                    options: {
                        offset: [0, 20],
                    },
                },
            ],
        });
    }

    listenOnMouseOutEventsInNavbar({ target }) {
        const targetMouseOut = target.closest('#theme-btn') || target.closest('#change-order-btn');
        if (!targetMouseOut) return;
        this.#popperElement.remove();
    }

    createTooltipElement(optName) {
        const tooltip = document.createElement('div');
        const arrow = document.createElement('div');
        arrow.setAttribute('data-popper-arrow', '');
        tooltip.classList.add('tooltip');
        const tooltipHeading = document.createElement('h2');
        tooltipHeading.textContent = optName;
        tooltip.append(tooltipHeading);
        tooltip.append(arrow);
        return tooltip;
    }

    searchTodoItem(todoName) {
        const todoElement = [...document.querySelectorAll('.todo-container__item')].find(
            todoTitle => todoTitle.querySelector('h2').textContent === todoName
        );
        const todoElementTitle = todoElement.querySelector('h2');
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(todoElementTitle);
        selection.removeAllRanges();
        selection.addRange(range);
        todoElement.classList.add('selected');
        setTimeout(() => todoElement.classList.remove('selected'), 4000);
    }

    checkUserPreferences() {
        const userThemeFromLS = localStorage.getItem('Theme');
        if (userThemeFromLS) this.loadUserThemeFromLS(userThemeFromLS);
    }

    loadUserThemeFromLS(theme) {
        const themeBtn = document.getElementById('theme-btn');
        theme === 'dark' ? themeBtn.classList.add('active') : themeBtn.classList.remove('active');
        document.documentElement.classList.add(theme);
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
    #todosContainer = document.getElementById('todo-container');
    #todoElements;
    #initialDraggedElement;
    constructor(title, description, date, importance) {
        this.title = title;
        this.description = description;
        this.date = date || null;
        this.importance = importance || null;
        this.renderTodo(title, description, date, importance);
    }

    renderTodo(title, description, date, importance) {
        const addTodoBtn = document.getElementById('add-todo-btn');
        const dateObject = new Date(date);
        const comparedFinishDateToCurrentDate = this.compareFinishDayToCurrentDay(dateObject.getDate());
        const todoHTMLTemplate = `
            <section 
    class="bg-neutral-500 dark:bg-neutral-200 rounded-md overflow-hidden todo-container__item border border-neutral-300 pb-4 todo-container__item grow dark:border-neutral-400
     transition-colors"
>
    <header class="py-3 border-b border-b-neutral-400 bg-neutral-600 dark:bg-neutral-300 transition-colors">
        <h2 class="text-3xl text-center font-semibold text-neutral-100 dark:text-neutral-900 transition-colors">${title}</h2>
    </header>
    <div class="px-2">
        <p class="mt-4 text-neutral-50 font-medium text-xl dark:text-neutral-900 transition-colors">${description}</p>
        ${
            !date
                ? ''
                : `<div class="mt-8 ml-auto w-fit">
            <p class="inline text-neutral-100 dark:text-neutral-900 transition-colors">Ends</p>
            
                 
                    <time
                        class="bg-neutral-600 px-3 py-1 rounded-md w-fit ml-auto text-neutral-100 border border-neutral-400 select-none dark:bg-neutral-100 dark:text-neutral-900 transition-colors"
                        datetime="17.04.2022"
                    >
                        ${
                            comparedFinishDateToCurrentDate === dateObject.getDate()
                                ? `${comparedFinishDateToCurrentDate}.${dateObject.getMonth()}.${dateObject.getFullYear()}`
                                : this.compareFinishDayToCurrentDay(dateObject.getDate())
                        }
                    </time>`
        }
        </div>
    </div>
</section>
        `;
        addTodoBtn.insertAdjacentHTML('beforebegin', todoHTMLTemplate);
    }

    compareFinishDayToCurrentDay(day) {
        const currentDay = new Date().getDate();
        return day === currentDay
            ? 'Today'
            : day === currentDay + 1
            ? 'Tomorrow'
            : day === currentDay + 2
            ? 'In 2 days'
            : day === currentDay + 3
            ? 'In 3 days'
            : day;
    }
}

const app = new App();
const navbar = new Navbar();
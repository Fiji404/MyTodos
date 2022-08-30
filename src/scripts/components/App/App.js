import { Todo } from './Todo';
import { createNotyficationElement } from '../../utils/popupMessage';
import { createTodoFormElement } from '../../utils/todoForm';

export class App {
    #addNewTodoBtn = document.getElementById('add-todo-btn');
    #todosContainerEl = document.getElementById('todo-container');
    #reOrderTodosBtn = document.querySelector('#change-order-btn');
    #createNewTodoFormEl;
    #datepickerEl;
    #todoElements;
    #initialDraggedElement;
    constructor() {
        this.#listenClickEventsInTodoContainer();
        this.#reOrderTodosBtn.addEventListener('click', this.#enableTodosReOrder.bind(this));
        window.addEventListener('DOMContentLoaded', this.#renderUserTodosFromLS.bind(this));
        [this.#handleTodoDragStart, this.#handleTodoDragEnter, this.#handleTodoDrop].forEach(
            func => (func.bound = func.bind(this))
        );
    }

    #listenClickEventsInTodoContainer() {
        this.#todosContainerEl.addEventListener('click', ({ target, currentTarget }) => {
            if (target === currentTarget) return;
            if (target === this.#addNewTodoBtn) this.#showTodoForm();
            if (target.closest('#cancel-add-todo-btn')) this.#cancelFromAddingNewTodo();
        });
    }

    #showTodoForm() {
        this.#addNewTodoBtn.setAttribute('disabled', '');
        const { formElement, datapickerInstance } = createTodoFormElement();
        this.#createNewTodoFormEl = formElement;
        this.#datepickerEl = datapickerInstance;
        formElement.addEventListener('submit', this.#appendNewCreatedTodo.bind(this));
    }

    #cancelFromAddingNewTodo() {
        this.#createNewTodoFormEl.remove();
        this.#addNewTodoBtn.removeAttribute('disabled');
        document.querySelector('.tooltip').remove();
    }

    #appendNewCreatedTodo(e) {
        e.preventDefault();
        const todoTitle = document.getElementById('title');
        const todoDesc = document.getElementById('description');
        const finishTodoDate = this.#datepickerEl.dateSelected?.toISOString();
        const todoPriority = document.getElementById('todo-importance').value;
        if (!this.#checkProvidedDataForNewTodo(todoTitle, todoDesc))
            return createNotyficationElement('Check provided data !');

        const removeNotyficationPopUp = document.querySelector('.notyfication-popup').remove();
        const todo = new Todo(todoTitle.value, todoDesc.value, finishTodoDate, todoPriority).renderTodo();
        const userTodosFromLS = this.#getUserTodosFromLS() || [];
        userTodosFromLS.push(todo);
        localStorage.setItem('todos', JSON.stringify(userTodosFromLS));
        this.#createNewTodoFormEl.remove();
        this.#addNewTodoBtn.removeAttribute('disabled');
    }

    #checkProvidedDataForNewTodo(...inputs) {
        return inputs.every(input => {
            if (!input.value) {
                input.style.borderColor = 'red';
                return false;
            }
            input.removeAttribute('style');
            return true;
        });
    }

    #getUserTodosFromLS() {
        const getUserTodosFromLS = JSON.parse(localStorage.getItem('todos'));
        if (!getUserTodosFromLS) return;
        return getUserTodosFromLS;
    }

    #renderUserTodosFromLS() {
        const userTodosInLS = this.#getUserTodosFromLS();
        if (!userTodosInLS) return;
        userTodosInLS.forEach(({ title, description, date, importance }) =>
            new Todo(title, description, date, importance).renderTodo()
        );
        this.#todoElements = [...document.querySelectorAll('.todo-container__item')];
    }

    #enableTodosReOrder() {
        if (document.body.dataset.disabled) {
            this.#removeDragEventsOnTodos();
            this.#saveTodosOrderToLS();
            this.#createSuccessMessage();
            return;
        }
        this.#setDragEventsOnTodos();
    }

    #saveTodosOrderToLS() {
        const newTodosOrder = this.#todoElements.map(todo => {
            const todoTitle = todo.querySelector('h2').textContent;
            const todoDesc = todo.querySelector('p').textContent;
            const todoFinishDate = this.#getTodoDateByTitle(todoTitle);
            return new Todo(todoTitle, todoDesc, todoFinishDate);
        });
        localStorage.setItem('todos', JSON.stringify(newTodosOrder));
    }

    #createSuccessMessage() {
        const successMessageHTMLTemplate = `
        <div id="success-message" class="success-message">
            <h2 class="text-2xl text-neutral-50 dark:text-black font-semibold">Saved <span><i class="fa-solid fa-circle-check text-green-400 ml-1"></i></span></h2>
        </div>`;
        document.body.insertAdjacentHTML('afterbegin', successMessageHTMLTemplate);
        const successMessageEl = document.getElementById('success-message');
        successMessageEl.classList.add('visible');
        setTimeout(() => {
            successMessageEl.remove();
        }, 2500);
    }

    #getTodoDateByTitle(todoTitle) {
        const userTodosInLS = this.#getUserTodosFromLS();
        if (!userTodosInLS) return;
        const todoFinishDate = userTodosInLS.find(todo => todoTitle === todo.title).date;
        return todoFinishDate;
    }

    #setDragEventsOnTodos() {
        document.body.dataset.disabled = true;
        this.#todoElements.forEach(todo => {
            todo.classList.add('dragging-enabled');
            todo.setAttribute('draggable', 'true');
        });
        this.#todosContainerEl.addEventListener('dragstart', this.#handleTodoDragStart.bound);
        this.#todosContainerEl.addEventListener('dragend', this.#handleTodoDragEnd);
        this.#todosContainerEl.addEventListener('dragleave', this.#handleTodoDragLeave);
        this.#todosContainerEl.addEventListener('dragover', this.#handleTodoDragOver);
        this.#todosContainerEl.addEventListener('dragenter', this.#handleTodoDragEnter.bound);
        this.#todosContainerEl.addEventListener('drop', this.#handleTodoDrop.bound);
    }

    #removeDragEventsOnTodos() {
        document.body.removeAttribute('data-disabled');
        this.#todoElements.forEach(todo => {
            todo.classList.remove('dragging-enabled');
            todo.removeAttribute('draggable');
        });
        this.#todosContainerEl.removeEventListener('dragstart', this.#handleTodoDragStart.bound);
        this.#todosContainerEl.removeEventListener('dragend', this.#handleTodoDragEnd);
        this.#todosContainerEl.removeEventListener('dragleave', this.#handleTodoDragLeave);
        this.#todosContainerEl.removeEventListener('dragover', this.#handleTodoDragOver);
        this.#todosContainerEl.removeEventListener('dragenter', this.#handleTodoDragEnter.bound);
        this.#todosContainerEl.removeEventListener('drop', this.#handleTodoDrop.bound);
    }

    #handleTodoDragStart(e) {
        e.target.classList.add('dragging');
        this.#initialDraggedElement = e.target;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.#initialDraggedElement.innerHTML);
    }

    #handleTodoDragEnd(e) {
        e.target.classList.remove('dragging');
    }

    #handleTodoDragLeave(e) {
        e.target.classList.remove('over');
    }

    #handleTodoDragOver(e) {
        e.preventDefault();
        return false;
    }

    #handleTodoDragEnter(e) {
        if (e.target === this.#initialDraggedElement) return;
        e.target.classList.add('over');
    }

    #handleTodoDrop(e) {
        e.target.classList.remove('over');
        this.#initialDraggedElement.innerHTML = e.target.innerHTML;
        e.target.innerHTML = e.dataTransfer.getData('text/html');
    }
}

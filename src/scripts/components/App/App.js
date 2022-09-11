import { v4 as uuidv4 } from 'uuid';
import { Todo } from './Todo';
import { createPopUpElement } from '../../utils/PopUpMessage';
import { createTodoFormElement } from '../../utils/TodoForm';
import { setDragEvents, removeDragEvents } from '../../utils/DragAndDrop';

export class App {
    #addNewTodoBtn = document.querySelector('.add-todo-btn');
    #todosContainerEl = document.querySelector('.todo-container');
    #reOrderTodosBtn = document.querySelector('#change-order-btn');
    #createNewTodoFormEl;
    #datepickerEl;
    #todoElements;
    constructor() {
        this.#listenClickEventsInTodoContainer();
        this.#reOrderTodosBtn.addEventListener('click', this.#enableTodosReOrder.bind(this));
        window.addEventListener('DOMContentLoaded', this.#renderUserTodosFromLS.bind(this));
    }

    #listenClickEventsInTodoContainer() {
        this.#todosContainerEl.addEventListener('click', ({ target, currentTarget }) => {
            if (target === currentTarget) return;
            if (target === this.#addNewTodoBtn) this.#showTodoForm();
            if (target.closest('.cancel-add-todo-btn')) this.#cancelFromAddingNewTodo();
            if (target.closest('#complete-todo-btn')) this.#markTodoAsCompleted(target);
            if (target.closest('#remove-todo-btn')) this.#removeTodoFromUI(target.closest('#remove-todo-btn'));
        });
    }

    #removeTodoFromUI(removeTodoBtn) {
        const parentElementOfClickedBtn = removeTodoBtn.parentElement;
        const parentElementTitle = parentElementOfClickedBtn.querySelector('h2').textContent;
        this.#removeTodoFromLS(parentElementTitle);
        parentElementOfClickedBtn.remove();
    }

    #markTodoAsCompleted(target) {
        const todoElement = target.closest('.todo-container__item');
        const todoElementClone = todoElement.cloneNode(true);
        todoElement.remove();
        this.#addNewTodoBtn.before(todoElementClone);
        const todosInLS = this.#getUserTodosFromLS();
        const completedTodoInLS = todosInLS.find(todo => todo.id === todoElementClone.id);
        completedTodoInLS.isFinished = true;
        localStorage.setItem('todos', JSON.stringify(todosInLS));
        todoElementClone.classList.add('completed');
    }

    #removeTodoFromLS(todoTitle) {
        const userTodosInLS = this.#getUserTodosFromLS();
        const getIndexTodoByTitle = userTodosInLS.findIndex(todo => todo.title === todoTitle);
        userTodosInLS.splice(getIndexTodoByTitle, 1);
        localStorage.setItem('todos', JSON.stringify(userTodosInLS));
    }

    #showTodoForm() {
        this.#addNewTodoBtn.setAttribute('disabled', '');
        const { formElement, datePickerInstance } = createTodoFormElement();
        this.#createNewTodoFormEl = formElement;
        this.#datepickerEl = datePickerInstance;
        formElement.addEventListener('submit', this.#appendNewCreatedTodo.bind(this));
    }

    #cancelFromAddingNewTodo() {
        this.#createNewTodoFormEl.remove();
        this.#addNewTodoBtn.removeAttribute('disabled');
        document.querySelector('.tooltip-message').remove();
    }

    #appendNewCreatedTodo(e) {
        e.preventDefault();
        const todoTitle = document.getElementById('title');
        const todoDesc = document.getElementById('description');
        const finishTodoDate = this.#datepickerEl.dateSelected?.toISOString();
        const todoID = uuidv4();
        if (!this.#checkProvidedDataForNewTodo(todoTitle, todoDesc))
            return createPopUpElement('Check provided data !', 'error-message');

        const notyficationEl = document.querySelector('.notyfication-popup');
        if (notyficationEl) notyficationEl.remove();
        const todo = new Todo(todoTitle.value, todoDesc.value, finishTodoDate, todoID);
        todo.renderTodo();
        this.#todoElements = [...document.querySelectorAll('.todo-container__item')];
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
        const finishedTodos = [];
        const userTodosInLS = this.#getUserTodosFromLS();
        if (!userTodosInLS) return;
        userTodosInLS.forEach(({ title, description, date, id, isFinished }) => {
            const todo = new Todo(title, description, date, id, isFinished);
            if (todo.renderTodo()) finishedTodos.push(todo);
        });
        if (finishedTodos.length !== 0)
            finishedTodos.forEach(
                ({ title, description, date, id, isFinished }) => new Todo(title, description, date, id, isFinished).renderFinishedTodo()
            );
        this.#todoElements = [...document.querySelectorAll('.todo-container__item')];
    }

    #enableTodosReOrder() {
        if (document.body.dataset.disabled) {
            removeDragEvents(this.#todoElements, this.#todosContainerEl);
            this.#saveTodosOrderToLS();
            return createPopUpElement('Saved', 'success-message', 'success');
        }
        setDragEvents(this.#todoElements, this.#todosContainerEl);
    }

    #saveTodosOrderToLS() {
        const newTodosOrder = this.#todoElements.map(todo => {
            const todoTitle = todo.querySelector('h2').textContent;
            const todoDesc = todo.querySelector('p').textContent;
            const todoFinishDate = this.#getTodoDateByTitle(todoTitle);
            const todoID = todo.id;
            return new Todo(todoTitle, todoDesc, todoFinishDate, todoID);
        });
        localStorage.setItem('todos', JSON.stringify(newTodosOrder));
    }

    #getTodoDateByTitle(todoTitle) {
        const userTodosInLS = this.#getUserTodosFromLS();
        if (!userTodosInLS) return;
        const todoFinishDate = userTodosInLS.find(todo => todoTitle === todo.title).date;
        return todoFinishDate;
    }
}
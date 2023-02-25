import { v4 as uuidv4 } from 'uuid';
import { Todo } from './Todo';
import { createModalElement } from '../utils/Modal';
import { createTodoFormElement } from '../utils/TodoCreateForm';
import { setDragEvents, removeDragEvents } from '../utils/DragAndDrop';

export class App {
    #addNewTodoBtn = document.querySelector('.add-todo-btn');
    #todosContainerEl = document.querySelector('.todo-container') as HTMLElement;
    #reOrderTodosBtn = document.querySelector('#change-order-btn');
    #createNewTodoFormEl: Element;
    #datepickerEl: any;
    #todoElements: Element[];
    constructor() {
        this.#listenClickEventsInTodoContainer();
        this.#reOrderTodosBtn?.addEventListener('click', this.#enableTodosReOrder.bind(this));
        window.addEventListener('DOMContentLoaded', this.#renderUserTodosFromLS.bind(this));
        this.#todoElements = [];
    }

    #listenClickEventsInTodoContainer() {
        this.#todosContainerEl.addEventListener('click', ({ target, currentTarget }: MouseEvent) => {
            if (!(target instanceof HTMLElement)) return;
            const closestRemoveTodoBtn = target.closest('#remove-todo-btn')
            if (target === currentTarget) return;
            if (target === this.#addNewTodoBtn) this.#showTodoForm();
            if (target.closest('.cancel-add-todo-btn')) this.#cancelFromAddingNewTodo();
            if (target.closest('#complete-todo-btn')) this.#markTodoAsCompleted(target);
            if (closestRemoveTodoBtn) this.#removeTodoFromUI(closestRemoveTodoBtn);
        });
    }

    #removeTodoFromUI(removeTodoBtn: Element) {
        const parentElementOfClickedBtn = removeTodoBtn.parentElement;
        if (!parentElementOfClickedBtn) return;
        const parentElementTitle = parentElementOfClickedBtn.querySelector('h2')?.textContent;
        if (parentElementTitle) this.#removeTodoFromLS(parentElementTitle);
        parentElementOfClickedBtn.remove();
    }

    #markTodoAsCompleted(target: Element) {
        const todoElement = target.closest('.todo-container__item');
        const todoElementClone = todoElement?.cloneNode(true) as Element;
        todoElement?.remove();
        if (todoElementClone) this.#addNewTodoBtn?.before(todoElementClone);
        const todosInLS = this.#getUserTodosFromLS();
        const completedTodoInLS = todosInLS?.find(todo => todo.id === todoElementClone.id);
        if (completedTodoInLS) completedTodoInLS.isFinished = true;
        localStorage.setItem('todos', JSON.stringify(todosInLS));
        todoElementClone?.classList.add('completed');
    }

    #removeTodoFromLS(todoTitle: string) {
        const userTodosInLS = this.#getUserTodosFromLS();
        const getIndexTodoByTitle = userTodosInLS?.findIndex(todo => todo.title === todoTitle);
        if (getIndexTodoByTitle) userTodosInLS?.splice(getIndexTodoByTitle, 1);
        localStorage.setItem('todos', JSON.stringify(userTodosInLS));
    }

    #showTodoForm() {
        this.#addNewTodoBtn?.setAttribute('disabled', '');
        const { formElement, datePickerInstance } = createTodoFormElement();
        if (formElement) this.#createNewTodoFormEl = formElement;
        this.#datepickerEl = datePickerInstance;
        formElement?.addEventListener('submit', this.#appendNewCreatedTodo.bind(this));
    }

    #cancelFromAddingNewTodo() {
        this.#createNewTodoFormEl.remove();
        this.#addNewTodoBtn?.removeAttribute('disabled');
        document.querySelector('.tooltip-message')?.remove();
    }

    #appendNewCreatedTodo(e: Event) {
        e.preventDefault();
        const todoTitle = document.getElementById('title') as HTMLInputElement;
        const todoDesc = document.getElementById('description') as HTMLInputElement;
        const finishTodoDate = this.#datepickerEl.dateSelected?.toISOString();
        const todoID = uuidv4();
        if (!this.#checkProvidedDataForNewTodo(todoTitle, todoDesc))
            return createModalElement('Check provided data !', '.error-message', 'error');

        const notyficationEl = document.querySelector('.notyfication-popup');
        if (notyficationEl) notyficationEl.remove();
        const todo = new Todo(todoTitle.value, todoDesc.value, finishTodoDate, todoID);
        todo.renderTodo();
        this.#todoElements = Array.from(document.querySelectorAll('.todo-container__item'));
        const userTodosFromLS = this.#getUserTodosFromLS() || [];
        userTodosFromLS.push(todo);
        localStorage.setItem('todos', JSON.stringify(userTodosFromLS));
        this.#createNewTodoFormEl.remove();
        this.#addNewTodoBtn?.removeAttribute('disabled');
    }

    #checkProvidedDataForNewTodo(...inputs: HTMLInputElement[]) {
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
        const todosLSJSON = localStorage.getItem('todos');
        if (!todosLSJSON) return;
        const userTodos: Todo[] = JSON.parse(todosLSJSON);
        return userTodos;
    }

    #renderUserTodosFromLS() {
        const finishedTodos: Todo[] = [];
        const userTodosInLS = this.#getUserTodosFromLS();
        if (!userTodosInLS) return;
        userTodosInLS.forEach(({ title, description, date, id, isFinished }) => {
            const todo = new Todo(title, description, isFinished, id, date);
            if (todo.renderTodo()) finishedTodos.push(todo);
        });
        if (finishedTodos.length !== 0)
            finishedTodos.forEach(({ title, description, date, id, isFinished }) =>
                new Todo(title, description, isFinished, id, date).renderFinishedTodo()
            );
        this.#todoElements = Array.from(document.querySelectorAll('.todo-container__item'));
    }

    #enableTodosReOrder() {
        if (document.body.dataset.disabled) {
            removeDragEvents({ targetElements: this.#todoElements, targetParentElement: this.#todosContainerEl });
            this.#saveTodosOrderToLS();
            return createModalElement('Saved', '.success-message');
        }
        setDragEvents({ targetElements: this.#todoElements, targetParentElement: this.#todosContainerEl });
    }

    #saveTodosOrderToLS() {
        const newTodosOrder = this.#todoElements.map(todo => {
            const todoTitle = todo.querySelector('h2')?.textContent;
            const todoDesc = todo.querySelector('p')?.textContent;
            if (!todoTitle || !todoDesc) return;
            const todoFinishDate = this.#getTodoDateByTitle(todoTitle);
            if (!todoFinishDate) return new Todo(todoTitle, todoDesc, false, todo.id);
            return new Todo(todoTitle, todoDesc, false, todo.id, todoFinishDate);
        });
        localStorage.setItem('todos', JSON.stringify(newTodosOrder));
    }

    #getTodoDateByTitle(todoTitle: string) {
        const userTodosInLS = this.#getUserTodosFromLS();
        if (!userTodosInLS) return;
        const todoFinishDate = userTodosInLS.find(todo => todoTitle === todo.title)?.date;
        return todoFinishDate;
    }
}

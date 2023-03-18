import { Todo } from './Todo';
import { createTodoFormElement, setDragEvents, removeDragEvents } from '../utils/index';

export class App {
    #addNewTodoBtn = document.querySelector('.add-todo-btn')!;
    #todoContainer = document.querySelector('.todo-container') as HTMLElement;
    #todoFormElement: HTMLFormElement;
    #datepickerEl: any;
    #userTodos: Element[] = [];
    constructor() {
        window.addEventListener('DOMContentLoaded', this.#renderTodosFromLS.bind(this));
        this.#todoClickHandler();
    }

    #todoClickHandler() {
        this.#todoContainer.addEventListener('click', ({ target, currentTarget }: MouseEvent) => {
            if (!(target instanceof HTMLElement) || target === currentTarget) return;
            if (target === this.#addNewTodoBtn) this.#showTodoForm();
            if (target.closest('.cancel-add-todo-btn')) this.#removeTodoForm();
            if (target.closest('.complete-todo-btn')) this.#markTodoAsCompleted(target);
            if (target.closest('.remove-todo-btn'))
                this.#removeTodoFromUI(target.closest('.remove-todo-btn')!);
        });
    }

    #removeTodoFromUI(removeTodoBtn: Element) {
        const todoElement = removeTodoBtn.closest<HTMLElement>('.todo-container__item');
        if (!todoElement) return;
        const todoElementId = todoElement.dataset.id;
        if (todoElementId) this.#removeTodoFromLS(todoElementId);
        todoElement.remove();
    }

    #markTodoAsCompleted(target: Element) {
        const todoElement = target.closest('.todo-container__item');
        const todoElementClone = todoElement?.cloneNode(true) as HTMLElement;
        todoElement?.remove();
        if (todoElementClone) this.#addNewTodoBtn?.before(todoElementClone);
        const userTodosLS = this.#getUserTodosFromLS();
        const completedTodoInLS = userTodosLS?.find(todo => todo.id === todoElementClone.dataset.id);
        if (completedTodoInLS) completedTodoInLS.isFinished = true;
        localStorage.setItem('todos', JSON.stringify(userTodosLS));
        todoElementClone?.classList.add('completed');
        todoElementClone.dataset.finished = 'true';
    }

    #removeTodoFromLS(todoId: string) {
        const userTodosLS = this.#getUserTodosFromLS();
        const foundTodoById = userTodosLS?.findIndex(todo => todo.id === todoId) as number;
        if (foundTodoById !== -1) userTodosLS?.splice(foundTodoById, 1);
        localStorage.setItem('todos', JSON.stringify(userTodosLS));
    }

    #showTodoForm() {
        this.#addNewTodoBtn?.setAttribute('disabled', '');
        const { formElement, datepicker } = createTodoFormElement();
        if (formElement) this.#todoFormElement = formElement;
        this.#datepickerEl = datepicker;
        formElement?.addEventListener('submit', this.#addNewTodoHandler.bind(this));
    }

    #removeTodoForm() {
        this.#todoFormElement.remove();
        this.#addNewTodoBtn?.removeAttribute('disabled');
    }

    #addNewTodoHandler(e: Event) {
        e.preventDefault();
        const formData = [...new FormData(this.#todoFormElement).values()] as [string, string, string];
        const todoID = crypto.randomUUID();
        const todo = new Todo(...formData, false, todoID).renderTodo(true);
        this.#userTodos = [...document.querySelectorAll('.todo-container__item')];
        const userTodosLS = this.#getUserTodosFromLS() || [];
        userTodosLS.push(todo);
        localStorage.setItem('todos', JSON.stringify(userTodosLS));
        this.#todoFormElement.remove();
        this.#addNewTodoBtn?.removeAttribute('disabled');
    }

    #getUserTodosFromLS() {
        const userTodosLS = localStorage.getItem('todos');
        if (!userTodosLS) return;
        const userTodos = JSON.parse(userTodosLS) as Todo[];
        return userTodos;
    }

    #renderTodosFromLS() {
        const userSavedTodos = this.#getUserTodosFromLS()?.filter(({ isFinished }) => !isFinished);
        const completedTodos = this.#getUserTodosFromLS()?.filter(({ isFinished }) => isFinished)!;
        if (!userSavedTodos) return;
        [...userSavedTodos, ...completedTodos].forEach(({ title, description, date, id, isFinished }) =>
            new Todo(title, description, date, isFinished, id).renderTodo()
        );
        this.#userTodos = [...document.querySelectorAll('.todo-container__item')];
    }
}

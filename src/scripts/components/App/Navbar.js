import { createPopper } from '@popperjs/core';
import { createTooltipElement } from '../../utils/tooltip';

export class Navbar {
    #navbarEl = document.getElementById('navbar');
    #searchInputEl = document.getElementById('search-input');
    #searchTodoBtn = document.getElementById('search-btn');
    #todosContainer = document.getElementById('todo-container')
    #tooltipElement;
    constructor() {
        this.#navbarEl.addEventListener('click', this.#listenClickEvents.bind(this));
        this.#searchInputEl.addEventListener('input', this.#listenInputEvents.bind(this));
        [this.#navbarEl, this.#todosContainer].forEach(el => el.addEventListener('mouseover', this.#listenHoverEvents.bind(this)));
        [this.#navbarEl, this.#todosContainer].forEach(el => el.addEventListener('mouseout', this.#listenMouseOutEvents.bind(this)));
        this.#checkUserThemePreference();
    }

    #listenClickEvents({ target }) {
        const navbarTargetElement =
            target.closest('#search-btn') || target.closest('#button-app-options') || target.closest('#theme-btn');
        if (!navbarTargetElement) return;
        if (navbarTargetElement.matches('#search-btn')) {
            if (navbarTargetElement.nextElementSibling.value)
                this.#searchTodoItem(navbarTargetElement.nextElementSibling.value);
            else navbarTargetElement.nextElementSibling.focus();
        }
        if (navbarTargetElement.matches('#button-app-options')) {
            navbarTargetElement.classList.toggle('button-hamburger--active-state');
            navbarTargetElement.previousElementSibling.classList.toggle('app-option--hidden');
        }
        if (navbarTargetElement.matches('#theme-btn')) this.#toggleUserTheme(navbarTargetElement);
    }

    #listenInputEvents({ target: { value } }) {
        this.#searchTodoBtn.classList.toggle('search--active', !!value);
    }

    #listenHoverEvents({ target }) {
        const targetOptionElement = target.closest('#theme-btn') || target.closest('#change-order-btn') || target.closest('#cancel-add-todo-btn');
        if (!targetOptionElement) return;
        this.#tooltipElement = createTooltipElement(targetOptionElement.dataset.optionName);
        createPopper(targetOptionElement, this.#tooltipElement, {
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

    #listenMouseOutEvents({ target }) {
        const targetMouseOut = target.closest('#theme-btn') || target.closest('#change-order-btn') || target.closest('#cancel-add-todo-btn');
        if (!targetMouseOut) return;
        this.#tooltipElement.remove();
    }

    #searchTodoItem(todoName) {
        const todoElement = [...document.querySelectorAll('.todo-container__item')].find(todo => {
            const todoHeadingEl = todo.querySelector('h2');
            return todoHeadingEl.textContent.toLowerCase().includes(todoName.toLowerCase());
        });
        todoElement?.classList.add('selected');
        setTimeout(() => todoElement.classList.remove('selected'), 4000);
    }

    #checkUserThemePreference() {
        const userThemeFromLS = localStorage.getItem('Theme');
        if (userThemeFromLS) this.loadUserThemeFromLS(userThemeFromLS);
    }

    loadUserThemeFromLS(theme) {
        const themeBtn = document.getElementById('theme-btn');
        theme === 'dark' ? themeBtn.classList.add('active') : themeBtn.classList.remove('active');
        document.documentElement.classList.add(theme);
    }

    #toggleUserTheme(changeThemeBtn) {
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

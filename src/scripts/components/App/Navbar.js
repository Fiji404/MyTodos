import { createPopper } from '@popperjs/core';
import { createTooltipElement } from '../../utils/tooltip';

class Navbar {
    #navbarEl = document.querySelector('.navbar');
    #searchInputEl = document.querySelector('.search-input');
    #searchTodoBtn = document.querySelector('.search-btn');
    #todosContainer = document.querySelector('.todo-container');
    #tooltipElement;
    constructor() {
        [this.#navbarEl, this.#todosContainer].forEach(targetEventEl =>
            targetEventEl.addEventListener('click', this.#listenClickEvents.bind(this))
        );
        this.#searchInputEl.addEventListener('input', this.#listenInputEvents.bind(this));
        [this.#navbarEl, this.#todosContainer].forEach(targetEventEl =>
            targetEventEl.addEventListener('mouseover', this.#listenHoverEvents.bind(this))
        );
        [this.#navbarEl, this.#todosContainer].forEach(targetEventEl =>
            targetEventEl.addEventListener('mouseout', this.#listenMouseOutEvents.bind(this))
        );
        this.#checkUserThemePreference();
    }

    #listenClickEvents({ target }) {
        const closestTargetElement =
            target.closest('#search-btn') ||
            target.closest('#button-app-options') ||
            target.closest('.theme-btn') ||
            target.closest('#remove-todo-btn') ||
            target.closest('#complete-todo-btn');
        if (!closestTargetElement) return;
        if (closestTargetElement.matches('#search-btn')) {
            if (closestTargetElement.nextElementSibling.value) return this.#searchTodoItem(closestTargetElement.nextElementSibling.value);
            closestTargetElement.nextElementSibling.focus();
        }
        if (closestTargetElement.matches('#button-app-options')) {
            closestTargetElement.classList.toggle('button-hamburger--active-state');
            closestTargetElement.previousElementSibling.classList.toggle('option-list--hidden');
        }
        if (closestTargetElement.matches('.theme-btn')) this.#toggleUserTheme(closestTargetElement);
        if (closestTargetElement.matches('#remove-todo-btn') || closestTargetElement.matches('#complete-todo-btn'))
            this.#deleteTooltipElement();
    }

    #listenInputEvents({ target: { value } }) {
        this.#searchTodoBtn.classList.toggle('search--active', !!value);
    }

    #listenHoverEvents({ target }) {
        const closestTargetElement =
            target.closest('.theme-btn') ||
            target.closest('#change-order-btn') ||
            target.closest('#cancel-add-todo-btn') ||
            target.closest('#complete-todo-btn') ||
            target.closest('#remove-todo-btn');
        if (!closestTargetElement) return;
        this.#tooltipElement = createTooltipElement(closestTargetElement.dataset.optionName);
        createPopper(closestTargetElement, this.#tooltipElement, {
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
        const closestTargetElement =
            target.closest('.theme-btn') ||
            target.closest('#change-order-btn') ||
            target.closest('#cancel-add-todo-btn') ||
            target.closest('#complete-todo-btn') ||
            target.closest('#remove-todo-btn');
        if (!closestTargetElement) return;
        this.#deleteTooltipElement();
    }

    #deleteTooltipElement() {
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
        const themeBtn = document.querySelector('.theme-btn');
        theme === 'dark' ? themeBtn.classList.add('active') : themeBtn.classList.remove('active');
        document.documentElement.classList.add(theme);
    }

    #toggleUserTheme(changeThemeBtn) {
        const rootElement = document.documentElement;
        changeThemeBtn.classList.toggle('active');
        if (rootElement.classList.contains('dark')) rootElement.classList.replace('dark', 'light');
        else if (rootElement.classList.contains('light')) rootElement.classList.replace('light', 'dark');
        else rootElement.classList.add('dark');
        localStorage.setItem('Theme', document.documentElement.className);
    }
}

export { Navbar };
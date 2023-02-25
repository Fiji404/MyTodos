import { createPopper } from '@popperjs/core';
import { createTooltipElement } from '../utils/Tooltip';

export class Navbar {
    #navbarEl = document.querySelector('.navbar') as HTMLElement;
    #searchInputEl = document.querySelector<HTMLInputElement>('.search-input');
    #todosContainer = document.querySelector('.todo-container') as HTMLElement;
    #tooltipElement: HTMLDivElement | undefined;
    constructor() {
        this.#searchInputEl?.addEventListener('input', this.#listenInputEvents.bind(this));
        this.#registerEvents(this.#navbarEl, this.#todosContainer);
        this.#checkUserThemePreference();
        this.#tooltipElement = undefined;
    }
    #registerEvents(...targetElements: HTMLElement[]) {
        targetElements.forEach(targetElement => {
            targetElement.addEventListener('mouseout', this.#listenMouseOutEvent.bind(this));
            targetElement.addEventListener('mouseover', this.#listenMouseOverEvent.bind(this));
            targetElement.addEventListener('click', this.#listenClickEvent.bind(this));
        });
    }

    #listenClickEvent({ target }: MouseEvent) {
        if (!(target instanceof HTMLElement)) return;
        const closestTargetElement =
            target.closest('.theme-btn') || target.closest('#remove-todo-btn') || target.closest('#complete-todo-btn') || target.closest('.expand-options');
        if (!closestTargetElement) return;
        if (closestTargetElement.matches('.theme-btn')) this.#toggleUserTheme(closestTargetElement);
        if (closestTargetElement.matches('#remove-todo-btn') || closestTargetElement.matches('#complete-todo-btn'))
            this.#deleteTooltipElement();
        if (closestTargetElement.matches('.expand-options')) this.#expandAppOptionsHandler()
    }

    #expandAppOptionsHandler() {
        const appOptionsListElement = document.querySelector('.app-options-list');
        appOptionsListElement.classList.toggle('active');
    }

    #listenInputEvents(e: Event) {
        if (!e.target) return;
        // handle todo searching
    }

    #listenMouseOverEvent({ target }: MouseEvent) {
        if (!(target instanceof HTMLElement)) return;
        const closestTargetElement = (target.closest('.theme-btn') ||
            target.closest('#change-order-btn') ||
            target.closest('.cancel-add-todo-btn') ||
            target.closest('#complete-todo-btn') ||
            target.closest('#remove-todo-btn') ||
            target.closest('.expand-options')) as HTMLElement;
        if (!closestTargetElement) return;
        this.#tooltipElement = createTooltipElement(closestTargetElement.dataset.optionName);
        if (!this.#tooltipElement) return;
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

    #listenMouseOutEvent({ target }: MouseEvent) {
        if (!(target instanceof HTMLElement)) return;
        const closestTargetElement =
            target.closest('.theme-btn') ||
            target.closest('#change-order-btn') ||
            target.closest('.cancel-add-todo-btn') ||
            target.closest('#complete-todo-btn') ||
            target.closest('#remove-todo-btn') ||
            target.closest('.expand-options');
        if (!closestTargetElement) return;
        this.#deleteTooltipElement();
    }

    #deleteTooltipElement() {
        if (!this.#tooltipElement) return;
        this.#tooltipElement.remove();
    }

    #searchTodoItem(todoName: string) {
        const todoElement = [...document.querySelectorAll('.todo-container__item')].find(todo => {
            const todoHeadingEl = todo.querySelector('h2');
            return todoHeadingEl?.textContent?.toLowerCase().includes(todoName.toLowerCase());
        });
        todoElement?.classList.add('selected');
        setTimeout(() => todoElement?.classList.remove('selected'), 4000);
    }

    #checkUserThemePreference() {
        const userThemeFromLS = localStorage.getItem('Theme');
        if (userThemeFromLS) this.loadUserThemeFromLS(userThemeFromLS);
    }

    loadUserThemeFromLS(theme: string) {
        const themeBtn = document.querySelector('.theme-btn');
        if (theme === 'dark') {
            themeBtn?.classList.add('active')
            document.documentElement.classList.remove(theme);
        } else {
            themeBtn?.classList.remove('active');
            document.documentElement.classList.add('dark');

        }
    }

    #toggleUserTheme(changeThemeBtn: Element) {
        const rootElement = document.documentElement;
        changeThemeBtn.classList.toggle('active');
        if (rootElement.classList.contains('dark')) return rootElement.classList.replace('dark', 'light');
        if (rootElement.classList.contains('light')) return rootElement.classList.replace('light', 'dark');
        rootElement.classList.add('dark');
        localStorage.setItem('Theme', document.documentElement.className);
    }
}

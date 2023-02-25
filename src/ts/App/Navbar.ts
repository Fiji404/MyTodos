export class Navbar {
    #navbarEl = document.querySelector('.navbar');
    #appOptionsList = document.querySelector('.app-options-list');
    constructor() {
        this.#navbarEl.addEventListener('click', this.#listenClickEvent.bind(this));
        window.addEventListener('click', this.#closeAppOptions.bind(this));
        this.#loadUserThemeFromLS();
    }

    #closeAppOptions({ target }: MouseEvent) {
        if (!(target instanceof Element)) return;
        if (!target.closest('.expand-options')) this.#appOptionsList.classList.remove('active');
    }

    #listenClickEvent({ target }: MouseEvent) {
        if (!(target instanceof HTMLElement)) return;
        const closestTargetElement = target.closest('.theme-btn') || target.closest('.expand-options');
        if (!closestTargetElement) return;
        if (closestTargetElement.matches('.theme-btn')) this.#toggleUserTheme(closestTargetElement);
        if (closestTargetElement.matches('.expand-options')) this.#appOptionsList.classList.toggle('active');
    }

    #loadUserThemeFromLS() {
        const userTheme = localStorage.getItem('theme');
        const themeBtn = document.querySelector('.theme-btn');
        if (!userTheme) return;
        themeBtn.classList.toggle('active');
        if (userTheme === 'dark') document.documentElement.classList.add('dark');
    }

    #toggleUserTheme(changeThemeBtn: Element) {
        changeThemeBtn.classList.toggle('active');
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', document.documentElement.className);
    }
}

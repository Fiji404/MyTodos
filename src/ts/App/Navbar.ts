export class Navbar {
    #navElement = document.querySelector<HTMLElement>('.navbar');
    constructor() {
        this.#navElement?.addEventListener('click', this.#listenOnThemeChange.bind(this));
        this.#getUserTheme();
    }

    #listenOnThemeChange({ target }: MouseEvent) {
        if (!(target instanceof Element)) return;
        const closestValidTarget = target.closest('.theme-btn');
        if (closestValidTarget) this.#toggleUserTheme(closestValidTarget);
    }

    #getUserTheme() {
        const themePreference = localStorage.getItem('theme');
        const changeThemeBtn = document.querySelector('.theme-btn');
        if (!themePreference) return changeThemeBtn?.classList.remove('active');
        changeThemeBtn?.classList.add('active');
        if (themePreference === 'dark') document.documentElement.classList.add('dark');
    }

    #toggleUserTheme(changeThemeBtn: Element) {
        changeThemeBtn.classList.toggle('active');
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', document.documentElement.className);
    }
}

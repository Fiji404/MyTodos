export const createModalElement = (msg: string, cssClass: string, modalType: string = 'success') => {
    const prevModalElement = getPreviousModalElement(cssClass);
    if (prevModalElement) prevModalElement.remove();
    const modalElement = document.createElement('div');
    const headingElement = createHeadingElement(msg, modalType);
    modalElement.classList.add(cssClass, 'visible');
    modalElement.append(headingElement);
    document.body.append(modalElement);
    modalElement.addEventListener('click', modalElement.remove);
    removeModalAfterDelay(2.5).catch(() => modalElement.remove());
};

const getPreviousModalElement = (cssClass: string) => {
    const popUpElement = document.querySelector(cssClass);
    return popUpElement;
};

const createHeadingElement = (msg: string, modalType: string) => {
    const headingElement = document.createElement('h2');
    headingElement.textContent = msg;
    if (modalType === 'success')
        headingElement.innerHTML = `${msg} <span><i class="fa-solid fa-circle-check text-green-400 ml-1"></i></span>`;
    return headingElement;
};

const removeModalAfterDelay = (sec: number) => new Promise((_, reject) => setTimeout(reject, sec * 1100));
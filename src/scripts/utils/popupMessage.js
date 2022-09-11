export const createPopUpElement = (msg, cssClass, popUpType) => {
    const { popUpElement: popUpEl, isPopUpExist } = checkIsPopUpElementExist(cssClass);
    if (isPopUpExist) popUpEl.remove();
    const popUpElement = document.createElement('div');
    const headingElement = createHeadingElement(msg, popUpType);
    popUpElement.classList.add(cssClass, 'visible');
    popUpElement.append(headingElement);
    document.body.append(popUpElement);
    popUpElement.addEventListener('click', popUpElement.remove);
    removePopUpAfterTime(2.5).catch(() => popUpElement.remove());
};

const checkIsPopUpElementExist = cssClass => {
    const popUpElement = document.querySelector(`.${cssClass}`);
    if (popUpElement) return { popUpElement, isPopUpExist: true };
    return { popUpElement: null, isPopUpExist: false };
};

const createHeadingElement = (msg, popUpType) => {
    const headingElement = document.createElement('h2');
    headingElement.textContent = msg;
    if (popUpType === 'success')
        headingElement.innerHTML = `${msg} <span><i class="fa-solid fa-circle-check text-green-400 ml-1"></i></span>`;
    return headingElement;
};

const removePopUpAfterTime = sec => new Promise((_, reject) => setTimeout(reject, sec * 1100));
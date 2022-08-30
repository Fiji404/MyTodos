export const createNotyficationElement = msg => {
    const notyficationElement = document.querySelector('.notyfication-popup');
    if (notyficationElement) {
        notyficationElement.remove();
        return createNotyficationElement(msg);
    }
    const divElement = document.createElement('div');
    divElement.classList.add('notyfication-popup');
    divElement.classList.add('visible');
    divElement.setAttribute('data-timer', 5);
    const notyficationHeadingElement = createHeadingMessageElement(msg);
    divElement.append(notyficationHeadingElement);
    document.body.append(divElement);
    divElement.addEventListener('click', () => divElement.remove());
    removeNotyficationAfterDelay(divElement.dataset.timer).catch(() => divElement.remove());
};

const createHeadingMessageElement = msg => {
    const headingElement = document.createElement('h2');
    headingElement.textContent = msg;
    return headingElement;
};

const removeNotyficationAfterDelay = time => new Promise((_, reject) => setTimeout(reject, time * 1100));
export const createNotyficationElement = msg => {
    if (document.querySelector('.notyfication-popup')) return;
    const divElement = document.createElement('div');
    divElement.classList.add('notyfication-popup');
    divElement.classList.add('visible');
    divElement.setAttribute('data-timer', 5);
    const notyficationHeadingElement = createHeadingMessageElement(msg);
    divElement.append(notyficationHeadingElement);
    document.body.append(divElement);
    divElement.addEventListener('click', () => divElement.remove());
    validateInputFields();
    removeNotyficationAfterTimerPassed(divElement.dataset.timer).catch(() => divElement.remove());
};

const createHeadingMessageElement = msg => {
    const headingElement = document.createElement('h2');
    headingElement.textContent = msg;
    return headingElement;
};

const removeNotyficationAfterTimerPassed = time => new Promise((_, reject) => setTimeout(reject, time * 1100));

const validateInputFields = (...inputs) => {
    inputs.forEach(input => {
        if (!input.value) input.style.borderColor = 'red'
    })
}

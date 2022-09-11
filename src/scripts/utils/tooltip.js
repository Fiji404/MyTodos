export const createTooltipElement = msg => {
    const tooltipElement = document.createElement('div');
    const headingElement = createTooltipTitle(msg);
    const tooltipArrow = document.createElement('div');
    tooltipElement.classList.add('tooltip-message');
    tooltipArrow.dataset.popperArrow = '';
    tooltipElement.append(headingElement, tooltipArrow);
    document.body.append(tooltipElement);
    return tooltipElement;
};

const createTooltipTitle = msg => {
    const headingElement = document.createElement('h2');
    headingElement.textContent = msg;
    return headingElement;
};
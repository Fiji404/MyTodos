export const createTooltipElement = (msg: string) => {
    const tooltipElement = document.createElement('div');
    const tooltipHeadingElement = createTooltipTitle(msg);
    const tooltipArrow = document.createElement('div');
    tooltipElement.classList.add('tooltip-message');
    tooltipArrow.dataset.popperArrow = '';
    tooltipElement.append(tooltipHeadingElement, tooltipArrow);
    document.body.append(tooltipElement);
    return tooltipElement;
};

const createTooltipTitle = (msg: string) => {
    const tooltipTitleElement = document.createElement('h2');
    tooltipTitleElement.textContent = msg;
    return tooltipTitleElement;
};
const createTooltipElement = msg => {
    const tooltipEl = document.createElement('div');
    const tooltipHeadingEl = createTooltipTitle(msg);
    const tooltipArrow = document.createElement('div');
    tooltipEl.classList.add('tooltip-message');
    tooltipArrow.dataset.popperArrow = '';
    tooltipEl.append(tooltipHeadingEl);
    tooltipEl.append(tooltipArrow);
    document.body.append(tooltipEl);
    return tooltipEl;
};

const createTooltipTitle = msg => {
    const tooltipTitle = document.createElement('h2');
    tooltipTitle.textContent = msg;
    return tooltipTitle;
};

export { createTooltipElement };
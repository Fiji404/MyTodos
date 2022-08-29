export const createTooltipElement = msg => {
    const tooltip = document.createElement('div');
    const tooltipHeading = createTooltipHeading(msg);
    const tooltipArrow = document.createElement('div');
    tooltip.classList.add('tooltip');
    tooltipArrow.setAttribute('data-popper-arrow', '');
    tooltip.append(tooltipHeading);
    tooltip.append(tooltipArrow);
    document.body.append(tooltip);
    return tooltip;
};

const createTooltipHeading = msg => {
    const tooltipHeading = document.createElement('h2');
    tooltipHeading.textContent = msg;
    return tooltipHeading;
};

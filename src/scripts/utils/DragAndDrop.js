const initialDraggedElement = {};

const setDragEvents = (targetElements, targetParentContainer) => {
    enableElementsToBeDragged(targetElements);
    targetParentContainer.addEventListener('dragstart', handleDragStart);
    targetParentContainer.addEventListener('dragend', handleDragEnd);
    targetParentContainer.addEventListener('dragleave', handleDragLeave);
    targetParentContainer.addEventListener('dragover', handleDragOver);
    targetParentContainer.addEventListener('dragenter', handleDragEnter);
    targetParentContainer.addEventListener('drop', handleDrop);
};

const removeDragEvents = (targetElements, targetParentContainer) => {
    disableElementsFromDragging(targetElements);
    targetParentContainer.removeEventListener('dragstart', handleDragStart);
    targetParentContainer.removeEventListener('dragend', handleDragEnd);
    targetParentContainer.removeEventListener('dragleave', handleDragLeave);
    targetParentContainer.removeEventListener('dragover', handleDragOver);
    targetParentContainer.removeEventListener('dragenter', handleDragEnter);
    targetParentContainer.removeEventListener('drop', handleDrop);
};

const enableElementsToBeDragged = elements => {
    document.body.dataset.disabled = true;
    elements.forEach(todo => {
        todo.classList.add('dragging-enabled');
        todo.setAttribute('draggable', 'true');
    });
};

const disableElementsFromDragging = elements => {
    document.body.removeAttribute('data-disabled');
    elements.forEach(todo => {
        todo.classList.remove('dragging-enabled');
        todo.removeAttribute('draggable');
    });
};

const handleDragStart = e => {
    e.target.classList.add('dragging');
    initialDraggedElement.element = e.target;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', initialDraggedElement.element.innerHTML);
};

const handleDragEnd = e => e.target.classList.remove('dragging');

const handleDragLeave = e => e.target.classList.remove('over');

const handleDragOver = e => e.preventDefault();

const handleDragEnter = e => {
    if (e.target === initialDraggedElement.element) return;
    e.target.classList.add('over');
};

const handleDrop = e => {
    e.target.classList.remove('over');
    initialDraggedElement.element.innerHTML = e.target.innerHTML;
    e.target.innerHTML = e.dataTransfer.getData('text/html');
};

export { setDragEvents, removeDragEvents };
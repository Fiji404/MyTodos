let initialDraggedElement: Element;

interface DragDetails {
    targetElements: Element[];
    targetParentElement: HTMLElement;
}

type PossiblitiesOfEventTarget = Element | null;

const setDragEvents = (dragDetails: DragDetails) => {
    prepareElementsToBeDragged(dragDetails.targetElements);
    dragDetails.targetParentElement.addEventListener('dragstart', handleDragStart);
    dragDetails.targetParentElement.addEventListener('dragend', handleDragEnd);
    dragDetails.targetParentElement.addEventListener('dragleave', handleDragLeave);
    dragDetails.targetParentElement.addEventListener('dragover', handleDragOver);
    dragDetails.targetParentElement.addEventListener('dragenter', handleDragEnter);
    dragDetails.targetParentElement.addEventListener('drop', handleDrop);
};

const removeDragEvents = (dragDetails: DragDetails) => {
    excludeElementsFromDragging(dragDetails.targetElements);
    dragDetails.targetParentElement.removeEventListener('dragstart', handleDragStart);
    dragDetails.targetParentElement.removeEventListener('dragend', handleDragEnd);
    dragDetails.targetParentElement.removeEventListener('dragleave', handleDragLeave);
    dragDetails.targetParentElement.removeEventListener('dragover', handleDragOver);
    dragDetails.targetParentElement.removeEventListener('dragenter', handleDragEnter);
    dragDetails.targetParentElement.removeEventListener('drop', handleDrop);
};

const prepareElementsToBeDragged = (targetElements: Element[]) => {
    document.body.dataset.disabled = 'true';
    targetElements.forEach(todo => {
        todo.classList.add('dragging-enabled');
        todo.setAttribute('draggable', 'true');
    });
};

const excludeElementsFromDragging = (targetElements: Element[]) => {
    document.body.removeAttribute('data-disabled');
    targetElements.forEach(todo => {
        todo.classList.remove('dragging-enabled');
        todo.removeAttribute('draggable');
    });
};

const handleDragStart = (e: DragEvent) => {
    const targetElement = e.target as PossiblitiesOfEventTarget;
    if (!targetElement) return;
    targetElement.classList.add('dragging');
    initialDraggedElement = targetElement;
    if (!e.dataTransfer) return;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', initialDraggedElement.innerHTML);
};

const handleDragEnd = (e: DragEvent) => (e.target as PossiblitiesOfEventTarget)?.classList.remove('dragging');

const handleDragLeave = (e: DragEvent) => (e.target as PossiblitiesOfEventTarget)?.classList.remove('over') 

const handleDragOver = (e: DragEvent) => e.preventDefault();

const handleDragEnter = (e: Event) => {
    const targetElement = e.target as PossiblitiesOfEventTarget;
    if (targetElement === initialDraggedElement) return;
    targetElement?.classList.add('over');
};

const handleDrop = (e: DragEvent) => {
    const targetElement = e.target as PossiblitiesOfEventTarget;
    if (!targetElement) return;
    targetElement.classList.remove('over');
    initialDraggedElement.innerHTML = targetElement.innerHTML;
    targetElement.innerHTML = e.dataTransfer!.getData('text/html');
};

export { setDragEvents, removeDragEvents };
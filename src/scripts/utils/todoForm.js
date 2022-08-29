import datepicker from 'js-datepicker';

const addNewTodoBtn = document.getElementById('add-todo-btn');

const replaceDatepickerInTodoForm = () => {
    const formDateInputEl = document.querySelector('#finish-date');
    return datepicker(formDateInputEl, { minDate: new Date() });
};

export const createTodoFormElement = () => {
    const todoFormHTMLTemplate = `
        <form
                id="add-todo-form"
                autocomplete="off"
                class="flex flex-col gap-3 bg-neutral-500 p-5 rounded-md border-2 border-neutral-400 transition-colors dark:bg-neutral-100 dark:border-neutral-300 relative"
            >
                <button
                    id="cancel-add-todo-btn"
                    type="button"
                    data-option-name="Cancel"
                    aria-label="close add todo form"
                    class="w-8 h-8 rounded-full bg-neutral-400 absolute right-0 top-0 translate-x-1/2 -translate-y-1/2 text-red-800 border border-red-800 dark:bg-neutral-100 dark:text-red-500 dark:border-red-500"
                >
                    <i class="fa-solid fa-xmark pointer-events-none"></i>
                </button>
                <div class="flex flex-col gap-1">
                    <label class="label-style dark:text-neutral-900" for="title">Title</label>
                    <input class="input-style dark:input-style--dark" id="title" type="text"  />
                </div>
                <div class="flex flex-col gap-1">
                    <label class="label-style dark:text-neutral-900" for="description">Description</label>
                    <textarea
                        class="input-style h-40 resize-none scroll-pt-60 dark:input-style--dark"
                        id="description"
                        
                    ></textarea>
                </div>
                <div class="flex flex-col gap-1">
                    <label class="label-style dark:text-neutral-900" for="finish-date">Finish date (optional)</label>
                    <input id="finish-date" class="p-1 rounded-sm" />
                </div>
                <div class="flex flex-col gap-1">
                    <label class="label-style dark:text-neutral-900" for="todo-importance">Importance (optional)</label>
                    <select class="rounded-sm focus:outline-neutral-800 focus:outline-offset-2" id="todo-importance">
                        <option value="null" class="option-style">Choose one below or left blank</option>
                        <option value="less" class="option-style">less important</option>
                        <option value="more" class="option-style">more important</option>
                        <option value="very" class="option-style">very important</option>
                    </select>
                </div>
                <button
                    id="submit-todo-btn"
                    class="w-fit mx-auto mt-3 border border-green-500 px-4 py-1 rounded-md text-green-500 bg-neutral-600 flex gap-2 items-center hover:-translate-y-1 transition-transform"
                >
                    Add Todo <i class="fa-solid fa-check"></i>
                </button>
            </form>`;
    addNewTodoBtn.insertAdjacentHTML('beforebegin', todoFormHTMLTemplate);
    const formElement = document.querySelector('#add-todo-form');
    const datapickerInstance = replaceDatepickerInTodoForm();
    return { formElement, datapickerInstance };
};

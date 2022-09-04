import datepicker from 'js-datepicker';

const replaceDatepickerInTodoForm = () => {
    const formDateInputEl = document.querySelector('.finish-date');
    return datepicker(formDateInputEl, { minDate: new Date() });
};

export const createTodoFormElement = () => {
    const newTodoBtn = document.querySelector('.add-todo-btn');
    const todoFormHTMLTemplate = `
        <form
                autocomplete="off"
                class="flex flex-col gap-3 bg-neutral-700 p-5 rounded-md border-2 border-neutral-800 transition-colors dark:bg-neutral-100 dark:border-neutral-300 relative add-todo-form"
            >
                <button
                    id="cancel-add-todo-btn"
                    type="button"
                    data-option-name="Cancel"
                    aria-label="close add todo form"
                    class="w-8 h-8 rounded-full bg-neutral-800 absolute right-0 top-0 translate-x-1/2 -translate-y-1/2 text-red-600 border border-red-800 dark:bg-neutral-100 dark:text-red-500 dark:border-red-500"
                >
                    <i class="fa-solid fa-xmark pointer-events-none"></i>
                </button>
                <div class="flex flex-col gap-1">
                    <label class="label-style" for="title">Title</label>
                    <input class="input-style" id="title" type="text"  />
                </div>
                <div class="flex flex-col gap-1">
                    <label class="label-style" for="description">Description</label>
                    <textarea
                        class="input-style h-40 resize-none scroll-pt-60"
                        id="description"
                        
                    ></textarea>
                </div>
                <div class="flex flex-col gap-1">
                    <label class="label-style" for="finish-date">Finish date (optional)</label>
                    <input class="p-1 rounded-sm finish-date" />
                </div>
                <button
                    id="submit-todo-btn"
                    class="w-fit mx-auto mt-3 border border-green-500 px-4 py-1 rounded-md text-green-500 bg-neutral-600 flex gap-2 items-center hover:-translate-y-1 transition-transform"
                >
                    Add Todo <i class="fa-solid fa-check"></i>
                </button>
            </form>`;
    newTodoBtn.insertAdjacentHTML('beforebegin', todoFormHTMLTemplate);
    const formElement = document.querySelector('.add-todo-form');
    const datePickerInstance = replaceDatepickerInTodoForm();
    return { formElement, datePickerInstance };
};
import datepicker from 'js-datepicker';
const insertCustomDatepicker = () => {
    return datepicker('.finish-date', { minDate: new Date() });
};

export const createTodoFormElement = () => {
    const addNewTodoBtn = document.querySelector('.add-todo-btn');
    const formHTMLTemplate = `
    <form
        autocomplete="off"
        class="flex flex-col gap-3 bg-[#1f1f1f] p-5 rounded-md border border-accentDark transition-colors dark:bg-neutral-100 dark:border-neutral-300 relative add-todo-form"
    >
        <button
            type="button"
            data-option-name="Cancel"
            aria-label="close add todo form"
            class="w-8 h-8 rounded-full absolute right-0 top-0 translate-x-1/2 -translate-y-1/2 text-red-600 border border-red-800  dark:text-red-500 dark:border-red-500 hover:bg-[rgba(255,0,0,0.34)] transition-colors cancel-add-todo-btn"
        >
            <i class="fa-solid fa-xmark pointer-events-none"></i>
        </button>
        <div class="flex flex-col gap-1">
            <label class="label-style" for="title"
                >Title<span title="required" class="text-red-500">*</span>
            </label>
            <input name="title" class="input-style" id="title" type="text" required />
        </div>
        <div class="flex flex-col gap-1">
            <label class="label-style" for="description">Description</label>
            <textarea name="desc" class="input-style h-40 resize-none scroll-pt-60" id="description"
            ></textarea>
        </div>
        <div class="flex flex-col gap-1">
            <label class="label-style" for="finish-date">Completion time</label>
            <input name="date" id="finish-date" class="input-style finish-date" />
        </div>
        <button
            id="submit-todo-btn"
            class="w-fit mx-auto mt-3 border dark:border-[#dbdbdb] dark:bg-[#f3f3f3] bg-[#202020] border-accentDark hover:bg-[#292929] text-white px-4 py-1 rounded-md flex gap-2 items-center dark:hover:bg-[#e6e6e6] dark:text-[#000] transition-colors"
        >
            Add todo <i class="fa-solid fa-check text-green-500"></i>
        </button>
    </form>`;
    addNewTodoBtn?.insertAdjacentHTML('beforebegin', formHTMLTemplate);
    return {
        formElement: document.querySelector('.add-todo-form') as HTMLFormElement,
        datepicker: insertCustomDatepicker(),
    };
};

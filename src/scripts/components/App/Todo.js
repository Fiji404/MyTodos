import { v4 as uuidv4 } from 'uuid'

export class Todo {
    constructor(title, description, date, importance) {
        this.title = title;
        this.description = description;
        this.date = date || null;
        this.importance = importance || null;
    }

    renderTodo() {
        const addTodoBtn = document.getElementById('add-todo-btn');
        const ISOStringToDateObject = new Date(this.date);
        const transformedDateToUserFriendlyFormat = this.#transformDateToUserFriendlyFormat(
            ISOStringToDateObject.getDate()
        );
        const todoID = uuidv4();
        const todoHTMLTemplate = `
            <section id="${todoID}"
    class="bg-neutral-500 dark:bg-neutral-200 rounded-md todo-container__item border border-neutral-400 pb-4 todo-container__item grow dark:border-neutral-400
     transition-colors relative hover:todo-options--active scale-105 shadow-xl max-h-52"
>
<button id="complete-todo-btn" data-option-name="Mark todo as completed" aria-label="Mark todo as completed" class="absolute top-0 -right-2 -translate-y-1/2 hover:bg-green-800 block h-5 rounded-full transition-all pointer-events-none opacity-0"><i class="fa-regular fa-circle-check text-xl text-green-500"></i></button>
<button id="remove-todo-btn" data-option-name="Remove todo" aria-label="Remove todo" class="h-5 absolute top-0 -translate-y-1/2 -left-2 hover:bg-red-800 rounded-full transition-all pointer-events-none opacity-0"><i class="fa-regular fa-circle-xmark text-xl text-red-600"></i></button>
    <header class="py-3 border-b border-b-neutral-400 bg-neutral-600 dark:bg-neutral-300 transition-colors rounded-md rounded-br-none rounded-bl-none">
        <h2 class="text-3xl text-center font-semibold text-neutral-100 dark:text-neutral-900 transition-colors">${this.title}</h2>
    </header>
    <div class="px-2">
        <p class="mt-4 text-neutral-50 font-medium text-xl dark:text-neutral-900 transition-colors">${this.description}</p>
        ${
            !this.date
                ? ''
                : `<div class="mt-8 ml-auto w-fit">
            <p class="inline text-neutral-100 dark:text-neutral-900 transition-colors">Ends</p>
            
                 
                    <time
                        class="bg-neutral-600 px-3 py-1 rounded-md w-fit ml-auto text-neutral-100 border border-neutral-400 select-none dark:bg-neutral-100 dark:text-neutral-900 transition-colors"
                        datetime="17.04.2022"
                    >
                        ${
                            transformedDateToUserFriendlyFormat === ISOStringToDateObject.getDate()
                                ? `${transformedDateToUserFriendlyFormat}.${ISOStringToDateObject.getMonth()}.${ISOStringToDateObject.getFullYear()}`
                                : this.#transformDateToUserFriendlyFormat(ISOStringToDateObject.getDate())
                        }
                    </time>`
        }
        </div>
    </div>
</section>
        `;
        addTodoBtn.insertAdjacentHTML('beforebegin', todoHTMLTemplate);
        const newAddedTodo = [...document.querySelectorAll('.todo-container__item')].find(todo => todo.id === todoID);
        newAddedTodo.classList.add('animate-originate')
    }

    #transformDateToUserFriendlyFormat(day) {
        const currentDay = new Date().getDate();
        const checkIsPassedDayBeginInFuture = this.#transformFutureDayToFriendlyName(day, currentDay);
        const checkIsDayPassedInPast = this.#checkIsDayPassedInPast(day, currentDay);
        if (checkIsPassedDayBeginInFuture) return checkIsPassedDayBeginInFuture;
        if (checkIsDayPassedInPast) return checkIsDayPassedInPast;
        return day;
    }
    #transformFutureDayToFriendlyName(day, currentDay) {
        const transformedFutureDateToFriendlyFormat =
            day === currentDay
                ? 'Today'
                : day === currentDay + 1
                ? 'Tomorrow'
                : day === currentDay + 2
                ? 'In 2 days'
                : day === currentDay + 3
                ? 'In 3 days'
                : false;
        return transformedFutureDateToFriendlyFormat;
    }

    #checkIsDayPassedInPast(day, currentDay) {
        const transformedPastDateToFriendlyFormat =
            day === currentDay - 1
                ? 'Yesterday'
                : day === currentDay - 2
                ? '2 days ago'
                : day === currentDay - 3
                ? '3 days ago'
                : false;
        return transformedPastDateToFriendlyFormat;
    }
}
export class Todo {
    constructor(title, description, date, importance) {
        this.title = title;
        this.description = description;
        this.date = date || null;
        this.importance = importance || null;
        // this.#renderTodo(title, description, date, importance);
    }

    renderTodo(title, description, date, importance) {
        const addTodoBtn = document.getElementById('add-todo-btn');
        const ISOStringToDateObject = new Date(this.date);
        const transformedDateToUserFriendlyFormat = this.#transformDateToUserFriendlyFormat(
            ISOStringToDateObject.getDate()
        );
        const todoHTMLTemplate = `
            <section 
    class="bg-neutral-500 dark:bg-neutral-200 rounded-md overflow-hidden todo-container__item border border-neutral-300 pb-4 todo-container__item grow dark:border-neutral-400
     transition-colors"
>
    <header class="py-3 border-b border-b-neutral-400 bg-neutral-600 dark:bg-neutral-300 transition-colors">
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
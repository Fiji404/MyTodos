export class Todo {
    #addTodoBtn = document.querySelector('.add-todo-btn')!;
    constructor(
        public title: string,
        public description: string,
        public date: string,
        public isFinished: boolean,
        public id: string
    ) {}

    renderTodo(isTodoAddedNow?: boolean) {
        const todoHTMLTemplate = this.#createTodoTemplate();
        const firstCompletedTodo = document.querySelector('.todo-container__item[data-finished="true"]');
        if (isTodoAddedNow && firstCompletedTodo)
            firstCompletedTodo.insertAdjacentHTML('beforebegin', todoHTMLTemplate);
        else this.#addTodoBtn.insertAdjacentHTML('beforebegin', todoHTMLTemplate);
        return this;
    }

    #createTodoTemplate() {
        const date = !(new Date(this.date).toString() === 'Invalid Date') && new Date(this.date);
        const friendlyFormattedDate = this.#convertDateToFriendlyFormat(date !== false ? date.getDate() : 0);
        const completionDate = date && `${friendlyFormattedDate}.${date.getMonth()}.${date.getFullYear()}`

        const todoHTMLTemplate = `<section
        data-id="${this.id}"
        data-finished="${this.isFinished}"
        class="bg-[#1b1b1b] dark:bg-primary rounded-md todo-container__item border border-[#272727] pb-4 todo-container__item grow dark:border-[#c9c9c9] transition-colors relative hover:todo-options--active shadow-sm opacity-0 scale-110 ${
            this.isFinished ? 'completed' : ''
        } originateTodo"
    >
        <button
            aria-label="Mark todo as completed"
            class="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 hover:bg-[#2e8536fd] flex-center h-5 rounded-full transition-colors pointer-events-none opacity-0 complete-todo-btn"
            ><i class="fa-regular fa-circle-check text-2xl text-green-500"></i>
        </button>
        <button
            aria-label="Remove todo"
            class="flex-center absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 h-5 hover:bg-[#7e0303] rounded-full transition-all pointer-events-none opacity-0 remove-todo-btn"
            ><i class="fa-regular fa-circle-xmark text-2xl text-red-600"></i>
        </button>
        <header
            class="py-3 px-1 border-b border-b-[#2c2c2c] dark:border-b-[#b3b3b3] bg-[#1d1d1d] dark:bg-[#e0e0e0] transition-colors rounded-md rounded-br-none rounded-bl-none"
        >
            <h2
                class="text-2xl text-center font-semibold text-neutral-100 dark:text-neutral-900 transition-colors"
            >
                ${this.title}
            </h2>
        </header>
        <div class="px-2">
            <p class="mt-4 text-neutral-50 font-medium text-xl dark:text-neutral-900 transition-colors break-all">
                ${this.description}
            </p>
            ${
                !this.date
                    ? ''
                    : `<div class="mt-8 ml-auto w-fit">
                <p class="inline text-neutral-100 dark:text-neutral-900 transition-colors">${date && new Date().getDate() > date.getDate() ? 'Ended' : 'Ends' }</p>
                
                     
                        <time
                            class="ml-1 bg-[#1a1a1a] px-3 py-1 rounded-md w-fit text-neutral-100 border border-[#292929] dark:border-[#cacaca] select-none dark:bg-neutral-100 dark:text-neutral-900 transition-colors"
                            datetime="17.04.2022"
                        >
                           ${
                               date && friendlyFormattedDate === date.getDate()
                                   ? completionDate
                                   : friendlyFormattedDate
                           }
                        </time>`
            }
        </div>
    </section>`;
        return todoHTMLTemplate;
    }

    #convertDateToFriendlyFormat(day: number) {
        const currentDay = new Date().getDate();
        const formattedFutureDayInFriendlyFormat = this.#transformFutureDayToFriendlyName(day, currentDay);
        const formattedPassedDayInFriendlyFormat = this.#checkIsDayPassedInPast(day, currentDay);
        if (formattedFutureDayInFriendlyFormat) return formattedFutureDayInFriendlyFormat;
        if (formattedPassedDayInFriendlyFormat) return formattedPassedDayInFriendlyFormat;
        return day;
    }
    #transformFutureDayToFriendlyName(day: number, currentDay: number) {
        const POSSIBLE_FUTURE_DATE_FORMATS: Record<string, string> = {
            0: 'Today',
            1: 'Tomorrow',
            2: 'in 2 days',
            3: 'in 3 days',
        };
        const transformedFutureDateToFriendlyFormat = POSSIBLE_FUTURE_DATE_FORMATS[day - currentDay] || day;
        return transformedFutureDateToFriendlyFormat;
    }

    #checkIsDayPassedInPast(day: number, currentDay: number) {
        const POSSIBLE_PASSED_DATE_FORMATS: Record<string, string> = {
            0: 'Yesterday',
            1: '2 days ago',
            2: '3 days ago',
        };
        const transformedPastDateToFriendlyFormat = POSSIBLE_PASSED_DATE_FORMATS[currentDay - day] || day;
        return transformedPastDateToFriendlyFormat;
    }
}

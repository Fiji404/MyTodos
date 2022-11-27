declare module 'js-datepicker' {
    interface DatepickerOptions {
        /** Uses that when you want to manipulate visibility of the datepicker */
        alwaysShow?: boolean;
        /** Set selected date by provided Date object */
        dateSelected?: Date;
        /** Set maximum threshold of selectable dates. */
        maxDate?: Date;
        /** Set minumum threshold of selectable dates. */
        minDate: Date;
        /** Determine the month that the calendar starts off at. */
        startDate?: Date;
        /** By default, the datepicker will not put date numbers on calendar days that fall outside the current month. They will be empty squares. Sometimes you want to see those preceding and trailing days */
        showAllDates?: boolean;
        respectDisabledReadOnly?: boolean;
        /** Determine is selecting weekends are possible */
        noWeekends?: boolean;
    }
    function datepicker(selectorOrElement: string | Element, options: DatepickerOptions): 

    
}
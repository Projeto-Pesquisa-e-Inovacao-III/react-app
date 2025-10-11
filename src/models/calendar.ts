export type CalendarDTO = {
    title: string,
    start: string,
    end?: string
}

export type CalendarResponse = {
    title: string,
    dateTime: string
}

export type EventDTO = {
    id: number,
    title: string,
    date: string,
    hour: string,
}
import { api } from "../system";
import type { CalendarResponse } from "../models/calendar";

export function createEvent(calendarData: CalendarResponse) {
    return api.post(`/events`, calendarData)
}

export function getEvents() {
    return api.get(`/events`)
}

export function debug() {
    return api.get(`/debug/testing-connection`)
}

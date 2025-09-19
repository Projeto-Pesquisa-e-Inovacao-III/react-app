import axios from "axios";
import { HOST } from "../system";
import type { CalendarResponse } from "../models/calendar";

export function createEvent(calendarData: CalendarResponse) {
    return axios.post(`${HOST}/events`, calendarData)
}

export function getEvents() {
    return axios.get(`${HOST}/events`)
}

export function debug() {
    return axios.get(`${HOST}/debug/testing-connection`)
}

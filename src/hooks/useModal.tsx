import { useState } from "react";

export type modalTypes = "timer" | "success" | "error" | "adjustAvatar" | "popup" | "newEvent" | "accept" | "decline" | "reschedule" | null;
//export default function useModal(type: modalTypes, text: { title: string, content: string }) {
// example of usage:
/*
const { openModal, setOpenModal, textModal, setTextModal } = useModal(null, { title: "", content: "" });
*/
export default function useModal(
    type: modalTypes,
    text: {
        title: string,
        content: string
    }) {

    const [openModal, setOpenModal] = useState<modalTypes>(type);
    const [textModal, setTextModal] = useState({ title: text.title, content: text.content });

    return {
        openModal,
        setOpenModal,
        textModal,
        setTextModal
    };
}
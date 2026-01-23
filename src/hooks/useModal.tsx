import { useState } from "react";

type modalTypes = "timer" | "success" | "error" | null;

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
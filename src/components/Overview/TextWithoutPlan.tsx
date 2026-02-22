import { Check } from 'lucide-react';
import React from 'react'

type Props = {
    text: string;
}

export default function TextWithoutPlan({ text }: Props) {
    return (
        <li className="flex items-center gap-3">
            <div className="bg-white/20 p-1 rounded-full">
                <span className="material-symbols-outlined text-sm leading-none"><Check /></span>
            </div>
            <span className="text-base font-medium">{text}</span>
        </li>
    )
}

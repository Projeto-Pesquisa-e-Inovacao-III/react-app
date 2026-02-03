import React from 'react'
import styles from './CheckScheduleKpis.module.css'

type Props = {
    title: string
    value: string | number
    color?: string
    customClass?: string
}

export default function CheckScheduleKpis({ title, value, color }: Props) {
    return (
        <div className="flex gap-5 mb-5 bg-white p-5 px-2.5 rounded-lg border border-gray-300">
            <div className="ml-3">
                <h2 className='text-gray-500 text-sm font-semibold uppercase'>{title}</h2>
                <p className='text-3xl font-extrabold mt-2' style={{ color: color }}>{value}</p>
            </div>
        </div>
    )
}

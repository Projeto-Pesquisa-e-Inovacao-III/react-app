type Props = {
    title: string
}

export default function TableHeader({ title }: Props) {
    return (
        <th className="px-6 py-4 text-slate-600 dark:text-white text-xs font-bold uppercase tracking-wider w-40">{title}</th>

    )
}

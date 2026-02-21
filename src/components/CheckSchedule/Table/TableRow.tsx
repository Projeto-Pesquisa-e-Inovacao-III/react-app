type Props = {
    text: string
    customClassName?: string
}


export default function TableRow({ text, customClassName }: Props) {
    return (

        <td className="px-6 py-4">
            <span className={`text-sm text-slate-900 ${customClassName ?? ""}`}>{text}</span>
        </td>
    )
}

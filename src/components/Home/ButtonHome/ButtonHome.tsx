export default function ButtonHome({ title, to }: { title: string, to: string }) {
    return (
        <a href={to} className="flex justify-center items-center bg-white min-h-12 w-[53.2%] mt-10 text-black font-semibold rounded-md cursor-pointer">
            {title}
        </a>
    );
}

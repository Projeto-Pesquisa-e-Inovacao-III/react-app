export default function ButtonHome({ title, to, classname }: { title: string, to: string, classname?: string }) {
    return (
        <a href={to} className={`flex text-center justify-center items-center bg-white min-h-12 w-[53.2%] mt-10 text-black font-semibold rounded-md cursor-pointer ${classname || ''}`}>
            {title}
        </a>
    );
}

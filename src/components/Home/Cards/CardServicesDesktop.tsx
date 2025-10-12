import type { CardServices } from "../../../constants/homeProps";

export default function CardServicesDesktop({ bgColor, title, content, image, isReverse }: CardServices) {
    return (
        <div className={`${bgColor} flex ${isReverse ? "flex-row-reverse pl-10" : "flex-row pr-10"} gap-9 mb-10 rounded-lg`}>
            <div className="max-w-fit w-3/4 h-1/4 overflow-hidden p-10 bg-white">
                <img className="w-full" src={image} alt={title} />
            </div>
            <div className={` text-white flex justify-around flex-col w-1/2 pb-20 pt-20`}>
                <h1 className="text-4xl font-bold">{title}</h1>
                <p className="text-2xl">{content}</p>
            </div>
        </div>
    );
}

import "./style.css"

type Props = {
    title: string;
    content: string;
    image: string;
    isReverse?: boolean;
    isCarrousel?: boolean;
}

export default function Card({ title, content, image, isReverse, isCarrousel }: Props) {
    return (
        <div>
            <div>
                <div className={`home-cta-card default-card-style ${isReverse ? "reverse" : ""}`}>
                    <div className="card-content">
                        <h2 className="text-2xl mb-5 mt-5">{title}</h2>
                        <p className="mb-5">{content}</p>
                    </div>
                    <div className="card-img">
                        <img src={image} alt="" />
                    </div>
                </div>
            </div>
        </div>
    );
}

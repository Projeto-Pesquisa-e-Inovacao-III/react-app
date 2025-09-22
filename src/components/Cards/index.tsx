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
        <div className="wrapper-content">
            <div className="wrapper-content-cta">
                <div className={`home-cta-card default-card-style ${isReverse ? "reverse" : ""}`}>
                    <div className="card-content" style={{marginLeft: isReverse ? "15px" : "0" }}>
                        <h2>{title}</h2>
                        <p>{content}</p>
                    </div>
                    <div className="card-img">
                        <img src={image} alt="" />
                    </div>
                </div>
            </div>
        </div>
    );
}

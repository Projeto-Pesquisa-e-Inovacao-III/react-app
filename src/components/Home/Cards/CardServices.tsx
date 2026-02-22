type CardServices = {
  title: string;
  content: string;
  image: string;
  isReverse?: boolean;
  isCarrousel?: boolean;
  bgColor: string;
  color?: string;
  isMobile?: boolean;
}

export default function CardServices({ bgColor, color, title, content, image, isReverse, isMobile }: CardServices) {
  return (
    <>
      {isMobile ? (
        <div className={`${bgColor} text-white home-cta-card default-card-style mt-5 rounded-lg ${isReverse ? "reverse" : ""}`}>
          <div className="p-3">
            <h2 className={`text-3xl ${isMobile && isReverse ? "text-white" : "text-black"} text-center font-semibold font-poppins mb-5 mt-5`}>{title}</h2>
            <p className={`mb-5 text-center font-poppins text-xl ${isMobile && isReverse ? "text-white" : "text-black"}`}>{content}</p>
          </div>
          <div className="card-img">
            <img className="w-full" src={image} alt="" />
          </div>
        </div>
      ) : (
        <div className={`${bgColor} flex ${isReverse ? "flex-row-reverse" : "flex-row"} gap-1 mb-10 rounded-lg`}>
          <div className="max-w-fit w-full overflow-hidden p-10 bg-white  flex items-center h-auto">
            <img className="w-full h-96 object-contain" src={image} alt={title} />
          </div>
          <div className={`w-full text-center ${color ? color : "text-white"} flex justify-around items-center flex-col p-12 pb-20 pt-20 ${!isReverse ? "pr-36" : ""}`}>
            <h1 className="text-4xl font-bold">{title}</h1>
            <p className="text-2xl">{content}</p>
          </div>
        </div>
      )}
    </>
  );
}

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
        <div className={`${bgColor} text-white home-cta-card default-card-style mt-5 rounded-lg overflow-hidden ${isReverse ? "reverse" : ""}`}>
          <div className="p-3">
            <h2 className={`text-3xl ${isMobile && isReverse ? "text-white" : "text-black"} text-center font-semibold font-poppins mb-5 mt-5`}>{title}</h2>
            <p className={`mb-5 text-center font-poppins text-xl ${isMobile && isReverse ? "text-white" : "text-black"}`}>{content}</p>
          </div>
          <div className="card-img">
            <img className="w-full h-[380px] object-cover object-center" src={image} alt="" />
          </div>
        </div>
      ) : (
        <div className={`${bgColor} flex ${isReverse ? "flex-row-reverse" : "flex-row"} gap-1 mb-10 rounded-lg overflow-hidden`}>
          <div className="w-[550px] shrink-0 overflow-hidden p-10 bg-white flex items-center justify-center h-auto">
            <img className="w-full h-[420px] object-cover object-center rounded-xl" src={image} alt={title} />
          </div>
          <div className={`flex-1 text-center ${color ? color : "text-white"} flex justify-center items-center flex-col p-12 pb-20 pt-20 ${!isReverse ? "pl-12 pr-12" : "pl-12 pr-12"}`}>
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
            <p className="text-2xl">{content}</p>
          </div>
        </div>
      )}
    </>
  );
}

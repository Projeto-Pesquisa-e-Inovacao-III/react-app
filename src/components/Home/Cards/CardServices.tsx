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
            <h2 className="text-3xl font-semibold font-poppins mb-5 mt-5">{title}</h2>
            <p className="mb-5 font-poppins text-xl">{content}</p>
          </div>
          <div className="card-img">
            <img className="w-full" src={image} alt="" />
          </div>
        </div>
      ) : (
        <div className={`${bgColor} flex ${isReverse ? "flex-row-reverse pl-10" : "flex-row pr-10"} gap-1 mb-10 rounded-lg`}>
          <div className="max-w-fit w-3/4 h-1/4 overflow-hidden p-10 bg-white">
            <img className="w-lg object-cover h-96" src={image} alt={title} />
          </div>
          <div className={`w-full text-center ${color ? color : "text-white"} flex justify-around items-center flex-col pb-20 pt-20`}>
            <h1 className="w-3xl text-4xl font-bold">{title}</h1>
            <p className="w-5xl text-2xl">{content}</p>
          </div>
        </div>
      )}
    </>
  );
}

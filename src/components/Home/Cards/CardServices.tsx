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
        <div className={`${bgColor} text-white home-cta-card default-card-style mt-5 rounded-2xl shadow-xl overflow-hidden ${isReverse ? "reverse" : ""}`}>
          <div className="p-6">
            <h2 className={`text-3xl ${isMobile && isReverse ? "text-white" : "text-oxford-blue"} text-center font-bold font-poppins mb-4 mt-2 leading-tight`}>{title}</h2>
            <p className={`mb-4 text-center font-poppins text-lg opacity-90 ${isMobile && isReverse ? "text-white" : "text-oxford-blue"}`}>{content}</p>
          </div>
          <div className="card-img w-full h-[320px]">
            <img className="w-full h-full object-cover object-center" src={image} alt="" />
          </div>
        </div>
      ) : (
        <div className={`${bgColor} flex ${isReverse ? "flex-row-reverse" : "flex-row"} gap-0 mb-12 rounded-3xl overflow-hidden shadow-2xl transition-transform hover:-translate-y-1 duration-300`}>
          <div className="w-[550px] shrink-0 overflow-hidden relative group h-auto min-h-[400px]">
            <img className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" src={image} alt={title} />
          </div>
          <div className={`flex-1 text-center ${color ? color : "text-white"} flex justify-center items-center flex-col p-12 relative backdrop-blur-sm bg-white/5`}>
            <h1 className="text-4xl font-bold mb-6 leading-tight drop-shadow-md">{title}</h1>
            <p className="text-2xl leading-relaxed opacity-95">{content}</p>
          </div>
        </div>
      )}
    </>
  );
}

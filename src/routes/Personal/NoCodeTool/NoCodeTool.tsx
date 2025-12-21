import { Editor, Frame, Element } from "@craftjs/core";
import Text from "../../../components/NoCodeToolsComponents/Text";
import { Container } from "../../../components/NoCodeToolsComponents/Container";
import Toolbox from "../../../components/NoCodeToolsComponents/Toolbox";
import ButtonHome from "../../../components/Home/ButtonHome/ButtonHome";
import useMobile from "../../../hooks/isMobile";

export default function NoCodeTool() {
  const isMobile = useMobile();
  return (
    <>
      <header className="w-full h-16 sticky top-0 z-50 shadow-md">
        <div className="flex justify-between items-center h-full px-12 bg-oxford-blue">
          <h1 className="text-white text-2xl font-bold">NoCode Tool</h1>
        </div>
      </header>
      <div className="flex h-auto bg-[#051128]"
        style={{
          backgroundImage: 'radial-gradient(circle at 0% 0%, rgba(12, 98, 145, 0.2) 0%, transparent 70%)'
        }}>
        <Editor resolver={{ Text, Container }}>
          <div className="flex flex-col  m-12">
            <section className="flex h-dvh w-full bg-[url('/Home/bgImageMainRight.png')] bg-cover bg-center">

              <div className="w-fit flex flex-col justify-center items-start gap-5 mt-64 ml-20 mr-20">
                <Frame>
                  <Element is={Container} canvas>
                    <Element
                      is={Text}
                      type={"h1"}
                      classname="text-5xl w-[54%] font-poppins font-bold uppercase text-center text-white hover:border hover:border-dashed   transition-all duration-75"
                      text="Bem-vindo a csf Treinamentos"
                    />
                  </Element>
                </Frame>

                <ButtonHome to="https://api.whatsapp.com/send?phone=5511945584686&text=Olá%2C%20tudo%20bem%3F" title="Entre em contato" />


              </div>


            </section >

            <section
              id="about-section"
              className={`bg-oxford-blue flex justify-center p-5 ${isMobile ? 'pt-10 pb-10' : 'pt-20 pb-20'
                }`}
            >
              <div
                className={`font-poppins w-full flex ${isMobile ? 'flex-col items-center' : 'ml-20 mr-20'
                  }`}
              >
                <div className={`${isMobile ? 'w-full mb-5' : ''}`}>
                  <img className="w-full" src="/Home/imageAbout.png" alt="" />
                </div>

                <div
                  className={`text-white flex flex-col ${!isMobile
                    ? 'justify-evenly ml-20 w-2xl max-w-3xl'
                    : ''
                    }`}
                >
                  <h1
                    className={`text-3xl font-bold mb-5 mt-3 ${!isMobile ? 'uppercase' : ''
                      }`}
                  >
                    Quem sou?
                  </h1>
                  <p className={`${isMobile ? 'text-lg' : 'text-2xl w-fit whitespace-pre-line'}`}>
                    Sou <span className="text-gigant-orange font-semibold">Fabio Bernardes</span>, professor de Educação Física e Personal Trainer apaixonado por transformar vidas através do movimento.
                  </p>
                  <p className={`${isMobile ? 'text-lg mt-5' : 'text-2xl w-fit'}`}>
                    Além de <span className="text-gigant-orange font-semibold">profissional</span>, sou marido e pai, e entendo na prática os desafios de conciliar uma rotina agitada com o <span className="text-gigant-orange font-semibold">cuidado da saúde</span>. É por isso que minha consultoria foi desenvolvida para se adaptar aos seus objetivos.
                  </p>

                  {!isMobile && (
                    <ButtonHome to="#plans-section" title="Conheça os planos" />
                  )}
                </div>
              </div>
            </section>
          </div>
          <div
            className="sticky top-0 h-dvh w-xl border-l border-white/20 overflow-auto backdrop-blur-xl"
            style={{
              top: '64px',
              height: 'calc(100dvh - 64px)',
              backgroundColor: 'rgba(12, 98, 145, 0.3)',
              backgroundImage: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.1), transparent)',
              zIndex: 40
            }}
          >
            <Toolbox />
          </div>

        </Editor>
      </div>
    </>
  )
}

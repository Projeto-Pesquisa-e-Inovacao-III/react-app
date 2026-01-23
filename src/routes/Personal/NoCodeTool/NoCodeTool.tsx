import useMobile from "../../../hooks/isMobile";
import { Editor, Frame, Element } from "@craftjs/core";
import Text from "../../../components/NoCodeToolsComponents/Text";
import { Container } from "../../../components/NoCodeToolsComponents/Container";

export default function NoCodeTool() {
  const isMobile = useMobile();

  return (
    <>
      <section
        className={
          "flex flex-col justify-center p-5 h-dvh bg-[url('/Home/bgImageMainRight.png')] bg-cover bg-center"
        }
      >

        <div className="w-fit flex flex-col justify-center items-start gap-5 mt-64 ml-20 mr-20">
          <Editor resolver={{ Text, Container }}>
            <Frame>
              <Element is={Container} canvas>
                <Element
                  is={Text}
                  type={"h1"}
                  classname="text-5xl w-[53.2%] font-poppins font-bold uppercase text-center text-white"
                  text="Bem-vindo a csf Treinamentos"
                />
              </Element>
            </Frame>
          </Editor>
        </div>
      </section >
    </>
  )
}

import { Editor, Frame, Element } from "@craftjs/core";
import { Container } from "../../../components/NoCodeToolsComponents/Container";
import Toolbox from "../../../components/NoCodeToolsComponents/Toolbox";
import EditableText from "../../../components/NoCodeToolsComponents/EditableText";
import EditableImage from "../../../components/NoCodeToolsComponents/EditableImage";
import EditableButton from "../../../components/NoCodeToolsComponents/EditableButton";
import { EditableSection } from "../../../components/NoCodeToolsComponents/EditableSection";
import EditableAccordion from "../../../components/NoCodeToolsComponents/EditableAccordion";
import { Save, Eye, Undo2, Redo2, History } from "lucide-react";
import { useEditor } from "@craftjs/core";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getNoCodeContent, createNoCodeContent } from "../../../services/noCodeService";
import PublishModal from "../../../components/Modal/PublishModal/PublishModal";
import SuccessModal from "../../../components/Modal/SuccessModal/SuccessModal";
import ErrorModal from "../../../components/Modal/ErrorModal/ErrorModal";
import useModal from "../../../hooks/useModal";
import HistoryDrawer from "../../../components/NoCodeToolsComponents/HistoryDrawer";

const TOOLBAR_BTN_CLASS = "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors";

function EditorActions({ onPreview, onPublishClick, onHistoryClick }: {
  onPreview: () => void;
  onPublishClick: () => void;
  onHistoryClick: () => void;
}) {
  const { actions, canUndo, canRedo } = useEditor((_, query) => ({
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
  }));

  return (
    <div className="flex items-center gap-3">
      <button disabled={!canUndo} onClick={() => actions.history.undo()} title="Desfazer" className={TOOLBAR_BTN_CLASS}>
        <Undo2 size={15} />
        Desfazer
      </button>
      <button disabled={!canRedo} onClick={() => actions.history.redo()} title="Refazer" className={TOOLBAR_BTN_CLASS}>
        <Redo2 size={15} />
        Refazer
      </button>
      <div className="w-px h-6 bg-white/20" />
      <button
        onClick={onHistoryClick}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
      >
        <History size={15} />
        Histórico
      </button>
      <button
        onClick={onPreview}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
      >
        <Eye size={15} />
        Preview
      </button>
      <button
        onClick={onPublishClick}
        className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm bg-[#0C6291] hover:bg-[#0a5278] text-white font-semibold transition-colors"
      >
        <Save size={15} />
        Publicar
      </button>
    </div>
  );
}

function NoCodeToolInner() {
  const { actions, query } = useEditor();
  const queryClient = useQueryClient();

  const { openModal, setOpenModal } = useModal(null, { title: "", content: "" });

  const [init, setInit] = useState({ done: false });
  const [publish, setPublish] = useState({ isOpen: false, isSaving: false });
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const resetPublish = () => setPublish({ isOpen: false, isSaving: false });

  const { data, isLoading } = useQuery({
    queryKey: ['noCodeContent'],
    queryFn: getNoCodeContent,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  useEffect(() => {
    if (!init.done && !isLoading) {
      if (data && data.content) {
        try {
          actions.deserialize(data.content);
        } catch (e) {
          console.error('Failed to deserialize content:', e);
          setOpenModal("error");
        }
      }
      setInit({ done: true });
    }
  }, [data, isLoading, actions, init.done, setOpenModal]);

  useEffect(() => {
    actions.setOptions((options) => {
      options.enabled = !isPreviewMode;
    });
  }, [isPreviewMode, actions]);

  if (isLoading && !init.done) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#051128] text-white flex-col gap-3">
        <span className="text-xl">Carregando conteúdo...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#051128]">
      <header
        className={`w-full flex-shrink-0 flex justify-between items-center px-8 h-16 border-b border-white/10 transition-all duration-500 ease-in-out ${isPreviewMode ? '-mt-16 opacity-0 pointer-events-none' : 'mt-0 opacity-100 pointer-events-auto'
          }`}
        style={{
          backgroundColor: 'rgba(5, 17, 40, 0.95)',
          backdropFilter: 'blur(12px)',
          zIndex: 50,
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-[#0C6291] flex items-center justify-center">
            <span className="text-white font-bold text-xs">NC</span>
          </div>
          <h1 className="text-white font-bold text-lg tracking-tight">NoCode Tool (BETA)</h1>
        </div>
        <EditorActions
          onPreview={() => setIsPreviewMode(true)}
          onPublishClick={() => setPublish(prev => ({ ...prev, isOpen: true }))}
          onHistoryClick={() => setHistoryOpen(true)}
        />
      </header>

      <HistoryDrawer
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onRestore={(content) => {
          try {
            actions.deserialize(content);
          } catch (e) {
            console.error('Failed to deserialize restored content:', e);
          }
        }}
        onDelete={async (deletedId) => {
          if (data?.id === deletedId) {
            try {
              const newContent = await queryClient.fetchQuery({
                queryKey: ['noCodeContent'],
                queryFn: getNoCodeContent,
              });
              if (newContent?.content) {
                actions.deserialize(newContent.content);
              }
            } catch (err) {
              console.error("Failed to load new active content after delete", err);
            }
          }
        }}
      />
      {publish.isOpen && (
        <PublishModal
          closeThen={() => setPublish(prev => ({ ...prev, isOpen: false }))}
          isSaving={publish.isSaving}
          onConfirm={async (modificationName, description) => {
            try {
              setPublish(prev => ({ ...prev, isSaving: true }));
              const json = query.serialize();
              await createNoCodeContent({ content: json, modificationName, description });
              queryClient.invalidateQueries({ queryKey: ["noCodeContent"] });
              resetPublish();
              setOpenModal("success");
            } catch (err) {
              console.error(err);
              resetPublish();
              setOpenModal("error");
            }
          }}
        />
      )}

      {openModal === "success" && (
        <SuccessModal
          closeThen={(() => setOpenModal(null)) as React.Dispatch<React.SetStateAction<boolean>>}
          title="Página publicada com sucesso!"
          content="As modificações foram salvas e estão disponíveis."
        />
      )}
      {openModal === "error" && (
        <ErrorModal
          closeThen={(() => setOpenModal(null)) as React.Dispatch<React.SetStateAction<boolean>>}
          title="Erro ao publicar"
          content="Não foi possível salvar as modificações. Tente novamente."
        />
      )}

      <div className="flex flex-1 overflow-hidden relative">
        <div className="flex-1 overflow-y-auto" style={{ minWidth: 0 }}>
          <div className="min-h-full">
            <Frame>
              <Element is={Container} canvas className="w-full">

                {/* section 1: Hero / Main */}
                <Element
                  is={EditableSection}
                  canvas
                  className="relative flex flex-col justify-center min-h-screen bg-cover bg-center overflow-hidden"
                  backgroundImage="/Home/bgImageMainRight-3.jpg"
                >
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(165deg, rgba(26, 97, 141, 1) 0%, rgba(6, 14, 25, 1) 69%)",
                      clipPath: "polygon(0 0, 43.3% 0, 57% 45%, 41% 100%, 0 100%)",
                      zIndex: 1,
                    }}
                  />
                  <Element is={Container} canvas className="relative flex flex-col items-start gap-5 ml-20 mr-20" style={{ zIndex: 2 }}>
                    <Element
                      is={EditableText}
                      tag="h1"
                      text="Bem-vindo a CSF Treinamentos"
                      className="text-7xl w-[53.2%] font-poppins font-bold uppercase text-left text-white"
                    />
                    <Element
                      is={EditableText}
                      tag="p"
                      text="A jornada para uma vida mais ativa e saudável começa aqui. Orientação profissional adaptada à sua rotina e necessidade."
                      className="text-2xl w-[53.2%] text-left font-montserrat text-white"
                    />
                    <Element
                      is={EditableButton}
                      title="Entre em contato"
                      href="https://api.whatsapp.com/send?phone=5511945584686&text=Olá%2C%20tudo%20bem%3F"
                      bgColor="#E05C00"
                      textColor="#ffffff"
                      className="w-[28%]! mt-3 text-xl rounded-2xl"
                    />
                  </Element>
                </Element>

                {/* section About / Quem sou */}
                <Element
                  is={EditableSection}
                  canvas
                  backgroundColor="#1a2e4a"
                  paddingTop="80px"
                  paddingBottom="80px"
                  className="flex justify-center px-5"
                >
                  <Element is={Container} canvas className="font-poppins w-full flex ml-20 mr-20 gap-16 items-center">
                    <Element is={Container} canvas className="w-2/4 flex-shrink-0">
                      <Element
                        is={EditableImage}
                        src="/Home/about-2.png"
                        alt="Foto de Fábio Bernardes"
                        className="rounded-lg w-full"
                      />
                    </Element>
                    <Element is={Container} canvas className="text-white flex flex-col justify-evenly gap-5">
                      <Element
                        is={EditableText}
                        tag="h2"
                        text="Quem sou?"
                        className="text-3xl font-bold uppercase"
                      />
                      <Element is={Container} canvas className="text-2xl leading-relaxed">
                        <Element is={EditableText} tag="span" text="Sou " />
                        <Element is={EditableText} tag="span" text="Fábio Bernardes" className="text-gigant-orange font-semibold" color="#E05C00" />
                        <Element is={EditableText} tag="span" text=", professor de Educação Física e Personal Trainer apaixonado por transformar vidas através do movimento." />
                      </Element>
                      <Element is={Container} canvas className="text-2xl leading-relaxed">
                        <Element is={EditableText} tag="span" text="Além de " />
                        <Element is={EditableText} tag="span" text="profissional" className="text-gigant-orange font-semibold" color="#E05C00" />
                        <Element is={EditableText} tag="span" text=", sou marido e pai, e entendo na prática os desafios de conciliar uma rotina agitada com o " />
                        <Element is={EditableText} tag="span" text="cuidado da saúde" className="text-gigant-orange font-semibold" color="#E05C00" />
                        <Element is={EditableText} tag="span" text=". É por isso que minha consultoria foi desenvolvida para se adaptar aos seus objetivos." />
                      </Element>
                      <Element
                        is={EditableButton}
                        title="Conheça os pacotes disponíveis"
                        href="#plans-section"
                        bgColor="#ffffff"
                        textColor="#000000"
                        className="w-fit mt-4 rounded-md"
                      />
                    </Element>
                  </Element>
                </Element>

                {/* section 3: Services */}
                <Element
                  is={EditableSection}
                  canvas
                  paddingTop="40px"
                  paddingBottom="40px"
                  className="px-5 bg-[#e5e7eb]!"
                >
                  <Element is={Container} canvas className="ml-20 mr-20">
                    <Element is={Container} canvas className="flex justify-center items-center uppercase mb-10">
                      <Element
                        is={EditableText}
                        tag="h2"
                        text="Bora treinar com quem entende e se importa"
                        className="text-8xl font-bebas leading-none text-center border-b-8"
                      />
                    </Element>

                    {/* card 1 — text left, image right (isReverse) */}
                    <Element is={Container} canvas className="flex flex-row-reverse items-center gap-1 mb-10 bg-indigo rounded-lg overflow-hidden">
                      <Element is={Container} canvas className="w-[550px] shrink-0 overflow-hidden p-10 bg-white flex items-center justify-center">
                        <Element
                          is={EditableImage}
                          src="/Home/bg-1-2.jpg"
                          alt="Serviço 1"
                          className="w-full h-[420px] object-cover object-center rounded-xl"
                        />
                      </Element>
                      <Element is={Container} canvas className="flex-1 text-center text-white flex justify-center items-center flex-col p-12 pb-20 pt-20">
                        <Element
                          is={EditableText}
                          tag="h3"
                          text="Um guia para a saúde em todas as idades"
                          className="text-4xl font-bold text-white mb-4"
                        />
                        <Element
                          is={EditableText}
                          tag="p"
                          text="Da infância à melhor idade, a saúde é nossa prioridade em cada etapa! Com um olhar atento às necessidades de cada um, oferecemos orientação personalizada para crianças, jovens, adultos e idosos."
                          className="text-white text-2xl"
                        />
                      </Element>
                    </Element>

                    {/* card 2 — image left, text right, white + blue right bar */}
                    <Element is={Container} canvas className="gradient-white-with-blue-bar flex flex-row items-center gap-1 mb-10 rounded-lg overflow-hidden">
                      <Element is={Container} canvas className="w-[550px] shrink-0 overflow-hidden p-10 bg-white flex items-center justify-center">
                        <Element
                          is={EditableImage}
                          src="/Home/cardImage2.png"
                          alt="Serviço 2"
                          className="w-full h-[420px] object-cover object-center rounded-xl"
                        />
                      </Element>
                      <Element is={Container} canvas className="flex-1 text-center text-oxford-blue flex justify-center items-center flex-col p-12 pb-20 pt-20">
                        <Element
                          is={EditableText}
                          tag="h3"
                          text="Cuidando da sua saúde e inspirando sua família a fazer o mesmo"
                          className="text-4xl font-bold text-oxford-blue mb-4"
                        />
                        <Element
                          is={EditableText}
                          tag="p"
                          text="Sua saúde é um presente que pode inspirar a todos ao seu redor, especialmente a sua família! Com nosso suporte, você encontrará o equilíbrio perfeito para se cuidar e motivar seus entes queridos a adotarem hábitos saudáveis."
                          className="text-oxford-blue text-2xl"
                        />
                      </Element>
                    </Element>

                    {/* card 3 — text left, image right (isReverse) */}
                    <Element is={Container} canvas className="flex flex-row-reverse items-center gap-1 bg-indigo rounded-lg overflow-hidden">
                      <Element is={Container} canvas className="w-[550px] shrink-0 overflow-hidden p-10 bg-white flex items-center justify-center">
                        <Element
                          is={EditableImage}
                          src="/Home/cardImage3.png"
                          alt="Serviço 3"
                          className="w-full h-[420px] object-cover object-center rounded-xl"
                        />
                      </Element>
                      <Element is={Container} canvas className="flex-1 text-center text-white flex justify-center items-center flex-col p-12 pb-20 pt-20">
                        <Element
                          is={EditableText}
                          tag="h3"
                          text="Muito além do físico: um treinador que cuida de você"
                          className="text-4xl font-bold text-white mb-4"
                        />
                        <Element
                          is={EditableText}
                          tag="p"
                          text="Aqui, você encontra um personal que realmente se importa com o seu bem-estar completo, da mente ao corpo. Venha treinar em um ambiente acolhedor, onde seus objetivos são levados a sério e seu progresso é celebrado a cada passo."
                          className="text-white text-2xl"
                        />
                      </Element>
                    </Element>
                  </Element>
                </Element>

                {/* section 4: FAQ */}
                <Element
                  is={EditableSection}
                  canvas
                  backgroundColor="#1a2e4a"
                  paddingTop="40px"
                  paddingBottom="40px"
                  className="px-5"
                >
                  
                  <Element is={Container} canvas className="bg-white rounded-lg p-8 ml-20 mr-20">
                    <Element
                      is={EditableText}
                      tag="h2"
                      text="Perguntas Frequentes"
                      className="text-black text-2xl mb-5 font-bold"
                    />
                    <Element is={Container} canvas>
                      <Element 
                        is={EditableAccordion} 
                        title="A consultoria é totalmente online?" 
                        content="A consultoria é totalmente online, realizada via WhatsApp. Alguns pacotes incluem aulas presenciais com o personal, nas quais você recebe acompanhamento e orientações práticas durante o treino." 
                      />
                      <Element 
                        is={EditableAccordion} 
                        title="Quais as formas de pagamento disponíveis?" 
                        content="Atualmente, o pagamento é feito via PIX. Alguns bancos digitais oferecem a opção de parcelamento diretamente pelo aplicativo." 
                      />
                      <Element 
                        is={EditableAccordion} 
                        title="A consultoria é para todos ou apenas para quem já treina?" 
                        content="A consultoria é indicada para todos os perfis, inclusive para quem nunca treinou ou não tem experiência com atividades físicas." 
                      />
                      <Element 
                        is={EditableAccordion} 
                        title="Tenho direito a reembolso?" 
                        content="Sim. Você pode solicitar o reembolso em até 7 (sete) dias corridos após a contratação. Esse prazo segue o Código de Defesa do Consumidor para compras realizadas online." 
                      />
                    </Element>
                  </Element>
                </Element>

              </Element>
            </Frame>
          </div>
        </div>

        {/* aside */}
        <div
          className={`flex-shrink-0 w-80 border-l border-white/10 overflow-hidden flex flex-col transition-all duration-500 ease-in-out ${isPreviewMode ? '-mr-80 opacity-0 pointer-events-none' : 'mr-0 opacity-100 pointer-events-auto'
            }`}
          style={{
            backgroundColor: 'rgba(5, 17, 40, 0.85)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <Toolbox onPreview={() => setIsPreviewMode(true)} />
        </div>

        {/* Voltar animado */}
        <div
          className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ease-in-out ${isPreviewMode ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'
            }`}
        >
          <button
            onClick={() => setIsPreviewMode(false)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-colors hover:opacity-90 shadow-lg"
            style={{ backgroundColor: 'rgba(5, 17, 40)' }}
          >
            Voltar ao painel de controle
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NoCodeTool() {
  return (
    <Editor
      resolver={{
        Container,
        EditableText,
        EditableImage,
        EditableButton,
        EditableSection,
        EditableAccordion,
      }}
    >
      <NoCodeToolInner />
    </Editor>
  );
}
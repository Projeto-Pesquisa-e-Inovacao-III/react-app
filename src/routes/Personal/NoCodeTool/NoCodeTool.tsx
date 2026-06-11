import { Editor, Frame, Element } from "@craftjs/core";
import { Container } from "../../../components/NoCodeToolsComponents/Container";
import Toolbox from "../../../components/NoCodeToolsComponents/Toolbox";
import EditableText from "../../../components/NoCodeToolsComponents/EditableText";
import EditableImage from "../../../components/NoCodeToolsComponents/EditableImage";
import EditableButton from "../../../components/NoCodeToolsComponents/EditableButton";
import { EditableSection } from "../../../components/NoCodeToolsComponents/EditableSection";
import { Save, Eye, Undo2, Redo2, History } from "lucide-react";
import { useEditor } from "@craftjs/core";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getNoCodeContent, createNoCodeContent, updateNoCodeContent, uploadNoCodeImage } from "../../../services/noCodeService";
import PublishModal from "../../../components/Modal/PublishModal/PublishModal";
import SuccessModal from "../../../components/Modal/SuccessModal/SuccessModal";
import ErrorModal from "../../../components/Modal/ErrorModal/ErrorModal";
import useModal from "../../../hooks/useModal";
import HistoryDrawer from "../../../components/NoCodeToolsComponents/HistoryDrawer";
import EditableAccordion from "../../../components/NoCodeToolsComponents/EditableAccordion";
import { BASE_URL } from "../../../system";
import PageLoader from "../../../components/PageLoader/PageLoader";

function base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

function sanitizeContent(content: string): string {
  return content.replace(
    /\/api\/usuarios\/foto\/\/images\/([^"'\s]+)/g,
    (_match, filename) => `${BASE_URL}/api/usuarios/foto/${filename}`
  );
}

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

  const { openModal, setOpenModal, textModal, setTextModal } = useModal(null, { title: "", content: "" });

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
    actions.setOptions((options) => {
      options.enabled = !isPreviewMode;
    });
  }, [isPreviewMode, actions]);

  if (isLoading) return <PageLoader />;

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
            <button onClick={() => window.location.href = '/'} className="cursor-pointer text-white font-bold text-xs">CSF</button>
          </div>
          <h1 className="text-white font-bold text-lg tracking-tight">Editor de Página CSF</h1>
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
              const serialized = query.serialize();
              const parsed = JSON.parse(serialized);

              // Step 1: create the NoCode record first so the API can associate images with it
              const created = await createNoCodeContent({
                content: serialized,
                modificationName,
                description,
              });

              // Step 2: upload base64 images now that a NoCode record exists
              let hasImages = false;
              for (const nodeId in parsed) {
                const node = parsed[nodeId];
                const props = node.props;
                const displayName = node.displayName;

                const imageProps = ['src', 'backgroundImage'];
                for (const propName of imageProps) {
                  const value = props[propName];
                  if (typeof value === 'string' && value.startsWith('data:image')) {
                    const file = base64ToFile(value, `upload_${nodeId}_${propName}.png`);
                    const section = displayName === 'Seção' ? 'Seção' : 'Imagem';
                    const { url } = await uploadNoCodeImage(file, section);
                    props[propName] = url.startsWith('http') ? url : `${BASE_URL}/api/usuarios/foto/${url}`;
                    hasImages = true;
                  }
                }
              }

              // Step 3: if images were uploaded, update the record with the final URLs
              if (hasImages) {
                const finalJson = JSON.stringify(parsed);
                console.log("Updating record with final JSON (server URLs):", finalJson);
                await updateNoCodeContent({
                  id: created.id,
                  content: finalJson,
                  modificationName,
                  description,
                });
              }

              // Small delay to ensure DB consistency before refetch
              await new Promise(resolve => setTimeout(resolve, 500));

              // Invalidate in background — a refetch failure should not cancel the success modal
              queryClient.invalidateQueries({ queryKey: ["noCodeContent"] }).catch((err) => {
                console.warn("Background refetch failed after publish:", err);
              });

              setTextModal({ title: "", content: "" });
              resetPublish();
              setOpenModal("success");
            } catch (err: unknown) {
              console.error("[NoCodeTool] publish error:", err);
              setTextModal({ title: "", content: "" });
              resetPublish();
              setOpenModal("error");
            }
          }}
        />
      )}

      {openModal === "success" && (
        <SuccessModal
          closeThen={(() => {
            setOpenModal(null);
            setTextModal({ title: "", content: "" });
          }) as React.Dispatch<React.SetStateAction<boolean>>}
          title={textModal.title || "Página publicada com sucesso!"}
          content={textModal.content || "As modificações foram salvas e estão disponíveis."}
        />
      )}
      {openModal === "error" && (
        <ErrorModal
          closeThen={(() => {
            setOpenModal(null);
            setTextModal({ title: "", content: "" });
          }) as React.Dispatch<React.SetStateAction<boolean>>}
          title={textModal.title || "Erro ao publicar"}
          content={textModal.content || "Não foi possível salvar as modificações. Tente novamente."}
        />
      )}

      <div className="flex flex-1 overflow-hidden relative">
        <div className="flex-1 overflow-y-auto" style={{ minWidth: 0 }}>
          <div className="min-h-full">
            <Frame data={data?.content ? sanitizeContent(data.content) : undefined}>
              <Element is={Container} canvas className="w-full">

                {/* section 1: Hero / Main */}
                <Element
                  is={EditableSection}
                  canvas
                  className="relative flex flex-col justify-center h-dvh bg-cover bg-center overflow-hidden"
                  backgroundImage="/Home/bg-1-1-EDIT.jpg"
                >
                  <div
                    className="absolute inset-0 pointer-events-none"
                  />
                  <Element is={Container} canvas className="relative w-fit flex flex-col justify-center items-start gap-5 ml-20 mr-20" style={{ zIndex: 2 }}>
                    <Element
                      is={EditableText}
                      tag="h1"
                      text="Bem-vindo a CSF Treinamentos"
                      className="text-8xl text-[5.5rem] w-[53.2%] font-poppins font-bold uppercase text-left text-white"
                    />
                    <Element
                      is={EditableText}
                      tag="p"
                      text="A jornada para uma vida mais ativa e saudável começa aqui. Orientação profissional adaptada à sua rotina e necessidade."
                      className="text-2xl w-[53.2%] text-left font-montserrat text-white"
                    />
                    <Element is={Container} canvas className="w-2/4 h-1/3!">
                      <Element
                        is={EditableButton}
                        title="Entre em contato"
                        href="https://api.whatsapp.com/send?phone=5511945584686&text=Olá%2C%20tudo%20bem%3F"
                        bgColor="#f26430"
                        textColor="#ffffff"
                        className="w-[53.2%] h-full! mt-3! rounded-2xl! text-xl"
                      />
                    </Element>
                  </Element>
                </Element>

                {/* section About / Quem sou */}
                <Element
                  is={EditableSection}
                  canvas
                  id="about-section"
                  backgroundColor="#051128"
                  paddingTop="80px"
                  paddingBottom="80px"
                  className="scroll-mt-20 flex justify-center px-5"
                >
                  <Element is={Container} canvas className="font-poppins w-full flex ml-20 mr-20">
                    <Element is={Container} canvas className="w-2/4 not-2xl:w-full">
                      <Element
                        is={EditableImage}
                        src="/Home/about-2.png"
                        alt="Foto de Fábio Bernardes"
                        className="rounded-lg w-full"
                      />
                    </Element>
                    <Element is={Container} canvas className="text-white flex flex-col justify-evenly ml-20 w-2xl max-w-3xl">
                      <Element
                        is={EditableText}
                        tag="h1"
                        text="Quem sou?"
                        className="text-3xl font-bold mb-5 mt-3 uppercase"
                      />
                      <Element is={Container} canvas className="text-2xl w-fit whitespace-pre-line">
                        <Element is={EditableText} tag="span" text="Sou " />
                        <Element is={EditableText} tag="span" text="Fábio Bernardes" className="text-gigant-orange font-semibold" color="#f26430" />
                        <Element is={EditableText} tag="span" text=", professor de Educação Física e Personal Trainer apaixonado por transformar vidas através do movimento." />
                      </Element>
                      <Element is={Container} canvas className="text-2xl w-fit">
                        <Element is={EditableText} tag="span" text="Além de " />
                        <Element is={EditableText} tag="span" text="profissional" className="text-gigant-orange font-semibold" color="#f26430" />
                        <Element is={EditableText} tag="span" text=", sou marido e pai, e entendo na prática os desafios de conciliar uma rotina agitada com o " />
                        <Element is={EditableText} tag="span" text="cuidado da saúde" className="text-gigant-orange font-semibold" color="#f26430" />
                        <Element is={EditableText} tag="span" text=". É por isso que minha consultoria foi desenvolvida para se adaptar aos seus objetivos." />
                      </Element>
                      <Element
                        is={EditableButton}
                        title="Conheça os pacotes disponíveis"
                        href="#plans-section"
                        bgColor="#ffffff"
                        textColor="#000000"
                        className="flex justify-center items-center min-h-12 w-[53.2%] mt-10 font-semibold rounded-md"
                      />
                    </Element>
                  </Element>
                </Element>

                {/* section 3: Services */}
                <Element
                  is={EditableSection}
                  canvas
                  id="services-section"
                  paddingTop="40px"
                  paddingBottom="40px"
                  className="scroll-mt-20 mt-10 px-5 bg-[#e5e7eb]!"
                >
                  <Element is={Container} canvas className="ml-20 mr-20">
                    <Element is={Container} canvas className="flex justify-center items-center uppercase border-amber-600 wrapper-content mb-10">
                      <Element
                        is={EditableText}
                        tag="h1"
                        text="Bora treinar com quem entende e se importa"
                        className="ml-auto mr-auto mt-0 mb-0 font-bebas leading-none text-8xl text-center border-b-8 line-clamp-1"
                      />
                    </Element>

                    {/* card 1 — text left, image right (isReverse) */}
                    <Element is={Container} canvas className="bg-indigo flex flex-row-reverse gap-1 mb-10 rounded-lg overflow-hidden">
                      <Element is={Container} canvas className="w-[550px] shrink-0 overflow-hidden p-10 bg-white flex items-center justify-center h-auto">
                        <Element
                          is={EditableImage}
                          src="/Home/bg-1-2.jpg"
                          alt="Serviço 1"
                          className="w-full h-[420px] object-cover object-center rounded-xl"
                        />
                      </Element>
                      <Element is={Container} canvas className="flex-1 text-center text-white flex justify-center items-center flex-col p-12 pb-20 pt-20 pl-12 pr-12">
                        <Element
                          is={EditableText}
                          tag="h1"
                          text="Um guia para a saúde em todas as idades"
                          className="text-4xl font-bold mb-4"
                        />
                        <Element
                          is={EditableText}
                          tag="p"
                          text="Da infância à melhor idade, a saúde é nossa prioridade em cada etapa! Com um olhar atento às necessidades de cada um, oferecemos orientação personalizada para crianças, jovens, adultos e idosos."
                          className="text-2xl"
                        />
                      </Element>
                    </Element>

                    {/* card 2 — image left, text right, white + blue right bar */}
                    <Element is={Container} canvas className="gradient-white-with-blue-bar flex flex-row gap-1 mb-10 rounded-lg overflow-hidden">
                      <Element is={Container} canvas className="w-[550px] shrink-0 overflow-hidden p-10 bg-white flex items-center justify-center h-auto">
                        <Element
                          is={EditableImage}
                          src="/Home/cardImage2.png"
                          alt="Serviço 2"
                          className="w-full h-[420px] object-cover object-center rounded-xl"
                        />
                      </Element>
                      <Element is={Container} canvas className="flex-1 text-center text-oxford-blue flex justify-center items-center flex-col p-12 pb-20 pt-20 pl-12 pr-24!">
                        <Element
                          is={EditableText}
                          tag="h1"
                          text="Cuidando da sua saúde e inspirando sua família a fazer o mesmo"
                          className="text-4xl font-bold mb-4"
                        />
                        <Element
                          is={EditableText}
                          tag="p"
                          text="Sua saúde é um presente que pode inspirar a todos ao seu redor, especialmente a sua família! Com nosso suporte, você encontrará o equilíbrio perfeito para se cuidar e motivar seus entes queridos a adotarem hábitos saudáveis."
                          className="text-2xl"
                        />
                      </Element>
                    </Element>

                    {/* card 3 — text left, image right (isReverse) */}
                    <Element is={Container} canvas className="bg-indigo flex flex-row-reverse gap-1 mb-10 rounded-lg overflow-hidden">
                      <Element is={Container} canvas className="w-[550px] shrink-0 overflow-hidden p-10 bg-white flex items-center justify-center h-auto">
                        <Element
                          is={EditableImage}
                          src="/Home/cardImage3.png"
                          alt="Serviço 3"
                          className="w-full h-[420px] object-cover object-center rounded-xl"
                        />
                      </Element>
                      <Element is={Container} canvas className="flex-1 text-center text-white flex justify-center items-center flex-col p-12 pb-20 pt-20 pl-12 pr-12">
                        <Element
                          is={EditableText}
                          tag="h1"
                          text="Muito além do físico: um treinador que cuida de você"
                          className="text-4xl font-bold mb-4"
                        />
                        <Element
                          is={EditableText}
                          tag="p"
                          text="Aqui, você encontra um personal que realmente se importa com o seu bem-estar completo, da mente ao corpo. Venha treinar em um ambiente acolhedor, onde seus objetivos são levados a sério e seu progresso é celebrado a cada passo."
                          className="text-2xl"
                        />
                      </Element>
                    </Element>
                  </Element>
                </Element>

                {/* section 4: FAQ */}
                <Element
                  is={EditableSection}
                  canvas
                  backgroundColor="#093A5D"
                  paddingTop="40px"
                  paddingBottom="40px"
                  className="px-5"
                >

                  <Element is={Container} canvas className="text-black bg-white rounded-lg p-5 ml-20 mr-20">
                    <Element
                      is={EditableText}
                      tag="h2"
                      text="Perguntas Frequentes"
                      className="text-black text-2xl mb-5"
                    />
                    <Element is={Container} canvas>
                      <Element
                        is={EditableAccordion}
                        title="A consultoria é totalmente online?"
                        content="A consultoria é totalmente online, realizada via WhatsApp. Alguns pacotes incluem aulas presenciais com o personal, nas quais você recebe acompanhamento e orientações práticas durante o treino."
                      />
                      <Element
                        is={EditableAccordion}
                        title="Quais as formas de pagamento disponivéis?"
                        content="Atualmente, o pagamento é feito via PIX. Alguns bancos digitais oferecem a opção de parcelamento diretamente pelo aplicativo."
                      />
                      <Element
                        is={EditableAccordion}
                        title="A consultoria é para todos ou apenas para quem já treina?"
                        content="A consultoria é indicada para todos os perfis, inclusive para quem nunca treinou ou não tem experiência com atividades físicas."
                      />
                      <Element
                        is={EditableAccordion}
                        title="Quais as formas de contato com o personal?"
                        content="O contato é realizado principalmente pelo WhatsApp, além de telefone e Instagram."
                      />
                      <Element
                        is={EditableAccordion}
                        title="Como funciona a consultoria após a contratação do pacote?"
                        content="Após a contratação, o personal entrará em contato para entender seu perfil, seus objetivos e sua experiência com treinos. Dependendo do pacote contratado, você terá direito a aulas presenciais mensais para agendamento."
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
          <Toolbox
            onPreview={() => setIsPreviewMode(true)}
            onError={(title, msg) => {
              setTextModal({ title, content: msg });
              setOpenModal("error");
            }}
          />
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
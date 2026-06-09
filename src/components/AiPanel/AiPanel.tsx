import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Sparkles, X } from "lucide-react";
import classNames from "classnames";
import styles from "./AiPanel.module.css";

type AiMessage = { role: "user" | "ai"; text: string };

type AnaliseIa = {
    intro: string;
    tips: { title: string; text: string }[];
};

type AiPanelProps = {
    isOpen: boolean;
    isClosing: boolean;
    isMobile: boolean;
    panelRef: React.RefObject<HTMLDivElement | null>;
    onClose: () => void;
    /** Callback chamado pelo FAB no mobile para abrir o painel */
    onOpen?: () => void;
    /** Última observação/nota do agendamento */
    note?: string;
    analiseIa?: AnaliseIa | null;
};

export default function AiPanel({
    isOpen,
    isClosing,
    isMobile,
    panelRef,
    onClose,
    // onOpen,
    note,
    analiseIa,
}: AiPanelProps) {
    const [aiMessages] = useState<AiMessage[]>([]);
    const [aiLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [aiMessages]);

    return (
        <>
            {(isOpen || isClosing) && (
                <>
                    <div className={classNames(styles.aiBackdrop, { [styles.aiBackdropExit]: isClosing })} />
                    <div
                        ref={panelRef}
                        className={classNames(styles.aiPanel, {
                            [styles.aiPanelMobile]: isMobile,
                            [styles.aiPanelExit]: isClosing,
                        })}
                    >
                        <div className={styles.aiPanelHeader}>
                            <div className={styles.aiPanelHeaderLeft}>
                                <div className={styles.aiIconBadge}>
                                    <Sparkles size={18} />
                                </div>
                                <div>
                                    <div className={styles.aiPanelTitle}>Dica do Treinador IA</div>
                                    <div className={styles.aiPanelSubtitle}>Análise personalizada</div>
                                </div>
                            </div>
                            <button className={styles.aiCloseBtn} onClick={onClose} aria-label="Fechar painel">
                                <X size={18} />
                            </button>
                        </div>

                        <div className={styles.aiPanelBody}>
                            <div className={styles.aiAnalysisSection}>
                                <p className={styles.aiAnalysisLabel}>Análise do último treino:</p>
                                <div className={styles.aiQuote}>
                                    <em>"{note || "Sem observações registradas"}"</em>
                                </div>
                                {analiseIa ? (
                                    <>
                                        <p className={styles.aiAnalysisText}>{analiseIa.intro}</p>
                                        <ul className={styles.aiTipsList}>
                                            {analiseIa.tips.map((tip, i) => (
                                                <li key={i} className={styles.aiTipItem}>
                                                    <span className={styles.aiTipDot} />
                                                    <span>
                                                        <strong>{tip.title}</strong> {tip.text}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                ) : (
                                    <p className={styles.aiAnalysisText}>
                                        A IA está analisando os dados do treino para gerar dicas personalizadas.
                                        Volte em breve!
                                    </p>
                                )}
                            </div>

                            {aiMessages.length > 0 && (
                                <div className={styles.aiChat}>
                                    {aiMessages.map((msg, i) => (
                                        <div
                                            key={i}
                                            className={classNames(styles.aiChatBubble, {
                                                [styles.aiChatBubbleUser]: msg.role === "user",
                                                [styles.aiChatBubbleAi]: msg.role === "ai",
                                            })}
                                        >
                                            {msg.text}
                                        </div>
                                    ))}
                                    {aiLoading && (
                                        <div className={classNames(styles.aiChatBubble, styles.aiChatBubbleAi, styles.aiLoading)}>
                                            <span /><span /><span />
                                        </div>
                                    )}
                                    <div ref={chatEndRef} />
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* FAB — visível no mobile quando o painel está fechado */}
            {/* isMobile && !isOpen && onOpen && (
                <button className={styles.aiFab} onClick={onOpen} aria-label="Abrir dicas do Treinador IA">
                    <Sparkles size={22} color="#2e5580" />
                </button>
            ) */}
        </>
    );
}

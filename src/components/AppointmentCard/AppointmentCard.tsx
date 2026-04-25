import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import { Check, RefreshCw, X, MapPin, Calendar, Clock } from "lucide-react";
import styles from "./AppointmentCard.module.css";
import { TypeContext } from "../../App";
import { useContext } from "react";
import UserAvatar from "../UserAvatar/UserAvatar";

const STATUS_CONFIG = {
  APROVADO: { label: "Marcado", variant: "confirmed" },
  PENDENTE_CLIENTE_APROVACAO: { label: "Pendente de confirmação", variant: "pending" },
  PENDENTE_PERSONAL_APROVACAO: { label: "Aguardando personal", variant: "pending" },
  CONCLUIDO: { label: "Concluído", variant: "completed" },
  PENDENTE_PERSONAL_CONCLUIR: { label: "Pendente de conclusão", variant: "pending" },
  CANCELADO_CLIENTE: { label: "Cancelado pelo aluno", variant: "cancelled" },
  CANCELADO_PERSONAL: { label: "Cancelado pelo personal", variant: "cancelled" },
  AUSENCIA_CLIENTE: { label: "Ausência do aluno", variant: "cancelled" },
  AUSENCIA_PERSONAL: { label: "Ausência do personal", variant: "cancelled" },
};

const PENDING_STATUSES = [
  "PENDENTE_PERSONAL_APROVACAO",
  "PENDENTE_PERSONAL_CONCLUIR",
];

const PENDING = [
  "PENDENTE_CLIENTE_APROVACAO",
];


type Props = {
  agendamentoId: number;
  status: keyof typeof STATUS_CONFIG;
  name: string;
  photoUrl?: string;
  date: string;
  type: string;
  address: string;
  time: string;
  isMobile?: boolean;
  onConfirm?: () => void;
  onReschedule?: () => void;
  onCancel?: () => void;
};

export function AppointmentCard(props: Props) {
  const { isMobile = false, onConfirm, onReschedule, onCancel } = props;
  const nav = useNavigate();
  const typeContext = useContext(TypeContext);


  const isPendingPersonal = PENDING_STATUSES.includes(props.status);
  const isPendingStudent = PENDING.includes(props.status);

  function handleNavigateToDetail() {
    nav(`/schedule-details?id=${props.agendamentoId}`);
  }

  function stopPropagation(fn?: () => void) {
    return (e: React.MouseEvent) => {
      e.stopPropagation();
      fn?.();
    };
  }

  return (
    <div
      className={classNames(styles.sessionCard, {
        [styles.sessionCardMobile]: isMobile,
      })}
      onClick={handleNavigateToDetail}
      role="button"
      tabIndex={0}
    >
      <div className={styles.sessionCardHeader}>
        <span
          className={classNames(
            styles.badge,
            styles[`badge_${STATUS_CONFIG[props.status].variant}` as keyof typeof styles]
          )}
        >
          <span className={styles.badgeDot} />
          {STATUS_CONFIG[props.status].label}
        </span>
        <span className={styles.sessionCardStatus}>{props.type}</span>
      </div>

      <div className={styles.sessionCardInfo}>
        <div className={classNames(styles.sessionCardLeft, {
          [styles.sessionCardLeftMobile]: isMobile,
        })}>
          <div className={styles.sessionCardUser}>
            <UserAvatar
            withUsernameClassName="w-10! h-10!"
              userName={props.name}
              foto={props.photoUrl}
            />

            <div style={{ minWidth: 0 }}>
              <p className={styles.sessionCardName}>{props.name}</p>
              <div className={styles.sessionCardAddress}>
                <MapPin className={styles.metaIcon} />
                {props.address}
              </div>
            </div>

          </div>
        </div>

        <div
          className={classNames(styles.sessionCardDivider, {
            [styles.sessionCardDividerMobile]: isMobile,
          })}
        />

        <div
          className={classNames(styles.sessionCardRight, {
            [styles.sessionCardRightMobile]: isMobile,
          })}
        >
          <div className={styles.sessionCardDate}>
            <Calendar className={styles.metaIcon} />
            {props.date}
          </div>

          <div className={styles.sessionCardTime}>
            <Clock className={styles.metaIcon} />
            {props.time}
          </div>
        </div>

      </div>

      {((isPendingPersonal && typeContext?.type?.includes("personal")) || (isPendingStudent && typeContext?.type?.includes("aluno")) || props.status === "APROVADO") && (
        <div className={styles.sessionCardActions}>
          {props.status !== "APROVADO" && (
            <button
              className={classNames(styles.actionBtn, styles.actionConfirm)}
              onClick={stopPropagation(onConfirm)}
            >
              <Check size={12} />
              Confirmar
            </button>
          )}
          <button
            className={styles.actionBtn}
            onClick={stopPropagation(onReschedule)}
          >
            <RefreshCw size={12} />
            Reagendar
          </button>
          <button
            className={classNames(styles.actionBtn, styles.actionCancel)}
            onClick={stopPropagation(onCancel)}
          >
            <X size={12} />
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}
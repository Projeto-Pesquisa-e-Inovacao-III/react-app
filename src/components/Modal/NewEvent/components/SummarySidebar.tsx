import React from 'react';
import classnames from 'classnames';
import { Calendar, MapPin, Info } from 'lucide-react';
import { differenceInYears, parse } from 'date-fns';
import UserAvatar from '../../../UserAvatar/UserAvatar';
import InformationCard from '../InformationCard/InformationCard';
import Select from '../../../Select/Select';
import styles from '../NewEvent.module.css';

type SummarySidebarProps = {
    isMobile: boolean;
    step: number;
    typeUser?: string[];
    appoitmentData: any;
    personalList: any;
    formattedDate: any;
    selectedType: string;
    setSelectedType: (type: string) => void;
    scheduleTypes: any[];
    openSelectId: string | null;
    setOpenSelectId: (id: string | null) => void;
    isReschedule?: boolean;
    selectedPersonal?: any;
    personalOptions?: any[];
    handlePersonalChange?: (val: string | number) => void;
};

export const SummarySidebar: React.FC<SummarySidebarProps> = ({
    isMobile,
    step,
    typeUser,
    appoitmentData,
    personalList,
    formattedDate,
    selectedType,
    setSelectedType,
    scheduleTypes,
    openSelectId,
    setOpenSelectId,
    isReschedule,
    selectedPersonal,
    personalOptions,
    handlePersonalChange
}) => {
    if (isMobile) return null;

    return (
        <div className={`p-4 py-7 bg-gray-100 border-r border-gray-300 sticky left-0 top-0 flex ${step === 2 && "gap-4"} ${step === 1 && "justify-between"} flex-col w-lg`} style={{ zIndex: 1000 }}>
            {typeUser?.includes("personal") ? (
                <InformationCard
                    icon={<UserAvatar userName={appoitmentData ? appoitmentData.aluno?.nome : ""} foto={appoitmentData ? appoitmentData.aluno?.avatarUrl : ""} />}
                    title="Aluno"
                    subtitle={appoitmentData ? appoitmentData.aluno?.nome : ""}
                    subtitle2={`Idade: ${appoitmentData ? appoitmentData.aluno?.idade : "N/A"} anos`}
                />
            ) : (
                <>
                    {step === 2 && (
                        <h1 className={classnames(styles.summaryTitle, { [styles.summaryTitleMobile]: isMobile })}>
                            Resumo do agendamento
                        </h1>
                    )}
                    <InformationCard
                        icon={<UserAvatar useUserImage={true} foto={selectedPersonal?.caminhoFoto} userName={selectedPersonal?.nome} />}
                        title="Personal Trainer"
                        subtitle={selectedPersonal?.nome || ""}
                        subtitle2={selectedPersonal?.dataNascimento ? `${differenceInYears(new Date(), parse(selectedPersonal?.dataNascimento, "yyyy-MM-dd", new Date()))} anos` : ""}
                        options={step === 1 ? personalOptions : undefined}
                        selectedValue={step === 1 ? selectedPersonal?.id : undefined}
                        onOptionChange={step === 1 ? handlePersonalChange : undefined}
                    />
                </>
            )}
            {step === 2 && (
                <>
                    <InformationCard
                        icon={<Calendar />}
                        title="Data e Horário"
                        subtitle={formattedDate?.datePart || ""}
                        subtitle2={formattedDate?.timePart || ""}
                    />
                    <InformationCard
                        icon={<MapPin fill="#000" color="#e2e8f0" />}
                        title="Tipo de aula"
                        subtitle={selectedType}
                    />
                </>
            )}
            {step === 1 && !isReschedule && (
                <div className={classnames(styles.wrappeSelects, { [styles.wrappeSelectsMobile]: isMobile })}>
                    <div className={classnames(styles.inputGroup, { [styles.inputGroupMobile]: isMobile })}>
                        <Select
                            defaultValue="PRESENCIAL"
                            id="type-select"
                            openSelectId={openSelectId}
                            setOpenSelectId={setOpenSelectId}
                            onSelectStatusChange={setSelectedType}
                            values={scheduleTypes}
                            containerClassName="w-full!"
                            triggerClassName="p-3 w-full!"
                            selectWrapperClassName="bg-white! rounded-xl! w-full!"
                            selectPlaceholder="Selecione o tipo"
                            labelClassName="text-slate-500! font-bold text-sm uppercase"
                            label="Tipo de Atendimento"
                            showSelectAll={false}
                            showSearchInput={false}
                        />
                    </div>
                </div>
            )}
            {step === 1 && (
                <div className="mt-auto hidden md:block">
                    <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20">
                        <div className="flex items-start gap-2 text-primary">
                            <span className="material-icons-round text-sm mt-0.5"><Info size={16} /></span>
                            <p className="text-xs leading-relaxed">Selecione uma data e horário disponível para prosseguir com seu agendamento.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

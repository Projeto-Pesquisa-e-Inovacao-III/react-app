import React from 'react';
import type { Dispatch, SetStateAction } from 'react';
import classnames from 'classnames';
import { format, parseISO, differenceInYears, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock, Sun, Sunset, SunMoon } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import CalendarMonthStyled from '../../../Calendars/CalendarMonthStyled/CalendarMonthStyled';
import SmallerButton from '../../../SmallerButton/SmallerButton';
import UserAvatar from '../../../UserAvatar/UserAvatar';
import InformationCard from '../InformationCard/InformationCard';
import Select from '../../../Select/Select';
import styles from '../NewEvent.module.css';

type DateTimeStepProps = {
    isMobile: boolean;
    isReschedule?: boolean;
    newEventDate: string;
    setNewEventDate: Dispatch<SetStateAction<string>>;
    clickedDate?: string;
    insertedEvents: any[];
    availabilityHoursTomorrow: any;
    tomorrow: string;
    disabledDays: string[];
    availabilityHours: any;
    selectedTimeOfDay: string | null;
    setSelectedTimeOfDay: (time: string) => void;
    newEventStartHour?: string;
    handleButtonClick: (hour: string | boolean) => void;
    handleStepChange: (step: number) => void;
    buttonTitle?: string;
    isValid: boolean;
    // Mobile-specific props
    typeUser?: string[];
    appoitmentData?: any;
    personalList?: any;
    setSelectedType: (type: string) => void;
    scheduleTypes: any[];
    openSelectId: string | null;
    setOpenSelectId: (id: string | null) => void;
    selectedPersonal?: any;
    personalOptions?: any[];
    handlePersonalChange?: (val: string | number) => void;
};

export const DateTimeStep: React.FC<DateTimeStepProps> = ({
    isMobile,
    isReschedule,
    newEventDate,
    setNewEventDate,
    clickedDate,
    insertedEvents,
    availabilityHoursTomorrow,
    tomorrow,
    disabledDays,
    availabilityHours,
    selectedTimeOfDay,
    setSelectedTimeOfDay,
    newEventStartHour,
    handleButtonClick,
    handleStepChange,
    buttonTitle,
    isValid,
    typeUser,
    appoitmentData,
    personalList,
    setSelectedType,
    scheduleTypes,
    openSelectId,
    setOpenSelectId,
    selectedPersonal,
    personalOptions,
    handlePersonalChange
}) => {
    const renderHourBlock = (hourBlock: any, index: number, selectedType: string) => {
        const [hours, minutes] = hourBlock.inicio.split(":");
        const startHour = parseInt(hours);
        const startMinute = parseInt(minutes);
        const durationMinutes = selectedType === "PRESENCIAL" || selectedType === "RESIDENCIAL" ? 60 : 30;
        const totalMinutes = startMinute + durationMinutes;
        const endHour = startHour + Math.floor(totalMinutes / 60);
        const endMinute = totalMinutes % 60;
        const finalHour = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;

        return (
            <div key={index} className={classnames(styles.buttonHourNewEvent, { [styles.buttonHourNewEventSelected]: newEventStartHour === hourBlock.inicio })}>
                <SmallerButton 
                    type="button" 
                    title={`${hourBlock.inicio} - ${finalHour}`} 
                    value={hourBlock.inicio} 
                    selected={clickedDate?.split("T")[1] === hourBlock.inicio ? true : newEventStartHour === hourBlock.inicio} 
                    handleButtonClick={handleButtonClick} 
                />
            </div>
        );
    };

    return (
        <div className={styles.stepOneContainer}>
            <div className={styles.containerForm}>
                {isMobile && (
                    <>
                        {typeUser?.includes("personal") ? (
                            <InformationCard
                                icon={<UserAvatar userName={appoitmentData ? appoitmentData.aluno?.nome : ""} foto={appoitmentData ? appoitmentData.aluno?.avatarUrl : ""} />}
                                title="Aluno"
                                subtitle={appoitmentData ? appoitmentData.aluno?.nome : ""}
                                subtitle2={`Idade: ${appoitmentData ? appoitmentData.aluno?.idade : "N/A"} anos`}
                            />
                        ) : (
                            <InformationCard
                                icon={<UserAvatar useUserImage={true} foto={selectedPersonal?.caminhoFoto} userName={selectedPersonal?.nome} />}
                                title="Personal Trainer"
                                subtitle={selectedPersonal?.nome || ""}
                                subtitle2={selectedPersonal?.dataNascimento ? `${differenceInYears(new Date(), parse(selectedPersonal?.dataNascimento, "yyyy-MM-dd", new Date()))} anos` : ""}
                                options={personalOptions}
                                selectedValue={selectedPersonal?.id}
                                onOptionChange={handlePersonalChange}
                            />
                        )}
                        {!isReschedule && (
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
                                        selectWrapperClassName="rounded-xl!"
                                        selectPlaceholder="Selecione o tipo"
                                        label="Tipo de Atendimento"
                                        showSelectAll={false}
                                        showSearchInput={false}
                                    />
                                </div>
                            </div>
                        )}
                    </>
                )}
                <div className={classnames(styles.wrapperNewEvent, { [styles.wrapperNewEventMobile]: isMobile })}>
                    <div className={classnames(styles.calendarSmall, { [styles.calendarSmallMobile]: isMobile })}>
                        <div className={`${isReschedule && "mt-6"}`}>
                            <CalendarMonthStyled
                                clickedDate={setNewEventDate}
                                clickedDateStr={newEventDate ? newEventDate.split("T")[0] : clickedDate?.split("T")[0]}
                                createdEvents={insertedEvents}
                                eventToReschedule={clickedDate ? `${clickedDate.split("T")[0]}` : undefined}
                                isMobile={isMobile}
                                hasClassTomorrow={availabilityHoursTomorrow?.data?.length > 0}
                                tomorrowDate={tomorrow}
                                disabledDays={disabledDays}
                            />
                        </div>
                        {newEventDate && (
                            <>
                                <span className="flex gap-1 mt-5 text-sm items-center">
                                    <Clock />
                                    Horários disponíveis para{" "}
                                    {format(parseISO(newEventDate), "d 'de' MMMM", { locale: ptBR })}
                                </span>

                                <div className="flex gap-2 mt-3 mb-5">
                                    {availabilityHours.data?.some((h: any) => parseInt(h.inicio.split(":")[0]) < 12) && 
                                        <SmallerButton type="button" title="Manhã" selected={selectedTimeOfDay === "MANHÃ"} classname={classnames(styles.buttonTimeOfDaySelect, { [styles.buttonTimeOfDaySelectSelected]: selectedTimeOfDay === "MANHÃ" })} icon={<Sun />} handleButtonClick={() => setSelectedTimeOfDay("MANHÃ")} />}
                                    {availabilityHours.data?.some((h: any) => parseInt(h.inicio.split(":")[0]) >= 12 && parseInt(h.inicio.split(":")[0]) < 18) && 
                                        <SmallerButton type="button" title="Tarde" selected={selectedTimeOfDay === "TARDE"} classname={classnames(styles.buttonTimeOfDaySelect, { [styles.buttonTimeOfDaySelectSelected]: selectedTimeOfDay === "TARDE" })} icon={<Sunset />} handleButtonClick={() => setSelectedTimeOfDay("TARDE")} />}
                                    {availabilityHours.data?.some((h: any) => parseInt(h.inicio.split(":")[0]) >= 18) && 
                                        <SmallerButton type="button" title="Noite" selected={selectedTimeOfDay === "NOITE"} classname={classnames(styles.buttonTimeOfDaySelect, { [styles.buttonTimeOfDaySelectSelected]: selectedTimeOfDay === "NOITE" })} icon={<SunMoon />} handleButtonClick={() => setSelectedTimeOfDay("NOITE")} />}
                                </div>

                                <div className={styles.hours}>
                                    {availabilityHours.isLoading && <Skeleton count={3} height={40} borderRadius={8} />}
                                    {availabilityHours.data?.filter((h: any) => {
                                        const hour = parseInt(h.inicio.split(":")[0]);
                                        if (selectedTimeOfDay === "MANHÃ") return hour < 12;
                                        if (selectedTimeOfDay === "TARDE") return hour >= 12 && hour < 18;
                                        if (selectedTimeOfDay === "NOITE") return hour >= 18;
                                        return false;
                                    }).map((h: any, i: number) => renderHourBlock(h, i, "PRESENCIAL"))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className={classnames(styles.buttonNextStep)}>
                    <SmallerButton 
                        type="button" 
                        title={buttonTitle || "Avançar"} 
                        handleButtonClick={() => handleStepChange(2)} 
                        classname={isValid ? styles.enabled : styles.disabled} 
                    />
                </div>
            </div>
        </div>
    );
};

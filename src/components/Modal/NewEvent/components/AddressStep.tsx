import React from 'react';
import classnames from 'classnames';
import { History, MapPin, Calendar } from 'lucide-react';
import { differenceInYears, parse } from 'date-fns';
import Select from '../../../Select/Select';
import SmallerButton from '../../../SmallerButton/SmallerButton';
import UserAvatar from '../../../UserAvatar/UserAvatar';
import InformationCard from '../InformationCard/InformationCard';
import styles from '../NewEvent.module.css';
import type { AddressState } from '../hooks/useAddressLookup';
import { cepMask } from '../../../../utils/mascara';
import { LOCATION_OPTIONS } from '../constants';

type AddressStepProps = {
    isMobile: boolean;
    selectedAddress: any;
    setSelectedAddress: (address: any) => void;
    addresses: any;
    addressData: AddressState;
    setAddressData: (data: AddressState) => void;
    selectDefault: string;
    setSelectDefault: (val: string) => void;
    openSelectId: string | null;
    setOpenSelectId: (id: string | null) => void;
    loading: boolean;
    onSubmit: (e: React.FormEvent) => void;
    location: string;
    setLocation: (loc: string) => void;
    selectedType: string;
    // Mobile-specific props
    personalList?: any;
    formattedDate?: any;
    selectedPersonal?: any;
};

export const AddressStep: React.FC<AddressStepProps> = ({
    isMobile,
    selectedAddress,
    setSelectedAddress,
    addresses,
    addressData,
    setAddressData,
    selectDefault,
    setSelectDefault,
    openSelectId,
    setOpenSelectId,
    loading,
    onSubmit,
    location,
    setLocation,
    selectedType,
    personalList,
    formattedDate,
    selectedPersonal
}) => {
    const locationOptions = LOCATION_OPTIONS[selectedType] || [];

    return (
        <div className={classnames(styles.inputInfosFormContainer, { [styles.inputInfosFormContainerMobile]: isMobile })}>
            {isMobile && (
                <div className="gap-4 flex flex-col mb-10">
                    <h1 className={classnames(styles.summaryTitle, { [styles.summaryTitleMobile]: isMobile })}>
                        Resumo do agendamento
                    </h1>
                    <InformationCard
                        icon={<UserAvatar useUserImage={true} foto={selectedPersonal?.caminhoFoto} userName={selectedPersonal?.nome} />}
                        title="Personal Trainer"
                        subtitle={selectedPersonal?.nome || ""}
                        subtitle2={selectedPersonal?.dataNascimento ? `${differenceInYears(new Date(), parse(selectedPersonal?.dataNascimento, "yyyy-MM-dd", new Date()))} anos` : ""}
                    />

                    <InformationCard
                        icon={<Calendar />}
                        title="Data e Horário"
                        subtitle={formattedDate?.datePart || ""}
                        subtitle2={formattedDate?.timePart || ""}
                    />

                    <InformationCard
                        icon={<MapPin fill="#000" color="#fff" />}
                        title="Tipo de aula"
                        subtitle={selectedType}
                    />
                </div>
            )}

            <div className="bg-gray-300/25 p-4 pt-2 rounded-2xl border border-gray-300 mb-4">
                <div className="flex items-center gap-2 mb-2">
                    {!isMobile && <MapPin />}
                    <span className="uppercase font-medium tracking-tight">Local de Atendimento</span>
                </div>
                <Select
                    id="location-select"
                    openSelectId={openSelectId}
                    setOpenSelectId={setOpenSelectId}
                    onSelectStatusChange={(val) => setLocation(val)}
                    values={locationOptions}
                    defaultValue={location}
                    containerClassName="w-full!"
                    triggerClassName="p-3 w-full!"
                    selectWrapperClassName="bg-white! rounded-xl! w-full! border border-gray-300!"
                    iconPlaceholder={<MapPin fill="#000" color="#fff" />}
                    selectPlaceholder="Selecione o local..."
                    labelClassName="text-slate-500! font-bold text-sm uppercase"
                    showSelectAll={false}
                    showSearchInput={false}
                />
            </div>

            <div className="bg-gray-300/25 p-4 pt-2 rounded-2xl border border-gray-300 not-xl:mt-10">
                <div className="flex justify-between mb-2">
                    <div className="flex items-center gap-2">
                        {!isMobile && <History />}
                        <span className="uppercase font-medium tracking-tight">Usar endereço salvo</span>
                    </div>
                    <span
                        className="not-xl:text-sm not-xl:pr-0 text-oxford-blue cursor-pointer transition hover:ring-2 hover:ring-gray-400 ring-2 ring-[##f3f4f6] p-2 rounded-2xl text-nowrap"
                        onClick={() => {
                            setSelectedAddress(null);
                            setSelectDefault("");
                            setAddressData({
                                postalCode: "",
                                address: "",
                                city: "",
                                state: "",
                                number: "",
                                complement: ""
                            });
                        }}>
                        Limpar seleção
                    </span>
                </div>
                <Select
                    id="address-select"
                    openSelectId={openSelectId}
                    setOpenSelectId={setOpenSelectId}
                    clear={!selectedAddress}
                    onSelectStatusChange={(addressId: string) => {
                        const selected = addresses.data?.find((address: any) => address?.id === addressId);
                        setSelectedAddress(selected || null);
                    }}
                    values={addresses.data?.map((address: any) => ({
                        label: `${address?.cep.logradouro}, ${address?.numero} - ${address?.cep.localidade}/${address?.cep.uf}`,
                        value: address?.id,
                    }))}
                    defaultValue={selectDefault}
                    containerClassName="w-full!"
                    triggerClassName="p-3 w-full!"
                    selectWrapperClassName="bg-white! rounded-xl! w-full! border border-gray-300!"
                    iconPlaceholder={<MapPin fill="#000" color="#fff" />}
                    selectPlaceholder="Selecione um endereço salvo..."
                    labelClassName="text-slate-500! font-bold text-sm uppercase"
                    showSelectAll={false}
                    showSearchInput={false}
                />
            </div>
            <div className={styles.title}>
                <span>Endereço do local</span>
            </div>
            <form className={classnames(styles.inputInfosForm, { [styles.inputInfosFormMobile]: isMobile })} onSubmit={onSubmit}>
                <div className={classnames(styles.wrapperInputs, { [styles.wrapperInputsMobile]: isMobile })}>
                    <div className={styles.inputGroupAddress}>
                        <div className={classnames(styles.inputGroup, styles.labelInput)}>
                            <label htmlFor="cep">CEP</label>
                            <input
                                type="text"
                                id="cep"
                                placeholder="00000-000"
                                onChange={(e) => setAddressData({ ...addressData, postalCode: cepMask(e.target.value) })}
                                value={addressData.postalCode || ""}
                            />
                        </div>
                        <div className={classnames(styles.inputGroup, styles.inputGroupMax)}>
                            <div className={styles.labelInput}>
                                <label htmlFor="city">Cidade</label>
                                <input type="text" id="city" placeholder="Cidade" className={classnames(styles.inputAddress, styles.disabled)} disabled value={addressData.city || ""} />
                            </div>
                            <div className={classnames(styles.labelInput, styles.smallInput)}>
                                <label htmlFor="state">UF</label>
                                <input className={classnames(styles.inputNumber, styles.disabled)} type="text" id="state" placeholder="UF" disabled value={addressData.state || ""} />
                            </div>
                        </div>
                        <div className={classnames(styles.inputGroup, styles.inputGroupMax)}>
                            <div className={styles.labelInput}>
                                <label htmlFor="address">Endereço</label>
                                <input type="text" id="address" placeholder="Endereço" className={classnames(styles.inputAddress, styles.disabled)} disabled value={addressData.address || ""} />
                            </div>
                            <div className={classnames(styles.labelInput, styles.smallInput)}>
                                <label htmlFor="number">N°</label>
                                <input className={styles.inputNumber} type="text" id="number" placeholder="N°" value={addressData.number || ""} onChange={(e) => setAddressData({ ...addressData, number: e.target.value })} />
                            </div>
                        </div>
                        <div className={classnames(styles.inputGroup, styles.doubleInput)}>
                            <div className={styles.labelInput}>
                                <label htmlFor="complement">Complemento</label>
                                <input type="text" id="complement" placeholder="Complemento" value={addressData.complement || ""} onChange={(e) => setAddressData({ ...addressData, complement: e.target.value })} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classnames(styles.buttonNextStep, { [styles.buttonNextStepMobile]: isMobile })}>
                    <SmallerButton loading={loading} type="submit" title={"Confirmar agendamento"} />
                </div>
            </form>
        </div>
    );
};

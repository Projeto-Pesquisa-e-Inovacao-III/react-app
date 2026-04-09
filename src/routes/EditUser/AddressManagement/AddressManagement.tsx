import styles from "./AddressManagement.module.css";
import InputWithIcon from "../../../components/Inputs/InputWithIcon/InputWithIcon.tsx";
import { Home, MapPin, Search, Trash2, Edit2, Briefcase, Building2, Map, Plus, Route, Hash, DoorOpen, MapPinned, Flag } from "lucide-react";
import { useState } from "react";
import { useMediaQuery } from "@mui/material";
import SuccessModal from "../../../components/Modal/SuccessModal/SuccessModal.tsx";
import ErrorModal from "../../../components/Modal/ErrorModal/ErrorModal.tsx";
import TimerModal from "../../../components/Modal/TimerModal/TimerModal.tsx";
import useModal from "../../../hooks/useModal.tsx";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAddress,
  getUserAddresses,
  updateUserAddress,
  deleteUserAddress,
} from "../../../constants/address.ts";
import type { Address } from "../../../models/address.ts";
import AsideEditUser from "../../../components/EditUser/AsideEditUser.tsx";
import SmallerButton from "../../../components/SmallerButton/SmallerButton.tsx";
import classNames from "classnames";
import Skeleton from "react-loading-skeleton";
import { WhiteContainer } from "../../../components/WhiteContainer/WhiteContainer.tsx";
import { cepMask } from "../../../utils/mascara";

type AddressForm = {
  apelido: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  padrao: boolean;
};

const emptyForm: AddressForm = {
  apelido: "",
  cep: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estado: "",
  padrao: false,
};

function extractAddressFields(address: Address) {
  return {
    logradouro: address.logradouro || address.cep?.logradouro || "",
    bairro: address.bairro || address.cep?.bairro || "",
    cidade: address.cep?.cidade?.nome || address.cep?.localidade || "",
    estado: address.cep?.cidade?.estado?.sigla || address.cep?.uf || "",
    cepId: address.cep?.id || address.cep?.cep || "",
  };
}

function getAddressIcon(tipo: string) {
  const lower = (tipo ?? "").toLowerCase();
  if (lower.includes("trabalho") || lower.includes("work")) return <Briefcase size={18} />;
  if (lower.includes("empresa") || lower.includes("comercial")) return <Building2 size={18} />;
  return <Home size={18} />;
}

export default function AddressManagement() {
  const isMobile = useMediaQuery('(max-width:1024px)');
  const queryClient = useQueryClient();

  const { openModal, setOpenModal, textModal, setTextModal } = useModal(null, {
    title: "",
    content: "",
  });

  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isClosingForm, setIsClosingForm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [form, setForm] = useState<AddressForm>(emptyForm);
  const [cepLoading, setCepLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<AddressForm>>({});

  const addressesQuery = useQuery<Address[]>({
    queryKey: ["userAddresses"],
    queryFn: async () => {
      const response = await getUserAddresses();
      return response.data as Address[];
    },
  });

  async function handleCepLookup() {
    const raw = form.cep.replace(/\D/g, "");
    if (raw.length !== 8) return;
    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setForm((prev) => ({
          ...prev,
          logradouro: data.logradouro || prev.logradouro,
          bairro: data.bairro || prev.bairro,
          cidade: data.localidade || prev.cidade,
          estado: data.uf || prev.estado,
        }));
      }
    } catch {
      // ignore
    } finally {
      setCepLoading(false);
    }
  }

  function handleOpenCreate() {
    setEditingAddress(null);
    setForm(emptyForm);
    setFormErrors({});
    setShowForm(true);
  }

  function handleOpenEdit(address: Address) {
    setEditingAddress(address);
    const { logradouro, bairro, cidade, estado, cepId } = extractAddressFields(address);
    setForm({
      apelido: address.apelido || address.tipo || "",
      cep: cepId,
      logradouro,
      numero: address.numero || "",
      complemento: address.complemento || "",
      bairro,
      cidade,
      estado,
      padrao: !!address.padrao,
    });
    setFormErrors({});
    setShowForm(true);
  }

  function handleCancelForm() {
    setIsClosingForm(true);
    setTimeout(() => {
      setShowForm(false);
      setIsClosingForm(false);
      setEditingAddress(null);
      setForm(emptyForm);
      setFormErrors({});
    }, 300);
  }

  function validate(): boolean {
    const errors: Partial<AddressForm> = {};
    if (!form.cep.replace(/\D/g, "")) errors.cep = "CEP obrigatório.";
    if (!form.logradouro.trim()) errors.logradouro = "Logradouro obrigatório.";
    if (!form.numero.trim()) errors.numero = "Número obrigatório.";
    if (!form.bairro.trim()) errors.bairro = "Bairro obrigatório.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaveLoading(true);

    const payload: Address = {
      apelido: form.apelido || "Endereço",
      tipo: form.apelido || "Endereço",
      numero: form.numero,
      complemento: form.complemento,
      logradouro: form.logradouro,
      bairro: form.bairro,
      padrao: form.padrao,
      cep: { id: form.cep.replace(/\D/g, "") },
    };

    try {
      if (editingAddress?.id) {
        await updateUserAddress(editingAddress.id, payload);
      } else {
        await createAddress(payload);
      }
      await queryClient.invalidateQueries({ queryKey: ["userAddresses"] });
      setTextModal({
        title: editingAddress ? "Endereço atualizado!" : "Endereço adicionado!",
        content: editingAddress
          ? "Seu endereço foi atualizado com sucesso."
          : "Seu endereço foi adicionado com sucesso.",
      });
      setOpenModal("success");
      handleCancelForm();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { Exception?: string } } };
      setTextModal({
        title: "Houve um erro",
        content: err.response?.data?.Exception || "Não foi possível salvar o endereço.",
      });
      setOpenModal("error");
    } finally {
      setSaveLoading(false);
    }
  }

  function handleDeleteConfirm() {
    if (deleteId == null) return;
    deleteUserAddress(deleteId)
      .then(async () => {
        await queryClient.invalidateQueries({ queryKey: ["userAddresses"] });
        setTextModal({ title: "Endereço removido!", content: "O endereço foi removido com sucesso." });
        setOpenModal("success");
      })
      .catch(() => {
        setTextModal({ title: "Houve um erro", content: "Não foi possível remover o endereço." });
        setOpenModal("error");
      });
  }

  const addresses = addressesQuery.data ?? [];

  return (
    <>
      <div className={styles.editUserGrid}>

        {!isMobile && (
          <div className={styles.goBackContainer}>
            <h1 className={styles.pageTitle}>Editar Perfil</h1>
            {(!showForm || !isMobile) && (
              <SmallerButton
                type="button"
                title="Adicionar Novo Endereço"
                icon={<Plus size={18} />}
                iconPosition="left"
                classname={styles.btnAddGlobal}
                handleButtonClick={handleOpenCreate}
              />
            )}
          </div>
        )}


        <div className={styles.pagesSection}>
          <WhiteContainer containerClassName={styles.profileWhiteContainer} title="" titleMarginBottom={25} gap={30}>
            <AsideEditUser activeTab="addresses" />
          </WhiteContainer>
        </div>


        <div className={styles.personalInfo}>

          <div className={styles.mainArea}>


            {(!isMobile || !showForm) && (
              <div className={styles.cardsArea}>
                {addressesQuery.isLoading ? (
                  <>
                    <Skeleton height={140} borderRadius={12} className="mb-4" />
                    <Skeleton height={140} borderRadius={12} />
                  </>
                ) : addresses.length === 0 ? (
                  <div className={styles.emptyContainer}>
                    <div className={styles.emptyIconWrapper}>
                      <Map size={36} color="#093a5d" className={styles.emptyIcon} />
                    </div>
                    <h3>Nenhum endereço encontrado</h3>
                    <p>Você ainda não cadastrou nenhum endereço. Adicione um para agilizar seus agendamentos e entregas.</p>
                    <SmallerButton
                      type="button"
                      icon={<MapPin size={16} />}
                      iconPosition="left"
                      title="Adicionar Novo Endereço"
                      classname={styles.btnEmptyAdd}
                      handleButtonClick={handleOpenCreate}
                    />
                    <span className={styles.emptyFooterText}>Leva menos de 1 minuto para configurar.</span>
                  </div>
                ) : (
                  <div className={styles.cardsList}>
                    {addresses.map((addr) => {
                      const { logradouro, bairro, cidade, estado, cepId } = extractAddressFields(addr);

                      return (
                        <div key={addr.id} className={classNames(styles.addressCard, {
                          [styles.addressCardBorder]: addr.padrao,
                        })}>
                          <div className={styles.cardHeader}>
                            <div className={styles.cardTitleLine}>
                              {getAddressIcon(addr.tipo)}
                              <strong>{addr.apelido || addr.tipo}</strong>
                              {addr.padrao && <span className={styles.badgePadrao}>PADRÃO</span>}
                            </div>
                            <div className={styles.cardActions}>
                              <button onClick={() => handleOpenEdit(addr)} title="Editar"><Edit2 size={16} /></button>
                              <button onClick={() => { setDeleteId(addr.id ?? null); setOpenModal("timer"); }} title="Remover" className={styles.btnTrash}><Trash2 size={16} /></button>
                            </div>
                          </div>
                          <div className={styles.cardBody}>
                            <p className={styles.boldText}>{logradouro}, {addr.numero}</p>
                            {addr.complemento && <p>{addr.complemento}</p>}
                            <p>{bairro} - {cepId}</p>
                            {(cidade || estado) && <p>{cidade}{cidade && estado ? ', ' : ''}{estado}</p>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}


            {(showForm || isClosingForm) && (
              <div className={classNames(styles.formArea, { [styles.formAreaClosing]: isClosingForm })}>
                <div className={styles.formCard}>
                  <div className={styles.formHeader}>
                    <MapPin size={20} color="#093a5d" />
                    <h3>{editingAddress ? "Editar Detalhes" : "Novo Endereço"}</h3>
                    <span className={styles.requiredHelper}>Todos os campos são obrigatórios</span>
                  </div>

                  <div className={styles.formGrid}>
                    <div className={styles.fieldCep}>
                      <span className={styles.label}>CEP</span>
                      <div className={styles.cepFlex}>
                        <div className="w-full">
                          <InputWithIcon
                            id="cep" type="text" placeholder="00000-000" icon={<MapPin size={18} />}
                            value={cepMask(form.cep)} hasError={!!formErrors.cep} maxLength={9}
                            onInputChange={(v: string) => setForm(p => ({ ...p, cep: cepMask(v) }))}
                            classNameInput={styles.grayInput}
                          />
                          {formErrors.cep && <span className={styles.error}>{formErrors.cep}</span>}
                        </div>
                        <button type="button" className={styles.btnSearchCep} onClick={handleCepLookup} disabled={cepLoading}>
                          <Search size={18} />
                        </button>
                      </div>
                    </div>

                    <div className={styles.fieldLogradouro}>
                      <span className={styles.label}>Logradouro</span>
                      <InputWithIcon
                        id="logradouro" type="text" placeholder="Alameda dos Anjos" icon={<Route size={18} />}
                        value={form.logradouro} hasError={!!formErrors.logradouro} onInputChange={(v: string) => setForm(p => ({ ...p, logradouro: v }))}
                        classNameInput={styles.grayInput}
                      />
                      {formErrors.logradouro && <span className={styles.error}>{formErrors.logradouro}</span>}
                    </div>

                    <div className={styles.fieldNumero}>
                      <span className={styles.label}>Número</span>
                      <InputWithIcon
                        id="numero" type="text" placeholder="123" icon={<Hash size={18} />}
                        value={form.numero} hasError={!!formErrors.numero} onInputChange={(v: string) => setForm(p => ({ ...p, numero: v }))}
                        classNameInput={styles.grayInput}
                      />
                      {formErrors.numero && <span className={styles.error}>{formErrors.numero}</span>}
                    </div>

                    <div className={styles.fieldComplemento}>
                      <span className={styles.label}>Complemento</span>
                      <InputWithIcon
                        id="complemento" type="text" placeholder="Ex: Sala 2" icon={<DoorOpen size={18} />}
                        value={form.complemento} onInputChange={(v: string) => setForm(p => ({ ...p, complemento: v }))}
                        classNameInput={styles.grayInput}
                      />
                    </div>

                    <div className={styles.fieldBairro}>
                      <span className={styles.label}>Bairro</span>
                      <InputWithIcon
                        id="bairro" type="text" placeholder="Vila Olimpia" icon={<MapPinned size={18} />}
                        value={form.bairro} hasError={!!formErrors.bairro} onInputChange={(v: string) => setForm(p => ({ ...p, bairro: v }))}
                        classNameInput={styles.grayInput}
                      />
                      {formErrors.bairro && <span className={styles.error}>{formErrors.bairro}</span>}
                    </div>

                    <div className={styles.fieldCidade}>
                      <span className={styles.label}>Cidade</span>
                      <InputWithIcon
                        id="cidade" type="text" placeholder="Nome da cidade" icon={<Building2 size={18} />}
                        value={form.cidade} onInputChange={(v: string) => setForm(p => ({ ...p, cidade: v }))}
                        classNameInput={styles.grayInput}
                      />
                    </div>

                    <div className={styles.fieldEstado}>
                      <span className={styles.label}>Estado</span>
                      <InputWithIcon
                        id="estado" type="text" placeholder="UF" icon={<Flag size={18} />} maxLength={2}
                        value={form.estado} onInputChange={(v: string) => setForm(p => ({ ...p, estado: v.toUpperCase() }))}
                        classNameInput={styles.grayInput}
                      />
                    </div>
                  </div>

                  <div className={styles.formCardFooter}>
                    <button type="button" className={styles.btnDiscard} onClick={handleCancelForm}>Descartar</button>
                    <button type="button" className={styles.btnSave} onClick={handleSave} disabled={saveLoading}>
                      {saveLoading ? "Salvando..." : (editingAddress ? "Salvar Alterações" : "Salvar Endereço")}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {openModal === "success" && (
        <SuccessModal isMobile={isMobile} closeThen={() => setOpenModal(null)} title={textModal.title} content={textModal.content} />
      )}
      {openModal === "error" && (
        <ErrorModal closeThen={() => setOpenModal(null)} title={textModal.title} content={textModal.content} />
      )}
      {openModal === "timer" && (
        <TimerModal
          isMobile={isMobile} isDelete={true} closeThen={() => { setOpenModal(null); setDeleteId(null); }}
          callSuccessModal={() => { handleDeleteConfirm(); setOpenModal(null); setDeleteId(null); }}
          title="Remover endereço?" buttonTitle="Remover"
          content="Tem certeza que deseja remover este endereço? Esta ação não pode ser desfeita."
        />
      )}
    </>
  );
}

import { useState } from "react";
import { api } from "../../system";
import styles from "./DevSeed.module.css";
import { LogoWhiteBig } from "../../components/LogoWhiteBig/LogoWhiteBig";
import { LogoHeaderDesktop } from "../../components/LogoHeaderDesktop/LogoHeaderDesktop";
import { LogoHeaderMobile } from "../../components/LogoHeaderMobile/LogoHeaderMobile";
import { Link } from "react-router-dom";
import classNames from "classnames";

// ─── Step Definitions ────────────────────────────────────────────────────────

const steps = [
  {
    label: "Login Admin",
    description: "POST /usuarios/login (admin)",
    run: async (ctx: Record<string, unknown>) => {
      const res = await api.post("/usuarios/login", {
        email: "fabio.admin@email.com",
        senha: "admin123",
      });
      ctx.adminToken = res.data?.token;
      return res.data;
    },
  },
  {
    label: "Criar Produto Exibição",
    description: "POST /produtos-exibicoes",
    run: async (ctx: Record<string, unknown>) => {
      const res = await api.post("/produtos-exibicoes", {
        titulo: "Pacote Anual",
        subtitulo: "Plano único - 12 meses",
        beneficios: [
          { valor: "Pacote anual adquirido uma única vez" },
          { valor: "Treino personalizado (visando o seu objetivo)" },
          { valor: "Anamnese mensal" },
          { valor: "Feedback diário" },
          { valor: "1 aula grátis com o personal por mês" },
        ],
        preco: 2400.0,
        status: "ATIVO",
        tipoProduto: "PACOTE",
        tipoAula: "PRESENCIAL",
        quantidadeAula: 12,
        periodo: "12 meses",
        duracaoMes: 12,
      });
      ctx.produtoId = res.data?.id ?? 1;
      return res.data;
    },
  },
  {
    label: "Criar Adicional FUNCIONAL",
    description: "POST /produtos-exibicoes (ADICIONAL / FUNCIONAL)",
    run: async (ctx: Record<string, unknown>) => {
      const res = await api.post("/produtos-exibicoes", {
        titulo: "Adicional Funcional",
        subtitulo: "Aulas funcionais ao ar livre",
        beneficios: [
          { valor: "Aulas em parques e espaços abertos" },
          { valor: "Treino funcional personalizado" },
          { valor: "Flexibilidade de local" },
        ],
        preco: 300.0,
        status: "ATIVO",
        tipoProduto: "ADICIONAL",
        tipoAula: "FUNCIONAL",
        quantidadeAula: 12,
        periodo: "1 mês",
        duracaoMes: 1,
      });
      ctx.adicionalFuncionalId = res.data?.id;
      return res.data;
    },
  },
  {
    label: "Criar Adicional RESIDENCIAL",
    description: "POST /produtos-exibicoes (ADICIONAL / RESIDENCIAL)",
    run: async (ctx: Record<string, unknown>) => {
      const res = await api.post("/produtos-exibicoes", {
        titulo: "Adicional Residencial",
        subtitulo: "Aulas em domicílio",
        beneficios: [
          { valor: "Personal no seu endereço" },
          { valor: "Sem deslocamento" },
          { valor: "Horário flexível" },
        ],
        preco: 350.0,
        status: "ATIVO",
        tipoProduto: "ADICIONAL",
        tipoAula: "RESIDENCIAL",
        quantidadeAula: 12,
        periodo: "1 mês",
        duracaoMes: 1,
      });
      ctx.adicionalResidencialId = res.data?.id;
      return res.data;
    },
  },
  {
    label: "Cadastrar Personal",
    description: "POST /controle/admin/dev/usuarios/personal",
    run: async (_ctx: Record<string, unknown>) => {
      const res = await api.post("/controle/admin/dev/usuarios/personal", {
        nome: "Fillipe",
        sexo: "Masculino",
        dataNascimento: "2005-12-27",
        email: "fillipemcoelho@hotmail.com",
        cref: "01415069031",
        telefone: {
          pais: 55,
          ddd: 11,
          numero: 912345678,
        },
      });
      return res.data;
    },
  },
  {
    label: "Cadastrar Aluno",
    description: "POST /alunos/cadastro",
    run: async (_ctx: Record<string, unknown>) => {
      const res = await api.post("/alunos/cadastro", {
        nome: "Fillipe",
        sexo: "Masculino",
        dataNascimento: "2005-12-27",
        email: "joao.silva@example.com",
        senha: "123456789aA!",
        cpf: "54451703069",
        telefone: {
          ddd: "11",
          numero: "932269949",
          pais: "55",
        },
      });
      return res.data;
    },
  },
  {
    label: "Login Aluno",
    description: "POST /usuarios/login (aluno)",
    run: async (_ctx: Record<string, unknown>) => {
      const res = await api.post("/usuarios/login", {
        email: "joao.silva@example.com",
        senha: "123456789aA!",
      });
      return res.data;
    },
  },
  {
    label: "Criar Anamnese",
    description: "POST /anamnese",
    run: async (_ctx: Record<string, unknown>) => {
      const res = await api.post("/anamnese", {
        altura: 175,
        peso: 70.5,
        objectivoPrincipal: "Ganho de massa muscular",
        rotina: "Trabalho das 9h às 18h, treino à noite",
        condicoes: [
          { situacao: "Controlada com medicamento", tipo: "OUTRO" },
          { situacao: "Sem tratamento", tipo: "OUTRO" },
        ],
        nivelDeAtividade: "SEDENTARIO",
        observacaoSaude: "Sinto dores no joelho direito ao agachar",
      });
      return res.data;
    },
  },
  {
    label: "Contratar Produto",
    description: "POST /produtos-contratados",
    run: async (ctx: Record<string, unknown>) => {
      const idProdutoExibicao = (ctx.produtoId as number) ?? 1;
      const res = await api.post("/produtos-contratados", {
        idProdutoExibicao,
      });
      return res.data;
    },
  },
  {
    label: "Contratar Adicional FUNCIONAL",
    description: "POST /produtos-contratados (FUNCIONAL)",
    run: async (ctx: Record<string, unknown>) => {
      const idProdutoExibicao = (ctx.adicionalFuncionalId as number) ?? 2;
      const res = await api.post("/produtos-contratados", {
        idProdutoExibicao,
      });
      return res.data;
    },
  },
  {
    label: "Contratar Adicional RESIDENCIAL",
    description: "POST /produtos-contratados (RESIDENCIAL)",
    run: async (ctx: Record<string, unknown>) => {
      const idProdutoExibicao = (ctx.adicionalResidencialId as number) ?? 3;
      const res = await api.post("/produtos-contratados", {
        idProdutoExibicao,
      });
      return res.data;
    },
  },
  {
    label: "Criar Agendamento PRESENCIAL",
    description: "POST /agendamentos (PRESENCIAL)",
    run: async (_ctx: Record<string, unknown>) => {
      const data = new Date();
      data.setDate(data.getDate() + 2);
      data.setHours(10, 0, 0, 0);
      const res = await api.post("/agendamentos", {
        data: data.toISOString(),
        descricao: "Aula presencial na academia",
        novoEndereco: {
          numero: "1234",
          complemento: "Apto 101",
          unidade: "Edifício Sol",
          tipo: "PRESENCIAL",
          cep: {
            id: "01001-000",
            logradouro: "Praça da Sé",
            bairro: "Sé",
            localidade: "São Paulo",
            uf: "SP",
          },
        },
        personalId: 1,
        tipoAulaProdutoContratado: "PRESENCIAL",
      });
      return res.data;
    },
  },
  {
    label: "Criar Agendamento FUNCIONAL",
    description: "POST /agendamentos (FUNCIONAL)",
    run: async (_ctx: Record<string, unknown>) => {
      const data = new Date();
      data.setDate(data.getDate() + 3);
      data.setHours(9, 0, 0, 0);
      const res = await api.post("/agendamentos", {
        data: data.toISOString(),
        descricao: "Aula funcional ao ar livre",
        novoEndereco: {
          numero: "S/N",
          complemento: "",
          unidade: "",
          tipo: "FUNCIONAL",
          cep: {
            id: "01310-100",
            logradouro: "Avenida Paulista",
            bairro: "Bela Vista",
            localidade: "São Paulo",
            uf: "SP",
          },
        },
        personalId: 1,
        tipoAulaProdutoContratado: "FUNCIONAL",
      });
      return res.data;
    },
  },
  {
    label: "Criar Agendamento RESIDENCIAL",
    description: "POST /agendamentos (RESIDENCIAL)",
    run: async (_ctx: Record<string, unknown>) => {
      const data = new Date();
      data.setDate(data.getDate() + 4);
      data.setHours(8, 0, 0, 0);
      const res = await api.post("/agendamentos", {
        data: data.toISOString(),
        descricao: "Aula residencial em domicílio",
        novoEndereco: {
          numero: "456",
          complemento: "Casa",
          unidade: "",
          tipo: "RESIDENCIAL",
          cep: {
            id: "01414-001",
            logradouro: "Rua Haddock Lobo",
            bairro: "Cerqueira César",
            localidade: "São Paulo",
            uf: "SP",
          },
        },
        personalId: 1,
        tipoAulaProdutoContratado: "RESIDENCIAL",
      });
      return res.data;
    },
  },


  {
    label: "Logout",
    description: "POST /usuarios/logout",
    run: async (_ctx: Record<string, unknown>) => {
      const res = await api.post("/usuarios/logout");
      return res.data;
    },
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type StepStatus = "idle" | "running" | "success" | "error" | "skipped";

interface StepState {
  status: StepStatus;
  response: unknown;
  error: string | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DevSeed() {
  const [stepStates, setStepStates] = useState<StepState[]>(
    steps.map(() => ({ status: "idle", response: null, error: null }))
  );
  const [selectedSteps, setSelectedSteps] = useState<boolean[]>(
    steps.map(() => true)
  );
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const toggleStep = (index: number) => {
    setSelectedSteps((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const toggleAll = (select: boolean) => {
    setSelectedSteps(steps.map(() => select));
  };

  const contratosAgendamentosIndices = steps
    .map((s, i) => (s.label.includes("Contratar") || s.label.includes("Agendamento") || s.label.includes("Anamnese") ? i : -1))
    .filter((i) => i !== -1);

  const hasContratosAgendamentos = contratosAgendamentosIndices.every((i) => selectedSteps[i]);

  const toggleContratosAgendamentos = (select: boolean) => {
    setSelectedSteps((prev) => {
      const next = [...prev];
      contratosAgendamentosIndices.forEach((i) => {
        next[i] = select;
      });
      return next;
    });
  };

  const updateStep = (index: number, patch: Partial<StepState>) => {
    setStepStates((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  const runAll = async () => {
    setRunning(true);
    setDone(false);
    // Reset
    setStepStates(steps.map(() => ({ status: "idle", response: null, error: null })));

    const ctx: Record<string, unknown> = {};

    for (let i = 0; i < steps.length; i++) {
      if (!selectedSteps[i]) {
        updateStep(i, { status: "skipped" });
        continue;
      }

      updateStep(i, { status: "running" });
      try {
        const data = await steps[i].run(ctx);
        updateStep(i, { status: "success", response: data });
      } catch (err: unknown) {
        const axiosErr = err as { response?: { data?: unknown; status?: number }; message?: string };
        const errorMsg =
          axiosErr?.response?.data
            ? JSON.stringify(axiosErr.response.data, null, 2)
            : axiosErr?.message ?? "Erro desconhecido";
        updateStep(i, { status: "error", error: errorMsg });
        // Continue anyway — don't break the chain
      }
    }

    setRunning(false);
    setDone(true);
  };

  const statusIcon = (s: StepStatus) => {
    if (s === "idle") return <span className={styles.iconIdle}>○</span>;
    if (s === "running") return <span className={styles.iconRunning}>◌</span>;
    if (s === "success") return <span className={styles.iconSuccess}>✓</span>;
    if (s === "skipped") return <span className={styles.iconSkipped}>-</span>;
    return <span className={styles.iconError}>✕</span>;
  };

  const successCount = stepStates.filter((s) => s.status === "success").length;
  const errorCount = stepStates.filter((s) => s.status === "error").length;
  const skippedCount = stepStates.filter((s) => s.status === "skipped").length;

  return (
    <>
      
      <div className={styles.page}>
        <div className={styles.header}>
          <div className={styles.badge}>DEV ONLY</div>
          <div className="flex justify-center">
            <div className="flex flex-col items-center border border-red fixed top-1 bg-red-100">
              <Link to="/home" className="underline">Voltar para o site</Link>
              <LogoHeaderMobile />
            </div>
          </div>
          <h1 className={styles.title}>Seed de Dados</h1>
          <p className={styles.subtitle}>
            Executa todos os requests de setup em sequência. Remover antes do deploy final.
          </p>

          <div className={styles.controls}>
            <button className={styles.controlBtn} onClick={() => toggleAll(true)} disabled={running}>Selecionar Todos</button>
            {/* <button className={styles.controlBtn} onClick={() => toggleAll(false)} disabled={running}>Desmarcar Todos</button> */}
            <button className={classNames(styles.controlBtn)} onClick={() => toggleContratosAgendamentos(false)} disabled={running}>Desmarcar Anamnese, Pacotes e Agendamentos</button>
          </div>

          <button
            className={styles.runBtn}
            onClick={runAll}
            disabled={running}
          >
            {running ? (
              <>
                <span className={styles.spinner} /> Executando…
              </>
            ) : done ? (
              "▶ Executar Novamente"
            ) : (
              "▶ Executar Seed"
            )}
          </button>

          {done && (
            <div className={styles.summary}>
              <span className={styles.summarySuccess}>✓ {successCount} ok</span>
              {errorCount > 0 && (
                <span className={styles.summaryError}>✕ {errorCount} erro(s)</span>
              )}
              {skippedCount > 0 && (
                <span className={styles.summarySkipped}>- {skippedCount} ignorado(s)</span>
              )}
            </div>
          )}
        </div>

        <div className={styles.steps}>
          {steps.map((step, i) => {
            const state = stepStates[i];
            return (
              <div
                key={i}
                className={`${styles.stepCard} ${styles[`card_${state.status}`]}`}
              >
                <div className={styles.stepHeader}>
                  <input
                    type="checkbox"
                    checked={selectedSteps[i]}
                    onChange={() => toggleStep(i)}
                    disabled={running}
                    className={styles.checkbox}
                  />
                  <span className={styles.stepNumber}>{i + 1}</span>
                  {statusIcon(state.status)}
                  <div className={styles.stepInfo}>
                    <span className={styles.stepLabel}>{step.label}</span>
                    <span className={styles.stepDesc}>{step.description}</span>
                  </div>
                </div>

                {state.status === "success" && state.response !== null && (
                  <pre className={styles.responseBox}>
                    {JSON.stringify(state.response, null, 2)}
                  </pre>
                )}

                {state.status === "error" && (
                  <pre className={styles.errorBox}>{state.error}</pre>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

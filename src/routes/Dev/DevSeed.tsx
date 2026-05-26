import { useState } from "react";
import { api } from "../../system";
import styles from "./DevSeed.module.css";

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
    label: "Criar Agendamento",
    description: "POST /agendamentos",
    run: async (_ctx: Record<string, unknown>) => {
      const res = await api.post("/agendamentos", {
        data: "2026-06-06T17:33:48.047Z",
        descricao: "Alteração de endereço e atualização de dados",
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
    label: "Logout",
    description: "POST /logout",
    run: async (_ctx: Record<string, unknown>) => {
      const res = await api.post("/logout");
      return res.data;
    },
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type StepStatus = "idle" | "running" | "success" | "error";

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
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

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
    return <span className={styles.iconError}>✕</span>;
  };

  const successCount = stepStates.filter((s) => s.status === "success").length;
  const errorCount = stepStates.filter((s) => s.status === "error").length;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.badge}>DEV ONLY</div>
        <h1 className={styles.title}>Seed de Dados</h1>
        <p className={styles.subtitle}>
          Executa todos os requests de setup em sequência. Remover antes do deploy final.
        </p>
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
  );
}

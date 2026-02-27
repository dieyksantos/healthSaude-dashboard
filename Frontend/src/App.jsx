import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { Records } from "./components/Records/Records";
import { Modal } from "./components/Modal/Modal";
import { Toast, useToast } from "./components/Toast/Toast";
import { useHealth } from "./hooks/useHealth";
import "./styles/globals.css";

export default function App() {
  const BACKEND = "https://health-dashboard-4qxq.onrender.com";

  const [page, setPage] = useState("dashboard");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [planId, setPlanId] = useState(null);
  const [bootStuck, setBootStuck] = useState(false);

  const { records, loading, isDemoMode, load, add, edit, remove } = useHealth();
  const { toast, showToast, dismissToast } = useToast();

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const t = setTimeout(() => setBootStuck(true), 20000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (isDemoMode) showToast("⚡ Modo demo ativo — API não conectada");
  }, [isDemoMode, showToast]);

  /* ================= MODAL ================= */

  function openNew() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(record) {
    setEditing(record);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
  }

  async function handleSave(formData) {
    try {
      if (editing) {
        await edit(editing.id, formData);
        showToast("✅ Registro atualizado");
      } else {
        await add(formData);
        showToast("✅ Registro salvo");
      }
      closeModal();
    } catch {
      showToast("❌ Erro ao salvar registro");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Confirmar exclusão?")) return;

    try {
      await remove(id);
      showToast("✅ Registro excluído");
    } catch {
      showToast("❌ Erro ao excluir registro");
    }
  }

  /* ================= PLANO IA ================= */

  async function generatePlan() {
    showToast("⏳ Gerando plano...");

    try {
      const res = await fetch(`${BACKEND}/plan/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = JSON.parse(text);
    setPlanId(data.id);

    showToast("🔥 Plano gerado com sucesso");
  } catch (err) {
    console.error(err);
    showToast("❌ Falha ao gerar plano: " + (err?.message || "erro desconhecido"));
    }
  }

  /* ================= LOADING (failsafe) ================= */

  if (loading && !bootStuck) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          color: "var(--muted)",
        }}
      >
        Carregando...
      </div>
    );
  }

  if (loading && bootStuck) {
    return (
      <div style={{ padding: 20 }}>
        <h3>Backend demorou para responder</h3>
        <p>Abra o backend para acordar e tente de novo:</p>

        <p>
          <a
            href="https://health-dashboard-4qxq.onrender.com/docs"
            target="_blank"
            rel="noreferrer"
          >
            Abrir /docs do backend
          </a>
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{
            background: "#00e5a0",
            padding: "10px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Recarregar
        </button>
      </div>
    );
  }

  /* ================= RENDER NORMAL ================= */

  return (
    <div className="layout">
      <Sidebar activePage={page} onNavigate={setPage} onNewRecord={openNew} />

      <main className="main-content">
        {page === "dashboard" && (
          <>
            <Dashboard records={records} onNewRecord={openNew} />

            {/* 🔥 BOTÕES DO PLANO */}
            <div style={{ marginTop: "20px" }}>
              <button
                type="button"
                onClick={generatePlan}
                style={{
                  background: "#00e5a0",
                  padding: "10px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                🚀 Gerar Plano de Treino e Alimentação
              </button>

              {planId && (
                <button
                  type="button"
                  style={{
                    marginLeft: "10px",
                    background: "#111827",
                    color: "#fff",
                    padding: "10px",
                    border: "1px solid #00e5a0",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    window.open(`${BACKEND}/plan/${planId}/pdf`, "_blank")
                  }
                >
                  🔥 Ver Plano
                </button>
              )}
            </div>
          </>
        )}

        {page === "records" && (
          <Records
            records={records}
            onNewRecord={openNew}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}
      </main>

      <Modal
        isOpen={modalOpen}
        record={editing}
        onClose={closeModal}
        onSave={handleSave}
      />

      <Toast message={toast} onDismiss={dismissToast} />
    </div>
  );
}
import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { Records } from "./components/Records/Records";
import { Modal } from "./components/Modal/Modal";
import { Toast, useToast } from "./components/Toast/Toast";
import { useHealth } from "./hooks/useHealth";
import "./styles/globals.css";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [planId, setPlanId] = useState(null); // ✅ NOVO

  const { records, loading, isDemoMode, load, add, edit, remove } = useHealth();
  const { toast, showToast, dismissToast } = useToast();

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (isDemoMode) showToast("⚡ Modo demo ativo — API não conectada");
  }, [isDemoMode]);

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
    console.log("🔥 generatePlan chamado"); 
  try {
    const res = await fetch("/plan/generate", { method: "POST" });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt);
    }

    const data = await res.json();
    setPlanId(data.id);

    showToast("🔥 Plano gerado com sucesso");
  } catch (err) {
    console.error(err);
    showToast("❌ Erro ao gerar plano");
  }
}

  /* ================= LOADING ================= */

  if (loading) {
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

  /* ================= RENDER ================= */

  return (
    <div className="layout">
      <Sidebar
        activePage={page}
        onNavigate={setPage}
        onNewRecord={openNew}
      />

      <main className="main-content">
        {page === "dashboard" && (
          <>
            <Dashboard records={records} onNewRecord={openNew} />

            {/* 🔥 BOTÃO PLANO */}
            <div style={{ marginTop: "20px" }}>
              <button
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
                    style={{
                      marginLeft: "10px",
                      background: "#111827",
                      color: "#fff",
                      padding: "10px",
                      border: "1px solid #00e5a0",
                      cursor: "pointer",
    }}
        onClick={() => window.open(`/plan/${planId}/pdf`, "_blank")
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
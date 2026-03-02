// src/components/PlanPreview.jsx
export function PlanPreview({ data, onClose }) {
  if (!data) return null;

  const p = data.plan;

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 9999
    }}>
      <div style={{
        width: "min(900px, 100%)", background: "#0b1220", color: "#fff",
        border: "1px solid #00e5a0", borderRadius: 12, padding: 16
      }}>
        <div className="no-print" style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={() => window.print()} style={{ padding: 10, cursor: "pointer" }}>
            Baixar PDF
          </button>
          <button onClick={onClose} style={{ padding: 10, cursor: "pointer" }}>
            Fechar
          </button>
        </div>

        <h2 style={{ marginTop: 8 }}>Plano</h2>
        <p><b>IMC atual:</b> {p.imc_atual}</p>
        <p><b>Categoria:</b> {p.categoria}</p>
        <p><b>Peso alvo:</b> {p.peso_alvo} kg</p>
        <p><b>Diferença:</b> {p.diferenca_kg} kg</p>
        <p>{p.analise_peso}</p>

        <hr style={{ margin: "16px 0" }} />

        <h3>{p.guidance_titulo}</h3>
        <div dangerouslySetInnerHTML={{ __html: p.guidance_alimentacao }} />
        <div style={{ marginTop: 12 }} dangerouslySetInnerHTML={{ __html: p.guidance_treino }} />

        <p style={{ marginTop: 16, opacity: 0.8 }}>
          *Relatório gerado localmente no seu navegador.
        </p>
      </div>
    </div>
  );
}
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "./Dashboard.css";

const STAT_CARDS = (last, total) => [
  { label: "Último Peso",  value: last?.weight ?? "—", sub: "kg",     icon: "⚖️", accent: "#00e5a0", bg: "rgba(0,229,160,0.1)"  },
  { label: "Altura",       value: last?.height ?? "—", sub: "metros", icon: "📏", accent: "#00b4d8", bg: "rgba(0,180,216,0.1)"  },
  { label: "IMC Atual",    value: last?.bmi    ?? "—", sub: last?.category ?? "—", icon: "🏃", accent: "#a78bfa", bg: "rgba(167,139,250,0.1)" },
  { label: "Registros",    value: total,               sub: "no total",icon: "📊", accent: "#f97316", bg: "rgba(249,115,22,0.1)" },
];

const CAT_COLORS = {
  "Abaixo do peso":    "#00b4d8",
  "Peso normal":       "#00e5a0",
  "Sobrepeso":         "#facc15",
  "Obesidade grau I":  "#f97316",
  "Obesidade grau II": "#ef4444",
  "Obesidade grau III":"#dc2626",
};

function formatDate(d) {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

export function Dashboard({ records, onNewRecord }) {
  const lineRef  = useRef(null);
  const donutRef = useRef(null);
  const lineChart  = useRef(null);
  const donutChart = useRef(null);

  const last  = records[records.length - 1] ?? null;
  const stats = STAT_CARDS(last, records.length);
  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  useEffect(() => {
    if (!records.length) return;

    const sorted = [...records].sort((a, b) => new Date(a.date) - new Date(b.date));
    const labels = sorted.map((d) => formatDate(d.date));
    const values = sorted.map((d) => d.bmi);

    // Line chart
    if (lineChart.current) lineChart.current.destroy();
    lineChart.current = new Chart(lineRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "IMC",
          data: values,
          borderColor: "#00e5a0",
          backgroundColor: "rgba(0,229,160,0.08)",
          borderWidth: 2.5,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#00e5a0",
          pointRadius: 5,
          pointHoverRadius: 7,
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: "#1a2235", borderColor: "rgba(255,255,255,0.1)", borderWidth: 1, titleColor: "#e8edf5", bodyColor: "#6b7a99", padding: 12 },
        },
        scales: {
          x: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#6b7a99", font: { size: 11 } } },
          y: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#6b7a99", font: { size: 11 } } },
        },
      },
    });

    // Donut chart
    const catCount = records.reduce((acc, d) => {
      acc[d.category] = (acc[d.category] ?? 0) + 1;
      return acc;
    }, {});

    if (donutChart.current) donutChart.current.destroy();
    donutChart.current = new Chart(donutRef.current, {
      type: "doughnut",
      data: {
        labels: Object.keys(catCount),
        datasets: [{
          data: Object.values(catCount),
          backgroundColor: Object.keys(catCount).map((k) => CAT_COLORS[k] ?? "#6b7a99"),
          borderWidth: 0,
          hoverOffset: 6,
        }],
      },
      options: {
        responsive: true,
        cutout: "72%",
        plugins: {
          legend: { position: "bottom", labels: { color: "#6b7a99", font: { size: 11 }, padding: 12 } },
          tooltip: { backgroundColor: "#1a2235", borderColor: "rgba(255,255,255,0.1)", borderWidth: 1, titleColor: "#e8edf5", bodyColor: "#6b7a99", padding: 12 },
        },
      },
    });

    return () => {
      lineChart.current?.destroy();
      donutChart.current?.destroy();
    };
  }, [records]);

  return (
    <section className="page-enter">
      <div className="page-header">
        <div>
          <h1 className="page-title">Visão Geral</h1>
          <p className="page-subtitle">{today}</p>
        </div>
        <button className="btn btn-primary" onClick={onNewRecord}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Novo Registro
        </button>
      </div>

      {/* Stat cards */}
      <div className="dashboard__stats">
        {stats.map((s) => (
          <div key={s.label} className="dashboard__stat-card" style={{ "--card-accent": s.accent }}>
            <div className="dashboard__stat-icon" style={{ background: s.bg }}>{s.icon}</div>
            <p className="dashboard__stat-label">{s.label}</p>
            <p className="dashboard__stat-value">{s.value}</p>
            <p className="dashboard__stat-sub">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="dashboard__charts">
        <div className="card">
          <div className="card-title"><span className="dot" /> Evolução do IMC</div>
          <canvas ref={lineRef} style={{ maxHeight: 260 }} />
        </div>
        <div className="card">
          <div className="card-title"><span className="dot" style={{ background: "var(--accent2)" }} /> Distribuição IMC</div>
          <canvas ref={donutRef} style={{ maxHeight: 220 }} />
          <div className="dashboard__bmi-scale">
            {["#00b4d8","#00e5a0","#facc15","#f97316","#ef4444"].map((c) => (
              <div key={c} className="dashboard__bmi-segment" style={{ background: c }} />
            ))}
          </div>
          <div className="dashboard__bmi-scale-labels">
            <span>Baixo</span><span>Normal</span><span>Alto</span>
          </div>
        </div>
      </div>
    </section>
  );
}

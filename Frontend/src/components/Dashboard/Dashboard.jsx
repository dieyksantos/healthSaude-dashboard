import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "./Dashboard.css";

/* ================= helpers ================= */

function toNumberBR(v) {
  if (v === null || v === undefined) return NaN;
  if (typeof v === "number") return v;
  const s = String(v).trim().replace(",", ".");
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}

function normalizeAltura(altura) {
  if (!Number.isFinite(altura)) return NaN;
  // Se veio em cm (ex: 175), vira 1.75m
  if (altura > 3) return altura / 100;
  return altura;
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

function calcBMI(pesoKg, alturaM) {
  if (!Number.isFinite(pesoKg) || !Number.isFinite(alturaM) || alturaM <= 0) return null;
  return round1(pesoKg / (alturaM * alturaM));
}

function bmiCategory(bmi) {
  if (bmi === null || bmi === undefined || Number.isNaN(bmi)) return "—";
  if (bmi < 18.5) return "Abaixo do peso";
  if (bmi < 25) return "Peso normal";
  if (bmi < 30) return "Sobrepeso";
  if (bmi < 35) return "Obesidade grau I";
  if (bmi < 40) return "Obesidade grau II";
  return "Obesidade grau III";
}

function formatDate(d) {
  if (!d) return "—";
  // se já for YYYY-MM-DD
  if (typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
    const [y, m, day] = d.split("-");
    return `${day}/${m}/${y}`;
  }
  // se for ISO tipo 2026-03-02T...
  if (typeof d === "string") {
    const dt = new Date(d);
    if (!Number.isNaN(dt.getTime())) return dt.toLocaleDateString("pt-BR");
  }
  // se for Date
  if (d instanceof Date && !Number.isNaN(d.getTime())) return d.toLocaleDateString("pt-BR");
  return "—";
}

/**
 * Normaliza qualquer record para os campos esperados pelo dashboard:
 * - weight, height, bmi, category, date
 */
function normalizeRecord(r) {
  const weight =
    r?.weight ?? r?.peso ?? r?.pesoKg ?? r?.weightKg ?? null;

  const heightRaw =
    r?.height ?? r?.altura ?? r?.alturaM ?? r?.heightM ?? null;

  const weightN = toNumberBR(weight);
  const heightN = normalizeAltura(toNumberBR(heightRaw));

  const bmiFromRecord =
    Number.isFinite(toNumberBR(r?.bmi)) ? toNumberBR(r?.bmi)
    : Number.isFinite(toNumberBR(r?.imc)) ? toNumberBR(r?.imc)
    : null;

  const bmi = bmiFromRecord ?? calcBMI(weightN, heightN);

  const category = r?.category ?? r?.categoria ?? bmiCategory(bmi);

  const date = r?.date ?? r?.createdAt ?? r?.updatedAt ?? null;

  return {
    ...r,
    weight: Number.isFinite(weightN) ? weightN : (weight ?? "—"),
    height: Number.isFinite(heightN) ? heightN : (heightRaw ?? "—"),
    bmi,
    category,
    date,
  };
}

/* ================= UI constants ================= */

const STAT_CARDS = (last, total) => [
  { label: "Último Peso", value: last?.weight ?? "—", sub: "kg", icon: "⚖️", accent: "#00e5a0", bg: "rgba(0,229,160,0.1)" },
  { label: "Altura", value: last?.height ?? "—", sub: "metros", icon: "📏", accent: "#00b4d8", bg: "rgba(0,180,216,0.1)" },
  { label: "IMC Atual", value: (Number.isFinite(last?.bmi) ? last.bmi : "—"), sub: last?.category ?? "—", icon: "🏃", accent: "#a78bfa", bg: "rgba(167,139,250,0.1)" },
  { label: "Registros", value: total, sub: "no total", icon: "📊", accent: "#f97316", bg: "rgba(249,115,22,0.1)" },
];

const CAT_COLORS = {
  "Abaixo do peso": "#00b4d8",
  "Peso normal": "#00e5a0",
  "Sobrepeso": "#facc15",
  "Obesidade grau I": "#f97316",
  "Obesidade grau II": "#ef4444",
  "Obesidade grau III": "#dc2626",
};

/* ================= component ================= */

export function Dashboard({ records = [], onNewRecord }) {
  const lineRef = useRef(null);
  const donutRef = useRef(null);
  const lineChart = useRef(null);
  const donutChart = useRef(null);

  // ✅ normaliza records para ter bmi/category sempre
  const normalized = (records || []).map(normalizeRecord);

  const last = normalized[normalized.length - 1] ?? null;
  const stats = STAT_CARDS(last, normalized.length);

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    if (!normalized.length) return;

    const sorted = [...normalized].sort((a, b) => new Date(a.date) - new Date(b.date));
    const labels = sorted.map((d) => formatDate(d.date));
    const values = sorted.map((d) => d.bmi);

    // Line chart
    if (lineChart.current) lineChart.current.destroy();
    lineChart.current = new Chart(lineRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
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
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#1a2235",
            borderColor: "rgba(255,255,255,0.1)",
            borderWidth: 1,
            titleColor: "#e8edf5",
            bodyColor: "#6b7a99",
            padding: 12,
          },
        },
        scales: {
          x: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#6b7a99", font: { size: 11 } } },
          y: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#6b7a99", font: { size: 11 } } },
        },
      },
    });

    // Donut chart
    const catCount = normalized.reduce((acc, d) => {
      const key = d.category ?? "—";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});

    if (donutChart.current) donutChart.current.destroy();
    donutChart.current = new Chart(donutRef.current, {
      type: "doughnut",
      data: {
        labels: Object.keys(catCount),
        datasets: [
          {
            data: Object.values(catCount),
            backgroundColor: Object.keys(catCount).map((k) => CAT_COLORS[k] ?? "#6b7a99"),
            borderWidth: 0,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        responsive: true,
        cutout: "72%",
        plugins: {
          legend: { position: "bottom", labels: { color: "#6b7a99", font: { size: 11 }, padding: 12 } },
          tooltip: {
            backgroundColor: "#1a2235",
            borderColor: "rgba(255,255,255,0.1)",
            borderWidth: 1,
            titleColor: "#e8edf5",
            bodyColor: "#6b7a99",
            padding: 12,
          },
        },
      },
    });

    return () => {
      lineChart.current?.destroy();
      donutChart.current?.destroy();
    };
  }, [normalized]);

  return (
    <section className="page-enter">
      <div className="page-header">
        <div>
          <h1 className="page-title">Visão Geral</h1>
          <p className="page-subtitle">{today}</p>
        </div>
        <button className="btn btn-primary" onClick={onNewRecord}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
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
            <p className="dashboard__stat-value">
              {s.label === "IMC Atual" && Number.isFinite(s.value) ? s.value.toFixed(1) : s.value}
            </p>
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
            {["#00b4d8", "#00e5a0", "#facc15", "#f97316", "#ef4444"].map((c) => (
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
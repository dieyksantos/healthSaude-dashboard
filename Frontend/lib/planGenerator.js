// src/lib/planGenerator.js
function round2(n) {
  return Math.round(n * 100) / 100;
}

function calcIMC(pesoKg, alturaM) {
  return round2(pesoKg / (alturaM * alturaM));
}

function categoriaIMC(imc) {
  if (imc < 18.5) return "Abaixo do peso";
  if (imc < 25) return "Peso normal";
  if (imc < 30) return "Sobrepeso";
  if (imc < 35) return "Obesidade grau I";
  if (imc < 40) return "Obesidade grau II";
  return "Obesidade grau III";
}

function pesoAlvoSaudavel(alturaM, imcMax = 24.9) {
  return round2(imcMax * alturaM * alturaM);
}

function htmlGuidance(acao) {
  if (acao === "perder") {
    return {
      guidance_titulo: "Direcionamento (Emagrecimento)",
      guidance_alimentacao: `
        <b>Objetivo:</b> déficit calórico (gastar mais do que consome) preservando a massa muscular.<br/><br/>
        <b>Prioridade Proteica:</b> Consuma proteínas em todas as refeições (ovo, frango, peixe, tofu). Elas saciam e protegem os músculos.<br/>
        <b>Carboidratos Inteligentes:</b> Troque farinha branca e açúcar por opções de baixo índice glicêmico (aveia, batata-doce, arroz integral).<br/>
        <b>Fibras:</b> Metade do prato deve ser vegetais verdes e legumes. Isso aumenta o volume da comida sem explodir as calorias.<br/>
        <b>Gorduras:</b> Use com moderação (azeite, abacate, castanhas).
      `,
      guidance_treino: `
        <b>Musculação (Prioridade):</b> Foque em treinos de 45 a 60 minutos.<br/>
        <b>Cardio Estratégico:</b> 20 a 30 minutos de caminhada rápida (ou inclinação).<br/>
        <b>Frequência:</b> 4 a 5 vezes por semana.
      `,
    };
  }

  if (acao === "ganhar") {
    return {
      guidance_titulo: "Direcionamento (Ganho de Peso)",
      guidance_alimentacao: `
        <b>Objetivo:</b> superávit calórico com qualidade.<br/><br/>
        <b>Proteína:</b> em todas as refeições.<br/>
        <b>Carboidratos:</b> aumente porções de arroz, aveia, batata, massas integrais.<br/>
        <b>Gorduras boas:</b> azeite, pasta de amendoim, castanhas.
      `,
      guidance_treino: `
        <b>Musculação (Prioridade):</b> 4x/semana com progressão de carga.<br/>
        <b>Cardio:</b> moderado (evitar excesso).
      `,
    };
  }

  return {
    guidance_titulo: "Direcionamento (Manutenção)",
    guidance_alimentacao: `
      <b>Objetivo:</b> equilíbrio calórico e consistência.<br/><br/>
      <b>Base:</b> prato equilibrado e rotina.
    `,
    guidance_treino: `
      <b>Força:</b> 3 a 4 vezes por semana.<br/>
      <b>Cardio:</b> 2 vezes por semana (20-30 min).
    `,
  };
}

export function gerarPlanoNoFront({ pesoKg, alturaM }) {
  const imc_atual = calcIMC(pesoKg, alturaM);
  const categoria = categoriaIMC(imc_atual);

  const peso_alvo = pesoAlvoSaudavel(alturaM, 24.9);
  const diferenca_kg = round2(Math.abs(pesoKg - peso_alvo));

  const acao = pesoKg > peso_alvo ? "perder" : (pesoKg < peso_alvo ? "ganhar" : "manter");

  const analise_peso =
    acao === "perder"
      ? `Você precisa perder aproximadamente ${diferenca_kg} kg para atingir o peso saudável de ${peso_alvo} kg (IMC 24.9).`
      : acao === "ganhar"
      ? `Você precisa ganhar aproximadamente ${diferenca_kg} kg para atingir o peso saudável de ${peso_alvo} kg (IMC 24.9).`
      : `Você já está no peso alvo aproximado de ${peso_alvo} kg (IMC 24.9).`;

  return {
    id: Date.now(),
    plan: {
      imc_atual,
      categoria,
      peso_alvo,
      diferenca_kg,
      analise_peso,
      acao,
      ...htmlGuidance(acao),
    },
  };
}
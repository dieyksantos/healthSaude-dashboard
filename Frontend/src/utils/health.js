/**
 * Calculates BMI from weight (kg) and height (m).
 */
export function calcBMI(weight, height) {
  return parseFloat((weight / (height * height)).toFixed(2));
}

/**
 * Returns the BMI category string.
 */
export function getBMICategory(bmi) {
  if (bmi < 18.5) return "Abaixo do peso";
  if (bmi < 25)   return "Peso normal";
  if (bmi < 30)   return "Sobrepeso";
  if (bmi < 35)   return "Obesidade grau I";
  if (bmi < 40)   return "Obesidade grau II";
  return "Obesidade grau III";
}

/**
 * Returns the CSS badge class for a given category.
 */
export function getCategoryBadgeClass(category) {
  const map = {
    "Abaixo do peso":    "badge-blue",
    "Peso normal":       "badge-green",
    "Sobrepeso":         "badge-yellow",
    "Obesidade grau I":  "badge-orange",
    "Obesidade grau II": "badge-red",
    "Obesidade grau III":"badge-red",
  };
  return map[category] ?? "badge-yellow";
}

/**
 * Sample demo data used when the API is unreachable.
 */
export const DEMO_DATA = [
  { id: 1, weight: 75.0, height: 1.75, date: "2024-10-15", bmi: 24.49, category: "Peso normal" },
  { id: 2, weight: 76.2, height: 1.75, date: "2024-11-01", bmi: 24.88, category: "Peso normal" },
  { id: 3, weight: 77.5, height: 1.75, date: "2024-11-15", bmi: 25.31, category: "Sobrepeso" },
  { id: 4, weight: 76.8, height: 1.75, date: "2024-12-01", bmi: 25.08, category: "Sobrepeso" },
  { id: 5, weight: 75.3, height: 1.75, date: "2025-01-10", bmi: 24.59, category: "Peso normal" },
  { id: 6, weight: 74.1, height: 1.75, date: "2025-02-01", bmi: 24.20, category: "Peso normal" },
];

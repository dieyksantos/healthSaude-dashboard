// src/hooks/useHealth.js
import { useCallback, useMemo, useState } from "react";
import {
  loadRecords,
  addRecord,
  updateRecord,
  deleteRecord,
} from "../lib/localRecords";

function round1(n) {
  return Math.round(n * 10) / 10;
}

function calcIMC(pesoKg, alturaM) {
  if (!pesoKg || !alturaM) return null;
  return round1(pesoKg / (alturaM * alturaM));
}

// tenta encontrar peso/altura em diferentes nomes (caso seu form use outros)
function getPesoAltura(formData) {
  const peso =
    Number(formData?.peso ?? formData?.weight ?? formData?.pesoKg ?? 0);
  const altura =
    Number(formData?.altura ?? formData?.height ?? formData?.alturaM ?? 0);

  return { pesoKg: peso, alturaM: altura };
}

export function useHealth() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const isDemoMode = useMemo(() => false, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = loadRecords();
      setRecords(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const add = useCallback(async (formData) => {
    const { pesoKg, alturaM } = getPesoAltura(formData);
    const imc = calcIMC(pesoKg, alturaM);

    const newRecord = {
      id: Date.now(),
      ...formData,
      imc, // ✅ agora salva IMC
      createdAt: new Date().toISOString(),
    };

    addRecord(newRecord);
    setRecords(loadRecords());
    return newRecord;
  }, []);

  const edit = useCallback(async (id, formData) => {
    const { pesoKg, alturaM } = getPesoAltura(formData);
    const imc = calcIMC(pesoKg, alturaM);

    const updated = updateRecord(id, {
      ...formData,
      imc, // ✅ recalcula IMC ao editar
      updatedAt: new Date().toISOString(),
    });

    setRecords(loadRecords());
    return updated;
  }, []);

  const remove = useCallback(async (id) => {
    deleteRecord(id);
    setRecords(loadRecords());
    return true;
  }, []);

  return { records, loading, isDemoMode, load, add, edit, remove };
}
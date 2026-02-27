import { useState, useCallback } from "react";
import { fetchRecords, createRecord, updateRecord, deleteRecord } from "../services/api";
import { calcBMI, getBMICategory, DEMO_DATA } from "../utils/health";

export function useHealth() {
  const [records, setRecords]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchRecords();
      setRecords(data);
      setIsDemoMode(false);
    } catch {
      // API unavailable — fall back to demo data
      setRecords(DEMO_DATA);
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const add = useCallback(async (formData) => {
    const bmi      = calcBMI(formData.weight, formData.height);
    const category = getBMICategory(bmi);

    if (isDemoMode) {
      setRecords((prev) => [
        ...prev,
        { id: Date.now(), ...formData, bmi, category },
      ]);
      return;
    }

    await createRecord(formData);
    await load();
  }, [isDemoMode, load]);

  const edit = useCallback(async (id, formData) => {
    const bmi      = calcBMI(formData.weight, formData.height);
    const category = getBMICategory(bmi);

    if (isDemoMode) {
      setRecords((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...formData, bmi, category } : r))
      );
      return;
    }

    await updateRecord(id, formData);
    await load();
  }, [isDemoMode, load]);

  const remove = useCallback(async (id) => {
    if (isDemoMode) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
      return;
    }

    await deleteRecord(id);
    await load();
  }, [isDemoMode, load]);

  return { records, loading, isDemoMode, load, add, edit, remove };
}

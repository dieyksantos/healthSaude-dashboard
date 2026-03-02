// src/hooks/useHealth.js
import { useCallback, useMemo, useState } from "react";
import {
  loadRecords,
  addRecord,
  updateRecord,
  deleteRecord,
} from "../lib/localRecords";

export function useHealth() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  // como agora é tudo local, demo mode é false
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
    const newRecord = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
    };
    addRecord(newRecord);
    setRecords(loadRecords());
    return newRecord;
  }, []);

  const edit = useCallback(async (id, formData) => {
    const updated = updateRecord(id, {
      ...formData,
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
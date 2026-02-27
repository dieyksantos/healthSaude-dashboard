import { useState, useCallback, useEffect } from "react";
import "./Toast.css";

export function Toast({ message, onDismiss }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onDismiss, 2800);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  return <div className="toast">{message}</div>;
}

/**
 * Hook to manage toast state.
 * Usage: const { toast, showToast } = useToast();
 */
export function useToast() {
  const [toast, setToast] = useState("");

  const showToast = useCallback((msg) => {
    setToast(msg);
  }, []);

  const dismissToast = useCallback(() => {
    setToast("");
  }, []);

  return { toast, showToast, dismissToast };
}

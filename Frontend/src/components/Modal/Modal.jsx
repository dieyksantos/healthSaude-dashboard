import { useState, useEffect } from "react";
import "./Modal.css";

const EMPTY_FORM = { weight: "", height: "", date: "" };

export function Modal({ isOpen, record, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const isEditing = Boolean(record);

  useEffect(() => {
    if (isOpen) {
      setForm(
        record
          ? { weight: record.weight, height: record.height, date: record.date }
          : { ...EMPTY_FORM, date: new Date().toISOString().slice(0, 10) }
      );
    }
  }, [isOpen, record]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave({
      weight: parseFloat(form.weight),
      height: parseFloat(form.height),
      date:   form.date,
    });
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="modal__overlay" onClick={handleOverlayClick}>
      <div className="modal__box">
        <h2 className="modal__title">
          {isEditing ? "Editar Registro" : "Novo Registro"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="modal__grid">
            <div className="modal__field">
              <label htmlFor="weight">Peso (kg)</label>
              <input
                id="weight"
                name="weight"
                type="number"
                placeholder="Ex: 70.5"
                step="0.01"
                min="1"
                max="500"
                value={form.weight}
                onChange={handleChange}
                required
              />
            </div>

            <div className="modal__field">
              <label htmlFor="height">Altura (m)</label>
              <input
                id="height"
                name="height"
                type="number"
                placeholder="Ex: 1.75"
                step="0.01"
                min="0.5"
                max="3"
                value={form.height}
                onChange={handleChange}
                required
              />
            </div>

            <div className="modal__field modal__field--full">
              <label htmlFor="date">Data</label>
              <input
                id="date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="modal__actions">
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              {isEditing ? "Atualizar" : "Salvar Registro"}
            </button>
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

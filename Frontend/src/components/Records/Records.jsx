import { getCategoryBadgeClass } from "../../utils/health";
import "./Records.css";

function formatDate(d) {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

export function Records({ records, onNewRecord, onEdit, onDelete }) {
  return (
    <section className="page-enter">
      <div className="page-header">
        <div>
          <h1 className="page-title">Registros</h1>
          <p className="page-subtitle">Histórico completo de saúde</p>
        </div>
        <button className="btn btn-primary" onClick={onNewRecord}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Novo Registro
        </button>
      </div>

      <div className="records__table-card">
        <div className="records__table-header">
          <div className="card-title" style={{ margin: 0 }}>
            <span className="dot" /> Todos os Registros
          </div>
          <span className="records__count">
            {records.length} registro{records.length !== 1 ? "s" : ""}
          </span>
        </div>

        <table className="records__table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Data</th>
              <th>Peso (kg)</th>
              <th>Altura (m)</th>
              <th>IMC</th>
              <th>Categoria</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="empty-state">
                    <div className="icon">🩺</div>
                    <p>Nenhum registro encontrado.<br />Adicione seu primeiro dado!</p>
                  </div>
                </td>
              </tr>
            ) : (
              [...records].reverse().map((item) => (
                <tr key={item.id}>
                  <td className="records__id">#{item.id}</td>
                  <td>{formatDate(item.date)}</td>
                  <td><strong>{item.weight}</strong></td>
                  <td>{item.height}</td>
                  <td><strong>{item.bmi}</strong></td>
                  <td>
                    <span className={`badge ${getCategoryBadgeClass(item.category)}`}>
                      {item.category}
                    </span>
                  </td>
                  <td className="records__actions">
                    <button
                      className="btn btn-edit"
                      onClick={() => onEdit(item)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => onDelete(item.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

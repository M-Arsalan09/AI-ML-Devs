import React from "react";

function formatMonthYear(dateString) {
  if (!dateString) return "";
  const s = dateString.trim();
  let d = new Date(s);
  if (isNaN(d)) {
    // Try ISO style
    const alt = s.replace(" ", "T");
    d = new Date(alt);
  }
  if (isNaN(d)) {
    return dateString;
  }
  const options = { year: "numeric", month: "long" };
  return new Intl.DateTimeFormat("en-US", options).format(d);
}

function RenderTable({ title, items }) {
  if (!items || items.length === 0) return <div className="empty">{title} — none</div>;

  const keys = Array.from(
    items.reduce((acc, it) => {
      Object.keys(it).forEach((k) => acc.add(k));
      return acc;
    }, new Set())
  );

  return (
    <div className="table-block">
      <h3>{title}</h3>
      <table>
        <thead>
          <tr>
            {keys.map((k) => (
              <th key={k}>{k}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((row, i) => (
            <tr key={i}>
              {keys.map((k) => (
                <td key={k + i}>
                  {row[k] != null ? String(row[k]) : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DeveloperDetails({ developer, onBack }) {
  if (!developer) {
    return <div className="placeholder">Select a developer from the left to see details.</div>;
  }

  console.log("Developer in DeveloperDetails:", developer);

  const name = developer.Name || developer["Full Name"] || developer.name || "Unknown";
  const details = developer.details || { skills: [], projects: [], learning: [] };

  // Keys which we expect to be dates
  const dateKeys = ["Graduation", "Employment Duration"];

  return (
    <div className="details">
      <div className="details-header">
        <button onClick={onBack}>Back</button>
        <h2>{name}</h2>
      </div>

      <div className="meta-grid">
        {Object.entries(developer).map(([k, v]) => {
          if (k === "details") return null;

          let displayValue = v;
          if (v != null && (dateKeys.includes(k) || (typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v.trim())))) {
            displayValue = formatMonthYear(v);
          }

          return (
            <div key={k} className="meta-item">
              <strong>{k}</strong>
              <div>{displayValue != null ? String(displayValue) : ""}</div>
            </div>
          );
        })}
      </div>

      <RenderTable title="Skills" items={details.skills} />
      <RenderTable title="Projects" items={details.projects} />
      <RenderTable title="Learning" items={details.learning} />
    </div>
  );
}

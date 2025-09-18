import React from "react";

export default function DeveloperList({ data = [], onSelect, selectedIndex }) {
  return (
    <div>
      <h2>Developers</h2>
      <div className="list">
        {data.length === 0 && <div>No developers found in data.json</div>}
        {data.map((dev, idx) => {
          const name = dev.Name || dev["Full Name"] || dev.name || `Dev ${idx+1}`;
          return (
            <div
              key={idx}
              className={`dev-item ${selectedIndex === idx ? "selected" : ""}`}
              onClick={() => onSelect(idx)}
            >
              <div className="dev-name">{name}</div>
              <div className="dev-meta">
                {dev.Role || dev["Role"] || dev.Position || ""}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// src/LearningByField.js

import React, { useState, useEffect } from "react";
import "./LearningByField.css";

function normalizeText(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")   // remove non-alphanumeric, replace with space
    .replace(/\s+/g, " ")            // collapse multiple spaces
    .trim();
}

function getSkillLevel(skillText, devSkills) {
  if (!devSkills || !Array.isArray(devSkills) || devSkills.length === 0) {
    return "Unidentified";
  }

  const skillNorm = normalizeText(skillText);

  for (let s of devSkills) {
    // Possible name fields in dev skill records
    const devSkillRaw =
      s["Skill"] ||
      s["skill"] ||
      s["Technology"] ||
      s["technology"] ||
      s["Skill / Technology"] ||
      s["name"] ||
      "";

    const devNameNorm = normalizeText(devSkillRaw);

    if (!devNameNorm) continue;

    // Direct exact match
    if (devNameNorm === skillNorm) {
        console.log("this")
        console.log(devNameNorm)
        console.log(skillNorm)
      return s["Experience level"] || s["Level"] || s["experience_level"] || "Unidentified";
    }

    // If dev skill name is part of project skill text
    if (skillNorm.includes(devNameNorm)) {
        console.log("this 2")
        console.log(devNameNorm)
        console.log(skillNorm)
        console.log(s)
      return s["Experience Level"] || s["Level"] || s["experience_level"] || "Unidentified";
    }

    // If project skill text normalized is part of dev skill name
    if (devNameNorm.includes(skillNorm)) {
        console.log("this 3")
        console.log(devNameNorm)
        console.log(skillNorm)
      return s["Experience level"] || s["Level"] || s["experience_level"] || "Unidentified";
    }

    // Also try splitting project skill after colon, take right part
    const parts = skillText.split(":");
    if (parts.length > 1) {
      const rightPart = normalizeText(parts.slice(1).join(":"));
      if (rightPart && (rightPart === devNameNorm || rightPart.includes(devNameNorm) || devNameNorm.includes(rightPart))) {
        return s["Experience level"] || s["Level"] || s["experience_level"] || "Unidentified";
      }
    }
  }

  return "Unidentified";
}

export default function LearningByField({ data }) {
  const [fieldsData, setFieldsData] = useState([]);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(null);
  const [selectedDevIndex, setSelectedDevIndex] = useState(null);

  useEffect(() => {
    fetch("/project_fields_skills.json")
      .then(r => {
        if (!r.ok) {
          throw new Error(`HTTP error ${r.status}`);
        }
        return r.json();
      })
      .then(j => {
        console.log("Loaded project_fields_skills.json:", j);
        if (j.Fields && Array.isArray(j.Fields)) {
          setFieldsData(j.Fields);
        } else {
          console.error("project_fields_skills.json has no Fields array or wrong format");
        }
      })
      .catch(err => console.error("Failed to load project_fields_skills.json:", err));
  }, []);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div>No developer data.</div>;
  }
  if (!fieldsData || fieldsData.length === 0) {
    return <div>Loading fields...</div>;
  }

  return (
    <div className="learning-by-field">
      <h2>Learning by Field</h2>

      <div className="selectors-grid">
        <div className="selector-fields">
          <h3>Select Field</h3>
          {fieldsData.map((fld, i) => (
            <div
              key={i}
              className={`field-item ${selectedFieldIndex === i ? "selected" : ""}`}
              onClick={() => { setSelectedFieldIndex(i); setSelectedDevIndex(null); }}
            >
              {fld.fieldName}
            </div>
          ))}
        </div>

        {selectedFieldIndex !== null && (
          <div className="selector-devs">
            <h3>Select Developer</h3>
            {data.map((dev, j) => {
              const name = dev.Name || dev["Full Name"] || dev.name || `Dev ${j+1}`;
              return (
                <div
                  key={j}
                  className={`dev-item ${selectedDevIndex === j ? "selected" : ""}`}
                  onClick={() => setSelectedDevIndex(j)}
                >
                  {name}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedFieldIndex !== null && selectedDevIndex !== null && (
        <div className="field-dev-skills">
          <h3>
            Skills in <strong>{fieldsData[selectedFieldIndex].fieldName}</strong> for{" "}
            <strong>{data[selectedDevIndex].Name || data[selectedDevIndex]["Full Name"] || data[selectedDevIndex].name}</strong>
          </h3>
          <table className="field-skills-table">
            <thead>
              <tr><th>Skill / Technology</th><th>Level</th></tr>
            </thead>
            <tbody>
              {fieldsData[selectedFieldIndex].skillsTechnologies.map((sk, idx) => {
                const level = getSkillLevel(sk, data[selectedDevIndex].details.skills);
                return (
                  <tr key={idx}>
                    <td>{sk}</td>
                    <td>{level}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

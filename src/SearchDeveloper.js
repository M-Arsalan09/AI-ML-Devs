// src/SearchDeveloper.js

import React, { useState } from "react";

export default function SearchDeveloper({ developers }) {
  const [title, setTitle] = useState("");
  const [requirements, setRequirements] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !requirements) return;

    setLoading(true);
    setResult(null);

    try {
      const resp = await fetch("ai-ml-devs.vercel.app/api/search-developer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          requirements,
          developers   // most likely `data` from your `data.json`
        })
      });

      const j = await resp.json();
      setResult(j);
    } catch (e) {
      setResult({ error: e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Search Developer for a Project</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Project Title:</label><br />
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </div>
        <div style={{ marginTop: "1rem" }}>
          <label>Requirements & Description:</label><br />
          <textarea
            value={requirements}
            onChange={e => setRequirements(e.target.value)}
            rows={5}
            required
            style={{ width: "100%" }}
          />
        </div>
        <div style={{ marginTop: "1rem" }}>
          <button type="submit" disabled={loading}>
            {loading ? "Searching…" : "Find Best Developer"}
          </button>
        </div>
      </form>
      {result && (
        <div style={{ marginTop: "1.5rem" }}>
          {result.error ? (
            <div style={{ color: "red" }}>Error: {result.error}</div>
          ) : (
            <div>
              <p><strong>Best Developer:</strong> {result.result.bestDeveloper}</p>
              <p><strong>Score:</strong> {result.result.score}</p>
              <p><strong>Reason:</strong> {result.result.reasoning}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

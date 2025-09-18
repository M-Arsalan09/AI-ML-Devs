// in App.js, modify imports
import React, { useEffect, useState } from "react";
import DeveloperList from "./DeveloperList";
import DeveloperDetails from "./DeveloperDetails";
import Learning from "./Learning";  // new
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [selectedDevIndex, setSelectedDevIndex] = useState(null);
  const [tab, setTab] = useState("developers"); // possible values: 'developers', 'projects', 'learning'

  useEffect(() => {
    fetch("/data.json")
      .then(r => r.json())
      .then(json => {
        setData(json.Data || []);
      })
      .catch(err => {
        console.error("Failed to load data.json:", err);
      });
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>Developers Dashboard</h1>
        <div className="tabs">
          <button
            className={tab === "developers" ? "active" : ""}
            onClick={() => setTab("developers")}
          >
            Developers
          </button>
          <button
            className={tab === "projects" ? "active" : ""}
            onClick={() => setTab("projects")}
          >
            Projects Information
          </button>
          <button
            className={tab === "learning" ? "active" : ""}
            onClick={() => setTab("learning")}
          >
            Learning
          </button>
        </div>
      </header>

      <main className="main">
        {tab === "developers" && (
          <div className="layout">
            <div className="left">
              <DeveloperList
                data={data}
                onSelect={i => setSelectedDevIndex(i)}
                selectedIndex={selectedDevIndex}
              />
            </div>
            <div className="right">
              <DeveloperDetails
                developer={data[selectedDevIndex]}
                onBack={() => setSelectedDevIndex(null)}
              />
            </div>
          </div>
        )}

        {tab === "projects" && (
          <div className="projects-frame">
            <iframe
              title="Projects Information"
              src="/projects.html"
              style={{ width: "100%", height: "80vh", border: "none" }}
            />
          </div>
        )}

        {tab === "learning" && (
          <Learning data={data} />
        )}
      </main>
    </div>
  );
}

export default App;

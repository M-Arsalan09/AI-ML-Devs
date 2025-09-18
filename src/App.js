// src/App.js
import React, { useEffect, useState } from "react";
import DeveloperList from "./DeveloperList";
import DeveloperDetails from "./DeveloperDetails";
import LearningByField from "./LearningByField";
import SearchDeveloper from "./SearchDeveloper";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [selectedDevIndex, setSelectedDevIndex] = useState(null);
  const [tab, setTab] = useState("developers"); 
  // possible tab values: "developers", "projects", "learning", "search"

  useEffect(() => {
    fetch("/data.json")
      .then(r => r.json())
      .then(j => setData(j.Data || []))
      .catch(err => console.error("Failed loading data:",err));
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>Developer Dashboard</h1>
        <div className="tabs">
          <button className={tab==="developers"?"active":""} onClick={()=>setTab("developers")}>Developers</button>
          <button className={tab==="projects"?"active":""} onClick={()=>setTab("projects")}>Projects Info</button>
          <button className={tab==="learning"?"active":""} onClick={()=>setTab("learning")}>Learning</button>
          <button className={tab==="search"?"active":""} onClick={()=>setTab("search")}>Search Developer</button>
        </div>
      </header>
      <main className="main">
        {tab === "developers" && (
          <div className="layout">
            <div className="left">
              <DeveloperList data={data} onSelect={i=>setSelectedDevIndex(i)} selectedIndex={selectedDevIndex}/>
            </div>
            <div className="right">
              <DeveloperDetails developer={data[selectedDevIndex]} onBack={()=>setSelectedDevIndex(null)}/>
            </div>
          </div>
        )}
        {tab === "projects" && (
          <div className="projects-frame">
            <iframe src="/projects.html" title="Projects Info" style={{width:"100%", height:"80vh", border:"none"}}/>
          </div>
        )}
        {tab === "learning" && (
          <LearningByField data={data}/>
        )}
        {tab === "search" && (
          <SearchDeveloper developers={data}/>
        )}
      </main>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import '../../style/AiModel.css'
import api from "../../utils/constants";


function AiModel({ source, onClose }) {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await api.post(
        "/api/getValue",
        { url: source },
        { headers: { "Content-Type": "application/json" } }
      );
      setData(response.data);
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (source) {
      fetchData();
    }
  }, [source]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  return (
    <div className="modal-overlay2">
      <div className="modal-content2">
        <span className="modal-close2" onClick={onClose}>×</span>
        <h2>AI Model</h2>
        <p>Received Source URL:</p>
        <pre className="source-box2">{source}</pre>
        <div className="data-box2">
          {data ? <ReactMarkdown>{data}</ReactMarkdown> : <p>Loading...</p>}
        </div>
        <div className="link-box2">
          <a href={source} target="_blank" rel="noopener noreferrer">
            Go To Main Website
          </a>
        </div>
      </div>
    </div>
  );
}

export default AiModel;

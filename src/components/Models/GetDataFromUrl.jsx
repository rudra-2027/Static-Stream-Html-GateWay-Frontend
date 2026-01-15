import React, { useState } from 'react';
// import api from 'axios';
import '../../style/GetDataUrlModel.css'
import api from '../../utils/constants';
import { toast } from 'react-toastify';


function GetDataFromUrl() {
  const [inputValue, setInputValue] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [headlines, setHeadlines] = useState([]);

  const handleFetch = async () => {
    console.log(inputValue);

    if (!inputValue) return;
    setLoading(true);
    try {
      const response = await api.post("/headlines/fetch", {
        url: inputValue,
        headers: { "Content-Type": "text/plain" }
      });
      setData(response.data);
      console.log(Object.keys(response.data).length);

      console.log("Response type:", typeof response.data, "value:", response.data);

      if (!response.data ||
        (Array.isArray(response.data) && response.data.length === 0) ||
        (typeof response.data === "object" && Object.keys(response.data).length === 0)) {
        toast.error("Sorry, no data allowed from this site");
        setData(null);

        setLoading(false);
        return;
      }
      const headlinesResponse = await api.post("/headlines/recentUrl", {
        url: inputValue,
        headers: { "Content-Type": "text/plain" }
      });
      console.log(headlinesResponse.data)

      setHeadlines(headlinesResponse.data);
    } catch (error) {
      toast.error("Sorry This Site Dosen't Allow To Scrap The Data")
      // console.error("Error fetching data:", error);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Get Data From URL</h3>
      <input
        type="text"
        placeholder="Enter URL or keyword"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={{ marginRight: "10px", padding: "5px", width: "300px" }}
      />
      <button onClick={handleFetch} style={{ padding: "5px 10px" }}>Fetch</button>

      {loading && <p>Loading...</p>}

      {headlines && (
        <ul>
          {headlines.map((item, index) => (
            <li key={index} style={{ marginBottom: "10px" }}>
              <strong>{item.text}</strong> <br />
              <span>{item.source}</span> <br />
              <a href={item.source} target="_blank" rel="noopener noreferrer">View Source</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default GetDataFromUrl;

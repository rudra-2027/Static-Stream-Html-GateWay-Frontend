import { useState, useEffect } from "react";
// import axios from "axios";
import { IoArrowBackCircleOutline } from 'react-icons/io5';
import { IoPlayOutline, } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";
import { BiSquare } from "react-icons/bi";
import "../../style/Active.css";
import api from "../../utils/constants";
import { useNavigate } from "react-router-dom";


function Active() {
  const [data, setData] = useState([]);
  const [fetchedData, setFetchedData] = useState({});
  const [timers, setTimers] = useState({});
  const navigate = useNavigate();


  const fetchData = async () => {
    try {
      const res = await api.get("/headlines/getUrl");
      const urlsWithId = res.data.map((item, index) => ({
        id: item.id ?? index,
        ...item,
      }));
      setData(urlsWithId);
    } catch (error) {
      console.log("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch for a single URL
  const fetchUrlData = async (item) => {
    if (!item?.url) return;
    console.log(item.url);

    try {
      const res = await api.post("/headlines/fetch", {
        url: item.url,
        headers: { "Content-Type": "text/plain" }
      });
      setFetchedData((prev) => ({ ...prev, [item.id]: res.data }));
      console.log("Fetched:", item.url);
    } catch (error) {
      console.log("Fetch URL data error:", error);
    }
  };

  // Handle start/stop
  const toggleActive = async (item) => {
    try {
      const updatedItem = { ...item, active: !item.active };

      await api.put(
        "/headlines/updateActive",
        updatedItem,
        { headers: { "Content-Type": "application/json" } }
      );

      setData((prev) =>
        prev.map((d) => (d.id === item.id ? updatedItem : d))
      );

      if (updatedItem.active) {
        fetchUrlData(updatedItem);
        setTimers((prev) => ({ ...prev, [item.id]: 20 })); // start at 20
      } else {
        setTimers((prev) => {
          const copy = { ...prev };
          delete copy[item.id];
          return copy;
        });
      }
    } catch (error) {
      console.log("Toggle error:", error);
    }
  };

  // Countdown logic
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((id) => {
          if (updated[id] > 1) {
            updated[id] -= 1;
          } else {
            // When reaches 0 → fetch again & reset
            const activeItem = data.find((d) => d.id.toString() === id);
            if (activeItem && activeItem.active) fetchUrlData(activeItem);
            updated[id] = 20;
          }
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [data]);

  // Delete a URL
  const onDelete = async (item) => {
    try {
      await api.delete("/headlines/deleteUrl", {
        data: { url: item.url },
        headers: { "Content-Type": "application/json" },
      });
      setData((prev) => prev.filter((d) => d.id !== item.id));
      setTimers((prev) => {
        const copy = { ...prev };
        delete copy[item.id];
        return copy;
      });
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  return (
    <div>


      <div >

        <h1>
          <button onClick={() => navigate("/dashboard")}>
            <IoArrowBackCircleOutline />
          </button>
          Activate Your Site for Fetching
        </h1>
        <ul className="container">
          {data.map((item) => (
            <li className="list" key={item.id}>
              <span>{item.url}</span>
              <div className="Btns">
                <h2 style={{ color: item.active ? "green" : "red" }}>
                  {item.active ? "Active" : "Inactive"}
                </h2>

                <button
                  className={`play-btn ${item.active ? "stop-btn" : ""}`}
                  onClick={() => toggleActive(item)}
                  title={item.active ? "Stop" : "Start"}
                >
                  {item.active ? <BiSquare /> : <IoPlayOutline />}
                </button>

                {item.active && (
                  <span style={{ marginLeft: 10, color: "orange" }}>
                    ⏱ Next fetch in {timers[item.id] ?? 20}s
                  </span>
                )}

                <button className="delete-btn" onClick={() => onDelete(item)}>
                  <IoIosClose />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Active;

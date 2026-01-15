import React, { useEffect, useState } from "react";
// import axios from "axios"; 
import DashBoardHeader from "./DashBoardHeader2";
import DashboardCards from "./DashboardCards";
import RecentHeadlines from "./RecentHeadlines";
import HeadlinesTable from "./HeadlinesTable";


import "../../style/App.css";
import api from "../../utils/constants";
import { useNavigate } from "react-router-dom";


function DashBoard() {

  const [headlines, setHeadlines] = useState([]);
  const [recentHeadlines, setRecentHeadlines] = useState([]);
  const [sourceResults, setSourceResults] = useState([]);
  const [activate, setActive] = useState([]);
  const [headlineCount, setHeadlineCount] = useState(0);
  const [recentCount, setRecentCount] = useState(0);
  const [averagePerHour, setAveragePerHour] = useState(0);

  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate()


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    console.log("Token before fetch:", localStorage.getItem("token"));
    const fetchData = async () => {
      try {
        const [all, recentCnt, count, avg, recent, doactivate] = await Promise.all([
          api.get("/headlines"),
          api.get("/headlines/recentCount"),
          api.get("/headlines/count"),
          api.get("/headlines/avgPerHour"),
          api.get("/headlines/recent"),
          api.get("/headlines/acivatS")
        ]);

        setHeadlines(all.data);
        setRecentCount(recentCnt.data);
        setHeadlineCount(count.data);
        setAveragePerHour(avg.data);
        setRecentHeadlines(recent.data);
        setActive(doactivate.data.length);

      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!searchValue) return;
    const delay = setTimeout(async () => {
      try {
        const res = await api.post(
          "/headlines/source",
          { url: searchValue },
          { headers: { "Content-Type": "application/json" } }
        );

        setSourceResults(res.data);
      } catch (err) {
        console.error("Error fetching source:", err);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [searchValue]);

  return (

    <div className="app-container">
      <DashBoardHeader />

      <h1 className="dashboard-title animate-fade-in">Analytics Dashboard</h1>

      <DashboardCards
        headlineCount={headlineCount}
        recentCount={recentCount}
        averagePerHour={averagePerHour}
        activeSources={activate}
      />

      <RecentHeadlines headlines={recentHeadlines} />

      <HeadlinesTable
        headlines={headlines}
        sourceResults={sourceResults}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}

export default DashBoard;

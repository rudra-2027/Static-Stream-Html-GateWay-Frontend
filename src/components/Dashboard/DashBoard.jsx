import React, { useCallback, useEffect, useState } from "react";
import DashBoardHeader from "./DashBoardHeader2";
import DashboardCards from "./DashboardCards";
import RecentHeadlines from "./RecentHeadlines";
import HeadlinesTable from "./HeadlinesTable";
import DashboardSkeleton from "./DashboardSkeleton";


import "../../style/App.css";
import api from "../../utils/constants";
import { useNavigate } from "react-router-dom";

const DASHBOARD_CACHE_TTL = 60 * 1000;
let dashboardCache = null;

const dashboardRequests = [
  ["headlines", () => api.get("/headlines")],
  ["recentCount", () => api.get("/headlines/recentCount")],
  ["headlineCount", () => api.get("/headlines/count")],
  ["averagePerHour", () => api.get("/headlines/avgPerHour")],
  ["recentHeadlines", () => api.get("/headlines/recent")],
  ["activeSources", () => api.get("/headlines/acivatS")],
];

const trackSlowRequest = (name, startedAt) => {
  const duration = performance.now() - startedAt;
  if (duration > 1500) {
    try {
      performance.measure(`dashboard:${name}:slow`, {
        start: startedAt,
        duration,
      });
    } catch {
      return;
    }
  }
};

function DashBoard() {

  const [headlines, setHeadlines] = useState([]);
  const [recentHeadlines, setRecentHeadlines] = useState([]);
  const [sourceResults, setSourceResults] = useState([]);
  const [activate, setActive] = useState(0);
  const [headlineCount, setHeadlineCount] = useState(0);
  const [recentCount, setRecentCount] = useState(0);
  const [averagePerHour, setAveragePerHour] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate()

  const applyDashboardData = useCallback((dashboardData) => {
    setHeadlines(dashboardData.headlines);
    setRecentCount(dashboardData.recentCount);
    setHeadlineCount(dashboardData.headlineCount);
    setAveragePerHour(dashboardData.averagePerHour);
    setRecentHeadlines(dashboardData.recentHeadlines);
    setActive(dashboardData.activeSources);
  }, []);

  const loadDashboardData = useCallback(async ({ forceRefresh = false } = {}) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const hasFreshCache =
      dashboardCache && Date.now() - dashboardCache.timestamp < DASHBOARD_CACHE_TTL;

    if (!forceRefresh && hasFreshCache) {
      applyDashboardData(dashboardCache.data);
      setError("");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");
    setSourceResults([]);

    try {
      const responses = await Promise.all(
        dashboardRequests.map(async ([name, request]) => {
          const startedAt = performance.now();
          const response = await request();
          trackSlowRequest(name, startedAt);
          return [name, response.data];
        })
      );

      const responseMap = Object.fromEntries(responses);
      const dashboardData = {
        headlines: responseMap.headlines ?? [],
        recentCount: responseMap.recentCount ?? 0,
        headlineCount: responseMap.headlineCount ?? 0,
        averagePerHour: responseMap.averagePerHour ?? 0,
        recentHeadlines: responseMap.recentHeadlines ?? [],
        activeSources: Array.isArray(responseMap.activeSources)
          ? responseMap.activeSources.length
          : 0,
      };

      dashboardCache = {
        data: dashboardData,
        timestamp: Date.now(),
      };

      applyDashboardData(dashboardData);
    } catch {
      setError("Unable to load dashboard data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [applyDashboardData, navigate]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleRetry = () => {
    loadDashboardData({ forceRefresh: true });
  };

  useEffect(() => {
    if (!searchValue) {
      setSourceResults([]);
      setIsSearchLoading(false);
      return;
    }

    setIsSearchLoading(true);
    const delay = setTimeout(async () => {
      try {
        const res = await api.post(
          "/headlines/source",
          { url: searchValue },
          { headers: { "Content-Type": "application/json" } }
        );

        setSourceResults(res.data);
      } catch {
        setSourceResults([]);
      } finally {
        setIsSearchLoading(false);
      }
    }, 500);

    return () => {
      clearTimeout(delay);
    };
  }, [searchValue]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="app-container">
        <DashBoardHeader />
        <div className="dashboard-error-state" role="alert">
          <h2>Dashboard data could not be loaded</h2>
          <p>{error}</p>
          <button onClick={handleRetry}>Retry</button>
        </div>
      </div>
    );
  }

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

      <RecentHeadlines headlines={recentHeadlines} isLoading={false} />

      <HeadlinesTable
        headlines={headlines}
        sourceResults={sourceResults}
        isLoading={false}
        isSearchLoading={isSearchLoading}
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

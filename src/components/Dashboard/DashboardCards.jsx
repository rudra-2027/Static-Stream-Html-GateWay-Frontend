import React from "react";
import StatCard from "./StatCard";
import "../../style/DashboardCards.css";
import Active from "../Button/Active";
import { useNavigate } from "react-router-dom"

function DashboardCards({ headlineCount, recentCount, averagePerHour, activeSources }) {
  const navigate = useNavigate();
  return (
    <div className="dashboard-cards">
      <StatCard
        icon="newspaper"
        title="Total Headlines"
        value={headlineCount}
        subtitle="Scraped articles"
        color="blue"
      />
      <StatCard
        icon="globe"
        title="Active Sources"
        value={activeSources}
        subtitle="Monitored websites"
        color="green"
        onClick={() => {
          console.log("Active Sources card clicked!");
          navigate("/active");
        }}
      />
      <StatCard
        icon="chart"
        title="Recent Activity"
        value={recentCount}
        subtitle="Last 24 hours"
        color="purple"

      />
      <StatCard
        icon="clock"
        title="Avg per Hour"
        value={averagePerHour}
        subtitle="Headlines scraped"
        color="orange"
      />
    </div>
  );
}

export default DashboardCards;

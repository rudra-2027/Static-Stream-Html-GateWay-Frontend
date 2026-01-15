import React from "react";
import {
  FaNewspaper,
  FaGlobe,
  FaChartLine,
  FaClock,
  FaUsers,
  FaDatabase,
  FaRocket,
  FaFire
} from "react-icons/fa";

const iconMap = {
  newspaper: FaNewspaper,
  globe: FaGlobe,
  chart: FaChartLine,
  clock: FaClock,
  users: FaUsers,
  database: FaDatabase,
  rocket: FaRocket,
  fire: FaFire
};

function StatCard({ icon, title, value, subtitle, color, onClick }) {
  const IconComponent = iconMap[icon] || FaNewspaper;

  return (
    <div
      className={`cursor-pointer p-4 rounded-2xl shadow bg-${color}-100`}
      onClick={onClick}
    >
      <div className={`card ${color} animate-fade-in`}>
        <div className="card-icon">
          <IconComponent />
        </div>
        <div className="card-info">
          <p>{title}</p>
          <h3>{value }</h3>
          <span>{subtitle}</span>
        </div>
      </div>
    </div>
  );
}

export default StatCard;

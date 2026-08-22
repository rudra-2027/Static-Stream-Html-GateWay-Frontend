import React from "react";
import { formatDistanceToNow } from "date-fns";
import { FaExternalLinkAlt, FaClock } from "react-icons/fa";
import "../../style/RecentHeadlines.css";

function RecentHeadlines({ headlines, isLoading }) {
  return (
    <div className="recent-headlines-section animate-fade-in">
      <h2 className="recent-headlines-title">Recent Headlines</h2>
      {isLoading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          Loading recent headlines...
        </div>
      ) : headlines.length > 0 ? (
        <ul className="recentResss">
          {headlines.map((item) => (
            <li key={item.id} className="animate-slide-up">
              <h1>{new URL(item.source).host.replace(/^www\./, "")}</h1>
              <strong>{item.text}</strong>
              <span>
                <FaClock style={{ marginRight: '6px' }} />
                {item.scrapedAt
                  ? `${formatDistanceToNow(new Date(item.scrapedAt))} ago`
                  : "Some time ago"}
              </span>
              <a href={item.source} target="_blank" rel="noopener noreferrer">
                View Source
                <FaExternalLinkAlt style={{ marginLeft: '6px' }} />
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div className="loading">
          No recent headlines available.
        </div>
      )}
    </div>
  );
}

export default RecentHeadlines;

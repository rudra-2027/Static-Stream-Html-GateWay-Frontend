import React from "react";

function DashboardSkeleton() {
  return (
    <div className="app-container dashboard-skeleton-page" aria-busy="true">
      <div className="skeleton-hero">
        <div>
          <div className="skeleton-line skeleton-title-line"></div>
          <div className="skeleton-line skeleton-subtitle-line"></div>
        </div>
        <div className="skeleton-actions">
          <div className="skeleton-pill"></div>
          <div className="skeleton-pill short"></div>
        </div>
      </div>

      <div className="skeleton-line skeleton-page-title"></div>

      <div className="dashboard-cards skeleton-card-grid">
        {[...Array(4)].map((_, index) => (
          <div className="card skeleton-stat-card" key={index}>
            <div className="skeleton-icon"></div>
            <div className="skeleton-card-content">
              <div className="skeleton-line skeleton-stat-title"></div>
              <div className="skeleton-line skeleton-stat-value"></div>
              <div className="skeleton-line skeleton-stat-subtitle"></div>
            </div>
          </div>
        ))}
      </div>

      <section className="recent-headlines-section">
        <div className="skeleton-line skeleton-section-title"></div>
        <div className="recentResss">
          {[...Array(3)].map((_, index) => (
            <div className="skeleton-recent-card" key={index}>
              <div className="skeleton-line skeleton-badge"></div>
              <div className="skeleton-line skeleton-headline-long"></div>
              <div className="skeleton-line skeleton-headline-medium"></div>
              <div className="skeleton-line skeleton-meta"></div>
              <div className="skeleton-line skeleton-link"></div>
            </div>
          ))}
        </div>
      </section>

      <section className="headlines-table-section">
        <div className="skeleton-line skeleton-section-title"></div>
        <div className="headings-div skeleton-table-card">
          <div className="skeleton-line skeleton-search"></div>
          <div className="skeleton-table-header">
            {[...Array(4)].map((_, index) => (
              <div className="skeleton-line" key={index}></div>
            ))}
          </div>
          {[...Array(7)].map((_, index) => (
            <div className="skeleton-table-row" key={index}>
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default DashboardSkeleton;

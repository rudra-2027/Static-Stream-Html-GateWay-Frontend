import React, { useState } from 'react';
import '../../style/DashBoardHeader2.css';
import GetDataFromUrl from '../Models/GetDataFromUrl';

function DashBoardHeader2() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="dashboard-header">

      <div className="header-left">
        <h1>Static Stream Gateway</h1>
        <p>
          <span className="highlight">Real-time headline scraping</span> and analysis dashboard
        </p>

      </div>

      <div className="header-right-container">
        <div className="header-right">
          <button
            className="refresh"
            onClick={() => window.location.reload()}
          >
            🔄 Refresh
          </button>

        </div>
        <div className="header-right-down">
          <button className="openHoverModel" onClick={openModal}>
            Add Your URL
          </button>
        </div>
      </div>


      {isModalOpen && (
        <div className="modal-overlay3">
          <div className="modal-content3">
            <button className="close-btn" onClick={() => {
              closeModal();
              window.location.reload();
            }}>X</button>
            <GetDataFromUrl />
          </div>
        </div>
      )}
    </div>
  );
}

export default DashBoardHeader2;

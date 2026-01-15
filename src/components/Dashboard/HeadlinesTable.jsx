import { React, useState, useEffect } from "react";
import { FaSearch, FaExternalLinkAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import AiModel from '../Models/AiModel';
import "../../style/HeadlinesTable.css";

function HeadlinesTable({
  headlines,
  sourceResults,
  searchValue,
  setSearchValue,
  currentPage,
  setCurrentPage,
  itemsPerPage,
}) {
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHeadlines = headlines.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(headlines.length / itemsPerPage);
  const dataToShow = searchValue ? sourceResults : currentHeadlines;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);

  const openModal = (source) => {
    setSelectedSource(source);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSource(null);
  };


  return (
    <div className="headlines-table-section animate-fade-in">
      <h3 className="headlines-table-title">All Headlines</h3>

      <div className="headings-div">
        <div className="search">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search headlines or enter URL..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        {dataToShow.length > 0 ? (
          <>
            <ul>
              <div className="table-header">
                <span>Headlines</span>
                <span>Source</span>
                <span>Scraped At</span>
                <span>Actions</span>
              </div>

              {dataToShow.map((item, index) => (
                <li key={item.id} className="table-row" style={{ animationDelay: `${index * 0.1}s` }}>
                  <span className="headline">{item.text}</span>
                  <span className="source">{new URL(item.source).host.replace(/^www\./, "")}</span>
                  <span className="scraped">{new Date(item.scrapedAt).toLocaleDateString()}</span>
                  <span className="actions">
                    <button
                      onClick={() => openModal(item.source)}
                      className="ai-btn"
                    >
                      View
                      <FaExternalLinkAlt style={{ marginLeft: "6px", fontSize: "0.75rem" }} />
                    </button>
                  </span>
                </li>
              ))}
            </ul>

            {!searchValue && totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <FaChevronLeft /> Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <span className="actions">
                  <button
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={currentPage === totalPages}>
                    <FaChevronRight /> Next

                  </button>
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="loading">
            {searchValue ? (
              <p>No headlines found for "{searchValue}"</p>
            ) : (
              <>
                <div className="loading-spinner"></div>
                Loading headlines...
              </>
            )}
          </div>
        )}
      </div>
      {isModalOpen && (
        <AiModel source={selectedSource} onClose={closeModal} />
      )}
    </div>
  );
}

export default HeadlinesTable;

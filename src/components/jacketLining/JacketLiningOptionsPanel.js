/**
 * JACKET LINING OPTIONS PANEL COMPONENT
 * ======================================
 * 
 * This component displays jacket lining options for suit jackets.
 * It allows users to select from available lining fabrics fetched from the API.
 * 
 * Features:
 * - Displays lining list with images and details
 * - Handles lining selection and updates
 * - Shows loading state while linings are being fetched
 * - Responsive design with smooth animations
 * - No pricing (included in base price)
 * - Rating system display
 * - Info button for additional details
 * 
 * Available Linings:
 * - Various lining fabrics fetched from API
 * - Only displays linings where lining_for === "Suit"
 * - Applied to inner meshes (backinner, FullSleeveInner)
 * 
 * @param {Array} linings - Array of available linings from API
 * @param {Object} selectedLining - Currently selected lining
 * @param {Function} setSelectedLining - Function to update selected lining
 * @param {boolean} isVisible - Whether the panel is visible
 * @returns {JSX.Element} Jacket lining options panel component
 */

import React from "react";

/**
 * JacketLiningOptionsPanel mirrors WholeFabricOptionsPanel, but is intended for selecting
 * a lining that applies to the inner meshes of the jacket. UI/structure kept same for familiarity.
 */
export default function JacketLiningOptionsPanel({
  linings,
  selectedLining,
  setSelectedLining,
  isVisible,
}) {
  return (
    <div
      className={`fabric-options-container ${isVisible ? "is-visible" : ""}`}
    >
      <h3 className="fabric-options-title">Select Jacket Lining</h3>
      <div className="fabric-list-container">
        {linings.length === 0 ? (
          <div className="loading-fabrics-message">Loading linings...</div>
        ) : (
          linings.map((lining) => {
            const isSelected =
              selectedLining && selectedLining.id === lining.id;

            return (
              <div
                key={lining.id}
                onClick={() => setSelectedLining(lining)}
                className={`fabric-option-item ${
                  isSelected ? "is-selected" : ""
                }`}
              >
                <div className="fabric-thumbnail-wrapper">
                  <img
                    src={lining.imageUrl}
                    alt={lining.name}
                    className="fabric-option-thumbnail"
                  />
                </div>
                <div className="fabric-details">
                  <div className="fabric-name">{lining.name}</div>
                  <div className="fabric-info">{lining.info}</div>
                  <div className="fabric-rating">
                    <span className="star-rating">★★★★☆</span> 4.5 (1379 votes)
                  </div>
                </div>
                <div className="fabric-price">Included</div>
                <button className="ui-button info-button">INFO</button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/**
 * BUTTON AND THREAD COLOR OPTIONS PANEL COMPONENT
 * ===============================================
 * 
 * This component displays button and thread color options for suit components.
 * It allows users to select from available fabrics to apply to all buttons and threads.
 * 
 * Features:
 * - Displays fabric list with images and details
 * - Handles fabric selection for buttons and threads
 * - Shows loading state while fabrics are being fetched
 * - Responsive design with smooth animations
 * - Applies selected fabric to all button and thread meshes
 * - Rating system display
 * - Info button for additional details
 * 
 * Available Fabrics:
 * - Various fabrics fetched from API
 * - Applied to all button and thread meshes throughout the suit
 * 
 * @param {Array} linings - Array of available fabrics from API (same as lining data)
 * @param {Object} selectedButtonThreadColor - Currently selected button/thread color fabric
 * @param {Function} setSelectedButtonThreadColor - Function to update selected button/thread color
 * @param {boolean} isVisible - Whether the panel is visible
 * @returns {JSX.Element} Button and thread color options panel component
 */

import React from "react";

/**
 * ButtonThreadColorOptionsPanel allows users to select a fabric that will be applied
 * to all button and thread meshes throughout the entire suit model.
 */
export default function ButtonThreadColorOptionsPanel({
  linings,
  selectedButtonThreadColor,
  setSelectedButtonThreadColor,
  isVisible,
}) {
  return (
    <div
      className={`fabric-options-container ${isVisible ? "is-visible" : ""}`}
    >
      <h3 className="fabric-options-title">All Button & Thread Color</h3>
      <div className="fabric-list-container">
        {linings.length === 0 ? (
          <div className="loading-fabrics-message">Loading button colors...</div>
        ) : (
          linings.map((lining) => {
            const isSelected =
              selectedButtonThreadColor && selectedButtonThreadColor.id === lining.id;

            return (
              <div
                key={lining.id}
                onClick={() => setSelectedButtonThreadColor(lining)}
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
                  <div className="fabric-info">{lining.type}</div>
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
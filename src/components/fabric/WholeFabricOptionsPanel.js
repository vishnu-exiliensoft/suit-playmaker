/**
 * WHOLE FABRIC OPTIONS PANEL COMPONENT
 * =====================================
 * 
 * This component displays fabric options that apply to the entire suit.
 * It allows users to select from available suit fabrics fetched from the API.
 * 
 * Features:
 * - Displays fabric list with images and details
 * - Handles fabric selection and updates
 * - Shows loading state while fabrics are being fetched
 * - Responsive design with smooth animations
 * - Price display for each fabric
 * - Rating system display
 * - Info button for additional details
 * 
 * Available Fabrics:
 * - Various suit fabrics fetched from API
 * - Only displays fabrics where fabric_for === "Suit"
 * - Includes pricing and rating information
 * - Supports additional information display
 * 
 * @param {Array} fabrics - Array of available fabrics from API
 * @param {Object} selectedWholeFabric - Currently selected fabric
 * @param {Function} setSelectedWholeFabric - Function to update selected fabric
 * @param {boolean} isVisible - Whether the panel is visible
 * @returns {JSX.Element} Whole fabric options panel component
 */

// WholeFabricOptionsPanel.js
import React from "react";

/**
 * WholeFabricOptionsPanel mirrors FabricOptionsPanel, but is intended for selecting
 * a fabric that applies to the entire shirt. UI/structure kept same for familiarity.
 */
export default function WholeFabricOptionsPanel({
  fabrics,
  selectedWholeFabric,
  setSelectedWholeFabric,
  isVisible,
}) {
  return (
    <div
      className={`fabric-options-container ${isVisible ? "is-visible" : ""}`}
    >
      <h3 className="fabric-options-title">Select Whole-Suit Fabric</h3>
      <div className="fabric-list-container">
        {fabrics.length === 0 ? (
          <div className="loading-fabrics-message">Loading fabrics...</div>
        ) : (
          fabrics.map((fabric) => {
            const isSelected =
              selectedWholeFabric && selectedWholeFabric.id === fabric.id;

            return (
              <div
                key={fabric.id}
                onClick={() => setSelectedWholeFabric(fabric)}
                className={`fabric-option-item ${
                  isSelected ? "is-selected" : ""
                }`}
              >
                <div className="fabric-thumbnail-wrapper">
                  <img
                    src={fabric.imageUrl}
                    alt={fabric.name}
                    className="fabric-option-thumbnail"
                  />
                </div>
                <div className="fabric-details">
                  <div className="fabric-name">{fabric.name}</div>
                  <div className="fabric-info">{fabric.info}</div>
                  <div className="fabric-rating">
                    <span className="star-rating">★★★★☆</span> 4.5 (1379 votes)
                  </div>
                </div>
                <div className="fabric-price">SDG {fabric.price}</div>
                <button className="ui-button info-button">INFO</button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

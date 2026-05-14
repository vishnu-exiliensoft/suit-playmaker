/**
 * COLLAR OPTIONS PANEL COMPONENT
 * ===============================
 * 
 * This component displays collar style options for shirts.
 * Users can choose from various collar configurations with visual previews and pricing.
 * 
 * Features:
 * - Visual collar style previews with images
 * - Smooth slide-in/slide-out animations
 * - Responsive design with hover effects
 * - Clear selection indicators
 * - Price display for premium options
 * - Info button for additional details
 * - Filters collars specifically for shirts
 * 
 * Available Collar Styles:
 * - Various collar designs fetched from API
 * - Only displays collars where collar_for === "Shirt"
 * - Includes pricing information
 * - Supports additional information display
 * 
 * @param {Array} collars - Array of available collar options from API
 * @param {Object} selectedCollar - Currently selected collar object
 * @param {Function} setSelectedCollar - Function to update selected collar
 * @param {boolean} isVisible - Whether the panel is visible
 * @returns {JSX.Element} Collar options panel component
 */

import React from "react";

/**
 * CollarOptionsPanel component displays the list of available collar options.
 * It slides in and out based on the isVisible prop.
 */
export default function CollarOptionsPanel({
  collars,
  selectedCollar,
  setSelectedCollar,
  isVisible,
}) {
  // Show only options where collar.collar_for === "Shirt"
  const filteredCollars = collars.filter(
    (collar) => collar.collar_for === "Shirt"
  );

  return (
    <div
      className={`fabric-options-container ${isVisible ? "is-visible" : ""}`}
    >
      <h3 className="fabric-options-title">Select Collar Style</h3>
      <div className="fabric-list-container">
        {filteredCollars.length === 0 ? (
          <div className="loading-collars-message">Loading collars...</div>
        ) : (
          filteredCollars.map((collar) => {
            // Check if this collar is the selected one
            const isSelected =
              selectedCollar && selectedCollar.name === collar.name;

            return (
              <div
                key={collar.name}
                onClick={() => setSelectedCollar(collar)}
                className={`fabric-option-item ${
                  isSelected ? "is-selected" : ""
                }`}
              >
                <div className="fabric-thumbnail-wrapper">
                  <img
                    src={collar.imageUrl}
                    alt={collar.name}
                    className="fabric-option-thumbnail"
                  />
                </div>
                <div className="fabric-details">
                  <div className="fabric-name">{collar.name}</div>
                  <div className="fabric-info">{collar.info}</div>
                  {/* <div className="fabric-info">{collar.backendkey}</div> */}
                  {/* <div className="fabric-info">{collar.collar_for}</div> */}
                </div>
                {collar.price > 0 && (
                  <div className="fabric-price">+SDG {collar.price}</div>
                )}
                <button className="ui-button info-button">INFO</button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

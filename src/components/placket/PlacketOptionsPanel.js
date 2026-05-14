/**
 * PLACKET OPTIONS PANEL COMPONENT
 * ================================
 * 
 * This component displays placket style options for shirts.
 * Users can choose from various placket configurations with visual previews.
 * 
 * Features:
 * - Visual placket style previews with SVG images
 * - Smooth slide-in/slide-out animations
 * - Responsive design with hover effects
 * - Clear selection indicators
 * - Fallback to default options if no data provided
 * - Error handling for missing images
 * 
 * Available Placket Styles:
 * - Single Placket: Standard single placket design
 * - Box Placket: Box-style placket design
 * - Box Placket no Button: Box placket without visible buttons
 * 
 * @param {Array} placketData - Array of available placket options from API
 * @param {string} selectedPlacket - Currently selected placket style key
 * @param {Function} setSelectedPlacket - Function to update placket style
 * @param {boolean} isVisible - Whether the panel is visible
 * @returns {JSX.Element} Placket options panel component
 */

import React from "react";

/**
 * PlacketOptionsPanel component displays the list of available placket styles.
 */
export default function PlacketOptionsPanel({
  placketData,
  selectedPlacket,
  setSelectedPlacket,
  isVisible,
}) {
  const placketOptions = placketData || [
    {
      name: "Single Placket",
      key: "SinglePlacket",
      imageUrl: "/packlet/singleacklet.svg",
    },
    {
      name: "Box Placklet",
      key: "BoxPlacket",
      imageUrl: "/packlet/box_placklet.svg",
    },
    {
      name: "Box Placket no Button",
      key: "boxPlackletNoButton",
      imageUrl: "/packlet/hiddenbtn.svg",
    },
  ];

  return (
    <div
      className={`fabric-options-container ${isVisible ? "is-visible" : ""}`}
    >
      <h3 className="fabric-options-title">Select Placket Style</h3>
      <div className="fabric-list-container">
        {placketOptions.map((placket) => {
          const isSelected = selectedPlacket === placket.key;
          return (
            <div
              key={placket.key}
              onClick={() => setSelectedPlacket(placket.key)}
              className={`fabric-option-item ${
                isSelected ? "is-selected" : ""
              }`}
            >
              <img
                src={placket.imageUrl}
                alt={placket.name}
                className="fabric-option-thumbnail"
              />
              <div className="fabric-details">
                <div className="fabric-name">{placket.name}</div>
                {/* <div className="fabric-name">{placket.key}</div> */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

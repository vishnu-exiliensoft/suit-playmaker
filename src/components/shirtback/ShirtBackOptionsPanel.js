/**
 * SHIRT BACK OPTIONS PANEL COMPONENT
 * ===================================
 * 
 * This component displays shirt back style options.
 * Users can choose from various back configurations with visual previews.
 * 
 * Features:
 * - Visual shirt back style previews with SVG images
 * - Smooth slide-in/slide-out animations
 * - Responsive design with hover effects
 * - Clear selection indicators
 * - Error handling for missing images
 * 
 * Available Shirt Back Styles:
 * - Side Placket: Side placket back design
 * - Box Plate: Box plate back design
 * - Plan: Plain back design
 * 
 * @param {string} selectedShirtBack - Currently selected shirt back style key
 * @param {Function} setSelectedShirtBack - Function to update shirt back style
 * @param {boolean} isVisible - Whether the panel is visible
 * @returns {JSX.Element} Shirt back options panel component
 */

import React from "react";

/**
 * ShirtBackOptionsPanel component displays the list of available shirt back styles.
 */
export default function ShirtBackOptionsPanel({
  selectedShirtBack,
  setSelectedShirtBack,
  isVisible,
}) {
  const shirtBackOptions = [
    { name: "Side Placket", key: "SidePlacket", imageUrl: "/back/sideplate.svg" },
    { name: "Box Plate", key: "BoxPlate", imageUrl: "/back/boxplate.svg" },
    { name: "Plan", key: "Plan", imageUrl: "/back/plainback.svg" },
  ];

  return (
    <div
      className={`fabric-options-container ${isVisible ? "is-visible" : ""}`}
      
    >
      <h3 className="fabric-options-title">Select Shirt Back Style</h3>
      <div className="fabric-list-container">
        {shirtBackOptions.map((shirtBack) => {
          const isSelected = selectedShirtBack === shirtBack.key;
          return (
            <div
              key={shirtBack.key}
              onClick={() => setSelectedShirtBack(shirtBack.key)}
              className={`fabric-option-item ${
                isSelected ? "is-selected" : ""
              }`}
            >
              <img
                src={shirtBack.imageUrl}
                alt={shirtBack.name}
                className="fabric-option-thumbnail"
              />
              <div className="fabric-details">
                <div className="fabric-name">{shirtBack.name}</div>
                {/* <div className="fabric-name">{shirtBack.key}</div> */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

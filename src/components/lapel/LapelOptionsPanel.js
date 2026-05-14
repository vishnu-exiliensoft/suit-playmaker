/**
 * LAPEL OPTIONS PANEL COMPONENT
 * ==============================
 * 
 * This component displays lapel style options for suit jackets.
 * Users can choose from various lapel configurations with visual previews.
 * 
 * Features:
 * - Visual lapel style previews with SVG images
 * - Smooth slide-in/slide-out animations
 * - Responsive design with hover effects
 * - Error handling for missing images
 * - Clear selection indicators
 * 
 * Available Lapel Styles:
 * - Peak Lapel: Pointed lapel extending upward
 * - Notch Lapel: Classic V-shaped lapel
 * - Round Lapel: Rounded lapel design
 * - Shawl Lapel: Smooth, curved lapel without notch
 * 
 * @param {string} selectedLapelStyle - Currently selected lapel style
 * @param {Function} setSelectedLapelStyle - Function to update lapel style
 * @param {boolean} isVisible - Whether the panel is visible
 * @returns {JSX.Element} Lapel options panel component
 */

import React from "react";

// Centralized lapel pricing configuration
export const LAPEL_PRICING = {
  "Peak Lapel": 25, // Updated price for testing
  "Notch Lapel": 0,
  "Round Lapel": 5, // Updated price for testing
  "Shawl Lapel": 30, // Updated price for testing
};

// Function to get lapel price based on style and product type
export const getLapelPrice = (lapelStyle, productType = null) => {
  // If SuitTrouser is selected, lapel price should be 0
  if (productType && productType.key === "SuitTrouser") {
    return 0;
  }
  return LAPEL_PRICING[lapelStyle] || 0;
};

export default function LapelOptionsPanel({
  selectedLapelStyle,
  setSelectedLapelStyle,
  isVisible,
}) {
  const options = [
    {
      name: "Peak Lapel",
      key: "Peak Lapel",
      imageUrl: "/lapel/Peak Lapel.svg",
      price: LAPEL_PRICING["Peak Lapel"], // Premium lapel style
    },
    {
      name: "Notch Lapel",
      key: "Notch Lapel",
      imageUrl: "/lapel/Notch lapel.svg",
      price: LAPEL_PRICING["Notch Lapel"], // Standard lapel style (no extra cost)
    },
    {
      name: "Round Lapel",
      key: "Round Lapel",
      imageUrl: "/lapel/Round Lapel.svg",
      price: LAPEL_PRICING["Round Lapel"], // Modern lapel style
    },
    {
      name: "Shawl Lapel",
      key: "Shawl Lapel",
      imageUrl: "/lapel/shawl Lapel.svg",
      price: LAPEL_PRICING["Shawl Lapel"], // Luxury lapel style
    },
  ];

  return (
    <div className={`fabric-options-container ${isVisible ? "is-visible" : ""}`}>
      <h3 className="fabric-options-title">Suit Jacket Lapel Style</h3>

      <div className="fabric-list-container">
        {options.map((option) => {
          const isSelected = selectedLapelStyle === option.key;
          return (
            <div
              key={option.key}
              onClick={() => setSelectedLapelStyle(option.key)}
              className={`fabric-option-item ${isSelected ? "is-selected" : ""}`}
            >
              <div className="fitting-image-preview">
                <img
                  src={option.imageUrl}
                  alt={option.name}
                  className="fitting-thumbnail"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder.png";
                  }}
                />
              </div>
              <div className="fabric-details">
                <div className="fabric-name">{option.name}</div>
                <div className="fabric-price">
                  {option.price > 0 ? `SDG ${option.price}` : "Included"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}



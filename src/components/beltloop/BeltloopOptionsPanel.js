/**
 * BELTLOOP OPTIONS PANEL COMPONENT
 * =================================
 * 
 * This component displays beltloop style options for suit trousers.
 * Users can choose from various beltloop configurations with visual previews.
 * 
 * Features:
 * - Visual beltloop style previews with SVG images
 * - Smooth slide-in/slide-out animations
 * - Responsive design with hover effects
 * - Error handling for missing images
 * - Clear selection indicators
 * - Fallback to default options if no data provided
 * 
 * Available Beltloop Styles:
 * - None: No beltloops
 * - Single: Single beltloop design
 * - Double: Double beltloop design
 * - Modern: Modern beltloop style
 * - None + Button Side Adjusters: No beltloops with button side adjusters
 * - None + Buckle Side Adjusters: No beltloops with buckle side adjusters
 * 
 * @param {Array} beltloopData - Array of available beltloop options from API
 * @param {string} selectedBeltloop - Currently selected beltloop style
 * @param {Function} setSelectedBeltloop - Function to update beltloop style
 * @param {boolean} isVisible - Whether the panel is visible
 * @returns {JSX.Element} Beltloop options panel component
 */

import React from "react";

/**
 * BeltloopOptionsPanel component displays the list of available beltloop styles.
 */
export default function BeltloopOptionsPanel({
  beltloopData,
  selectedBeltloop,
  setSelectedBeltloop,
  isVisible,
  onPriceChange,
}) {
  // Map beltloop keys to their icon paths in public/beltloop
  const iconMap = {
    None: "/beltloop/None.svg",
    Single: "/beltloop/Single_1.svg",
    Double: "/beltloop/Double_1.svg",
    Modern: "/beltloop/Modern.svg",
    NoneButtonSideAdjusters: "/beltloop/None+Button.svg",
    NoneBtnSideAdjusters: "/beltloop/Buckle.svg",
  };

  // Static pricing for beltloop options
  const beltloopPrices = {
    "None": 0,
    "Single": 15,
    "Double": 25,
    "Modern": 35,
    "NoneButtonSideAdjusters": 20,
    "NoneBtnSideAdjusters": 30,
  };

  // Use beltloopData if available, but ensure correct image URLs and pricing
  const beltloopOptions = (
    beltloopData || [
      { name: "None", key: "None" },
      { name: "Single", key: "Single" },
      { name: "Double", key: "Double" },
      { name: "Modern", key: "Modern" },
      { name: "None + Button Side Adjusters", key: "NoneButtonSideAdjusters" },
      { name: "None + Buckle Side Adjusters", key: "NoneBtnSideAdjusters" },
    ]
  ).map((beltloop) => ({
    ...beltloop,
    imageUrl: iconMap[beltloop.key] || beltloop.imageUrl || "/placeholder.png",
    price: beltloopPrices[beltloop.key] || 0,
  }));

  return (
    <div
      className={`fabric-options-container ${isVisible ? "is-visible" : ""}`}
    >
      <h3 className="fabric-options-title">Select Beltloop</h3>
      <div className="fabric-list-container">
        {beltloopOptions.map((beltloop) => {
          const isSelected = selectedBeltloop === beltloop.key;
          return (
            <div
              key={beltloop.key}
              onClick={() => {
                setSelectedBeltloop(beltloop.key);
                // Notify parent component about price change
                if (onPriceChange) {
                  onPriceChange(beltloop.price);
                }
              }}
              className={`fabric-option-item ${
                isSelected ? "is-selected" : ""
              }`}
            >
              <div className="fabric-effect-image-preview">
                <img
                  src={beltloop.imageUrl}
                  alt={beltloop.name}
                  className="fabric-effect-thumbnail"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder.png";
                  }}
                />
              </div>
              <div className="fabric-details">
                <div className="fabric-name">{beltloop.name}</div>
                <div className="fabric-price">
                  {beltloop.price > 0 ? `SDG ${beltloop.price}` : "Included"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

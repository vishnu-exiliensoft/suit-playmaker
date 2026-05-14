/**
 * POCKET OPTIONS PANEL COMPONENT
 * ===============================
 * 
 * This component displays pocket style options for suit trousers with tabbed interface.
 * Users can choose from various back and front pocket configurations with visual previews.
 * 
 * Features:
 * - Tabbed interface for back and front pocket styles
 * - Visual pocket style previews with SVG images
 * - Smooth slide-in/slide-out animations
 * - Responsive design with hover effects
 * - Error handling for missing images
 * - Clear selection indicators
 * - Auto-close panel after selection
 * 
 * Available Pocket Styles:
 * Back Pockets:
 * - Single: Single pocket design
 * - Double: Double pocket design
 * - Modern Flap: Modern flap pocket
 * - Curved Flap: Curved flap pocket
 * - Square Flap: Square flap pocket
 * 
 * Front Pockets:
 * - None: No front pocket
 * - Slanted: Slanted pocket design
 * - Straight Welt: Straight welt pocket
 * - Slanted Welt: Slanted welt pocket
 * - Modern Curved: Modern curved pocket
 * - Suit: Suit-style pocket
 * 
 * @param {string} selectedPocket - Currently selected pocket status (yes/no)
 * @param {Function} setSelectedPocket - Function to update pocket status
 * @param {string} selectedBackPocketStyle - Currently selected back pocket style
 * @param {Function} setSelectedBackPocketStyle - Function to update back pocket style
 * @param {string} selectedFrontPocketStyle - Currently selected front pocket style
 * @param {Function} setSelectedFrontPocketStyle - Function to update front pocket style
 * @param {boolean} isVisible - Whether the panel is visible
 * @param {Function} onSelection - Callback function called after selection
 * @returns {JSX.Element} Pocket options panel component
 */

import React, { useState } from "react";

/**
 * PocketOptionsPanel component displays pocket options with tabs for back pocket and front pocket styles.
 * It slides in and out based on the isVisible prop.
 */
export default function PocketOptionsPanel({
  selectedPocket,
  setSelectedPocket,
  selectedBackPocketStyle,
  setSelectedBackPocketStyle,
  selectedFrontPocketStyle,
  setSelectedFrontPocketStyle,
  isVisible,
  onSelection,
  onPriceChange,
}) {
  const [activeTab, setActiveTab] = useState("back");

  // Static pricing for pocket options
  const pocketPrices = {
    "no": 0,
    "yes": 20,
  };

  const pocketOptions = [
    { name: "No Pocket", key: "no", imageUrl: "/no_pocket.png", price: pocketPrices.no },
    { name: "With Pocket", key: "yes", imageUrl: "/pocket.png", price: pocketPrices.yes },
  ];

  const handlePocketSelection = (pocketKey) => {
    setSelectedPocket(pocketKey);
    // Notify parent component about price change
    if (onPriceChange) {
      const selectedOption = pocketOptions.find(option => option.key === pocketKey);
      onPriceChange(selectedOption ? selectedOption.price : 0);
    }
    // Close panel after selection if callback provided
    if (onSelection) {
      onSelection();
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`fabric-options-container ${isVisible ? "is-visible" : ""}`}>
      <h3 className="fabric-options-title">Pocket Options</h3>
      
      {/* Tab Navigation */}
      <div className="button-tabs">
        <button
          className={`button-tab ${activeTab === "back" ? "active" : ""}`}
          onClick={() => setActiveTab("back")}
        >
          Back Pocket
        </button>
        <button
          className={`button-tab ${activeTab === "front" ? "active" : ""}`}
          onClick={() => setActiveTab("front")}
        >
          Front Pocket
        </button>
      </div>

      {/* Pocket Selection */}
      <div className="fabric-list-container">
        {pocketOptions.map((pocket) => {
          const isSelected = selectedPocket === pocket.key;
          return (
            <div
              key={pocket.key}
              onClick={() => handlePocketSelection(pocket.key)}
              className={`fabric-option-item ${isSelected ? "is-selected" : ""}`}
            >
              <div className="fabric-effect-image-preview">
                <img
                  src={pocket.imageUrl}
                  alt={pocket.name}
                  className="fabric-effect-thumbnail"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder.png";
                  }}
                />
              </div>
              <div className="fabric-details">
                <div className="fabric-name">{pocket.name}</div>
                <div className="fabric-price">
                  {pocket.price > 0 ? `SDG ${pocket.price}` : "Included"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="fabric-list-container">
        {activeTab === "back" ? (
          // Back Pocket Style Tab
          <div className="button-style-options">
            {[
              { name: "Single", file: "Single.svg" },
              { name: "Double", file: "Double.svg" },
              { name: "Modern Flap", file: "Modern Flap.svg" },
              // "Curved Flap" image not present; keep option with placeholder
              { name: "Curved Flap", file: "Curved Flap.svg" },
              { name: "Square Flap", file: "Square Flap.svg" },
            ].map((option) => {
              const isSelected = selectedBackPocketStyle === option.name;
              const imageUrl = option.file
                ? `/pocket/backpocket/${encodeURIComponent(option.file)}`
                : "/placeholder.png";
              
              return (
                <div
                  key={option.name}
                  onClick={() => setSelectedBackPocketStyle(option.name)}
                  className={`button-style-option-item ${
                    isSelected ? "is-selected" : ""
                  }`}
                >
                  <div className="pocket-image-preview">
                    <img
                      src={imageUrl}
                      alt={option.name}
                      className="pocket-thumbnail"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder.png";
                      }}
                    />
                  </div>
                  <div className="style-name">{option.name}</div>
                </div>
              );
            })}
          </div>
        ) : activeTab === "front" ? (
          // Front Pocket Style Tab
          <div className="button-style-options">
            {[
              { name: "None", file: null },
              { name: "Slanted", file: "Slanted.svg" },
              { name: "Straight Welt", file: "Straight Welt.svg" },
              { name: "Slanted Welt", file: "Slanted Welt.svg" },
              { name: "Modern Curved", file: "Modern Curved.svg" },
              { name: "Jeans", file: "Jeans.svg" },
            ].map((option) => {
              const isSelected = selectedFrontPocketStyle === option.name;
              const imageUrl = option.file
                ? `/pocket/frontpocket/${encodeURIComponent(option.file)}`
                : "/no_select.svg";
              
              return (
                <div
                  key={option.name}
                  onClick={() => setSelectedFrontPocketStyle(option.name)}
                  className={`button-style-option-item ${
                    isSelected ? "is-selected" : ""
                  }`}
                >
                  <div className="pocket-image-preview">
                    <img
                      src={imageUrl}
                      alt={option.name}
                      className="pocket-thumbnail"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder.png";
                      }}
                    />
                  </div>
                  <div className="style-name">{option.name}</div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}

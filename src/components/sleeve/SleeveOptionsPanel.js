/**
 * SLEEVE OPTIONS PANEL COMPONENT
 * ===============================
 * 
 * This component displays sleeve button style options for shirts.
 * Users can choose from various sleeve button configurations with visual previews.
 * 
 * Features:
 * - Visual sleeve button style previews with SVG images
 * - Smooth slide-in/slide-out animations
 * - Responsive design with hover effects
 * - Clear selection indicators
 * - Auto-close panel after selection
 * 
 * Available Sleeve Button Styles:
 * - 3 Kissing Buttons: Three buttons with kissing style
 * - 3 Standard Button: Three standard buttons
 * - 3 Working Buttons: Three functional buttons
 * - 4 Kissing Button: Four buttons with kissing style
 * - 4 Standard Buttons: Four standard buttons
 * - 4 Working Button: Four functional buttons
 * - 5 Kissing Button: Five buttons with kissing style
 * - 5 Standard Buttons: Five standard buttons
 * 
 * @param {string} selectedSleeve - Currently selected sleeve button style
 * @param {Function} setSelectedSleeve - Function to update sleeve button style
 * @param {boolean} isVisible - Whether the panel is visible
 * @param {Function} onSelection - Callback function called after selection
 * @returns {JSX.Element} Sleeve options panel component
 */

import React from "react";

/**
 * SleeveOptionsPanel component displays the list of available sleeve button options.
 * It slides in and out based on the isVisible prop.
 */
export default function SleeveOptionsPanel({
  selectedSleeve,
  setSelectedSleeve,
  isVisible,
  onSelection,
}) {
  const sleeveOptions = [
    // Kissing buttons first
    { 
      name: "3 Kissing Buttons", 
      key: "3_kissing_buttons", 
      imageUrl: "/sleevesbtn/3 kissing Buttons.svg" 
    },
    { 
      name: "4 Kissing Button", 
      key: "4_kissing_button", 
      imageUrl: "/sleevesbtn/4 kissing button.svg" 
    },
    { 
      name: "5 Kissing Button", 
      key: "5_kissing_button", 
      imageUrl: "/sleevesbtn/5 kissing button.svg" 
    },
    // Standard buttons second
    { 
      name: "3 Standard Button", 
      key: "3_standard_button", 
      imageUrl: "/sleevesbtn/3 standard button.svg" 
    },
    { 
      name: "4 Standard Buttons", 
      key: "4_standard_buttons", 
      imageUrl: "/sleevesbtn/4 standard Buttons.svg" 
    },
    { 
      name: "5 Standard Buttons", 
      key: "5_standard_buttons", 
      imageUrl: "/sleevesbtn/5 standard buttons.svg" 
    },
  ];

  const handleSleeveSelection = (sleeveKey) => {
    setSelectedSleeve(sleeveKey);
    // Close panel after selection if callback provided
    if (onSelection) {
      onSelection();
    }
  };

  return (
    <div
      className={`fabric-options-container ${isVisible ? "is-visible" : ""}`}
    >
      <h3 className="fabric-options-title">Select Sleeve Button Style</h3>
      <div className="fabric-list-container">
        {sleeveOptions.map((sleeve) => {
          const isSelected = selectedSleeve === sleeve.key;
          return (
            <div
              key={sleeve.key}
              onClick={() => handleSleeveSelection(sleeve.key)}
              className={`fabric-option-item ${isSelected ? "is-selected" : ""}`}
            >
              <img
                src={sleeve.imageUrl}
                alt={sleeve.name}
                className="fabric-option-thumbnail"
              />
              <div className="fabric-details">
                <div className="fabric-name">{sleeve.name}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

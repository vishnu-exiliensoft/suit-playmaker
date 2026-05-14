/**
 * SELECTED POCKET DISPLAY COMPONENT
 * ==================================
 * 
 * This component displays the currently selected pocket styles in the sidebar.
 * It shows both back and front pocket style images and names, and allows users to click to open pocket options.
 * 
 * Features:
 * - Displays both back and front pocket style images with fallback handling
 * - Maps pocket styles to corresponding SVG images
 * - Clickable to open pocket options panel
 * - Handles missing images gracefully
 * - Shows pocket status (With Pocket/No Pocket)
 * - Dual display for back and front pockets
 * 
 * Available Pocket Styles:
 * Back Pockets:
 * - Single: Single pocket design
 * - Double: Double pocket design
 * - Modern Flap: Modern flap pocket
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
 * @param {string} selectedBackPocketStyle - Currently selected back pocket style
 * @param {string} selectedFrontPocketStyle - Currently selected front pocket style
 * @param {Function} onClick - Function to call when component is clicked
 * @returns {JSX.Element} Selected pocket display component
 */

import React from "react";

export default function SelectedPocketDisplay({ 
  selectedPocket, 
  selectedBackPocketStyle, 
  selectedFrontPocketStyle, 
  onClick 
}) {
  const getPocketDisplayName = (pocketKey) => {
    switch (pocketKey) {
      case "yes":
        return "With Pocket";
      case "no":
        return "No Pocket";
      default:
        return "Select Pocket";
    }
  };

  const backPocketStyle = selectedBackPocketStyle || "Single";
  const frontPocketStyle = selectedFrontPocketStyle || "Style 1";

  // Get back pocket image
  // Map back pocket style names to files (use actual filenames from public)
  const backMap = {
    "Single": "Single.svg",
    "Double": "Double.svg",
    "Modern Flap": "Modern Flap.svg",
    "Curved Flap": null, // not present
    "Square Flap": "Square Flap.svg",
  };
  const backPocketImageUrl = backMap[backPocketStyle]
    ? `/pocket/backpocket/${encodeURIComponent(backMap[backPocketStyle])}`
    : "/placeholder.png";

  // Get front pocket image from actual filenames
  const frontMap = {
    "None": null,
    "Slanted": "Slanted.svg",
    "Straight Welt": "Straight Welt.svg",
    "Slanted Welt": "Slanted Welt.svg",
    "Modern Curved": "Modern Curved.svg",
    "Jeans": "Jeans.svg",
  };
  const frontPocketImageUrl = frontMap[frontPocketStyle]
    ? `/pocket/frontpocket/${encodeURIComponent(frontMap[frontPocketStyle])}`
    : "/no_select.svg";


  return (
    <div className="selected-fabric-display" onClick={onClick}>
      <div className="pocket-styles-display">
        <div className="pocket-style-item">
          <div className="pocket-image-preview-small">
            <img
              src={backPocketImageUrl}
              alt={`Back ${backPocketStyle}`}
              className="pocket-thumbnail-small"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder.png";
              }}
            />
          </div>
          <div className="pocket-style-label">Back</div>
        </div>
        <div className="pocket-style-item">
          <div className="pocket-image-preview-small">
            <img
              src={frontPocketImageUrl}
              alt={`Front ${frontPocketStyle}`}
              className="pocket-thumbnail-small"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder.png";
              }}
            />
          </div>
          <div className="pocket-style-label">Front</div>
        </div>
      </div>
      <div className="selected-fabric-name">
        {getPocketDisplayName(selectedPocket)}
      </div>
    </div>
  );
}

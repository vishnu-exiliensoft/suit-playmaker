/**
 * SELECTED JACKET LINING DISPLAY COMPONENT
 * ==========================================
 * 
 * This component displays the currently selected jacket lining in the sidebar.
 * It shows the lining image and name, and allows users to click to open lining options.
 * 
 * Features:
 * - Displays lining image with fallback handling
 * - Shows lining name with "Jacket Lining:" prefix
 * - Clickable to open lining options panel
 * - Handles missing images gracefully
 * - Uses consistent styling with other fabric displays
 * 
 * @param {Object} selectedLining - Currently selected lining object
 * @param {Function} onClick - Function to call when component is clicked
 * @returns {JSX.Element} Selected jacket lining display component
 */

import React from "react";

/**
 * SelectedJacketLiningDisplay component shows the currently chosen jacket lining's image and name.
 * Structure intentionally mirrors SelectedWholeFabricDisplay for consistency.
 */
export default function SelectedJacketLiningDisplay({
  selectedLining,
  onClick,
}) {
  const fallbackImage = "/placeholder.png";

  const imageUrl = selectedLining?.imageUrl || fallbackImage;
  const liningName = selectedLining?.name || "Select jacket lining";

  return (
    <div className="selected-fabric-display" onClick={onClick}>
      <img
        src={imageUrl}
        alt={liningName}
        className="selected-fabric-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = fallbackImage;
        }}
      />
      <div className="selected-fabric-name">Jacket Lining: {liningName}</div>
    </div>
  );
}

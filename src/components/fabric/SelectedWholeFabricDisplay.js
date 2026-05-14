/**
 * SELECTED WHOLE FABRIC DISPLAY COMPONENT
 * ========================================
 * 
 * This component displays the currently selected whole suit fabric in the sidebar.
 * It shows the fabric image and name, and allows users to click to open fabric options.
 * 
 * Features:
 * - Displays fabric image with fallback handling
 * - Shows fabric name with "Suit Fabric:" prefix
 * - Clickable to open fabric options panel
 * - Handles missing images gracefully
 * - Uses consistent styling with other fabric displays
 * 
 * @param {Object} selectedWholeFabric - Currently selected fabric object
 * @param {Function} onClick - Function to call when component is clicked
 * @returns {JSX.Element} Selected whole fabric display component
 */

import React from "react";

/**
 * SelectedWholeFabricDisplay component shows the currently chosen whole-suit fabric's image and name.
 * Structure intentionally mirrors SelectedFabricDisplay for consistency.
 */
export default function SelectedWholeFabricDisplay({
  selectedWholeFabric,
  onClick,
}) {
  const fallbackImage = "/placeholder.png";

  const imageUrl = selectedWholeFabric?.imageUrl || fallbackImage;
  const fabricName = selectedWholeFabric?.name || "Select whole-suit fabric";

  return (
    <div className="selected-fabric-display" onClick={onClick}>
      <img
        src={imageUrl}
        alt={fabricName}
        className="selected-fabric-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = fallbackImage;
        }}
      />
      <div className="selected-fabric-name">Suit Fabric: {fabricName}</div>
    </div>
  );
}

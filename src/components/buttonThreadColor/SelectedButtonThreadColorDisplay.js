/**
 * SELECTED BUTTON AND THREAD COLOR DISPLAY COMPONENT
 * ================================================
 * 
 * This component displays the currently selected button and thread color fabric.
 * It shows the fabric image and name, and allows users to click to open options.
 * 
 * Features:
 * - Displays fabric image with fallback handling
 * - Shows fabric name and type
 * - Clickable to open button/thread color options panel
 * - Handles missing images gracefully
 * - Consistent styling with other selected fabric displays
 * 
 * @param {Object} selectedButtonThreadColor - Currently selected button/thread color fabric
 * @param {Function} onClick - Function to call when component is clicked
 * @returns {JSX.Element} Selected button/thread color display component
 */

import React from "react";

/**
 * SelectedButtonThreadColorDisplay component shows the current chosen button/thread color fabric.
 */
export default function SelectedButtonThreadColorDisplay({
  selectedButtonThreadColor,
  onClick
}) {
  const fallbackImage = "/placeholder.png";

  const imageUrl = selectedButtonThreadColor?.imageUrl || fallbackImage;
  const fabricName = selectedButtonThreadColor?.name || "Select Button & Thread Color";

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
      <div className="selected-fabric-name">Button & Thread Color: {fabricName}</div>
    </div>
  );
}
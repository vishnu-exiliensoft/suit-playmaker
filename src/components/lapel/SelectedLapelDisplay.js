/**
 * SELECTED LAPEL DISPLAY COMPONENT
 * =================================
 * 
 * This component displays the currently selected lapel style in the sidebar.
 * It shows the lapel style image and name, and allows users to click to open lapel options.
 * 
 * Features:
 * - Displays lapel style image with fallback handling
 * - Maps lapel styles to corresponding SVG images
 * - Clickable to open lapel options panel
 * - Handles missing images gracefully
 * - Supports various lapel configurations
 * 
 * Available Lapel Styles:
 * - Notch Lapel: Classic V-shaped lapel
 * - Peak Lapel: Pointed lapel extending upward
 * - Round Lapel: Rounded lapel design
 * - Shawl Lapel: Smooth, curved lapel without notch
 * 
 * @param {string} selectedLapelStyle - Currently selected lapel style
 * @param {Function} onClick - Function to call when component is clicked
 * @returns {JSX.Element} Selected lapel display component
 */

import React from "react";

export default function SelectedLapelDisplay({ selectedLapelStyle, onClick }) {
  const lapelStyle = selectedLapelStyle || "Notch Lapel";

  // Map lapel styles to their corresponding image URLs
  const getLapelImageUrl = (style) => {
    switch (style) {
      case "Notch Lapel":
        return "/lapel/Notch lapel.svg";
      case "Peak Lapel":
        return "/lapel/Peak Lapel.svg";
      case "Round Lapel":
        return "/lapel/Round Lapel.svg";
      case "Shawl Lapel":
        return "/lapel/shawl Lapel.svg";
      default:
        return "/lapel/Notch lapel.svg";
    }
  };

  const fallbackImage = "/placeholder.png";
  const imageUrl = getLapelImageUrl(lapelStyle);

  return (
    <div className="selected-fabric-display" onClick={onClick}>
      <img
        src={imageUrl}
        alt={lapelStyle}
        className="selected-fabric-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = fallbackImage;
        }}
      />
      <div className="selected-fabric-name">{lapelStyle}</div>
    </div>
  );
}



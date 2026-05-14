/**
 * SELECTED PANT CUFF DISPLAY COMPONENT
 * ====================================
 * 
 * This component displays the currently selected pant cuff style in the sidebar.
 * It shows the pant cuff style image and name, and allows users to click to open pant cuff options.
 * 
 * Features:
 * - Displays pant cuff style image with fallback handling
 * - Maps pant cuff styles to corresponding SVG images
 * - Clickable to open pant cuff options panel
 * - Handles missing images gracefully
 * - Supports various pant cuff configurations
 * 
 * Available Pant Cuff Styles:
 * - Regular: Regular pant cuff design
 * - Cuff: Standard cuff style
 * - Single Tabs: Single tabs cuff design
 * - Double Tabs: Double tabs cuff design
 * - Foldover Tabs: Foldover tabs cuff style
 * 
 * @param {string} selectedPantCuff - Currently selected pant cuff style
 * @param {Array} pantCuffData - Array of available pant cuff options
 * @param {Function} onClick - Function to call when component is clicked
 * @returns {JSX.Element} Selected pant cuff display component
 */

import React from "react";

/**
 * SelectedPantCuffDisplay component shows the current chosen pant cuff's image and name.
 */
export default function SelectedPantCuffDisplay({ selectedPantCuff, onClick }) {
  const iconMap = {
    Regular: "/pantCuff/Regular.svg",
    Cuff: "/pantCuff/Cuff.svg",
    SingleTabs: "/pantCuff/Single Tabs.svg",
    DoubleTabs: "/pantCuff/Double Tabs.svg",
    FoldoverTabs: "/pantCuff/Foldover Tabs.svg",
  };

  const getPantCuffDisplayInfo = (pantCuffKey) => {
    switch (pantCuffKey) {
      case "Regular":
        return {
          name: "Regular",
          imageUrl: iconMap.Regular
        };
      case "Cuff":
        return {
          name: "Cuff",
          imageUrl: iconMap.Cuff
        };
      case "SingleTabs":
        return {
          name: "Single Tabs",
          imageUrl: iconMap.SingleTabs
        };
      case "DoubleTabs":
        return {
          name: "Double Tabs",
          imageUrl: iconMap.DoubleTabs
        };
      case "FoldoverTabs":
        return {
          name: "Foldover Tabs",
          imageUrl: iconMap.FoldoverTabs
        };
      default:
        return {
          name: "Select a pant cuff style",
          imageUrl: "/placeholder.png"
        };
    }
  };

  const pantCuff = getPantCuffDisplayInfo(selectedPantCuff);

  return (
    <div className="selected-fabric-display" onClick={onClick}>
      <img
        src={pantCuff.imageUrl}
        alt={pantCuff.name}
        className="fabric-effect-thumbnail-sidebar"
        style={{ marginRight: 8 }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/placeholder.png";
        }}
      />
      <div className="selected-fabric-name">{pantCuff.name}</div>
    </div>
  );
}

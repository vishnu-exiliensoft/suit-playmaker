/**
 * SELECTED BELTLOOP DISPLAY COMPONENT
 * ===================================
 * 
 * This component displays the currently selected beltloop style in the sidebar.
 * It shows the beltloop style image and name, and allows users to click to open beltloop options.
 * 
 * Features:
 * - Displays beltloop style image with fallback handling
 * - Maps beltloop styles to corresponding SVG images
 * - Clickable to open beltloop options panel
 * - Handles missing images gracefully
 * - Supports various beltloop configurations
 * 
 * Available Beltloop Styles:
 * - None: No beltloops
 * - Single: Single beltloop design
 * - Double: Double beltloop design
 * - Modern: Modern beltloop style
 * - None + Button Side Adjusters: No beltloops with button side adjusters
 * - None + Buckle Side Adjusters: No beltloops with buckle side adjusters
 * 
 * @param {string} selectedBeltloop - Currently selected beltloop style
 * @param {Array} beltloopData - Array of available beltloop options
 * @param {Function} onClick - Function to call when component is clicked
 * @returns {JSX.Element} Selected beltloop display component
 */

import React from "react";

/**
 * SelectedBeltloopDisplay component shows the current chosen beltloop's image and name.
 */
export default function SelectedBeltloopDisplay({ selectedBeltloop, beltloopData, onClick }) {
  const iconMap = {
    None: "/beltloop/None.svg",
    Single: "/beltloop/Single_1.svg",
    Double: "/beltloop/Double_1.svg",
    Modern: "/beltloop/Modern.svg",
    NoneButtonSideAdjusters: "/beltloop/None+Button.svg",
    NoneBtnSideAdjusters: "/beltloop/Buckle.svg",
  };

  const getBeltloopDisplayInfo = (beltloopKey) => {
    switch (beltloopKey) {
      case "None":
        return {
          name: "None",
          imageUrl: iconMap.None
        };
      case "Single":
        return {
          name: "Single",
          imageUrl: iconMap.Single
        };
      case "Double":
        return {
          name: "Double",
          imageUrl: iconMap.Double
        };
      case "Modern":
        return {
          name: "Modern",
          imageUrl: iconMap.Modern
        };
      case "NoneButtonSideAdjusters":
        return {
          name: "None + Button Side Adjusters",
          imageUrl: iconMap.NoneButtonSideAdjusters
        };
      case "NoneBtnSideAdjusters":
        return {
          name: "None + Buckle Side Adjusters",
          imageUrl: iconMap.NoneBtnSideAdjusters
        };
      default:
        return {
          name: "Select a beltloop",
          imageUrl: "/placeholder.png"
        };
    }
  };

  const beltloop = getBeltloopDisplayInfo(selectedBeltloop);

  return (
    <div className="selected-fabric-display" onClick={onClick}>
      <img
        src={beltloop.imageUrl}
        alt={beltloop.name}
        className="fabric-effect-thumbnail-sidebar"
        style={{ marginRight: 8 }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/placeholder.png";
        }}
      />
      <div className="selected-fabric-name">{beltloop.name}</div>
    </div>
  );
}

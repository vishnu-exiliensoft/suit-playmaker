/**
 * SELECTED SLEEVE DISPLAY COMPONENT
 * =================================
 * 
 * This component displays the currently selected sleeve button style in the sidebar.
 * It shows the sleeve button style image and name, and allows users to click to open sleeve options.
 * 
 * Features:
 * - Displays sleeve button style image with fallback handling
 * - Maps sleeve button styles to corresponding SVG images
 * - Clickable to open sleeve options panel
 * - Handles missing images gracefully
 * - Supports various sleeve button configurations
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
 * @param {Function} onClick - Function to call when component is clicked
 * @returns {JSX.Element} Selected sleeve display component
 */

import React from "react";

/**
 * SelectedSleeveDisplay component shows the current chosen sleeve button's image and name.
 */
export default function SelectedSleeveDisplay({ selectedSleeve, onClick }) {
  const sleeveData = {
    // Kissing buttons first
    "3_kissing_buttons": {
      name: "3 Kissing Buttons",
      imageUrl: "/sleevesbtn/3 kissing Buttons.svg",
    },
    "4_kissing_button": {
      name: "4 Kissing Button",
      imageUrl: "/sleevesbtn/4 kissing button.svg",
    },
    "5_kissing_button": {
      name: "5 Kissing Button",
      imageUrl: "/sleevesbtn/5 kissing button.svg",
    },
    // Standard buttons second
    "3_standard_button": {
      name: "3 Standard Button",
      imageUrl: "/sleevesbtn/3 standard button.svg",
    },
    "4_standard_buttons": {
      name: "4 Standard Buttons",
      imageUrl: "/sleevesbtn/4 standard Buttons.svg",
    },
    "5_standard_buttons": {
      name: "5 Standard Buttons",
      imageUrl: "/sleevesbtn/5 standard buttons.svg",
    },
  };

  const sleeve = sleeveData[selectedSleeve] || {
    name: "Select a sleeve button style",
    imageUrl: "/placeholder.png",
  };

  return (
    <div className="selected-fabric-display" onClick={onClick}>
      <img
        src={sleeve.imageUrl}
        alt={sleeve.name}
        className="selected-fabric-thumbnail"
        style={{ width: 40, height: 40, marginRight: 8 }}
      />
      <div className="selected-fabric-name">{sleeve.name}</div>
    </div>
  );
}

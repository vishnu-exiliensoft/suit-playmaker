/**
 * SELECTED BUTTON DISPLAY COMPONENT
 * ==================================
 * 
 * This component displays the currently selected button style in the sidebar.
 * It shows the button style image and name, and allows users to click to open button options.
 * 
 * Features:
 * - Displays button style image with fallback handling
 * - Maps button styles to corresponding SVG images
 * - Clickable to open button options panel
 * - Handles missing images gracefully
 * - Supports various button configurations
 * 
 * Available Button Styles:
 * - Single breasted options (1-6 buttons)
 * - Different closing styles (1 to close, 2 to close, etc.)
 * - Visual previews for each style
 * 
 * @param {string} selectedButtonStyle - Currently selected button style
 * @param {Function} onClick - Function to call when component is clicked
 * @returns {JSX.Element} Selected button display component
 */

import React from "react";

/**
 * SelectedButtonDisplay component shows the current chosen button style.
 */
export default function SelectedButtonDisplay({ selectedButtonStyle, onClick }) {
  const buttonStyle = selectedButtonStyle || "1 Button, Single Breasted";

  // Map button styles to their corresponding image URLs
  const getButtonImageUrl = (style) => {
    switch (style) {
      case "1 Button, Single Breasted":
        return "/jacketbutton/1 Buttin.svg";
      case "2 Button, Single Breasted":
        return "/jacketbutton/2 Buttin.svg";
      case "3 Button, Single Breasted":
        return "/jacketbutton/3 Buttin.svg";
      case "4 Button, Single Breasted":
        return "/jacketbutton/4 Buttin.svg";
      case "4 Button, Single Breasted 2 to close":
        return "/jacketbutton/4 Buttin signle Breasted 2 to close.svg";
      case "4 Button, Single Breasted 1 to close":
        return "/jacketbutton/4 Buttin signle Breasted 1 to close.svg";
      case "6 Button, Single Breasted 2 to close":
        return "/jacketbutton/6 Buttin signle Breasted 2 to close.svg";
      case "6 Button, Single Breasted 3 to close":
        return "/jacketbutton/6 Buttin signle Breasted 3 to close.svg";
      case "6 Button, Single Breasted 1 to close":
        return "/jacketbutton/6 Buttin signle Breasted 1 to close.svg";
      default:
        return "/jacketbutton/1 Buttin.svg";
    }
  };

  const fallbackImage = "/placeholder.png";
  const imageUrl = getButtonImageUrl(buttonStyle);

  return (
    <div className="selected-fabric-display" onClick={onClick}>
      <img
        src={imageUrl}
        alt={buttonStyle}
        className="selected-fabric-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = fallbackImage;
        }}
      />
      <div className="selected-fabric-name">{buttonStyle}</div>
    </div>
  );
}

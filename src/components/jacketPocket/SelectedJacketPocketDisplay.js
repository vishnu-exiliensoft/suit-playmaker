/**
 * SELECTED JACKET POCKET DISPLAY COMPONENT
 * =========================================
 * 
 * This component displays the currently selected jacket pocket style in the sidebar.
 * It shows the pocket style image and name, and allows users to click to open pocket options.
 * 
 * Features:
 * - Displays pocket style image with fallback handling
 * - Shows pocket name with "Jacket Pocket:" prefix
 * - Clickable to open jacket pocket options panel
 * - Handles missing images gracefully
 * - Supports various pocket configurations
 * 
 * Available Pocket Styles:
 * - 2 Straight Pockets (with/without flaps)
 * - 2 Slanted Pockets (with/without ticket pockets)
 * - 2 Patched Pockets
 * - Various combinations with ticket pockets
 * 
 * @param {Object} selectedJacketPocket - Currently selected jacket pocket object
 * @param {Array} jacketPocketData - Array of available jacket pocket options
 * @param {Function} onClick - Function to call when component is clicked
 * @returns {JSX.Element} Selected jacket pocket display component
 */

import React from "react";

/**
 * SelectedJacketPocketDisplay component shows the currently selected jacket pocket style.
 * This component displays the selected jacket pocket option in the sidebar.
 */
export default function SelectedJacketPocketDisplay({
  selectedJacketPocket,
  jacketPocketData,
  onClick,
}) {
  // Default jacket pocket options with proper image URLs
  const defaultJacketPockets = [
    {
      name: "2 Straight Pockets",
      key: "2StraightPockets",
      description: "Two straight pockets on the jacket",
      imageUrl: "/jacketpocket/2 straight pockets.svg",
    },
    {
      name: "2 Straight Pockets and 1 Ticket Pocket",
      key: "2StraightPockets1Ticket",
      description: "Two straight pockets with one ticket pocket",
      imageUrl: "/jacketpocket/2 straight pockets And 1 tichet Pocket.svg",
    },
    {
      name: "2 Slanted Pockets",
      key: "2SlantedPockets",
      description: "Two slanted pockets on the jacket",
      imageUrl: "/jacketpocket/2 slanted pockets.svg",
    },
    {
      name: "2 Slanted Pockets and 1 Ticket Pocket",
      key: "2SlantedPockets1Ticket",
      description: "Two slanted pockets with one ticket pocket",
      imageUrl: "/jacketpocket/2slanted pockets and 1 ticket pocket.svg",
    },
    {
      name: "2 Straight Pockets No Flap",
      key: "2StraightPocketsNoFlap",
      description: "Two straight pockets without flaps",
      imageUrl: "/jacketpocket/2 straight pockets no flap.svg",
    },
    {
      name: "2 Straight Pockets and 1 Ticket Pocket No Flap",
      key: "2StraightPockets1TicketNoFlap",
      description: "Two straight pockets with ticket pocket, no flaps",
      imageUrl: "/jacketpocket/2 straight pockets and 1 ticket pocket no flap.svg",
    },
    {
      name: "2 Patched Pockets",
      key: "2PatchedPockets",
      description: "Two patched pockets on the jacket",
      imageUrl: "/jacketpocket/2 patched pockets.svg",
    },
  ];

  const fallbackImage = "/placeholder.png";
  const currentPocket = selectedJacketPocket || defaultJacketPockets[0];

  return (
    <div className="selected-fabric-display" onClick={onClick}>
      <img
        src={currentPocket.imageUrl || fallbackImage}
        alt={currentPocket.name}
        className="selected-fabric-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = fallbackImage;
        }}
      />
      <div className="selected-fabric-name">Jacket Pocket: {currentPocket.name}</div>
    </div>
  );
}

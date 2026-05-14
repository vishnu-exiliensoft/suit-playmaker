/**
 * JACKET POCKET OPTIONS PANEL COMPONENT
 * ======================================
 * 
 * This component displays jacket pocket style options specifically for suit jackets.
 * Users can choose from various pocket configurations including:
 * - Straight pockets (with/without flaps)
 * - Slanted pockets (with/without ticket pockets)
 * - Patched pockets
 * 
 * Features:
 * - Visual pocket style previews with SVG images
 * - Detailed descriptions for each option
 * - Fallback to default options if no data provided
 * - Error handling for missing images
 * 
 * Available Options:
 * - 2 Straight Pockets
 * - 2 Straight Pockets and 1 Ticket Pocket
 * - 2 Slanted Pockets
 * - 2 Slanted Pockets and 1 Ticket Pocket
 * - 2 Straight Pockets No Flap
 * - 2 Straight Pockets and 1 Ticket Pocket No Flap
 * - 2 Patched Pockets
 * 
 * @param {Array} jacketPocketData - Array of jacket pocket options from API
 * @param {Object} selectedJacketPocket - Currently selected jacket pocket
 * @param {Function} setSelectedJacketPocket - Function to update selected pocket
 * @param {boolean} isVisible - Whether the panel is visible
 * @returns {JSX.Element} Jacket pocket options panel component
 */

import React from "react";

// Centralized jacket pocket pricing configuration
export const JACKET_POCKET_PRICING = {
  "2StraightPockets": 0,
  "2StraightPockets1Ticket": 15, // Updated price for testing
  "2SlantedPockets": 8, // Updated price for testing
  "2SlantedPockets1Ticket": 20, // Updated price for testing
  "2StraightPocketsNoFlap": 0,
  "2StraightPockets1TicketNoFlap": 12, // Updated price for testing
  "2PatchedPockets": 18, // Updated price for testing
};

// Function to get jacket pocket price based on style and product type
export const getJacketPocketPrice = (pocketStyle, productType = null) => {
  // If SuitTrouser is selected, jacket pocket price should be 0
  if (productType && productType.key === "SuitTrouser") {
    return 0;
  }
  return JACKET_POCKET_PRICING[pocketStyle] || 0;
};

/**
 * JacketPocketOptionsPanel component displays the list of available jacket pocket styles.
 * This component is specifically for Suit Jacket pocket customization.
 */
export default function JacketPocketOptionsPanel({
  jacketPocketData,
  selectedJacketPocket,
  setSelectedJacketPocket,
  isVisible,
}) {
  // Default jacket pocket options with proper names
  const jacketPocketOptions = (jacketPocketData || [
    {
      name: "2 Straight Pockets",
      key: "2StraightPockets",
      description: "Two straight pockets on the jacket",
    },
    {
      name: "2 Straight Pockets and 1 Ticket Pocket",
      key: "2StraightPockets1Ticket",
      description: "Two straight pockets with one ticket pocket",
    },
    {
      name: "2 Slanted Pockets",
      key: "2SlantedPockets",
      description: "Two slanted pockets on the jacket",
    },
    {
      name: "2 Slanted Pockets and 1 Ticket Pocket",
      key: "2SlantedPockets1Ticket",
      description: "Two slanted pockets with one ticket pocket",
    },
    {
      name: "2 Straight Pockets No Flap",
      key: "2StraightPocketsNoFlap",
      description: "Two straight pockets without flaps",
    },
    {
      name: "2 Straight Pockets and 1 Ticket Pocket No Flap",
      key: "2StraightPockets1TicketNoFlap",
      description: "Two straight pockets with ticket pocket, no flaps",
    },
    {
      name: "2 Patched Pockets",
      key: "2PatchedPockets",
      description: "Two patched pockets on the jacket",
    },
  ]).map(pocket => ({
    ...pocket,
    // Add image URLs if needed in the future
    imageUrl: pocket.imageUrl || "/placeholder.png",
    // Add pricing from centralized configuration
    price: JACKET_POCKET_PRICING[pocket.key] || 0
  }));

  return (
    <div
      className={`fabric-options-container ${isVisible ? "is-visible" : ""}`}
    >
      <h3 className="fabric-options-title">Select Jacket Pocket Style</h3>
      <div className="fabric-list-container">
        {jacketPocketOptions.map((pocket) => {
          const isSelected = selectedJacketPocket && selectedJacketPocket.key === pocket.key;
          return (
            <div
              key={pocket.key}
              onClick={() => setSelectedJacketPocket(pocket)}
              className={`fabric-option-item ${
                isSelected ? "is-selected" : ""
              }`}
            >
              <div className="fitting-image-preview">
                <img
                  src={pocket.imageUrl}
                  alt={pocket.name}
                  className="fitting-thumbnail"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder.png";
                  }}
                />
              </div>
              <div className="fabric-details">
                <div className="fabric-name">{pocket.name}</div>
                <div className="fabric-description">{pocket.description}</div>
                <div className="fabric-price">
                  {pocket.price > 0 ? `SDG ${pocket.price}` : "Included"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

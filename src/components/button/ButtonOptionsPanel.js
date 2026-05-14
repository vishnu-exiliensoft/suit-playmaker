/**
 * BUTTON OPTIONS PANEL COMPONENT
 * ===============================
 * 
 * This component displays button style options for suit jackets.
 * Users can choose from various button configurations with visual previews.
 * 
 * Features:
 * - Visual button style previews with SVG images
 * - Smooth slide-in/slide-out animations
 * - Responsive design with hover effects
 * - Clear selection indicators
 * - Error handling for missing images
 * - Supports various button configurations
 * 
 * Available Button Styles:
 * - Single breasted options (1-6 buttons)
 * - Different closing styles (1 to close, 2 to close, etc.)
 * - Visual previews for each style
 * - Basic and advanced button configurations
 * 
 * @param {string} selectedButtonStyle - Currently selected button style
 * @param {Function} setSelectedButtonStyle - Function to update button style
 * @param {boolean} isVisible - Whether the panel is visible
 * @returns {JSX.Element} Button options panel component
 */

import React from "react";

// Centralized button pricing configuration
export const BUTTON_PRICING = {
  "1 Button, Single Breasted": 0,
  "2 Button, Single Breasted": 0,
  "3 Button, Single Breasted": 8, // Updated price for testing
  "4 Button, Single Breasted": 12, // Updated price for testing
  "4 Button, Single Breasted 2 to close": 18, // Updated price for testing
  "4 Button, Single Breasted 1 to close": 15, // Updated price for testing
  "6 Button, Single Breasted 2 to close": 22, // Updated price for testing
  "6 Button, Single Breasted 3 to close": 25, // Updated price for testing
  "6 Button, Single Breasted 1 to close": 18, // Updated price for testing
};

// Function to get button price based on style and product type
export const getButtonPrice = (buttonStyle, productType = null) => {
  // If SuitTrouser is selected, button price should be 0
  if (productType && productType.key === "SuitTrouser") {
    return 0;
  }
  return BUTTON_PRICING[buttonStyle] || 0;
};

/**
 * ButtonOptionsPanel component displays button style options.
 * It slides in and out based on the isVisible prop.
 */
export default function ButtonOptionsPanel({
  selectedButtonStyle,
  setSelectedButtonStyle,
  isVisible,
  onPriceChange,
}) {
  const options = [
    {
      label: "1 Button, Single Breasted",
      type: "basic",
      imageUrl: "/jacketbutton/1 Buttin.svg",
      price: BUTTON_PRICING["1 Button, Single Breasted"],
    },
    {
      label: "2 Button, Single Breasted",
      type: "basic",
      imageUrl: "/jacketbutton/2 Buttin.svg",
      price: BUTTON_PRICING["2 Button, Single Breasted"],
    },
    {
      label: "3 Button, Single Breasted",
      type: "basic",
      imageUrl: "/jacketbutton/3 Buttin.svg",
      price: BUTTON_PRICING["3 Button, Single Breasted"],
    },
    {
      label: "4 Button, Single Breasted",
      type: "basic",
      imageUrl: "/jacketbutton/4 Buttin.svg",
      price: BUTTON_PRICING["4 Button, Single Breasted"],
    },
    {
      label: "4 Button, Single Breasted 2 to close",
      type: "advanced",
      imageUrl: "/jacketbutton/4 Buttin signle Breasted 2 to close.svg",
      price: BUTTON_PRICING["4 Button, Single Breasted 2 to close"],
    },
    {
      label: "4 Button, Single Breasted 1 to close",
      type: "advanced",
      imageUrl: "/jacketbutton/4 Buttin signle Breasted 1 to close.svg",
      price: BUTTON_PRICING["4 Button, Single Breasted 1 to close"],
    },
    {
      label: "6 Button, Single Breasted 2 to close",
      type: "advanced",
      imageUrl: "/jacketbutton/6 Buttin signle Breasted 2 to close.svg",
      price: BUTTON_PRICING["6 Button, Single Breasted 2 to close"],
    },
    {
      label: "6 Button, Single Breasted 3 to close",
      type: "advanced",
      imageUrl: "/jacketbutton/6 Buttin signle Breasted 3 to close.svg",
      price: BUTTON_PRICING["6 Button, Single Breasted 3 to close"],
    },
    {
      label: "6 Button, Single Breasted 1 to close",
      type: "advanced",
      imageUrl: "/jacketbutton/6 Buttin signle Breasted 1 to close.svg",
      price: BUTTON_PRICING["6 Button, Single Breasted 1 to close"],
    },
  ];

  return (
    <div
      className={`fabric-options-container ${isVisible ? "is-visible" : ""}`}
    >
      <h3 className="fabric-options-title">Suit Jacket Button Style</h3>
      
      <div className="fabric-list-container">
        {options.map((option) => {
          const isSelected = selectedButtonStyle === option.label;
          return (
            <div
              key={option.label}
              onClick={() => {
                setSelectedButtonStyle(option.label);
                // Notify parent component about price change
                if (onPriceChange) {
                  onPriceChange(option.price);
                }
              }}
              className={`fabric-option-item ${isSelected ? "is-selected" : ""}`}
            >
              <div className="fitting-image-preview">
                <img
                  src={option.imageUrl}
                  alt={option.label}
                  className="fitting-thumbnail"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder.png";
                  }}
                />
              </div>
              <div className="fabric-details">
                <div className="fabric-name">{option.label}</div>
                <div className="fabric-price">
                  {option.price > 0 ? `SDG ${option.price}` : "Included"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * PANT CUFF OPTIONS PANEL COMPONENT
 * ==================================
 * 
 * This component displays pant cuff style options for suit trousers.
 * Users can choose from various pant cuff configurations with visual previews.
 * 
 * Features:
 * - Visual pant cuff style previews with SVG images
 * - Smooth slide-in/slide-out animations
 * - Responsive design with hover effects
 * - Error handling for missing images
 * - Clear selection indicators
 * - Fallback to default options if no data provided
 * 
 * Available Pant Cuff Styles:
 * - Regular: Regular pant cuff design
 * - Cuff: Standard cuff style
 * - Single Tabs: Single tabs cuff design
 * - Double Tabs: Double tabs cuff design
 * - Foldover Tabs: Foldover tabs cuff style
 * 
 * @param {Array} pantCuffData - Array of available pant cuff options from API
 * @param {string} selectedPantCuff - Currently selected pant cuff style
 * @param {Function} setSelectedPantCuff - Function to update pant cuff style
 * @param {boolean} isVisible - Whether the panel is visible
 * @returns {JSX.Element} Pant cuff options panel component
 */

import React from "react";

/**
 * PantCuffOptionsPanel component displays the list of available pant cuff styles.
 */
export default function PantCuffOptionsPanel({
  selectedPantCuff,
  setSelectedPantCuff,
  isVisible,
  onPriceChange,
  onMeshVisibilityChange,
}) {
  // Map pant cuff keys to their icon paths in public/pantCuff
  const iconMap = {
    Regular: "/pantCuff/Regular.svg",
    Cuff: "/pantCuff/Cuff.svg",
    SingleTabs: "/pantCuff/Single Tabs.svg",
    DoubleTabs: "/pantCuff/Double Tabs.svg",
    FoldoverTabs: "/pantCuff/Foldover Tabs.svg",
  };

  // Define pant cuff meshes for visibility control
  const pantCuffMeshes = [
    "DoubleTabs",
    "SingleTabs", 
    "SingleTabsBtn001",
    "FoldoverTab",
    "FoldoverTabBtn001",
    "DoubleTabsBtn",
  ];

  // Function to handle mesh visibility based on selected pant cuff
  const handleMeshVisibility = (pantCuffKey) => {
    if (!onMeshVisibilityChange) return;

    // Hide all pant cuff meshes first
    pantCuffMeshes.forEach(meshName => {
      onMeshVisibilityChange(meshName, false);
    });

    // Show specific meshes based on selection
    switch (pantCuffKey) {
      case "Regular":
        // Regular - hide all pant cuff meshes
        break;
      case "Cuff":
        onMeshVisibilityChange("DoubleTabs", false);
        onMeshVisibilityChange("SingleTabs", false);
        onMeshVisibilityChange("DoubleTabsBtn", false);
        onMeshVisibilityChange("SingleTabsBtn001", false);
        break;
      case "SingleTabs":
        // Single Tabs - show SingleTabs and SingleTabsBtn.001
        onMeshVisibilityChange("SingleTabs", true);
        onMeshVisibilityChange("SingleTabsBtn001", true);
        break;
      case "DoubleTabs":
        // Double Tabs - show DoubleTabs
        onMeshVisibilityChange("DoubleTabs", true);
        onMeshVisibilityChange("SingleTabs", true);
        onMeshVisibilityChange("DoubleTabsBtn", true);
        onMeshVisibilityChange("SingleTabsBtn001", true);
        break;
      case "FoldoverTabs":
        // Foldover Tabs - show FoldoverTab and FoldoverTabBtn.001
        onMeshVisibilityChange("FoldoverTab", true);
        onMeshVisibilityChange("FoldoverTabBtn001", true);
        break;
      default:
        // Default - hide all
        break;
    }
  };

  // Define pant cuff options with price, name, key, and image URLs
  const pantCuffOptions = [
    {
      name: "Regular",
      key: "Regular",
      imageUrl: iconMap.Regular,
      price: 0,
    },
    {
      name: "Cuff",
      key: "Cuff",
      imageUrl: iconMap.Cuff,
      price: 10,
    },
    {
      name: "Single Tabs",
      key: "SingleTabs",
      imageUrl: iconMap.SingleTabs,
      price: 25,
    },
    {
      name: "Double Tabs",
      key: "DoubleTabs",
      imageUrl: iconMap.DoubleTabs,
      price: 35,
    },
    {
      name: "Foldover Tabs",
      key: "FoldoverTabs",
      imageUrl: iconMap.FoldoverTabs,
      price: 45,
    },
  ];

  return (
    <div
      className={`fabric-options-container ${isVisible ? "is-visible" : ""}`}
    >
      <h3 className="fabric-options-title">Select Pant Cuff Style</h3>
      <div className="fabric-list-container">
        {pantCuffOptions.map((pantCuff) => {
          const isSelected = selectedPantCuff === pantCuff.key;
          return (
            <div
              key={pantCuff.key}
              onClick={() => {
                setSelectedPantCuff(pantCuff.key);
                // Handle mesh visibility
                handleMeshVisibility(pantCuff.key);
                // Notify parent component about price change
                if (onPriceChange) {
                  onPriceChange(pantCuff.price);
                }
              }}
              className={`fabric-option-item ${
                isSelected ? "is-selected" : ""
              }`}
            >
              <div className="fabric-effect-image-preview">
                <img
                  src={pantCuff.imageUrl}
                  alt={pantCuff.name}
                  className="fabric-effect-thumbnail"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder.png";
                  }}
                />
              </div>
              <div className="fabric-details">
                <div className="fabric-name">{pantCuff.name}</div>
                <div className="fabric-price">
                  {pantCuff.price > 0 ? `SDG ${pantCuff.price}` : "Included"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

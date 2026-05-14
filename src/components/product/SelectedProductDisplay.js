/**
 * SELECTED PRODUCT DISPLAY COMPONENT
 * ===================================
 * 
 * This component displays the currently selected product type in the sidebar.
 * It shows the product image and name, and allows users to click to open options.
 * 
 * Features:
 * - Displays product image with fallback handling
 * - Shows product name with "Product:" prefix
 * - Clickable to open product options panel
 * - Handles missing images gracefully
 * 
 * Available Products:
 * - Two Piece Suit: Complete suit with jacket and trouser
 * - Suit Jacket: Only jacket customization
 * - Suit Trouser: Only trouser customization
 * 
 * @param {Object} selectedProduct - Currently selected product object
 * @param {Array} productData - Array of available products from API
 * @param {Function} onClick - Function to call when component is clicked
 * @returns {JSX.Element} Selected product display component
 */

import React from "react";

/**
 * SelectedProductDisplay component shows the currently selected product type.
 */
export default function SelectedProductDisplay({
  selectedProduct,
  productData,
  onClick,
}) {
  // Default product options
  const defaultProducts = [
    {
      name: "Two Piece Suit",
      key: "TwoPieceSuit",
      imageUrl: "/product/two-piece-suit.svg",
    },
    {
      name: "Suit Jacket",
      key: "SuitJacket",
      imageUrl: "/product/suit-jacket.svg",
    },
    {
      name: "Suit Trouser",
      key: "SuitTrouser",
      imageUrl: "/product/suit-trouser.svg",
    },
  ];

  const fallbackImage = "/placeholder.png";
  const currentProduct = selectedProduct || defaultProducts[0];

  return (
    <div className="selected-product-display" onClick={onClick}>
      <img
        src={currentProduct.imageUrl}
        alt={currentProduct.name}
        className="selected-product-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = fallbackImage;
        }}
      />
      <div className="selected-product-name">Product: {currentProduct.name}</div>
    </div>
  );
}

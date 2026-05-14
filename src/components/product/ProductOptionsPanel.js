/**
 * PRODUCT OPTIONS PANEL COMPONENT
 * ================================
 * 
 * This component displays the available product types for customization.
 * Users can select between different suit configurations.
 * 
 * Features:
 * - Visual product type previews with SVG images
 * - Smooth slide-in/slide-out animations
 * - Responsive design with hover effects
 * - Clear selection indicators
 * - Error handling for missing images
 * - Fallback to default options if no data provided
 * 
 * Available Products:
 * - Two Piece Suit: Complete suit with jacket and trouser
 * - Suit Jacket: Only jacket customization
 * - Suit Trouser: Only trouser customization
 * 
 * @param {Array} productData - Array of available products from API
 * @param {Object} selectedProduct - Currently selected product
 * @param {Function} setSelectedProduct - Function to update selected product
 * @param {boolean} isVisible - Whether the panel is visible
 * @returns {JSX.Element} Product options panel component
 */

import React from "react";

/**
 * ProductOptionsPanel component displays the list of available product types.
 */
export default function ProductOptionsPanel({
  productData,
  selectedProduct,
  setSelectedProduct,
  isVisible,
}) {
  // Product options with images and base pricing
  const productOptions = (productData || [
    {
      name: "Two Piece Suit",
      key: "TwoPieceSuit",
      imageUrl: "/product/two-piece-suit.svg",
      basePrice: 99, // Complete suit base price
    },
    {
      name: "Suit Jacket",
      key: "SuitJacket",
      imageUrl: "/product/suit-jacket.svg",
      basePrice: 69, // Jacket only base price
    },
    {
      name: "Suit Trouser",
      key: "SuitTrouser",
      imageUrl: "/product/suit-trouser.svg",
      basePrice: 49, // Trouser only base price
    },
  ]).map(product => ({
    ...product,
    imageUrl: product.key === "TwoPieceSuit" ? "/product/two-piece-suit.svg" : 
              product.key === "SuitJacket" ? "/product/suit-jacket.svg" : 
              product.key === "SuitTrouser" ? "/product/suit-trouser.svg" : 
              product.imageUrl || "/placeholder.png",
    // Ensure base price is set
    basePrice: product.basePrice || (product.key === "TwoPieceSuit" ? 99 : 
                                    product.key === "SuitJacket" ? 69 : 
                                    product.key === "SuitTrouser" ? 49 : 0)
  }));

  return (
    <div
      className={`fabric-options-container ${isVisible ? "is-visible" : ""}`}
    >
      <h3 className="fabric-options-title">Select Product Type</h3>
      <div className="fabric-list-container">
        {productOptions.map((product) => {
          const isSelected = selectedProduct && selectedProduct.key === product.key;
          return (
            <div
              key={product.key}
              onClick={() => setSelectedProduct(product)}
              className={`fabric-option-item ${
                isSelected ? "is-selected" : ""
              }`}
            >
              <div className="fitting-image-preview">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="fitting-thumbnail"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder.png";
                  }}
                />
              </div>
              <div className="fabric-details">
                <div className="fabric-name">{product.name}</div>
                <div className="fabric-price">SDG {product.basePrice}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import SelectedWholeFabricDisplay from "./components/fabric/SelectedWholeFabricDisplay";
import WholeFabricOptionsPanel from "./components/fabric/WholeFabricOptionsPanel";

import CollarOptionsPanel from "./components/collar/CollarOptionsPanel";
import SleeveOptionsPanel from "./components/sleeve/SleeveOptionsPanel";
import SelectedSleeveDisplay from "./components/sleeve/SelectedSleeveDisplay";
import ShirtBackOptionsPanel from "./components/shirtback/ShirtBackOptionsPanel";
import PlacketOptionsPanel from "./components/placket/PlacketOptionsPanel";
import SelectedBeltloopDisplay from "./components/beltloop/SelectedBeltloopDisplay";
import BeltloopOptionsPanel from "./components/beltloop/BeltloopOptionsPanel";
import SelectedPantCuffDisplay from "./components/pantCuff/SelectedPantCuffDisplay";
import PantCuffOptionsPanel from "./components/pantCuff/PantCuffOptionsPanel";
import SelectedPocketDisplay from "./components/pocket/SelectedPocketDisplay";
import PocketOptionsPanel from "./components/pocket/PocketOptionsPanel";
import SelectedButtonDisplay from "./components/button/SelectedButtonDisplay";
import ButtonOptionsPanel from "./components/button/ButtonOptionsPanel";
import SelectedLapelDisplay from "./components/lapel/SelectedLapelDisplay";
import LapelOptionsPanel, { getLapelPrice } from "./components/lapel/LapelOptionsPanel";
import JacketPocketOptionsPanel, { getJacketPocketPrice } from "./components/jacketPocket/JacketPocketOptionsPanel";
import SelectedJacketPocketDisplay from "./components/jacketPocket/SelectedJacketPocketDisplay";
import JacketLiningOptionsPanel from "./components/jacketLining/JacketLiningOptionsPanel";
import SelectedJacketLiningDisplay from "./components/jacketLining/SelectedJacketLiningDisplay";
import ButtonThreadColorOptionsPanel from "./components/buttonThreadColor/ButtonThreadColorOptionsPanel";
import SelectedButtonThreadColorDisplay from "./components/buttonThreadColor/SelectedButtonThreadColorDisplay";
import SelectedProductDisplay from "./components/product/SelectedProductDisplay";
import ProductOptionsPanel from "./components/product/ProductOptionsPanel";
import SelectedNotesDisplay from "./components/notes/SelectedNotesDisplay";
import NotesOptionsPanel from "./components/notes/NotesOptionsPanel";

/**
 * Sidebar component manages all UI controls for shirt customization.
 */
const Sidebar = ({
  fabrics,
  buttonColor,
  setButtonColor,
  repeatScale,
  setRepeatScale,
  showItalianCollar,
  setShowItalianCollar,
  showFranchCollar,
  setShowFranchCollar,
  collarFabricTextureUrl,
  setCollarFabricTextureUrl,
  addToCartMessage,
  handleAddToCart,
  randomColor,
  collars,
  selectedCollar,
  setSelectedCollar,
  selectedSleeve,
  setSelectedSleeve,
  selectedWholeFabric,
  setSelectedWholeFabric,
  selectedShirtBack,
  setSelectedShirtBack,
  selectedPlacket,
  setSelectedPlacket,
  placketData,
  selectedBeltloop,
  setSelectedBeltloop,
  beltloopData,
  selectedPantCuff,
  setSelectedPantCuff,
  setSelectedOptionsPrices,
  onMeshVisibilityChange,
  selectedPocket,
  setSelectedPocket,
  selectedLogoMesh,
  setSelectedLogoMesh,
  logoImageUrl,
  setLogoImageUrl,
  logoEnabled,
  setLogoEnabled,
  selectedButtonStyle,
  setSelectedButtonStyle,
  selectedLapelStyle,
  setSelectedLapelStyle,
  selectedJacketPocket,
  setSelectedJacketPocket,
  jacketPocketData,
  selectedLining,
  setSelectedLining,
  liningData,
  selectedBackPocketStyle,
  setSelectedBackPocketStyle,
  selectedFrontPocketStyle,
  setSelectedFrontPocketStyle,
  selectedProduct,
  setSelectedProduct,
  productData,
  selectedNotes,
  setSelectedNotes,
  selectedButtonThreadColor,
  setSelectedButtonThreadColor,
  buttonThreadColorData,
}) => {
  const [showWholeFabricOptions, setShowWholeFabricOptions] = useState(false);
  const [showCollarOptions, setShowCollarOptions] = useState(false);
  const [showSleeveOptions, setShowSleeveOptions] = useState(false);
  const [showShirtBackOptions, setShowShirtBackOptions] = useState(false);
  const [showPlacketOptions, setShowPlacketOptions] = useState(false);
  const [showBeltloopOptions, setShowBeltloopOptions] = useState(false);
  const [showPantCuffOptions, setShowPantCuffOptions] = useState(false);
  const [showPocketOptions, setShowPocketOptions] = useState(false);
  const [showLogoOptions, setShowLogoOptions] = useState(false);
  const [showButtonOptions, setShowButtonOptions] = useState(false);
  const [showLapelOptions, setShowLapelOptions] = useState(false);
  const [showJacketPocketOptions, setShowJacketPocketOptions] = useState(false);
  const [showLiningOptions, setShowLiningOptions] = useState(false);
  const [showProductOptions, setShowProductOptions] = useState(false);
  const [showNotesOptions, setShowNotesOptions] = useState(false);
  const [showButtonThreadColorOptions, setShowButtonThreadColorOptions] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const togglePanel = (panel) => {
    // Don't allow belt loop, pant cuff and pocket panels to open if SuitJacket is selected
    if ((panel === "beltloop" || panel === "pantCuff" || panel === "pocket") && selectedProduct && selectedProduct.key === "SuitJacket") {
      return;
    }

    const nextState = {
      product: false,
      whole: false,
      collar: false,
      sleeve: false,
      shirtBack: false,
      placket: false,
      beltloop: false,
      pantCuff: false,
      pocket: false,
      logo: false,
      button: false,
      lapel: false,
      jacketPocket: false,
      lining: false,
      notes: false,
      buttonThreadColor: false,
    };
    const current = {
      product: showProductOptions,
      whole: showWholeFabricOptions,
      collar: showCollarOptions,
      sleeve: showSleeveOptions,
      shirtBack: showShirtBackOptions,
      placket: showPlacketOptions,
      beltloop: showBeltloopOptions,
      pantCuff: showPantCuffOptions,
      pocket: showPocketOptions,
      logo: showLogoOptions,
      button: showButtonOptions,
      lapel: showLapelOptions,
      jacketPocket: showJacketPocketOptions,
      lining: showLiningOptions,
      notes: showNotesOptions,
      buttonThreadColor: showButtonThreadColorOptions,
    }[panel];
    nextState[panel] = !current;

    setShowProductOptions(nextState.product);
    setShowWholeFabricOptions(nextState.whole);
    setShowCollarOptions(nextState.collar);
    setShowSleeveOptions(nextState.sleeve);
    setShowShirtBackOptions(nextState.shirtBack);
    setShowPlacketOptions(nextState.placket);
    setShowBeltloopOptions(nextState.beltloop);
    setShowPantCuffOptions(nextState.pantCuff);
    setShowPocketOptions(nextState.pocket);
    setShowLogoOptions(nextState.logo);
    setShowButtonOptions(nextState.button);
    setShowLapelOptions(nextState.lapel);
    setShowJacketPocketOptions(nextState.jacketPocket);
    setShowLiningOptions(nextState.lining);
    setShowNotesOptions(nextState.notes);
    setShowButtonThreadColorOptions(nextState.buttonThreadColor);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
    // Close all open panels
    setShowProductOptions(false);
    setShowWholeFabricOptions(false);
    setShowCollarOptions(false);
    setShowSleeveOptions(false);
    setShowShirtBackOptions(false);
    setShowPlacketOptions(false);
    setShowBeltloopOptions(false);
    setShowPantCuffOptions(false);
    setShowPocketOptions(false);
    setShowLogoOptions(false);
    setShowButtonOptions(false);
    setShowLapelOptions(false);
    setShowJacketPocketOptions(false);
    setShowNotesOptions(false);
    setShowButtonThreadColorOptions(false);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="mobile-sidebar-toggle">
        <button 
          className="mobile-customize-btn"
          onClick={toggleMobileSidebar}
          aria-label="Toggle customization options"
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/>
            <path d="M7 7h.01"/>
          </svg>
          <span>Customize</span>
        </button>
      </div>

      {/* Sidebar Content */}
      <div className={`ui-controls-container ${isMobileSidebarOpen ? 'mobile-open' : ''}`}>
        {/* Close button for mobile */}
        <button 
          className="mobile-close-btn"
          onClick={closeMobileSidebar}
          aria-label="Close customization options"
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* All Selected Displays */}
        <div className="selected-displays-container">
          {/* Product Selection */}
          <SelectedProductDisplay
            selectedProduct={selectedProduct}
            productData={productData}
            onClick={() => togglePanel("product")}
          />

          {/* Jacket Options */}
          <SelectedWholeFabricDisplay
            selectedWholeFabric={selectedWholeFabric}
            onClick={() => togglePanel("whole")}
          />

          {/* Jacket Lining selected display - only for SuitJacket and TwoPieceSuit */}
          {(selectedProduct && (selectedProduct.key === "SuitJacket" || selectedProduct.key === "TwoPieceSuit")) && (
            <SelectedJacketLiningDisplay
              selectedLining={selectedLining}
              onClick={() => togglePanel("lining")}
            />
          )}

          {/* Sleeve Display - only show if NOT SuitTrouser */}
          {!(selectedProduct && selectedProduct.key === "SuitTrouser") && (
            <SelectedSleeveDisplay
              selectedSleeve={selectedSleeve}
              onClick={() => {
                togglePanel("sleeve");
              }}
            />
          )}

          {/* Button selected display - only for SuitJacket and TwoPieceSuit */}
          {(selectedProduct && (selectedProduct.key === "SuitJacket" || selectedProduct.key === "TwoPieceSuit")) && (
            <SelectedButtonDisplay
              selectedButtonStyle={selectedButtonStyle}
              onClick={() => togglePanel("button")}
            />
          )}

          {/* Jacket Pocket selected display - only for SuitJacket and TwoPieceSuit */}
          {(selectedProduct && (selectedProduct.key === "SuitJacket" || selectedProduct.key === "TwoPieceSuit")) && (
            <SelectedJacketPocketDisplay
              selectedJacketPocket={selectedJacketPocket}
              jacketPocketData={jacketPocketData}
              onClick={() => togglePanel("jacketPocket")}
            />
          )}

          {/* Lapel selected display - only for SuitJacket and TwoPieceSuit */}
          {(selectedProduct && (selectedProduct.key === "SuitJacket" || selectedProduct.key === "TwoPieceSuit")) && (
            <SelectedLapelDisplay
              selectedLapelStyle={selectedLapelStyle}
              onClick={() => togglePanel("lapel")}
            />
          )}

          {/* Pants Section Heading - only show if NOT SuitJacket */}
          {!(selectedProduct && selectedProduct.key === "SuitJacket") && (
            <div className="section-heading">
              <h3>Pants</h3>
            </div>
          )}

          {/* Show belt loop display only if selectedProduct is NOT SuitJacket */}
          {!(selectedProduct && selectedProduct.key === "SuitJacket") && (
            <SelectedBeltloopDisplay
              selectedBeltloop={selectedBeltloop}
              beltloopData={beltloopData}
              onClick={() => {
                // Auto-select SuitTrouser only if current product is SuitJacket
                if (selectedProduct && selectedProduct.key === "SuitJacket") {
                  const trouserProduct = productData.find(product => product.key === "SuitTrouser");
                  if (trouserProduct) {
                    setSelectedProduct(trouserProduct);
                  }
                }
                togglePanel("beltloop");
              }}
            />
          )}

          {/* Show pant cuff display only if selectedProduct is NOT SuitJacket */}
          {!(selectedProduct && selectedProduct.key === "SuitJacket") && (
            <SelectedPantCuffDisplay
              selectedPantCuff={selectedPantCuff}
              onClick={() => {
                // Auto-select SuitTrouser only if current product is SuitJacket
                if (selectedProduct && selectedProduct.key === "SuitJacket") {
                  const trouserProduct = productData.find(product => product.key === "SuitTrouser");
                  if (trouserProduct) {
                    setSelectedProduct(trouserProduct);
                  }
                }
                togglePanel("pantCuff");
              }}
            />
          )}

          {/* Show pocket display only if selectedProduct is NOT SuitJacket */}
          {!(selectedProduct && selectedProduct.key === "SuitJacket") && (
            <SelectedPocketDisplay
              selectedPocket={selectedPocket}
              selectedBackPocketStyle={selectedBackPocketStyle}
              selectedFrontPocketStyle={selectedFrontPocketStyle}
              onClick={() => togglePanel("pocket")}
            />
          )}

          {/* Notes Display - Always visible */}
          <SelectedNotesDisplay
            selectedNotes={selectedNotes}
            onClick={() => togglePanel("notes")}
          />

          {/* Button Thread Color Display - Always visible */}
          <SelectedButtonThreadColorDisplay
            selectedButtonThreadColor={selectedButtonThreadColor}
            onClick={() => togglePanel("buttonThreadColor")}
          />
        </div>

        {/* All Options Containers */}
        <div className="options-containers">
          {/* Product Selection Panel */}
          <ProductOptionsPanel
            productData={productData}
            selectedProduct={selectedProduct}
            setSelectedProduct={(product) => {
              setSelectedProduct(product);
              setShowProductOptions(false);
            }}
            isVisible={showProductOptions}
          />

          {/* Jacket Options Panels */}
          <WholeFabricOptionsPanel
            fabrics={fabrics}
            selectedWholeFabric={selectedWholeFabric}
            setSelectedWholeFabric={(fabric) => {
              setSelectedWholeFabric(fabric);
              setShowWholeFabricOptions(false);
            }}
            isVisible={showWholeFabricOptions}
          />

          {/* Jacket Lining options panel - only for SuitJacket and TwoPieceSuit */}
          {(selectedProduct && (selectedProduct.key === "SuitJacket" || selectedProduct.key === "TwoPieceSuit")) && (
            <JacketLiningOptionsPanel
              linings={liningData}
              selectedLining={selectedLining}
              setSelectedLining={(lining) => {
                setSelectedLining(lining);
                setShowLiningOptions(false);
              }}
              isVisible={showLiningOptions}
            />
          )}

          {/* Sleeve Options Panel - only show if NOT SuitTrouser */}
          {!(selectedProduct && selectedProduct.key === "SuitTrouser") && (
            <SleeveOptionsPanel
              selectedSleeve={selectedSleeve}
              setSelectedSleeve={setSelectedSleeve}
              isVisible={showSleeveOptions}
              onSelection={() => setShowSleeveOptions(false)}
            />
          )}

          {/* Button options panel - only for SuitJacket and TwoPieceSuit */}
          {(selectedProduct && (selectedProduct.key === "SuitJacket" || selectedProduct.key === "TwoPieceSuit")) && (
            <ButtonOptionsPanel
              selectedButtonStyle={selectedButtonStyle}
              // setSelectedButtonStyle={(style) => {
              //   setSelectedButtonStyle(style);
              //   // Save to localStorage
              //   try {
              //     localStorage.setItem("shirt_selectedButtonStyle", style);
              //   } catch (err) {}
              // }}
              setSelectedButtonStyle={(style) => {
                setSelectedButtonStyle(style);

                try {
                  localStorage.setItem("shirt_selectedButtonStyle", style);
                } catch (err) {}

                setShowButtonOptions(false);
              }}
              isVisible={showButtonOptions}
              onSelection={() => setShowButtonOptions(false)}
              onPriceChange={(price) => {
                // Update price tracking
                setSelectedOptionsPrices((prev) => ({
                  ...prev,
                  button: price,
                }));
              }}
            />
          )}

          {/* Jacket Pocket options panel - only for SuitJacket and TwoPieceSuit */}
          {(selectedProduct && (selectedProduct.key === "SuitJacket" || selectedProduct.key === "TwoPieceSuit")) && (
            // <JacketPocketOptionsPanel
            //   jacketPocketData={jacketPocketData}
            //   selectedJacketPocket={selectedJacketPocket}
            //   setSelectedJacketPocket={setSelectedJacketPocket}
            //   isVisible={showJacketPocketOptions}
            // />
            <JacketPocketOptionsPanel
              jacketPocketData={jacketPocketData}
              selectedJacketPocket={selectedJacketPocket}
              setSelectedJacketPocket={(value) => {
                setSelectedJacketPocket(value);
                setShowJacketPocketOptions(false);
              }}
              isVisible={showJacketPocketOptions}
            />
          )}

          {/* Lapel options panel - only for SuitJacket and TwoPieceSuit */}
          {(selectedProduct && (selectedProduct.key === "SuitJacket" || selectedProduct.key === "TwoPieceSuit")) && (
            <LapelOptionsPanel
              selectedLapelStyle={selectedLapelStyle}
              // setSelectedLapelStyle={(style) => {
              //   setSelectedLapelStyle(style);
              //   try {
              //     localStorage.setItem("shirt_selectedLapelStyle", style);
              //   } catch (err) {}
              // }}
              setSelectedLapelStyle={(style) => {
                setSelectedLapelStyle(style);
                try {
                  localStorage.setItem("shirt_selectedLapelStyle", style);
                } catch (err) {}
                setShowLapelOptions(false);
              }}
              isVisible={showLapelOptions}
            />
          )}

          {/* Pants Options Panels */}
          {/* Show belt loop options panel only if selectedProduct is NOT SuitJacket */}
          {!(selectedProduct && selectedProduct.key === "SuitJacket") && (
            <BeltloopOptionsPanel
              beltloopData={beltloopData}
              selectedBeltloop={selectedBeltloop}
              setSelectedBeltloop={(beltloopKey) => {
                setSelectedBeltloop(beltloopKey);
                // Auto-select SuitTrouser only if current product is SuitJacket
                if (selectedProduct && selectedProduct.key === "SuitJacket") {
                  const trouserProduct = productData.find(product => product.key === "SuitTrouser");
                  if (trouserProduct) {
                    setSelectedProduct(trouserProduct);
                  }
                }
                setShowBeltloopOptions(false);
              }}
              onPriceChange={(price) => {
                // Update price tracking
                setSelectedOptionsPrices((prev) => ({
                  ...prev,
                  beltloop: price,
                }));
              }}
              isVisible={showBeltloopOptions}
            />
          )}
          {/* Show pant cuff options panel only if selectedProduct is NOT SuitJacket */}
          {!(selectedProduct && selectedProduct.key === "SuitJacket") && (
            <PantCuffOptionsPanel
              selectedPantCuff={selectedPantCuff}
              setSelectedPantCuff={(pantCuffKey) => {
                setSelectedPantCuff(pantCuffKey);
                // Auto-select SuitTrouser only if current product is SuitJacket
                if (selectedProduct && selectedProduct.key === "SuitJacket") {
                  const trouserProduct = productData.find(product => product.key === "SuitTrouser");
                  if (trouserProduct) {
                    setSelectedProduct(trouserProduct);
                  }
                }
                setShowPantCuffOptions(false);
              }}
              onPriceChange={(price) => {
                // Update price tracking
                setSelectedOptionsPrices((prev) => ({
                  ...prev,
                  pantCuff: price,
                }));
              }}
              onMeshVisibilityChange={onMeshVisibilityChange}
              isVisible={showPantCuffOptions}
            />
          )}

          {/* Show pocket options panel only if selectedProduct is NOT SuitJacket */}
          {!(selectedProduct && selectedProduct.key === "SuitJacket") && (
            // <PocketOptionsPanel
            //   selectedPocket={selectedPocket}
            //   setSelectedPocket={setSelectedPocket}
            //   selectedBackPocketStyle={selectedBackPocketStyle}
            //   setSelectedBackPocketStyle={setSelectedBackPocketStyle}
            //   selectedFrontPocketStyle={selectedFrontPocketStyle}
            //   setSelectedFrontPocketStyle={setSelectedFrontPocketStyle}
            //   isVisible={showPocketOptions}
            //   onSelection={() => setShowPocketOptions(false)}
            <PocketOptionsPanel
              selectedPocket={selectedPocket}
              setSelectedPocket={(value) => {
                setSelectedPocket(value);
                setShowPocketOptions(false);
              }}
              selectedBackPocketStyle={selectedBackPocketStyle}
              setSelectedBackPocketStyle={(value) => {
                setSelectedBackPocketStyle(value);
                setShowPocketOptions(false);
              }}
              selectedFrontPocketStyle={selectedFrontPocketStyle}
              setSelectedFrontPocketStyle={(value) => {
                setSelectedFrontPocketStyle(value);
                setShowPocketOptions(false);
              }}
              isVisible={showPocketOptions}
              onSelection={() => setShowPocketOptions(false)}
              onPriceChange={(price) => {
                // Update price tracking
                setSelectedOptionsPrices((prev) => ({
                  ...prev,
                  pocket: price,
                }));
              }}
            />
          )}

          {/* Notes Options Panel - Always visible */}
          <NotesOptionsPanel
            selectedNotes={selectedNotes}
            setSelectedNotes={setSelectedNotes}
            isVisible={showNotesOptions}
            onSelection={() => setShowNotesOptions(false)}
          />

          {/* Button Thread Color Options Panel */}
          <ButtonThreadColorOptionsPanel
            linings={buttonThreadColorData}
            selectedButtonThreadColor={selectedButtonThreadColor}
            setSelectedButtonThreadColor={(fabric) => {
              setSelectedButtonThreadColor(fabric);
              setShowButtonThreadColorOptions(false);
            }}
            isVisible={showButtonThreadColorOptions}
          />
        </div>




      </div>
    </>
  );
};

export default Sidebar;

/**
 * SUIT CUSTOMIZATION APPLICATION
 * ==============================
 * 
 * This is the main React application for customizing suits with 3D visualization.
 * The app allows users to customize various aspects of suits including:
 * - Product Type Selection (Suit Jacket, Suit Trouser, Two Piece Suit)
 * - Fabric Selection (Whole Fabric)
 * - Collar Styles and Textures
 * - Sleeve Styles
 * - Shirt Back Styles
 * - Placket Styles
 * - Belt Loop Options
 * - Pocket Styles (Front and Back)
 * - Logo Customization
 * - Button Styles
 * - Lapel Styles (for jackets)
 * - Jacket Pocket Styles (for jackets)
 * 
 * TECHNICAL STACK:
 * - React with Hooks (useState, useEffect, useRef)
 * - Three.js with React-Three-Fiber for 3D rendering
 * - GLTFLoader for 3D model loading
 * - GSAP for animations
 * - LocalStorage for state persistence
 * 
 * MAIN COMPONENTS:
 * - App: Main application component with state management
 * - ShirtModel: 3D model rendering component
 * - Sidebar: UI controls for customization
 * 
 * @author Your Name
 * @version 1.0.0
 */

import React, { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useLoader, useThree, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  TextureLoader,
  RepeatWrapping,
  SRGBColorSpace,
  DirectionalLight,
  PCFSoftShadowMap,
  ACESFilmicToneMapping,
  LinearMipmapLinearFilter,
  LinearFilter,
} from "three";
import { OrbitControls, SoftShadows } from "@react-three/drei";
import { gsap } from "gsap"; // Import gsap for animations

// Import custom components
import Sidebar from "./Sidebar";
import {
  fetchFabricsData,
  fetchCollarsData,
  fetchLiningData,
  fetchButtonThreadColorData,
} from "./api/api";
import { getLapelPrice } from "./components/lapel/LapelOptionsPanel";
import { getJacketPocketPrice } from "./components/jacketPocket/JacketPocketOptionsPanel";

/**
 * SHIRT MODEL COMPONENT
 * =====================
 * 
 * This component handles the 3D model rendering and mesh visibility logic.
 * It receives all customization parameters as props and applies them to the 3D model.
 * 
 * Key Responsibilities:
 * - Load and render the 3D suit model (suits.glb)
 * - Apply fabric textures to different parts
 * - Control mesh visibility based on selected options
 * - Handle collar, sleeve, pocket, and other customization logic
 * - Manage logo placement and visibility
 * - Apply button and lapel styles for jackets
 * 
 * @param {Object} props - All customization parameters
 * @returns {JSX.Element} 3D model component
 */
function ShirtModel({
  repeatScale,
  showItalianCollar,
  showFranchCollar,
  collarFabricTextureUrl,
  selectedCollar,
  selectedSleeve,
  selectedWholeFabric,
  selectedShirtBack,
  selectedPlacket,
  selectedBeltloop,
  selectedPantCuff,
  selectedPocket,
  selectedLogoMesh,
  logoImageUrl,
  logoEnabled,
  showFrontView,
  selectedButton,
  selectedButtonStyle,
  selectedLapelStyle,
  selectedJacketPocket,
  selectedBackPocketStyle,
  selectedFrontPocketStyle,
  isPocketSelected,
  selectedProduct,
  selectedLining,
  selectedButtonThreadColor,
}) {
  const gltf = useLoader(GLTFLoader, "/suits.glb");
  const { gl } = useThree();
  
  // Create unique keys for each texture to force reload when dependencies change
  const wholeFabricKey = selectedWholeFabric?.imageUrl || "/placeholder.png";
  const collarTextureKey = collarFabricTextureUrl || "/placeholder.png";
  const logoTextureKey = logoImageUrl || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2P8z/D/PwAI/wN5Zb0q1wAAAABJRU5ErkJggg==";
  const liningTextureKey = selectedLining?.imageUrl || "/placeholder.png";
  const buttonThreadColorKey = selectedButtonThreadColor?.imageUrl || "/placeholder.png";
  
  const wholeFabricTexture = useLoader(TextureLoader, wholeFabricKey);
  const loadedCollarTexture = useLoader(TextureLoader, collarTextureKey);
  const uploadedLogoTexture = useLoader(TextureLoader, logoTextureKey);
  const liningTexture = useLoader(TextureLoader, liningTextureKey);
  const buttonThreadColorTexture = useLoader(TextureLoader, buttonThreadColorKey);

  const ref = useRef();
  const groupRef = useRef();
  const [direction, setDirection] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartXRef = useRef(0);
  const angularVelocityRef = useRef(0);
  const hasLoggedMeshesRef = useRef(false);
  const basePositionsRef = useRef(new Map()); // Store base Y positions per mesh
  
  // Debug current product key whenever it changes
  useEffect(() => {
    try {
      // eslint-disable-next-line no-console
      console.log("[Product] selected:", selectedProduct && selectedProduct.key);
    } catch (e) {}
  }, [selectedProduct]);

  useEffect(() => {
    if (groupRef.current) {
      gsap.to(groupRef.current.rotation, {
        y: showFrontView ? 0 : Math.PI,
        duration: 0.5, // Animation duration in seconds
        ease: "power2.out", // Easing function for smoother animation
      });
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection((prev) => -prev);
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      // apply inertial rotation + tiny auto rotation
      groupRef.current.rotation.y +=
        angularVelocityRef.current + direction * 0.00005;
      // damping for smooth easing
      angularVelocityRef.current *= 0.5;
      // avoid denormals
      if (Math.abs(angularVelocityRef.current) < 1e-6)
        angularVelocityRef.current = 0;
    }
  });

  useEffect(() => {

    if (gltf && gltf.scene) {
      gltf.scene.scale.set(1.8, 1.8, 1.8);
      gltf.scene.position.y = 0;

      // Configure logo texture to preserve original colors
      if (uploadedLogoTexture && logoImageUrl) {
        uploadedLogoTexture.colorSpace = SRGBColorSpace;
        uploadedLogoTexture.generateMipmaps = true;
        uploadedLogoTexture.minFilter = LinearMipmapLinearFilter;
        uploadedLogoTexture.magFilter = LinearFilter;
        if (gl && gl.capabilities) {
          uploadedLogoTexture.anisotropy = Math.min(gl.capabilities.getMaxAnisotropy(), 16);
        }
        uploadedLogoTexture.needsUpdate = true;
      }

      if (wholeFabricTexture) {
        wholeFabricTexture.wrapS = RepeatWrapping;
        wholeFabricTexture.wrapT = RepeatWrapping;
        wholeFabricTexture.repeat.set(repeatScale, repeatScale);
        wholeFabricTexture.colorSpace = SRGBColorSpace;
        wholeFabricTexture.generateMipmaps = true;
        wholeFabricTexture.minFilter = LinearMipmapLinearFilter;
        wholeFabricTexture.magFilter = LinearFilter;
        if (gl && gl.capabilities) {
          wholeFabricTexture.anisotropy = Math.min(gl.capabilities.getMaxAnisotropy(), 16);
        }
        wholeFabricTexture.needsUpdate = true;
      }

      if (liningTexture) {
        liningTexture.wrapS = RepeatWrapping;
        liningTexture.wrapT = RepeatWrapping;
        liningTexture.repeat.set(repeatScale, repeatScale);
        liningTexture.colorSpace = SRGBColorSpace;
        liningTexture.generateMipmaps = true;
        liningTexture.minFilter = LinearMipmapLinearFilter;
        liningTexture.magFilter = LinearFilter;
        if (gl && gl.capabilities) {
          liningTexture.anisotropy = Math.min(gl.capabilities.getMaxAnisotropy(), 16);
        }
        liningTexture.needsUpdate = true;
      }

      if (collarFabricTextureUrl) {
        loadedCollarTexture.wrapS = RepeatWrapping;
        loadedCollarTexture.wrapT = RepeatWrapping;
        loadedCollarTexture.repeat.set(repeatScale, repeatScale);
        loadedCollarTexture.colorSpace = SRGBColorSpace;
        loadedCollarTexture.generateMipmaps = true;
        loadedCollarTexture.minFilter = LinearMipmapLinearFilter;
        loadedCollarTexture.magFilter = LinearFilter;
        if (gl && gl.capabilities) {
          loadedCollarTexture.anisotropy = Math.min(gl.capabilities.getMaxAnisotropy(), 16);
        }
        loadedCollarTexture.needsUpdate = true;
      }

      const meshNameSet = new Set();

      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          meshNameSet.add(child.name);
          child.castShadow = true;
          child.receiveShadow = true;

          // Ensure base position stored and reset each run to avoid accumulation
          const baseMap = basePositionsRef.current;
          if (!baseMap.has(child.name)) {
            baseMap.set(child.name, child.position.y);
          }
          const baseY = baseMap.get(child.name);
          child.position.y = baseY;

          // Hide SleeveRightLogo by making it fully transparent
          if ((child.name === "logo", "SleeveRightLogo")) {
            const matArray = Array.isArray(child.material)
              ? child.material.map((m) => m.clone())
              : [child.material.clone()];
            // child.visible = false;
            matArray.forEach((mat) => {
              mat.transparent = false;
              mat.alphaTest = 0.5;
              mat.opacity = 1;
              mat.depthWrite = true;
              mat.needsUpdate = true;
            });
            child.material = matArray.length === 1 ? matArray[0] : matArray;
          }

          // Apply Whole-Shirt fabric to specific meshes when selected
          if (selectedWholeFabric) {
            // JACKET BUTTON MESHES ARRAY
            // ==========================
            // This array contains all mesh names that belong to the jacket button component.
            // These meshes represent different jacket button styles and configurations:
            // WHOLE TARGETS MESHES ARRAY
            // ===========================
            // This array contains all mesh names that should receive the whole-suit fabric texture.
            // These meshes represent the main structural elements of the suit that need fabric treatment:
            // 
            // JACKET STRUCTURAL ELEMENTS:
            // - "4btnpeakslanted": Peak lapel with 4 buttons and slanted pockets
            // - "NoFlap": Jacket without flaps
            // - "Notch2Btnpatched": Notch lapel with 2 buttons and patched pockets
            // - "notch4btn": Notch lapel with 4 buttons
            // - "NotchNoflap2btn": Notch lapel with 2 buttons, no flaps
            // - "straightPatchedPocket": Straight patched pocket style
            // - "patch": Patched pocket style
            // - "Round": Round lapel style
            // - "round2btnJacket": Round lapel with 2 buttons
            // - "ShawlSlantedPocket0": Shawl lapel with slanted pockets
            // - "ShawlPatched": Shawl lapel with patched pockets
            // - "ShawlPatched4Btn": Shawl lapel with patched pockets and 4 buttons
            // 
            // Usage: This array is used to apply fabric textures to the main suit meshes
            // when a whole-suit fabric is selected. It ensures consistent fabric treatment
            // across all major suit components.
            const wholeTargets = [
              
              "4btnpeakslanted",
            "NoFlap",
            "Notch2Btnpatched",
              "notch4btn",
          
 

            "NotchNoflap2btn",
            "straightPatchedPocket",
            "patch",
              "Round",
              "round2btnJacket",
            "ShawlSlantedPocket0",
            "ShawlPatched",
            "ShawlPatched4Btn",
            "ShawlSlanted",
            "ShawlStraign",
            "ShawlStraignPocket",
            "slanted",
            "straight",
            "shawl2btn",
            "NotchNoflap2btnbody",
 
            //    "Backside",
            "jacketback",
            "backinner",
 
            //    "Sleeve",
            "FullSleeve",
            "FullSleeveInner",
 
            // "Pockets",
            "notch4btnpatchedPocket001",
            "notch4btnpatchedPocket",
            "2Round2Btnpatched",
            "2BtnStraightRound",
            "2BtnStraightRoundTiicketPocket",
            "2Round2Btnpatched",
            "2RoundNoflap2btn",
            "2RoundNoflap2btnTicketPocket",
            "3pocket",
            "4btnpeakslanted2Pocket",
            "4btnpeakslantedTecket",
            "4btnslanted2Pocket",
            "4btnslantedTecket",
            "Noflap2Pocket",
            "notch4btnpatchedPocket001",
            "NotchNoflap2btn001",
            "NotchNoflap2btnTicketPocket",
            "NotchNoflap2btnticketpocket",
            "NotchSlantedpocket",
            "NotchSlantedTicket",
              "notchStraight",
            "NoFlapTicket",
            "notchStraightTicket",
            "Peack4BtnTicketPocket",
            "RoundSlanted",
            "RoundSlantedTicket",
            "RoundTicketPocket",
            "shawl2btnSlantedPocket",
            "shawl2btnSlantedTicketPocket",
            "shawl2btnStraightPocket",
            "shawl2btnStraightTicket",
            "ShawlNoFlap",
            "ShawlNoFlapTicket",
            "ShawlSlanted4btn001",
            "ShawlSlanted4btn003",
            "ShawlSlantedTicket",
            "ShawlStraignTicket",
            "slanted2Pocket",
            "slantedTicketPocket",
            "Straight2Pocket",
            "Straight3Pocket",
            "straight4BtnNotchTicket",
            "straight4BtnPeack2pocket",
            "straight4BtnPeackTicket",
            "strait_3_pocket",
            "TicketPocket",
 

             //  "Shuit paint *********************************//
             "Balt",
             "BeltBtnThread001",
             "Beltloop",
             "Bukle001",
             "BukleSideAdjusters",
             "DoubleLoop",
             "ModernLoop",
             "NoneBtnSideAdjusters",
             "NoneBtnSideAdjustersThread001",
             "NoneButtonSideAdjusters",
             "Single",
 

             //  "Front",
             "Jains",
             "Modern",
             "ModernCurv1Plat",
             "ModernCurv2Plat",
             "None",
             "None2",
             "nonestraightwell",
             "PlateSingle",
             "Slanted",
             "SlantedWelt",
 
             //  "FrontCuff",
             "jainsCuff",
             "ModernCuff",
             "None2Cuff",
             "NoneCuf",
             "StraightCuff",
 
             //  "Backside",
             "DoublePocket",
             "ModernFlap",
             "ModernFlapCurv",
             "sqaur",
              "straight001",
             "backs",
 
             //  "Backside Cuff",
             "DoubleCuff",
             "SquarCuff",
              "StraightCuffBack",
              "backs_Cuff",


              "DoublePockeLeft",
              "DoublePockeRght",
              "ModernFlapCurvLeft",
              "ModernFlapCurvRight",
              "ModernFlapLeft",
              "ModernFlapRight",
              "sqaurLeft",
              "sqaurRight",
              "straightLeft",
              "straightRight",
              "backpocketbtnLeft",
              "backpocketbtnRight",
             
              // Additional jacket pocket meshes from jacket pocket logic
              "Straight2Pocket",
              "straight4BtnPeack2pocket",
              "notchStraight",
              "shawl2btnStraightPocket",
              "RoundSlanted",
              "ShawlStraignPocket",
              "Straight3Pocket",
              "straight4BtnPeackTicket",
              "notchStraightTicket",
              "2BtnStraightRoundTiicketPocket",
              "2BtnStraightRound",
              "shawl2btnStraightTicket",
              "ShawlStraignTicket",
              "slanted2Pocket",
              "4btnpeakslanted2Pocket",
              "NotchSlantedpocket",
              "shawl2btnSlantedPocket",
              "ShawlSlanted4btn003",
              "NotchSlantedTicket",
              "RoundSlantedTicket",
              "shawl2btnSlantedTicketPocket",
              "ShawlSlantedTicket",
              "Noflap2Pocket",
              "NotchNoflap2btn001",
              "NotchNoFlap",
              "ShawlNoFlap",
              "Peack4BtnTicketPocket",
              "NotchNoflap2btnticketpocket",
              "ShawlNoFlapTicket",
              "notch4btnpatchedPocket001",
              "Notch2Btnpatched",
              "notch4btnpatchedPocket",
              "2Round2Btnpatched",
              "ShawlSlantedPocket",

              // Pant Cuff Meshes - These meshes should receive whole fabric
              "DoubleTabs",
              "SingleTabs", 
              "SingleTabsBtn001",
              "FoldoverTab",
              "FoldoverTabBtn001",
              "DoubleTabsBtn",

            ]; // extend as needed
            
            // Apply fabric only to regular meshes (not jacket button meshes)
            const isRegularMesh = wholeTargets.includes(child.name);
            
            if (isRegularMesh) {
              const matArray = Array.isArray(child.material)
                ? child.material.map((m) => m.clone())
                : [child.material.clone()];
              matArray.forEach((mat) => {
                // Regular fabric properties for main suit meshes
                mat.map = wholeFabricTexture;
                mat.roughness = 0.8;
                mat.metalness = 0.2;
                mat.envMapIntensity = 0;
                mat.needsUpdate = true;
              });
              child.material = matArray.length === 1 ? matArray[0] : matArray;
            }
          }

          if (selectedCollar && child.name === selectedCollar.backendkey) {
            const matArray = Array.isArray(child.material)
              ? child.material.map((m) => m.clone())
              : [child.material.clone()];

            matArray.forEach((mat) => {
              mat.roughness = 1;
              mat.metalness = 0.2;
              mat.envMapIntensity = 0;
              mat.needsUpdate = true;
            });

            child.material = matArray.length === 1 ? matArray[0] : matArray;
          }

          // Apply lining texture to inner meshes
          if (selectedLining && (child.name === "backinner" || child.name === "FullSleeveInner")) {
            const matArray = Array.isArray(child.material)
              ? child.material.map((m) => m.clone())
              : [child.material.clone()];

            matArray.forEach((mat) => {
              // Apply lining texture
              mat.map = liningTexture;
              // Different material properties for inner meshes
              mat.roughness = 0.349; // Higher roughness for inner fabric
              mat.metalness = 0.1; // Lower metalness for inner fabric
              mat.envMapIntensity = 0.1; // Lower environment map intensity
              mat.needsUpdate = true;
            });

            child.material = matArray.length === 1 ? matArray[0] : matArray;
          }

          // ALL BUTTON AND THREAD MESHES ARRAY
          // ===================================
          // This array contains all mesh names that belong to buttons and threads throughout the entire suit.
          // These meshes represent buttons and thread details that should receive the selected button/thread color fabric:
          // 
          // JACKET BUTTON AND THREAD MESHES:
          // - "4ButtonSingleBreasted", "1BtnHole", "4Btn", "4BtnPatched", "4BtnPatchedHole"
          // - "2Btn", "2BtnHole", "beltBtn001", "4BtnHole", "3Btn", "3BtnHole"
          // - "4ButtonSingleBreasted2toclose", "6ButtonSingleBreasted2ToCloseHole"
          // - "BeltBtnThread", "FoldoverTabBtnThread", "SignleTabsBtnThread"
          // 
          // SHIRT BUTTON AND THREAD MESHES:
          // - "PlacketBtn", "CollarBtnDown", "3btn Coller", "2BtnCollar", "1BandBtn"
          // - "RoundThread", "ModenThread", "ItalianCollarThread", "BatmanThread"
          // - "BtnDownThread", "FranchThread", "CutAwayThread", "TuxedoThread"
          // - "2btnHole", "3BtnHole", "3BtnBandThread", "2btnBandThread", "bandThread"
          // 
          // SLEEVE BUTTON AND THREAD MESHES:
          // - "AngleCuff", "RoundCuff", "Square", "1CuffBtn", "2CuffBtn"
          // - "DoubleCuff", "DoubleTabBtnThread", "FoldoverTabBtnThread001"
          // - "SignleTabsBtnThread001", "SingleTabsBtn001"
          // 
          // BELT LOOP BUTTON AND THREAD MESHES:
          // - "Belt", "ModernLoop", "Single", "NoneBtnSideAdjusters"
          // - "NoneBtnSideAdjustersThread001", "NoneButtonSideAdjusters"
          // 
          // JACKET BUTTON MESHES ARRAY
          // ==========================
          // This array contains all mesh names that belong to jacket buttons.
          // These meshes are used for both visibility control and button/thread color application.
          const jacketbuttonmesh = [
            "4ButtonSingleBreasted",
            "1Btn",
            "1BtnHole",
            "4Btn",
            "4BtnPatched",
            "4BtnPatchedHole",
            "2Btn",
            "2BtnHole",
            "beltBtn001",
            "4BtnHole",
            "3Btn",
            "3BtnHole",
            "4ButtonSingleBreasted2toclose",
            "4ButtonSingleBreastedHole",
            "6ButtonSingleBreasted2ToCloseHole",
            "6ButtonSingleBreasted2toclose",
            "6ButtonSingleBreasted3ToClose",
            "6ButtonSingleBreasted3ToCloseHole",
            "4ButtonHoleSingleBreasted",
            "ButtonHole",
            "4Button,SingleBreasted2tocloseHole",
            "BeltBtnThread",
            "beltBtn",
            "FoldoverTabBtn",
            "FoldoverTabBtnThread",
            "SignleTabsBtnThread",
            
          ];

          // Usage: This array is used to apply button/thread color fabric to all button and thread
          // meshes throughout the suit when a button/thread color fabric is selected.
          const allButtonThreadMeshes = [
            // Jacket button meshes
            "4ButtonSingleBreasted", "1BtnHole", "4Btn", "4BtnPatched", "4BtnPatchedHole",
            "2Btn", "2BtnHole", "beltBtn001", "4BtnHole", "3Btn", "3BtnHole",
            "4ButtonSingleBreasted2toclose", "4ButtonSingleBreastedHole",
            "6ButtonSingleBreasted2ToCloseHole", "6ButtonSingleBreasted2toclose",
            "6ButtonSingleBreasted3ToClose", "6ButtonSingleBreasted3ToCloseHole",
            "4ButtonHoleSingleBreasted", "ButtonHole", "4Button,SingleBreasted2tocloseHole",
            "BeltBtnThread", "beltBtn", "FoldoverTabBtn", "FoldoverTabBtnThread",
            "SignleTabsBtnThread", "",
            
            // Shirt button and thread meshes
            "PlacketBtn", "CollarBtnDown", "3btnColler", "2BtnCollar", "1BandBtn",
            "RoundThread", "ModenThread", "ItalianCollarThread", "BatmanThread",
            "BtnDownThread", "FranchThread", "CutAwayThread", "CollarBtnDown",
            "TuxedoThread", "3BtnBandThread", "2btnBandThread", "bandThread",
            "2btnHole", "3BtnHole", "4BtnHole",
            
            // Sleeve button and thread meshes
            "AngleCuff", "RoundCuff", "Square", "1CuffBtn", "2CuffBtn",
            "DoubleCuff",
            
            // Belt loop button and thread meshes
             "beltBtn001", "BeltBtnThread001",
            "ModernFlap", "ModernFlapCurv", "ModernFlapCuff", "ModernFlapCurvCuff",
            "", "NoneBtnSideAdjusters", "NoneBtnSideAdjustersThread001",
            "NoneButtonSideAdjusters", "Single"
          ];

          // Apply button/thread color fabric to all button and thread meshes AND jacket button meshes
          const isButtonThreadMesh = allButtonThreadMeshes.includes(child.name);
          const isJacketButtonMesh = jacketbuttonmesh.includes(child.name);
          
          if (selectedButtonThreadColor && (isButtonThreadMesh || isJacketButtonMesh)) {
            const matArray = Array.isArray(child.material)
              ? child.material.map((m) => m.clone())
              : [child.material.clone()];

            matArray.forEach((mat) => {
              // Apply button/thread color fabric with proper material properties
              mat.map = buttonThreadColorTexture;
           
              mat.needsUpdate = true;
            });

            child.material = matArray.length === 1 ? matArray[0] : matArray;
          }

          // Button styling based on selected button style - target specific button meshes
          // BUTTON MESH NAMES ARRAY
          // ========================
          // This array contains all mesh names that belong to the button component.
          // These meshes represent different button styles and configurations:
          // 
          // BUTTON STYLES:
          // - "PlacketBtn": Placket button style
          // - "CollarBtnDown": Collar button down style
          // - "3btnColler": 3-button collar style
          // - "2BtnCollar": 2-button collar style
          // - "1BandBtn": 1-button band style
          // 
          // Usage: This array is used to show/hide button meshes based on selectedButton
          // state. It ensures only the selected button style is visible on the shirt.
          const buttonMeshNames = [
            "PlacketBtn",
            "CollarBtnDown",
            "3btnColler",
            "2BtnCollar",
            "1BandBtn",
          ];


          // Debug: Check if this is a button mesh
          if (buttonMeshNames.includes(child.name)) {
          }

          if (selectedButton && buttonMeshNames.includes(child.name)) {

            // Make button mesh visible when button is selected
            child.visible = true;

            const matArray = Array.isArray(child.material)
              ? child.material.map((m) => m.clone())
              : [child.material.clone()];

            matArray.forEach((mat) => {
              // Apply button color from API if available
              if (selectedButton && selectedButton.color) {
                // Handle different color formats
                let colorValue = selectedButton.color;

                // If color doesn't start with #, add it
                if (
                  typeof colorValue === "string" &&
                  !colorValue.startsWith("#")
                ) {
                  colorValue = "#" + colorValue;
                }

                mat.color.set(colorValue);
              }
              mat.metalness = 0.2;
              mat.roughness = 1;
              mat.envMapIntensity = 0;
              mat.needsUpdate = true;
            });

            child.material = matArray.length === 1 ? matArray[0] : matArray;
          }


          // LOGO MESHES ARRAY
          // ==================
          // This array contains all mesh names that belong to the logo component.
          // These meshes represent different logo placement options:
          // 
          // LOGO PLACEMENTS:
          // - "DownLogo": Logo placed down/on the shirt
          // - "fullSleevesLogo": Logo on full sleeves
          // 
          // Usage: This array is used to show/hide logo meshes based on selectedLogo
          // state. It ensures only the selected logo placement is visible on the shirt.
          const logoMeshes = [
            "DownLogo",
            "fullSleevesLogo",
            "logo",
            "SleeveLeftLogo",
            "SleeveRightLogo",
          ];
          if (logoMeshes.includes(child.name)) {
            child.visible = false;
          }


          // CUFF MESHES ARRAY
          // ==================
          // This array contains all mesh names that belong to the cuff component.
          // These meshes represent different cuff styles and configurations:
          // 
          // CUFF STYLES:
          // - "DoubleCuff": Double cuff style
          // - "DoubleTabBtnThread": Double tab button with thread
          // - "DoubleTabs": Double tabs cuff
          // - "DoubleTabsBtn": Double tabs button cuff
          // - "FoldoverTab": Foldover tab cuff
          // - "FoldoverTabBtn001": Foldover tab button cuff
          // - "FoldoverTabBtnThread001": Foldover tab button with thread
          // - "ModernFlapCuff": Modern flap cuff
          // - "ModernFlapCurvCuff": Modern curved flap cuff
          // - "SignleTabsBtnThread001": Single tabs button with thread
          // - "SingleTabs": Single tabs cuff
          // - "SingleTabsBtn001": Single tabs button cuff
          // - "SquarCuff": Square cuff
          // - "StraightCuffBack": Straight cuff back
          // 
          // Usage: This array is used to show/hide cuff meshes based on selectedSleeve
          // state. It ensures only the selected cuff style is visible on the shirt.
          const cuffMeshes = [
            "AngleCuff",
            "RoundCuff",
            "Square",
            "1CuffBtn",
            "2CuffBtn",
          ];
          if (cuffMeshes.includes(child.name)) {
            child.visible = selectedSleeve.includes("4_") || selectedSleeve.includes("5_"); // Show cuffs for 4+ button styles
          }

          // DYNAMIC COLLAR MESHES ARRAY
          // ============================
          // This array contains all collar-related mesh names that are dynamically shown/hidden
          // based on user's collar selection. These meshes represent different collar styles:
          // - "Tuxedo": Tuxedo collar style
          // - "Batman": Batman-style collar
          // - "CollerIttalian": Italian collar style
          // - "Moden": Modern collar style
          // - "Round": Round collar style
          // - "BtnDown": Button-down collar style
          // - "Franch": French collar style
          // - "CutAway": Cutaway collar style
          // - "3btn_band": 3-button band collar
          // - "2BtnBand": 2-button band collar
          // - "CollarBtnDown": Collar button down style
          // - "Band": Band collar style
          // Usage: All meshes in this array are hidden by default, then specific ones are shown
          // based on selectedCollar state in the collar visibility logic below
          const dynamicCollar = [
            "Tuxedo",
            "Batman",
            "CollerIttalian",
            "Moden",
            "Round",
            "BtnDown",

            "Franch",
            "CutAway",
            "3btn_band",
            "2BtnBand",
            "CollarBtnDown",
            "Band",
          ];

          // Hide all dynamic collar meshes by default (early)
          if (dynamicCollar.includes(child.name)) {
            child.visible = false;
          }

          // COLLARS AND THREAD MESHES ARRAY
          // ================================
          // This array contains both collar meshes and their corresponding thread meshes
          // that are used for collar customization. It includes:
          // 
          // COLLAR MESHES:
          // - "Tuxedo", "Batman", "CollerIttalian", "Moden", "Round", "BtnDown"
          // - "Franch", "CutAway", "3btn_band", "2BtnBand", "CollarBtnDown"
          // 
          // THREAD MESHES (for collar stitching details):
          // - "RoundThread", "ModenThread", "ItalianCollarThread", "BatmanThread"
          // - "BtnDownThread", "FranchThread", "CutAwayThread", "TuxedoThread"
          // - "3BtnBandThread", "2btnBandThread", "bandThread"
          // 
          // BUTTON AND HOLE MESHES:
          // - "3btnColler", "2BtnCollar", "2btnHole", "3BtnHole"
          // 
          // Usage: This array is used to apply fabric textures to collar-related meshes
          // when a collar is selected. It ensures both the collar and its thread details
          // get the same fabric treatment for visual consistency.
          const collarsAndThread = [
            "Tuxedo",
            "Batman",
            "CollerIttalian",
            "Moden",
            "Round",
            "BtnDown",
            // "Band",
            "Franch",
            "CutAway",
            "3btn_band",
            "2BtnBand",
            "RoundThread",
            "ModenThread",
            "ItalianCollarThread",
            "BatmanThread",
            "BtnDownThread",
            "FranchThread",
            "CutAwayThread",
            "CollarBtnDown",
            "TuxedoThread",
            "3BtnBandThread",
            "2btnBandThread",
            "bandThread",
            "3btnColler",
            "2BtnCollar",
            // "1BandBtn",
            "2btnHole",
            "3BtnHole",
            "4BtnHole",
            "NeckHanger",
            // "NeckLogo",
          ];

          // Hide all collars by default
          if (collarsAndThread.includes(child.name)) {
            child.visible = false;
          }

          // Show selected collar
          if (selectedCollar && child.name === selectedCollar.backendkey) {
            child.visible = true;
          }

          // Cutaway 1 btn  Collar
          if (
            selectedCollar &&
            selectedCollar.backendkey == "CutAway" &&
            (child.name === "CutAway" ||
              child.name === "1BandBtn" ||
              child.name === "Band" ||
              child.name === "1BtnHole" ||
              child.name === "CutAwayThread" ||
              child.name === "bandThread")
          ) {
            child.visible = true;
          }

          // Cutaway 2 btn collar - deterministic offset from base
          if (
            selectedCollar &&
            selectedCollar.backendkey == "cutAway2Btn" &&
            child.name === "CutAway"
          ) {
            const baseY2 = basePositionsRef.current.get("CutAway");
            child.position.y = baseY2 + 0.015;
          }
          if (
            selectedCollar &&
            selectedCollar.backendkey == "cutAway2Btn" &&
            (child.name === "CutAway" ||
              child.name === "2BtnBand" ||
              child.name === "2btnBandThread" ||
              child.name === "2BtnCollar" ||
              child.name === "2btnHole" ||
              child.name === "CutAwayThread")
          ) {
            child.visible = true;
          }

          if (
            (selectedCollar &&
              selectedCollar.backendkey === "cutAway2Btn" &&
              child.name === "Band") ||
            child.name === "1BandBtn" ||
            child.name === "bandThread"
          ) {
            child.visible = false;
          }

          // Cutaway 3 btn collar - deterministic offset from base
          if (
            selectedCollar &&
            selectedCollar.backendkey == "CutAway3btn" &&
            child.name === "CutAway"
          ) {
            const baseY3 = basePositionsRef.current.get("CutAway");
            child.position.y = baseY3 + 0.06;
          }
          if (
            selectedCollar &&
            selectedCollar.backendkey === "CutAway3btn" &&
            (child.name === "CutAway" ||
              child.name === "3btn_band" ||
              child.name === "3BtnHole" ||
              child.name === "3btnColler" ||
              child.name === "3BtnHole" ||
              child.name === "CutAwayThread")
          ) {
            child.visible = true;
          }

          if (
            (selectedCollar &&
              selectedCollar.backendkey === "CutAway3btn" &&
              child.name === "Band") ||
            child.name === "1BandBtn"
          ) {
            child.visible = false;
          }

          // Frech 2 btn collar -
          if (
            selectedCollar &&
            selectedCollar.backendkey == "French2Btn" &&
            child.name === "Franch"
          ) {
            const baseY2 = basePositionsRef.current.get("Franch");
            child.position.y = baseY2 + 0.015;
          }
          if (
            selectedCollar &&
            selectedCollar.backendkey == "French2Btn" &&
            (child.name === "Franch" ||
              child.name === "2BtnBand" ||
              child.name === "2btnBandThread" ||
              child.name === "2BtnCollar" ||
              child.name === "2btnHole" ||
              child.name === "FranchThread")
          ) {
            child.visible = true;
          }

          if (
            (selectedCollar &&
              selectedCollar.backendkey === "French2Btn" &&
              child.name === "Band") ||
            child.name === "1BandBtn" ||
            child.name === "bandThread"
          ) {
            child.visible = false;
          }

          // Frech 3 btn collar -
          if (
            selectedCollar &&
            selectedCollar.backendkey == "French3Btn" &&
            child.name === "Franch"
          ) {
            const baseY2 = basePositionsRef.current.get("Franch");
            child.position.y = baseY2 + 0.06;
          }
          if (
            selectedCollar &&
            selectedCollar.backendkey == "French3Btn" &&
            (child.name === "Franch" ||
              child.name === "3btn_band" ||
              child.name === "3BtnHole" ||
              child.name === "3btnColler" ||
              child.name === "3BtnHole" ||
              child.name === "FranchThread")
          ) {
            child.visible = true;
          }

          if (
            (selectedCollar &&
              selectedCollar.backendkey === "French3Btn" &&
              child.name === "Band") ||
            child.name === "1BandBtn" ||
            child.name === "bandThread"
          ) {
            child.visible = false;
          }

          // Franch 1btn Collar

          if (
            selectedCollar &&
            selectedCollar.backendkey === "French1Btn" &&
            (child.name === "Franch" ||
              child.name === "Band" ||
              child.name === "1BandBtn" ||
              child.name === "1BtnHole" ||
              child.name === "FranchThread")
          ) {
            child.visible = true;
          }

          // CollerIttalian1 1btn Collar

          if (
            selectedCollar &&
            selectedCollar.backendkey === "CollerIttalian1" &&
            (child.name === "CollerIttalian" ||
              child.name === "Band" ||
              child.name === "1BandBtn" ||
              child.name === "1BtnHole" ||
              child.name === "ItalianCollarThread")
          ) {
            child.visible = true;
          }

          // CollerIttalian 2 btn collar -
          if (
            selectedCollar &&
            selectedCollar.backendkey == "CollerIttalian2" &&
            child.name === "CollerIttalian"
          ) {
            const baseY2 = basePositionsRef.current.get("CollerIttalian");
            child.position.y = baseY2 + 0.02;
          }
          if (
            selectedCollar &&
            selectedCollar.backendkey == "CollerIttalian2" &&
            (child.name === "CollerIttalian" ||
              child.name === "2BtnBand" ||
              child.name === "2btnBandThread" ||
              child.name === "2BtnCollar" ||
              child.name === "2btnHole" ||
              child.name === "ItalianCollarThread")
          ) {
            child.visible = true;
          }

          if (
            (selectedCollar &&
              selectedCollar.backendkey === "CollerIttalian2" &&
              child.name === "Band") ||
            child.name === "1BandBtn" ||
            child.name === "bandThread"
          ) {
            child.visible = false;
          }

          // CollerIttalian 3 btn collar -
          if (
            selectedCollar &&
            selectedCollar.backendkey == "CollerIttalian3" &&
            child.name === "CollerIttalian"
          ) {
            const baseY2 = basePositionsRef.current.get("CollerIttalian");
            child.position.y = baseY2 + 0.06;
          }
          if (
            selectedCollar &&
            selectedCollar.backendkey == "CollerIttalian3" &&
            (child.name === "CollerIttalian" ||
              child.name === "3btn_band" ||
              child.name === "3BtnHole" ||
              child.name === "3btnColler" ||
              child.name === "3BtnHole" ||
              child.name === "ItalianCollarThread")
          ) {
            child.visible = true;
          }

          if (
            (selectedCollar &&
              selectedCollar.backendkey === "CollerIttalian3" &&
              child.name === "Band") ||
            child.name === "1BandBtn" ||
            child.name === "bandThread"
          ) {
            child.visible = false;
          }

          // Moden  Collar
          if (
            selectedCollar &&
            selectedCollar.backendkey === "Moden" &&
            (child.name === "Moden" ||
              child.name === "Band" ||
              child.name === "1BandBtn" ||
              child.name === "1BtnHole" ||
              child.name === "bandThread" ||
              child.name === "ModenThread")
          ) {
            child.visible = true;
          }

          // Round  Collar
          if (
            selectedCollar &&
            selectedCollar.backendkey === "Round" &&
            (child.name === "Round" ||
              child.name === "Band" ||
              child.name === "1BandBtn" ||
              child.name === "1BtnHole" ||
              child.name === "bandThread" ||
              child.name === "RoundThread")
          ) {
            child.visible = true;
          }

          // Tuxedo  Collar
          if (
            selectedCollar &&
            selectedCollar.backendkey === "Tuxedo" &&
            (child.name === "Tuxedo" ||
              child.name === "Band" ||
              child.name === "1BandBtn" ||
              child.name === "1BtnHole" ||
              child.name === "bandThread" ||
              child.name === "TuxedoThread")
          ) {
            child.visible = true;
          }

          // Band Collar
          if (
            selectedCollar &&
            selectedCollar.backendkey === "Band" &&
            (child.name === "1BandBtn" ||
              child.name === "Band" ||
              child.name === "1BtnHole" ||
              child.name === "bandThread")
          ) {
            child.visible = true;
          }

          // Batman Collar
          if (
            selectedCollar &&
            selectedCollar.backendkey === "Batman" &&
            (child.name === "Batman" ||
              child.name === "Band" ||
              child.name === "1BandBtn" ||
              child.name === "bandThread" ||
              child.name === "BatmanThread")
          ) {
            child.visible = true;
          }

          // button Down Collar
          if (
            selectedCollar &&
            selectedCollar.backendkey === "BtnDown" &&
            (child.name === "BtnDown" ||
              child.name === "Band" ||
              child.name === "1BandBtn" ||
              child.name === "bandThread" ||
              child.name === "CollarBtnDown" ||
              child.name === "BtnDownThread")
          ) {
            child.visible = true;
          }
          if (
            selectedCollar &&
            selectedCollar.backendkey === "hiddenBtnDown" &&
            (child.name === "BtnDown" ||
              child.name === "Band" ||
              child.name === "1BandBtn" ||
              child.name === "bandThread" ||
              child.name === "BtnDownThread")
          ) {
            child.visible = true;
          }

          if (
            [
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
              "10",
              "11",
              "12",
              // "BackBodyTop",
              "BackEffect",
              // "BackThread",
              // "balt",
              "BP001",
              "BP002",
              "BP003",
              "BP004",
              "BP005",
              "BP006",
              "BP007",
              "BP008",
              // "BPocket",
              // "BtnBack",
              "BtnLogo1",
              
              "FB001Thread",
              "FB002Thread",
              "FPT003Thread",
              "FPT004Thread",
              "FPT005Thread",
              "FrontEffect",
              // "FrontInnerPocket",
              // "FrontThread",
              "Logo",
              // "Loop",
              // "MonigramLogo",
              // "Monogram",
              "Monogram2",
              "Monogram3",
              // "Outline",
              
             
              "RELAXED2",
              "RELAXEDThread",
              "RELAXEDWrinklesBack",
              "RELAXEDWrinklesFront",
              // "RepeatBtn",
              "StraightBack",
              // "StraightFront",
             
              "wrinklesFrontEffect",
              "Zip_Layar",
              "zipBackgroundPatti",
              "ZipBtn",
              "ZipSliderr",
              "zip",
              "Wrinkles",
            ].includes(child.name)
          ) {
            child.visible = false;
          }



          // FULL MODEL MESHES ARRAY
          // ========================
          // This array contains all the main jacket meshes that are part of the complete suit model.
          // These meshes represent different jacket styles and configurations:
          // 
          // LAPEL STYLES:
          // - "4btnpeakslanted": Peak lapel with 4 buttons and slanted pockets
          // - "notch4btn": Notch lapel with 4 buttons
          // - "Round": Round lapel style
          // - "round2btnJacket": Round lapel with 2 buttons
          // 
          // POCKET STYLES:
          // - "NoFlap": Jacket without flaps
          // - "Notch2Btnpatched": Notch lapel with 2 buttons and patched pockets
          // - "NotchNoflap2btn": Notch lapel with 2 buttons, no flaps
          // - "straightPatchedPocket": Straight patched pocket style
          // - "patch": Patched pocket style
          // - "ShawlSlantedPocket": Shawl lapel with slanted pockets
          // 
          // Usage: This array is used to show/hide complete jacket models based on product selection.
          // When "TwoPieceSuit" is selected, these meshes are shown along with trouser meshes.
          const fullmodallmesh = [
            "4btnpeakslanted",
            "NoFlap",
            "Notch2Btnpatched",
            "notch4btn",
 
 
            "NotchNoflap2btn",
            "straightPatchedPocket",
            "patch",
            "Round",
            "round2btnJacket",
            "ShawlSlantedPocket",
            "ShawlPatched",
            "ShawlPatched4Btn",
            "ShawlSlanted",
            "ShawlStraign",
            "slanted",
            "straight",
            "shawl2btn",
            "NotchNoflap2btnbody",
           
 
            //    "Backside",
            "jacketback", 
            "backinner",
 
            //    "Sleeve",
            "FullSleeve",
            "FullSleeveInner",
 
            // "Pockets",
            "notch4btnpatchedPocket001",
            "notch4btnpatchedPocket",
            "NoFlapTicket",
            "2Round2Btnpatched",
            "2BtnStraightRound",
            "2BtnStraightRoundTiicketPocket",
            "2Round2Btnpatched",
            "2RoundNoflap2btn",
            "2RoundNoflap2btnTicketPocket",
            "3pocket",
            "4btnpeakslanted2Pocket",
            "4btnpeakslantedTecket",
            "4btnslanted2Pocket",
            "4btnslantedTecket",
            "Noflap2Pocket",
            "notch4btnpatchedPocket001",
            "NotchNoflap2btn001",
            "NotchNoflap2btnTicketPocket",
            "NotchNoflap2btnticketpocket",
            "NotchSlantedpocket",
            "NotchSlantedTicket",
            "notchStraight",
            "notchStraightTicket",
            "Peack4BtnTicketPocket",
            "RoundSlanted",
            "RoundSlantedTicket",
            "RoundTicketPocket",
            "shawl2btnSlantedPocket",
            "shawl2btnSlantedTicketPocket",
            "shawl2btnStraightPocket",
            "shawl2btnStraightTicket",
            "ShawlNoFlap",
            "ShawlNoFlapTicket",
            "ShawlSlanted4btn001",
            "ShawlSlanted4btn003",
            "ShawlSlantedTicket",
            "ShawlStraignTicket",
            "slanted2Pocket",
            "slantedTicketPocket",
            "Straight2Pocket",
            "Straight3Pocket",
            "straight4BtnNotchTicket",
            "straight4BtnPeack2pocket",
            "straight4BtnPeackTicket",
            "strait_3_pocket",
            "TicketPocket",
 
            //  "Button",
            "1Btn",
             "2Btn",
             "3Btn",
             "4Btn",
             "4BtnPatched",
             "4ButtonSingleBreasted",
             "4ButtonSingleBreasted2toclose",
             "6ButtonSingleBreasted2toclose",
             "6ButtonSingleBreasted3ToClose",
             "BeltBtnThread",
             "beltBtn",
             "FoldoverTabBtn",
             "FoldoverTabBtnThread",
             "Kissing1",
             "Kissing2",
             "Kissing3",
             "Kissing4",
             "Kissing5",
             "SignleTabsBtnThread",
             "SingleTabsBtn",
             "Standerd1",
             "Standerd2",
             "Standerd3",
             "Standerd4",
             "Standerd5",
           
 
              "ButtonHole",
             "1BtnHole",
             "2BtnHole",
            "3BtnHole",
             "4BtnHole",
             "4BtnPatchedHole",
             "4ButtonHoleSingleBreasted",
             "4ButtonSingleBreastedHole",
             "6ButtonSingleBreasted2ToCloseHole",
            "6ButtonSingleBreasted3ToCloseHole",
             
 
 
 
 
 
             //  "Shuit paint *********************************//
             "Balt",
             "beltBtn001",
             "BeltBtnThread001",
             "Beltloop",
             "Bukle001",
             "BukleSideAdjusters",
             "DoubleLoop",
             "ModernLoop",
             "NoneBtnSideAdjusters",
             "NoneBtnSideAdjustersThread001",
             "NoneButtonSideAdjusters",
             "Single",
 
 
             //  "Front",
             "Jains",
             "Modern",
             "ModernCurv1Plat",
             "ModernCurv2Plat",
             "None",
             "None2",
             "nonestraightwell",
             "PlateSingle",
             "Slanted",
             "SlantedWelt",
 
             //  "FrontCuff",
             "jainsCuff",
             "ModernCuff",
             "None2Cuff",
             "NoneCuf",
             "StraightCuff",
 
             //  "Backside",
             "DoublePocket",
             "ModernFlap",
             "ModernFlapCurv",
             "sqaur",
             "straight001",
 
             //  "Backside Cuff",
             "DoubleCuff",
             "DoubleTabBtnThread",
             "DoubleTabs",
             "DoubleTabsBtn",
             "FoldoverTab",
             "FoldoverTabBtn001",
             "FoldoverTabBtnThread001",
             "ModernFlapCuff",
             "ModernFlapCurvCuff",
             "SignleTabsBtnThread001",
             "SingleTabs",
             "SingleTabsBtn001",
             "SquarCuff",
             "StraightCuffBack",
          ];

          // Button style mesh visibility logic
          if (fullmodallmesh.includes(child.name)) {
            child.visible = false; // Hide all button style meshes by default
          }

          // JACKET MESHES ARRAY
          // ====================
          // This array contains all mesh names that belong to the suit jacket component.
          // These meshes represent different jacket styles, lapels, pockets, and structural elements:
          // 
          // LAPEL STYLES:
          // - "4btnpeakslanted": Peak lapel with 4 buttons and slanted pockets
          // - "notch4btn": Notch lapel with 4 buttons
          // - "round2btnJacket": Round lapel with 2 buttons
          // - "NotchNoflap2btn": Notch lapel with 2 buttons, no flaps
          // - "Round": Round lapel style
          // - "shawl2btn": Shawl lapel with 2 buttons
          // 
          // POCKET STYLES:
          // - "NoFlap": Jacket without flaps
          // - "Notch2Btnpatched": Notch lapel with 2 buttons and patched pockets
          // - "straightPatchedPocket": Straight patched pocket style
          // - "patch": Patched pocket style
          // - "ShawlSlantedPocket": Shawl lapel with slanted pockets
          // - "ShawlPatched": Shawl lapel with patched pockets
          // - "ShawlPatched4Btn": Shawl lapel with patched pockets and 4 buttons
          // - "ShawlSlanted": Shawl lapel with slanted design
          // - "ShawlStraign": Shawl lapel with straight design
          // - "ShawlStraignPocket": Shawl lapel with straight pockets
          // - "straight": Straight pocket style
          // - "notch4btnpatchedPocket001": Notch lapel with 4 buttons and patched pockets
          // - "notch4btnpatchedPocket": Notch lapel with 4 buttons and patched pockets
          // 
          // STRUCTURAL ELEMENTS:
          // - "NotchNoflap2btnbody": Body of notch lapel with 2 buttons, no flaps
          // - "jacketback": Back of the jacket
          // - "backinner": Inner back of the jacket
          // - "Sleeve": Jacket sleeve
          // - "FullSleeve": Full-length sleeve
          // - "FullSleeveInner": Inner part of full sleeve
          // - "Pockets": General pocket meshes
          // 
          // Usage: This array is used to show/hide jacket-specific meshes when "SuitJacket" 
          // or "TwoPieceSuit" is selected. It ensures only jacket-related meshes are visible
          // for jacket customization.
          const jacketMeshes = [
            "4btnpeakslanted",
            "NoFlap",
            "Notch2Btnpatched",
            "notch4btn",
            "round2btnJacket",
            "NotchNoflap2btn",
            "straightPatchedPocket",
            "patch",
            "Round",
            "ShawlSlantedPocket",
            "ShawlPatched",
            "ShawlPatched4Btn",
            "ShawlSlanted",
            "ShawlStraign",
            "ShawlStraignPocket",
            "straight",
            "shawl2btn",
            "NotchNoflap2btnbody",
            "ShawlStraign",
            "jacketback",
            "backinner",
            "Sleeve",
            "FullSleeve",
            "FullSleeveInner",
            "Pockets",
            "notch4btnpatchedPocket001",
            "notch4btnpatchedPocket",
            "2Round2Btnpatched",
            "2BtnStraightRound",
            "2BtnStraightRoundTiicketPocket",
            "2Round2Btnpatched",
            "2RoundNoflap2btn",
            "2RoundNoflap2btnTicketPocket",
            "3pocket",
            "4btnpeakslanted2Pocket",
            "4btnpeakslantedTecket",
            "4btnslanted2Pocket",
            "4btnslantedTecket",
            "Noflap2Pocket",
            "notch4btnpatchedPocket001",
            "NotchNoflap2btn001",
            "NoFlapTicket",
            "NotchNoflap2btnTicketPocket",
            "NotchNoflap2btnticketpocket",
            "NotchSlantedpocket",
            "NotchSlantedTicket",
            "notchStraight",
            "notchStraightTicket",
            "Peack4BtnTicketPocket",
            "RoundSlanted",
            "RoundSlantedTicket",
            "RoundTicketPocket",
            "shawl2btnSlantedPocket",
            "shawl2btnSlantedTicketPocket",
            "shawl2btnStraightPocket",
            "shawl2btnStraightTicket",
            "ShawlNoFlap",
            "ShawlNoFlapTicket",
            "ShawlSlanted4btn001",
            "ShawlSlanted4btn003",
            "ShawlSlantedTicket",
            "ShawlStraignTicket",
            "slanted2Pocket",
            "slantedTicketPocket",
            "Straight2Pocket",
            "Straight3Pocket",
            "straight4BtnNotchTicket",
            "straight4BtnPeack2pocket",
            "straight4BtnPeackTicket",
            "strait_3_pocket",
            "TicketPocket",
            "Button",
            "2Btn",
            "1Btn",
            "3Btn",
            "4Btn",
            "4BtnPatched",
            "4ButtonSingleBreasted",
            "4ButtonSingleBreasted2toclose",
            "6ButtonSingleBreasted2toclose",
            "6ButtonSingleBreasted3ToClose",
            "BeltBtnThread",
            "beltBtn",
            "FoldoverTabBtn",
            "FoldoverTabBtnThread",
           
            "SignleTabsBtnThread",
            "SingleTabsBtn",
           
            "ButtonHole",
            "1BtnHole",
            "2BtnHole",
            "3BtnHole",
            "4BtnPatchedHole",
            "4ButtonHoleSingleBreasted",
            "4ButtonSingleBreastedHole",
            "6ButtonSingleBreasted2ToCloseHole",
            "6ButtonSingleBreasted3ToCloseHole",
            "Kissing1",
            "Kissing2",
            "Kissing3",
            "Kissing4",
            "Kissing5",
            "4BtnHole",
          ];

          // TROUSER MESHES ARRAY
          // =====================
          // This array contains all mesh names that belong to the suit trouser component.
          // These meshes represent different trouser styles, belt loops, pockets, and structural elements:
          // 
          // BELT LOOP STYLES:
          // - "Balt": Belt style
          // - "beltBtn001": Belt button
          // - "BeltBtnThread001": Belt button thread
          // - "Beltloop": Belt loop
          // - "Bukle001": Buckle style
          // - "BukleSideAdjusters": Buckle with side adjusters
          // - "DoubleLoop": Double belt loop
          // - "ModernLoop": Modern belt loop
          // - "NoneBtnSideAdjusters": No button side adjusters
          // - "NoneBtnSideAdjustersThread001": No button side adjusters thread
          // - "NoneButtonSideAdjusters": No button side adjusters
          // 
          // POCKET STYLES:
          // - "Single": Single pocket style
          // - "Jains": Jeans-style pocket (now used for suit)
          // - "Modern": Modern pocket style
          // - "ModernCurv1Plat": Modern curved pocket with 1 plate
          // - "ModernCurv2Plat": Modern curved pocket with 2 plates
          // - "None": No pocket style
          // - "None2": No pocket style variant 2
          // - "nonestraightwell": No straight welt pocket
          // - "PlateSingle": Single plate pocket
          // 
          // Usage: This array is used to show/hide trouser-specific meshes when "SuitTrouser" 
          // or "TwoPieceSuit" is selected. It ensures only trouser-related meshes are visible
          // for trouser customization.
          var trouserMeshes = [
            "Balt",
            "beltBtn001",
            "BeltBtnThread001",
            "Beltloop",
            "Bukle001",
            "BukleSideAdjusters",
            "DoubleLoop",
            "ModernLoop",
            "NoneBtnSideAdjusters",
            "NoneBtnSideAdjustersThread001",
            "NoneButtonSideAdjusters",
             "Single",
             //  "Front" ===== ,
             "Jains",
             "Modern",
             "ModernCurv1Plat",
             "ModernCurv2Plat",
             "None",
             "None2",
             "nonestraightwell",
             "PlateSingle",
             "Slanted",
             "SlantedWelt",
              //  "FrontCuff",
            "jainsCuff",
            "ModernCuff",
            "None2Cuff",
            "NoneCuf",
            "StraightCuff",

            //  "Backside",
            "DoublePocket",
            "ModernFlap",
            "ModernFlapCurv",
            "sqaur",
             "straight001",
             "backs",
            "backs_Cuff",

            //  "Backside Cuff",
           //  "DoubleCuff",
            "DoubleTabBtnThread",
            "DoubleTabs",
            "DoubleTabsBtn",
            "FoldoverTab",
            "FoldoverTabBtn001",
            "FoldoverTabBtnThread001",
           //  "ModernFlapCuff",
           //  "ModernFlapCurvCuff",
            "SignleTabsBtnThread001",
            "SingleTabs",
            "SingleTabsBtn001",
           //  "SquarCuff",
             // "StraightCuffBack",
            
             "DoublePockeLeft",
             "DoublePockeRght",
             "ModernFlapCurvLeft",
             "ModernFlapCurvRight",
             "ModernFlapLeft",
             "ModernFlapRight",
             "sqaurLeft",
             "sqaurRight",
             "straightLeft",
             "straightRight",
             "backpocketbtnLeft",
            "backpocketbtnRight",
             
            "DoublePockeLeft",
            "DoublePockeRght",
            "ModernFlapCurvLeft",
            "ModernFlapCurvRight",
            "ModernFlapLeft",
            "ModernFlapRight",
            "sqaurLeft",
            "sqaurRight",
            "straightLeft",
            "straightRight",
           ];

          // Define beltloop mesh array
          // BELT LOOP MESHES ARRAY
          // =======================
          // This array contains all mesh names that belong to the belt loop component.
          // These meshes represent different belt loop styles and configurations:
          // 
          // BELT LOOP STYLES:
          // - "DoubleLoop": Double belt loop style
          // - "Bukle.001": Buckle style belt loop
          // - "BukleSideAdjusters": Buckle with side adjusters
          // - "ModernLoop": Modern belt loop style
          // - "NoneBtnSideAdjusters": No button side adjusters
          // - "NoneBtnSideAdjustersThread.001": No button side adjusters with thread
          // - "NoneButtonSideAdjusters": No button side adjusters variant
          // - "Single": Single belt loop style
          // 
          // Usage: This array is used to show/hide belt loop meshes based on selectedBeltloop
          // state. It ensures only the selected belt loop style is visible on the trouser.
          const beltloopmesh = [
            "DoubleLoop",
            "Bukle.001",
            "BukleSideAdjusters",
            "ModernLoop",
            "NoneBtnSideAdjusters",
            "NoneBtnSideAdjustersThread.001",
            "NoneButtonSideAdjusters",
            "Single",
          ];

          // Define back pocket style mesh array
          // BACK POCKET STYLE MESHES ARRAY
          // ==============================
          // This array contains all mesh names that belong to the back pocket component.
          // These meshes represent different back pocket styles and configurations:
          // 
          // BACK POCKET STYLES:
          // - "DoublePockeLeft": Double pocket on left side
          // - "DoublePockeRght": Double pocket on right side
          // - "ModernFlapCurvLeft": Modern curved flap pocket on left side
          // - "ModernFlapCurvRight": Modern curved flap pocket on right side
          // - "ModernFlapLeft": Modern flap pocket on left side
          // - "ModernFlapRight": Modern flap pocket on right side
          // - "sqaurLeft": Square pocket on left side
          // - "sqaurRight": Square pocket on right side
          // - "straightLeft": Straight pocket on left side
          // - "straightRight": Straight pocket on right side
          // 
          // Usage: This array is used to show/hide back pocket meshes based on selectedBackPocketStyle
          // state. It ensures only the selected back pocket style is visible on the trouser.
          const backpocketstylemesh = [
            "DoublePockeLeft",
            "DoublePockeRght",
            "ModernFlapCurvLeft",
            "ModernFlapCurvRight",
            "ModernFlapLeft",
            "ModernFlapRight",
            "sqaurLeft",
            "sqaurRight",
            "straightLeft",
            "straightRight",
            "ShawlStraignPocket",
          ];

          // Define front pocket style mesh array
          // FRONT POCKET STYLE MESHES ARRAY
          // ===============================
          // This array contains all mesh names that belong to the front pocket component.
          // These meshes represent different front pocket styles and configurations:
          // 
          // FRONT POCKET STYLES:
          // - "None": No front pocket
          // - "None2": No front pocket variant 2
          // - "Jains": Jeans-style front pocket (now used for suit)
          // - "Modern": Modern front pocket style
          // - "ModernCurv1Plat": Modern curved pocket with 1 plate
          // - "ModernCurv2Plat": Modern curved pocket with 2 plates
          // - "FPT005ModernCurv2PlatThread": Thread for modern curved pocket with 2 plates
          // - "nonestraightwell": No straight welt pocket
          // - "PlateSingle": Single plate pocket
          // - "Slanted": Slanted pocket style
          // 
          // Usage: This array is used to show/hide front pocket meshes based on selectedFrontPocketStyle
          // state. It ensures only the selected front pocket style is visible on the trouser.
          const frontpocketstylemesh = [
            "None",
            "None2",
            "Jains",
            "Modern",
            "ModernCurv1Plat",
            "ModernCurv2Plat",
            "FPT005ModernCurv2PlatThread",
            "nonestraightwell",
            "PlateSingle",
            "Slanted",
            "SlantedWelt",
            "jainsCuff",
            "ModernCuff",
            "None2Cuff",
            "NoneCuf",
            "StraightCuff",
            "FoldoverTabBtn",
            "FoldoverTabBtnThread",
            "SignleTabsBtnThread",
            "SingleTabsBtn",
            "StraightCuff",
            "ShawlStraignPocket",
          ];

          if (selectedProduct && selectedProduct.key === "SuitJacket") {
            try {
              // eslint-disable-next-line no-console
              console.log("[Product] SuitJacket branch active");
            } catch (e) {}
            // Show only jacket-related meshes when Suit Jacket is selected
            
            if (jacketMeshes.includes(child.name)) {
              child.visible = true;
            } 
            if (trouserMeshes.includes(child.name)) {
              child.visible = false;
            }
            // Hide beltloop meshes when SuitJacket is selected
            if (beltloopmesh.includes(child.name)) {
              child.visible = false;
            }
            // Hide back pocket style meshes when SuitJacket is selected
            if (backpocketstylemesh.includes(child.name)) {
              child.visible = false;
            }
            // Hide front pocket style meshes when SuitJacket is selected
            if (frontpocketstylemesh.includes(child.name)) {
              child.visible = false;
            }
          } 
          // Show only trouser-related meshes when Suit Trouser is selected
          else if (selectedProduct && selectedProduct.key === "SuitTrouser") {
           
            if (trouserMeshes.includes(child.name)) {
              child.visible = true;
              // Adjust Y position for trouser meshes
              const baseY = basePositionsRef.current.get(child.name);
              // const baseZ = basePositionsRef.current.get(child.name);
              if (baseY !== undefined) {
                child.position.y = baseY + 2; // Adjust Y position
                // child.position.z = baseZ + 2; // Adjust Y position
              }
            }
          }
          else if (selectedProduct && selectedProduct.key === "TwoPieceSuit") {
            // Show meshes based on individual selections for Two Piece Suit
            // Show jacket meshes (respect individual jacket selections)
            if (jacketMeshes.includes(child.name)) {
              child.visible = true;
            }
            // Show trouser meshes (respect individual trouser selections)
            if (trouserMeshes.includes(child.name)) {
              child.visible = true;
              // Restore original Y position for Two Piece Suit
              const baseY = basePositionsRef.current.get(child.name);
              if (baseY !== undefined) {
                child.position.y = baseY; // Restore original position
              }
            }
            // Show beltloop meshes (respect individual beltloop selections)
            if (beltloopmesh.includes(child.name)) {
              child.visible = true;
            }
            // Show back pocket style meshes (respect individual pocket selections)
            if (backpocketstylemesh.includes(child.name)) {
              child.visible = true;
            }
            // Show front pocket style meshes (respect individual pocket selections)
            if (frontpocketstylemesh.includes(child.name)) {
              child.visible = true;
            }
          }

         

          // Beltloop mesh visibility logic
          if (beltloopmesh.includes(child.name)) {
            child.visible = false; // Hide all beltloop meshes by default
            // Set low opacity for effect meshes
            if (child.material) {
              const matArray = Array.isArray(child.material)
                ? child.material
                : [child.material];
              matArray.forEach((mat) => {
                mat.transparent = true;
                mat.opacity = 1; // Reduced opacity (30%)
                mat.alphaTest = 1; // Alpha test threshold
                mat.needsUpdate = true;
              });
            }
          }

          // Show specific beltloop mesh based on selected beltloop style
          // Only show if selectedProduct is NOT SuitJacket
          if (!(selectedProduct && selectedProduct.key === "SuitJacket")) {
            if (selectedBeltloop === "None" && child.name === "None") {
              child.visible = true;
            } else if (selectedBeltloop === "Single" && child.name === "Single") {
              child.visible = true;
            } else if (selectedBeltloop === "Double" && child.name === "DoubleLoop") {
              child.visible = true;
            } else if (selectedBeltloop === "Modern" && child.name === "ModernLoop") {
              child.visible = true;
            } else if (selectedBeltloop === "NoneButtonSideAdjusters" && child.name === "NoneButtonSideAdjusters") {
              child.visible = true;
            } else if (selectedBeltloop === "NoneBtnSideAdjusters" && child.name === "NoneBtnSideAdjusters") {
              child.visible = true;
            }
          }

          // PANT CUFF MESHES ARRAY
          // =======================
          // This array contains all mesh names that belong to pant cuff styles.
          // These meshes represent different pant cuff configurations:
          // 
          // PANT CUFF STYLES:
          // - "DoubleTabs": Double tabs pant cuff
          // - "SingleTabs": Single tabs pant cuff
          // - "SingleTabsBtn.001": Single tabs button pant cuff
          // - "FoldoverTab": Foldover tab pant cuff
          // - "FoldoverTabBtn.001": Foldover tab button pant cuff
          // 
          // Usage: This array is used to show/hide pant cuff meshes based on selectedPantCuff
          // state. It ensures only the selected pant cuff style is visible on the trousers.
          const pantCuffMeshes = [
            "DoubleTabs",
            "SingleTabs", 
            "SingleTabsBtn001",
            "FoldoverTab",
            "FoldoverTabBtn001",
            "DoubleTabsBtn",
          ];

          // Hide all pant cuff meshes by default
          if (pantCuffMeshes.includes(child.name)) {
            child.visible = false;
          }

          // Show specific pant cuff mesh based on selected pant cuff style
          // Only show if selectedProduct is NOT SuitJacket
          if (!(selectedProduct && selectedProduct.key === "SuitJacket")) {
            if (selectedPantCuff === "Regular") {
              // Regular - hide all pant cuff meshes (already hidden above)
            } else if (selectedPantCuff === "Cuff") {
              // Cuff - hide all pant cuff meshes (already hidden above)
            } else if (selectedPantCuff === "SingleTabs") {
              // Single Tabs - show SingleTabs and SingleTabsBtn.001
              if (child.name === "SingleTabs" || child.name === "SingleTabsBtn001") {
                child.visible = true;
              }
            } else if (selectedPantCuff === "DoubleTabs") {
              // Double Tabs - show DoubleTabs
              if (child.name === "DoubleTabs" || child.name === "DoubleTabsBtn" || child.name === "SingleTabsBtn001" || child.name === "SingleTabs" ) {
                child.visible = true;
              }
            } else if (selectedPantCuff === "FoldoverTabs") {
              // Foldover Tabs - show FoldoverTab and FoldoverTabBtn.001
              if (child.name === "FoldoverTab" || child.name === "FoldoverTabBtn001") {
                child.visible = true;
              }
            }
          }




          if (backpocketstylemesh.includes(child.name)) {
            child.visible = false; // Hide all back pocket style meshes by default
          }

          // Show specific back pocket style mesh based on selected back pocket style
          // Only show if selectedProduct is NOT SuitJacket
          if (!(selectedProduct && selectedProduct.key === "SuitJacket")) {
            if (selectedBackPocketStyle === "Single" && (child.name === "straightLeft" || child.name === "straightRight")) {
              child.visible = true;
            } else if (selectedBackPocketStyle === "Double" && (child.name === "DoublePockeLeft" || child.name === "DoublePockeRght")) {
              child.visible = true;
            } else if (selectedBackPocketStyle === "Modern Flap" && (child.name === "ModernFlapLeft" || child.name === "ModernFlapRight")) {
              child.visible = true;
            } else if (selectedBackPocketStyle === "Curved Flap" && (child.name === "ModernFlapCurvLeft" || child.name === "ModernFlapCurvRight")) {
              child.visible = true;
            } else if (selectedBackPocketStyle === "Square Flap" && (child.name === "sqaurLeft" || child.name === "sqaurRight")) {
              child.visible = true;
            }
          }


          // Front pocket style mesh visibility logic
          if (frontpocketstylemesh.includes(child.name)) {
            child.visible = false; // Hide all front pocket style meshes by default
          }

          // Show specific front pocket style mesh based on selected front pocket style
          // Only show if selectedProduct is NOT SuitJacket
          if (!(selectedProduct && selectedProduct.key === "SuitJacket")) {
            if (selectedFrontPocketStyle === "None" && child.name === "None") {
              child.visible = true;
            } else if (selectedFrontPocketStyle === "Slanted" && child.name === "Slanted") {
              child.visible = true;
            } else if (selectedFrontPocketStyle === "Straight Welt" && (child.name === "nonestraightwell" || child.name === "StraightCuff")) {
              child.visible = true;
            } else if (selectedFrontPocketStyle === "Slanted Welt" && (child.name === "SlantedWelt" || child.name === "None2Cuff")) {
              child.visible = true;
            } else if (selectedFrontPocketStyle === "Modern Curved" && (child.name === "Modern" || child.name === "ModernCuff")) {
              child.visible = true;
            } else if (selectedFrontPocketStyle === "Jeans" && (child.name === "Jains" || child.name === "jainsCuff")) {
              child.visible = true;
            }
          }


          // Collar End Dyanmic

          // BOTTOM MESHES ARRAY
          // ====================
          // This array contains all mesh names that belong to the shirt back/bottom component.
          // These meshes represent different shirt back styles and configurations:
          // 
          // SHIRT BACK STYLES:
          // - "back": Basic back style
          // - "MaoSlitsLongBack": Mao collar with long slits on back
          // - "SlitsBack": Back with slits
          // - "MaoSlitsBack": Mao collar with slits on back
          // - "LongSlitsBack": Back with long slits
          // 
          // Usage: This array is used to show/hide shirt back meshes based on selectedShirtBack
          // state. It ensures only the selected shirt back style is visible on the shirt.
          const BottomMesh = [
            "back",
            "MaoSlitsLongBack",
            "SlitsBack",
            "MaoSlitsBack",
            "LongSlitsBack",
          ];

          if (BottomMesh.includes(child.name)) {
            // Only show the mesh whose name matches selectedShirtBack; supports string or { backendkey }
            const selectedShirtBackKey =
              typeof selectedShirtBack === "string"
                ? selectedShirtBack
                : selectedShirtBack && selectedShirtBack.backendkey;
            child.visible =
              !!selectedShirtBackKey && child.name === selectedShirtBackKey;
          }

          // PLACKET MESHES ARRAY
          // =====================
          // This array contains all mesh names that belong to the placket component.
          // These meshes represent different placket styles and configurations:
          // 
          // PLACKET STYLES:
          // - "BoxPlacket": Box-style placket
          // - "HiddenBtn": Hidden button placket
          // - "SinglePlacket": Single placket style
          // 
          // Usage: This array is used to show/hide placket meshes based on selectedPlacket
          // state. It ensures only the selected placket style is visible on the shirt.
          const PlacketMesh = [
            "BoxPlacket",
            // "SinglePlacket",
          ];

          // Show only the placket mesh that matches selectedPlacket (string or backendkey)
          if (PlacketMesh.includes(child.name)) {
            const selectedPlacketKey =
              typeof selectedPlacket === "string"
                ? selectedPlacket
                : selectedPlacket && selectedPlacket.backendkey;
            if (selectedPlacketKey === "boxPlackletNoButton") {
              // Special case: show BoxPlacket only and hide button mesh separately
              child.visible = child.name === "BoxPlacket";
            } else {
              child.visible = child.name === selectedPlacketKey;
            }
          }

          // Placket Start Dynamic
          const shirtBack = ["SidePlacket", "BoxPlate", "Plan"];

          // Show only the placket mesh that matches selectedPlacket (string or backendkey)
          if (shirtBack.includes(child.name)) {
            const selectedShirtBackKey =
              typeof selectedShirtBack === "string"
                ? selectedShirtBack
                : selectedShirtBack && selectedShirtBack.backendkey;
            if (selectedShirtBackKey === "boxPlackletNoButton") {
              // Special case: show BoxPlacket only and hide button mesh separately
              child.visible = child.name === "BoxPlacket";
            } else {
              child.visible = child.name === selectedShirtBackKey;
            }
          }


          // Jacket button style visibility based on selectedButtonStyle (for SuitJacket and TwoPieceSuit)
          if (selectedProduct && (selectedProduct.key === "SuitJacket" || selectedProduct.key === "TwoPieceSuit")) {
            // Hide all jacket button related meshes by default
            if (jacketbuttonmesh.includes(child.name)) {
              child.visible = false;
            }

            // Map UI labels to GLB mesh names (best available matches)
            const buttonStyleToMeshMap = {
              "1 Button, Single Breasted": ["1Btn", "1BtnHole"],
              "2 Button, Single Breasted": ["2Btn", "2BtnHole"],
              "3 Button, Single Breasted": ["3Btn", "3BtnHole"],
              "4 Button, Single Breasted": ["4Btn", "4BtnHole"],
              "4 Button, Single Breasted 2 to close": ["4ButtonSingleBreasted2toclose", "4ButtonHoleSingleBreasted"],
              "4 Button, Single Breasted 1 to close": ["4ButtonSingleBreasted", "4ButtonSingleBreastedHole"],
              "6 Button, Single Breasted 2 to close": ["6ButtonSingleBreasted2toclose", "6ButtonSingleBreasted2ToCloseHole"],
              "6 Button, Single Breasted 3 to close": ["6ButtonSingleBreasted3ToClose", "6ButtonSingleBreasted3ToCloseHole"],
              "6 Button, Single Breasted 1 to close": ["4BtnPatched", "4BtnPatchedHole"],
            };

            const targetMeshName = buttonStyleToMeshMap[selectedButtonStyle];
            if (targetMeshName) {
              // Handle both string and array cases
              if (Array.isArray(targetMeshName)) {
                if (targetMeshName.includes(child.name)) {
                  child.visible = true;
                }
              } else if (child.name === targetMeshName) {
                child.visible = true;
              }
            }

            // JACKET LAPEL MESHES ARRAY
            // =========================
            // This array contains all mesh names that belong to the jacket lapel component.
            // These meshes represent different lapel styles and configurations:
            // 
            // LAPEL STYLES:
            // - "NoFlap": Jacket without flaps
            // - "Notch2Btnpatched": Notch lapel with 2 buttons and patched pockets
            // - "NotchNoflap2btn": Notch lapel with 2 buttons, no flaps
            // - "NotchNoflap2btnbody": Body of notch lapel with 2 buttons, no flaps
            // - "shawl2btn": Shawl lapel with 2 buttons
            // - "ShawlPatched": Shawl lapel with patched pockets
            // - "ShawlSlanted": Shawl lapel with slanted design
            // - "straight": Straight pocket style
            // - "straightPatchedPocket": Straight patched pocket style
            // - "4btnpeakslanted": Peak lapel with 4 buttons and slanted pockets
            // - "notch4btn": Notch lapel with 4 buttons
            // - "patch": Patched pocket style
            // 
            // Usage: This array is used to show/hide jacket lapel meshes based on selectedLapelStyle
            // state. It ensures only the selected lapel style is visible on the jacket.
            const jacketLapelMesh = [
              "NoFlap",
              "Notch2Btnpatched",
              "NotchNoflap2btn",
              "NotchNoflap2btnbody",
              "shawl2btn",
              "ShawlPatched",
              "ShawlSlanted",
              "straight",
              "straightPatchedPocket",
              "4btnpeakslanted",
              "notch4btn",
              "patch",
              "Round",
              "ShawlPatched4Btn",
              "round2btnJacket",
              "ShawlStraign",
              "slanted",
              "ShawlStraign",
              
            ];

            // Hide all lapel meshes by default
            if (jacketLapelMesh.includes(child.name)) {
              child.visible = false;
            }
           
            
            // Helper function to get button type
            const getButtonType = (buttonStyle) => {
              const buttonTypes = {
                "1 Button, Single Breasted": "basic",
                "2 Button, Single Breasted": "basic", 
                "3 Button, Single Breasted": "basic",
                "4 Button, Single Breasted": "basic",
                "4 Button, Single Breasted 2 to close": "advanced",
                "4 Button, Single Breasted 1 to close": "advanced", 
                "6 Button, Single Breasted 2 to close": "advanced",
                "6 Button, Single Breasted 3 to close": "advanced",
                "6 Button, Single Breasted 1 to close": "advanced"
              };
              return buttonTypes[buttonStyle] || "basic";
            };
            
            // Show lapel mesh based on both selectedLapelStyle and selectedButtonStyle
            if (selectedLapelStyle === "Peak Lapel") {
              const buttonType = getButtonType(selectedButtonStyle);
            
              if (buttonType === "basic") {
                if (selectedJacketPocket.key === "2StraightPocketsNoFlap") {
                  if (child.name === "NoFlap") {
                    child.visible = true;
                  }
                } else if (selectedJacketPocket.key === "2PatchedPockets") {
                  if (child.name === "straightPatchedPocket") {
                    child.visible = true;
                  }
                } else {
                  if (child.name === "straight") {
                    child.visible = true;
                  }
                }
              } else if (buttonType === "advanced" && child.name === "4btnpeakslanted") {
                child.visible = true;
              }
            }
            
            
            if (selectedLapelStyle === "Notch Lapel") {
              const buttonType = getButtonType(selectedButtonStyle);
              
              if (buttonType === "basic" && child.name === "NotchNoflap2btnbody") {
                child.visible = true;
              } else if (buttonType === "advanced" && child.name === "notch4btn") {
                child.visible = true;
              }
            }
            if (selectedLapelStyle === "Round Lapel") {
              const buttonType = getButtonType(selectedButtonStyle);
              
              if (buttonType === "basic" && child.name === "round2btnJacket") {
                child.visible = true;
              } else if (buttonType === "advanced" && child.name === "Round") {
                child.visible = true;
              }
            }

            if (selectedLapelStyle === "Shawl Lapel") {
              const buttonType = getButtonType(selectedButtonStyle);
              
              if (buttonType === "basic" && child.name === "shawl2btn") {
                child.visible = true;
              } else if (buttonType === "advanced" && child.name === "ShawlStraign") {
                child.visible = true;
              }
            }
          }



          // JACKET POCKET MESHES ARRAY
          // ===========================
          // This array contains all mesh names that belong to the jacket pocket component.
          // These meshes represent different jacket pocket styles and configurations:
          // 
          // STRAIGHT POCKET STYLES:
          // - "Straight2Pocket": 2 straight pockets
          // - "Straight3Pocket": 3 straight pockets
          // - "notchStraight": Notch lapel with straight pockets
          // - "shawl2btnStraightPocket": Shawl lapel with 2 buttons and straight pockets
          // - "2BtnStraightRound": 2 buttons with straight round pockets
          // 
          // SLANTED POCKET STYLES:
          // - "4btnslanted2Pocket": 4 buttons with 2 slanted pockets
          // - "4btnpeakslanted2Pocket": 4 buttons peak lapel with 2 slanted pockets
          // - "ShawlSlantedPocket": Shawl lapel with slanted pockets
          // - "shawl2btnSlantedPocket": Shawl lapel with 2 buttons and slanted pockets
          // - "ShawlSlanted4btn003": Shawl lapel with 4 buttons and slanted pockets
          // 
          // TICKET POCKET STYLES:
          // - "slantedTicketPocket": Slanted ticket pocket
          // - "4btnpeakslantedTecket": 4 buttons peak lapel with ticket pocket
          // - "4btnslantedTecket": 4 buttons slanted with ticket pocket
          // 
          // PATCHED POCKET STYLES:
          // - "notch4btnpatchedPocket001": Notch lapel with 4 buttons and patched pockets
          // 
          // SPECIAL POCKET STYLES:
          // - "ShawlStraignPocket": Shawl lapel with straight pockets
          // 
          // Usage: This array is used to show/hide jacket pocket meshes based on selectedJacketPocket
          // state. It ensures only the selected jacket pocket style is visible on the jacket.
          const jacketpocketmesh = [
            "Straight2Pocket",
            "ShawlStraignPocket",
            "4btnslanted2Pocket",
            "ShawlSlanted4btn003",
            "4btnpeakslanted2Pocket",
            "notch4btnpatchedPocket001",
            "shawl2btnStraightPocket",
            "2BtnStraightRound",
            "ShawlSlantedPocket",
            "shawl2btnSlantedPocket",
            "notchStraight",
            "slantedTicketPocket",
            "4btnpeakslantedTecket",
            "4btnslantedTecket",
            "Straight3Pocket",
            "slanted2Pocket",
            "RoundSlanted",
            "NotchSlantedpocket",
            "straight4BtnPeack2pocket",
            "ShawlSlanted4btn001",
            "ShawlStraignTicket",
            "straight4BtnNotchTicket",
            "straight4BtnPeackTicket",
            "NotchSlantedTicket",
            "ShawlSlantedTicket",
            "RoundSlantedTicket",
            "3pocket",
            "shawl2btnStraightTicket",
            "shawl2btnSlantedTicketPocket",
            "2BtnStraightRoundTiicketPocket",
            "notchStraightTicket",
            "NotchNoflap2btnTicketPocket",
            "NotchNoflap2btnticketpocket",
            "2RoundNoflap2btnTicketPocket",
            "RoundTicketPocket",
            "strait_3_pocket",
            "2Round2Btnpatched",
            "notch4btnpatchedPocket",
            "ShawlNoFlapTicket",
            "Peack4BtnTicketPocket",
            "TicketPocket",
            "ShawlNoFlap",
            "Noflap2Pocket",
            "2RoundNoflap2btn",
            "NotchNoflap2btn001",
            "NotchNoFlap",
            "NoFlapTicket",
            
          ]

          // Jacket Pocket mesh visibility logic
          if (jacketpocketmesh.includes(child.name)) {
            child.visible = false; // Hide all jacket pocket meshes by default
          }

          // Show specific jacket pocket mesh based on selected jacket pocket style
          // Only show if selectedProduct is SuitJacket or TwoPieceSuit
          if (selectedProduct && (selectedProduct.key === "SuitJacket" || selectedProduct.key === "TwoPieceSuit")) {
            if (selectedJacketPocket) {
              // Helper function to get button type
              const getButtonType = (buttonStyle) => {
                const buttonTypes = {
                  "1 Button, Single Breasted": "basic",
                  "2 Button, Single Breasted": "basic", 
                  "3 Button, Single Breasted": "basic",
                  "4 Button, Single Breasted": "basic",
                  "4 Button, Single Breasted 2 to close": "advanced",
                  "4 Button, Single Breasted 1 to close": "advanced", 
                  "6 Button, Single Breasted 2 to close": "advanced",
                  "6 Button, Single Breasted 3 to close": "advanced",
                  "6 Button, Single Breasted 1 to close": "advanced"
                };
                return buttonTypes[buttonStyle] || "basic";
              };

              const buttonType = getButtonType(selectedButtonStyle);
              
              // Map jacket pocket options to specific meshes based on lapel style and button type
              if (selectedJacketPocket.key === "2StraightPockets") {
                if (selectedLapelStyle === "Peak Lapel") {
                  if (buttonType === "basic" && child.name === "Straight2Pocket") {
                    child.visible = true;
                  } else if (buttonType === "advanced" && child.name === "straight4BtnPeack2pocket") {
                    child.visible = true;
                  }
                } else if (selectedLapelStyle === "Notch Lapel") {
                  if (buttonType === "basic" && child.name === "notchStraight") {
                    child.visible = true;
                  } else if (buttonType === "advanced" && child.name === "straight4BtnPeack2pocket") {
                    child.visible = true;
                  }
                } else if (selectedLapelStyle === "Round Lapel") {
                  if (buttonType === "basic" && child.name === "shawl2btnStraightPocket") {
                    child.visible = true;
                  } else if (buttonType === "advanced" && child.name === "RoundSlanted") {
                    child.visible = true;
                  }
                } else if (selectedLapelStyle === "Shawl Lapel") {
                  if (buttonType === "basic" && child.name === "shawl2btnStraightPocket") {
                    child.visible = true;
                  } else if (buttonType === "advanced" && child.name === "ShawlStraignPocket") {
                    child.visible = true;
                  }
                }
              } else if (selectedJacketPocket.key === "2StraightPockets1Ticket") {
                if (selectedLapelStyle === "Peak Lapel") {
                  if (buttonType === "basic" && (child.name === "Straight2Pocket" || child.name === "Straight3Pocket")) {
                    child.visible = true;
                  } else if (buttonType === "advanced" && (child.name === "straight4BtnPeack2pocket" || child.name === "straight4BtnPeackTicket")) {
                    child.visible = true;
                  }
                } else if (selectedLapelStyle === "Notch Lapel") {
                  if (buttonType === "basic" && (child.name === "notchStraightTicket" || child.name === "notchStraight")) {
                    child.visible = true;
                  } else if (buttonType === "advanced"  && (child.name === "notchStraightTicket" || child.name === "notchStraight")) {
                    child.visible = true;
                  }
                } else if (selectedLapelStyle === "Round Lapel") {
                  if (buttonType === "basic" && (child.name === "shawl2btnStraightPocket" || child.name === "2BtnStraightRoundTiicketPocket") ) {
                    child.visible = true;
                  } else if (buttonType === "advanced" && (child.name === "2BtnStraightRound" || child.name === "2BtnStraightRoundTiicketPocket")) {
                    child.visible = true;
                  }
                } else if (selectedLapelStyle === "Shawl Lapel") {
                 
                  if (buttonType === "basic" && (child.name === "shawl2btnStraightPocket" || child.name === "shawl2btnStraightTicket")) {
                    child.visible = true;
                  } else if (buttonType === "advanced" && (child.name === "shawl2btnStraightPocket" || child.name === "ShawlStraignTicket")) {
                    child.visible = true;
                  }
                }
              } else if (selectedJacketPocket.key === "2SlantedPockets") {
                if (selectedLapelStyle === "Peak Lapel") {
                  if (buttonType === "basic" && child.name === "slanted2Pocket") {
                    child.visible = true;
                  } else if (buttonType === "advanced" && child.name === "4btnpeakslanted2Pocket") {
                    child.visible = true;
                  }
                } else if (selectedLapelStyle === "Notch Lapel") {
                  if (buttonType === "basic" && child.name === "NotchSlantedpocket") {
                    child.visible = true;
                  } else if (buttonType === "advanced" && child.name === "NotchSlantedpocket") {
                    child.visible = true;
                  }
                } else if (selectedLapelStyle === "Round Lapel") {
                  if (buttonType === "basic" && child.name === "RoundSlanted") {
                    child.visible = true;
                  } else if (buttonType === "advanced" && child.name === "RoundSlanted") {
                    child.visible = true;
                  }
                } else if (selectedLapelStyle === "Shawl Lapel") {
                  if (buttonType === "basic" && child.name === "shawl2btnSlantedPocket") {
                    child.visible = true;
                  } else if (buttonType === "advanced" && child.name === "ShawlSlanted4btn003") {
                    child.visible = true;
                  }
                }
              } else if (selectedJacketPocket.key === "2SlantedPockets1Ticket") {
                if (selectedLapelStyle === "Peak Lapel") {
                  if (buttonType === "basic"  && (child.name === "slanted2Pocket" || child.name === "Straight3Pocket")) {
                    child.visible = true;
                  } else if (buttonType === "advanced"  && (child.name === "4btnpeakslanted2Pocket" || child.name === "straight4BtnPeackTicket")) {
                    child.visible = true;
                  }
                } else if (selectedLapelStyle === "Notch Lapel") {
                  if (buttonType === "basic" && (child.name === "NotchSlantedTicket" || child.name === "NotchSlantedpocket")) {
                    child.visible = true;
                  } else if (buttonType === "advanced"  && (child.name === "straight4BtnPeackTicket" || child.name === "NotchSlantedpocket")) {
                    child.visible = true;
                  }
                } else if (selectedLapelStyle === "Round Lapel") {
                  if (buttonType === "basic"  && (child.name === "RoundSlanted" || child.name === "RoundSlantedTicket")) {
                    child.visible = true;
                  } else if (buttonType === "advanced" && (child.name === "RoundSlanted" || child.name === "RoundSlantedTicket")) {
                    child.visible = true;
                  }
                } else if (selectedLapelStyle === "Shawl Lapel") {
                 
                  if (buttonType === "basic"  && (child.name === "shawl2btnSlantedPocket" || child.name === " ShawlSlantedTicket")) {
                    child.visible = true;
                  } else if (buttonType === "advanced"  && (child.name === "shawl2btnSlantedPocket" || child.name === " ShawlSlantedTicket")) {
                    child.visible = true;
                  }
                }
              } else if (selectedJacketPocket.key === "2StraightPocketsNoFlap") {
                if (selectedLapelStyle === "Peak Lapel") {
                  if (buttonType === "basic" && child.name === "") {
                    child.visible = true;
                  } else if (buttonType === "advanced" && child.name === "Noflap2Pocket") {
                    child.visible = true;
                  }
                } else if (selectedLapelStyle === "Notch Lapel") {
                  if (buttonType === "basic" && child.name === "NotchNoflap2btn001") {
                    child.visible = true;
                  } else if (buttonType === "advanced" && child.name === "NotchNoflap2btn001") {
                    child.visible = true;
                  }
                } else if (selectedLapelStyle === "Round Lapel") {
                  if (buttonType === "basic" && child.name === "NotchNoFlap") {
                    child.visible = true;
                  } else if (buttonType === "advanced" && child.name === "NotchNoFlap") {
                    child.visible = true;
                  }
                } else if (selectedLapelStyle === "Shawl Lapel") {
                  if (buttonType === "basic" && child.name === "ShawlNoFlap") {
                    child.visible = true;
                  } else if (buttonType === "advanced" && child.name === "ShawlNoFlap") {
                    child.visible = true;
                  }
                }
              } else if (selectedJacketPocket.key === "2StraightPockets1TicketNoFlap") {
                if (selectedLapelStyle === "Peak Lapel") {
                  if (buttonType === "basic" && child.name === "") {
                    child.visible = true;
                  } else if (buttonType === "advanced"  && (child.name === "Noflap2Pocket" || child.name === "Peack4BtnTicketPocket")) {
                    child.visible = true;
                  }
                } else if (selectedLapelStyle === "Notch Lapel") {
                  if (buttonType === "basic" && (child.name === "NotchNoflap2btnticketpocket" || child.name === "NotchNoflap2btn001") ) {
                    child.visible = true;
                  } else if (buttonType === "advanced" && (child.name === "NotchNoFlap" || child.name === "Peack4BtnTicketPocket")) {
                    child.visible = true;
                  }
                } else if (selectedLapelStyle === "Round Lapel") {
                  if (buttonType === "basic" && (child.name === "NotchNoFlap" || child.name === "2RoundNoflap2btnTicketPocket")) {
                    child.visible = true;
                  } else if (buttonType === "advanced" && (child.name === "NotchNoFlap" || child.name === "NoFlapTicket")) {
                    child.visible = true;
                  }
                } else if (selectedLapelStyle === "Shawl Lapel") {
                 
                  if (buttonType === "basic"  && (child.name === "ShawlNoFlap" || child.name === "ShawlNoFlapTicket")) {
                    child.visible = true;
                  } else if (buttonType === "advanced"  && (child.name === "ShawlNoFlap" || child.name === "ShawlNoFlapTicket")) {
                    child.visible = true;
                  }
                }
              } else if (selectedJacketPocket.key === "2PatchedPockets") {
                if (selectedLapelStyle === "Peak Lapel") {
                  if (buttonType === "basic" && child.name === "") {
                    child.visible = true;
                  } else if (buttonType === "advanced" && child.name === "notch4btnpatchedPocket001") {
                    child.visible = true;
                  }
                } else if (selectedLapelStyle === "Notch Lapel") {
                  if (buttonType === "basic" && child.name === "Notch2Btnpatched") {
                    child.visible = true;
                  } else if (buttonType === "advanced" && child.name === "notch4btnpatchedPocket") {
                    child.visible = true;
                  }
                } else if (selectedLapelStyle === "Round Lapel") {
                  if (buttonType === "basic" && child.name === "2Round2Btnpatched") {
                    child.visible = true;
                  } else if (buttonType === "advanced" && child.name === "ShawlPatched4Btn") {
                    child.visible = true;
                  }
                } else if (selectedLapelStyle === "Shawl Lapel") {
                  if (buttonType === "basic" && child.name === "ShawlPatched") {
                    child.visible = true;
                  } else if (buttonType === "advanced" && child.name === "ShawlPatched4Btn") {
                    child.visible = true;
                  }
                }
              }
            }
          }





          // Hide the placket button mesh when no-button placket is selected
          if (child.name === "PlacketBtn") {
            const selectedPlacketKey =
              typeof selectedPlacket === "string"
                ? selectedPlacket
                : selectedPlacket && selectedPlacket.backendkey;
            child.visible = selectedPlacketKey !== "boxPlackletNoButton";
          }

          // Placket End Dynamic

          // Pocket Start Dynamic
          if (child.name === "pocket") {
            // Show pocket only if selectedPocket is "yes"
            child.visible = selectedPocket === "yes";
          }
          // Pocket End Dynamic

          // Logo application: apply uploaded logo texture to selected logo mesh
          if (
            selectedLogoMesh &&
            child.name === selectedLogoMesh &&
            logoImageUrl &&
            logoEnabled
          ) {
            const matArray = Array.isArray(child.material)
              ? child.material.map((m) => m.clone())
              : [child.material.clone()];
            matArray.forEach((mat) => {
              mat.map = uploadedLogoTexture;
              // Fix logo orientation by flipping the texture
              if (mat.map) {
                mat.map.flipY = false; // This flips the texture vertically
                mat.map.wrapS = RepeatWrapping;
                mat.map.wrapT = RepeatWrapping;
                // Preserve original logo colors
                mat.map.colorSpace = SRGBColorSpace;
                mat.map.generateMipmaps = true;
                mat.map.anisotropy = Math.min(gl.capabilities.getMaxAnisotropy(), 16); // High quality texture filtering
                mat.map.minFilter = LinearMipmapLinearFilter;
                mat.map.magFilter = LinearFilter;
              }
              mat.transparent = true;
              mat.alphaTest = 0.3;
              mat.depthWrite = true;
              mat.needsUpdate = true;
            });
            child.material = matArray.length === 1 ? matArray[0] : matArray;
            child.visible = true;
          } else if (selectedLogoMesh && child.name === selectedLogoMesh) {
            // Hide logo mesh if logo is disabled
            child.visible = false;
          }

          // SLEEVE MESHES ARRAY - MOVED TO BOTTOM TO AVOID OVERLAP
          // ======================================================
          // This array contains all mesh names that belong to the sleeve component.
          // These meshes represent different sleeve styles and configurations:
          // 
          // SLEEVE BUTTON STYLES:
          // - "Kissing1": Kissing button style 1
          // - "Kissing2": Kissing button style 2
          // - "Kissing3": Kissing button style 3
          // - "Kissing4": Kissing button style 4
          // - "Kissing5": Kissing button style 5
          // - "Standerd1": Standard button style 1
          // - "Standerd2": Standard button style 2
          // - "Standerd3": Standard button style 3
          // - "Standerd4": Standard button style 4
          // - "Standerd5": Standard button style 5
          // 
          // Usage: This array is used to show/hide sleeve button meshes based on selectedSleeve
          // state. It ensures only the selected sleeve button style is visible on the shirt.
          const sleeveMeshes = [
            "Kissing1",
            "Kissing2",
            "Kissing3",
            "Kissing4",
            "Kissing5",
            "Standerd1",
            "Standerd2",
            "Standerd3",
            "Standerd4",
            "Standerd5"
          ];

          // Hide all sleeve meshes by default
          if (sleeveMeshes.includes(child.name)) {
            child.visible = false;
          }
          
          // Show only selected sleeve mesh
          if (
            // Kissing buttons logic - show multiple buttons based on selection
            (selectedSleeve === "3_kissing_buttons" && (child.name === "Kissing4" || child.name === "Kissing3" || child.name === "Kissing2")) ||
            (selectedSleeve === "4_kissing_button" && (child.name === "Kissing4" || child.name === "Kissing3" || child.name === "Kissing2" || child.name === "Kissing1")) ||
            (selectedSleeve === "5_kissing_button" && (child.name === "Kissing5" || child.name === "Kissing4" || child.name === "Kissing3" || child.name === "Kissing2" || child.name === "Kissing1")) ||
            // Standard buttons logic - show multiple buttons based on selection
            (selectedSleeve === "3_standard_button" && (child.name === "Standerd4" || child.name === "Standerd3" || child.name === "Standerd2")) ||
            (selectedSleeve === "4_standard_buttons" && (child.name === "Standerd4" || child.name === "Standerd3" || child.name === "Standerd2" || child.name === "Standerd1")) ||
            (selectedSleeve === "5_standard_buttons" && (child.name === "Standerd5" || child.name === "Standerd4" || child.name === "Standerd3" || child.name === "Standerd2" || child.name === "Standerd1"))
          ) {
            child.visible = true;
            
            // Disable shadows for sleeve button meshes to prevent background shadows
            if (child.name.includes("Kissing") || child.name.includes("Standerd")) {
              child.castShadow = false;
              child.receiveShadow = true; // Still receive shadows for realism
            }
          }
          
          // IMPORTANT: Hide sleeve meshes when SuitTrouser is selected (this must come after show logic)
          if (selectedProduct && selectedProduct.key === "SuitTrouser" && sleeveMeshes.includes(child.name)) {
            child.visible = false;
          }
        }
      });

      if (!hasLoggedMeshesRef.current) {
        try {
          const allNames = Array.from(meshNameSet.values());
        } catch (e) {}
        hasLoggedMeshesRef.current = true;
      }
      ref.current = gltf.scene;
    }
  }, [
    gltf,
    wholeFabricTexture,
    loadedCollarTexture,
    collarFabricTextureUrl,
    repeatScale,
    showItalianCollar,
    showFranchCollar,
    selectedCollar,
    selectedSleeve, // <-- yahan hona chahiye
    selectedWholeFabric,
    selectedShirtBack,
    selectedPlacket,
    selectedBeltloop,
    selectedPantCuff,
    selectedPocket,
    selectedLogoMesh,
    logoImageUrl,
    logoEnabled,
    uploadedLogoTexture,
    selectedButton, // <-- Added selectedButton dependency
    selectedButtonStyle, // <-- Added selectedButtonStyle dependency
    selectedLapelStyle, // <-- Added selectedLapelStyle dependency
    selectedJacketPocket, // <-- Added selectedJacketPocket dependency
    selectedBackPocketStyle, // <-- Added selectedBackPocketStyle dependency
    selectedFrontPocketStyle, // <-- Added selectedFrontPocketStyle dependency
    selectedProduct, // <-- Added selectedProduct dependency
  ]);

  return (
    <group
      ref={groupRef}
      onPointerDown={(e) => {
        e.stopPropagation();
        setIsDragging(true);
        dragStartXRef.current = e.clientX || (e.pointer && e.pointer.x) || 0;
      }}
      onPointerUp={(e) => {
        e.stopPropagation();
        setIsDragging(false);
      }}
      onPointerOut={() => setIsDragging(false)}
      onPointerMove={(e) => {
        if (!isDragging) return;
        const x = e.clientX || (e.pointer && e.pointer.x) || 0;
        const deltaX = x - dragStartXRef.current;
        dragStartXRef.current = x;
        // accumulate angular velocity for smoother motion
        angularVelocityRef.current += deltaX * 0.003;
      }}
    >
      <primitive ref={ref} object={gltf.scene} />
    </group>
  );
}

function StudioLights() {
  const { scene } = useThree();

  useEffect(() => {
    // Enhanced key light with higher quality shadows
    const keyLight = new DirectionalLight(0xffffff, 4.0);
    keyLight.position.set(5, 5, 7);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.1;
    keyLight.shadow.camera.far = 100;
    keyLight.shadow.camera.left = -20;
    keyLight.shadow.camera.right = 20;
    keyLight.shadow.camera.top = 20;
    keyLight.shadow.camera.bottom = -20;
    keyLight.shadow.bias = -0.0001; // Reduced bias for sharper shadows
    keyLight.shadow.normalBias = 0.0005; // Reduced normal bias
    keyLight.shadow.radius = 8; // Soft shadow radius

    // Enhanced fill light
    const fillLight = new DirectionalLight(0xffffff, 1.5);
    fillLight.position.set(-5, 5, 5);
    fillLight.castShadow = true;
    fillLight.shadow.mapSize.width = 1024;
    fillLight.shadow.mapSize.height = 1024;
    fillLight.shadow.camera.near = 0.1;
    fillLight.shadow.camera.far = 50;
    fillLight.shadow.camera.left = -15;
    fillLight.shadow.camera.right = 15;
    fillLight.shadow.camera.top = 15;
    fillLight.shadow.camera.bottom = -15;
    fillLight.shadow.bias = -0.1;
    fillLight.shadow.normalBias = 0.1;
    fillLight.shadow.radius = 6;

    // Enhanced rim light
    const rimLight = new DirectionalLight(0xffffff, 1.8);
    rimLight.position.set(0, 0, 10);
    rimLight.castShadow = false;

    // Additional ambient light for better overall illumination
    const ambientLight = new DirectionalLight(0xffffff, 0.3);
    ambientLight.position.set(0, 10, 0);
    ambientLight.castShadow = false;

    scene.add(keyLight, fillLight, rimLight, ambientLight);

    return () => {
      scene.remove(keyLight, fillLight, rimLight, ambientLight);
    };
  }, [scene]);

  return null;
}

export default function App() {
  // src/App.js ya kisi bhi component me
  useEffect(() => {
    document.title = "Playmaker Suit  Customizer";
  }, []);

  // Add loading state
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // Progress states for add to cart
  const [showProgress, setShowProgress] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

  // Initialize prices from localStorage on component mount
  useEffect(() => {
    try {
      // Load saved selections and update prices
      const savedWholeFabric = localStorage.getItem(
        "suit_selectedWholeFabric"
      );
      const savedCollar = localStorage.getItem("suit_selectedCollar");
      const savedSleeve = localStorage.getItem("suit_selectedSleeve");
      const savedShirtBack = localStorage.getItem("suit_selectedShirtBack");
      const savedPlacket = localStorage.getItem("suit_selectedPlacket");
      const savedPocket = localStorage.getItem("suit_selectedPocket");
      const savedLogoMesh = localStorage.getItem("suit_selectedLogoMesh");
      const savedButton = localStorage.getItem("suit_selectedButton");

      if (savedWholeFabric) {
        const wholeFabric = JSON.parse(savedWholeFabric);
        setSelectedOptionsPrices((prev) => ({
          ...prev,
          wholeFabric: wholeFabric?.price || 0,
        }));
      }
      if (savedCollar) {
        const collar = JSON.parse(savedCollar);
        setSelectedOptionsPrices((prev) => ({
          ...prev,
          collar: collar?.price || 0,
        }));
      }
      if (savedSleeve) {
        const sleevePrice = savedSleeve.includes("4_") || savedSleeve.includes("5_") ? 25 : 0;
        setSelectedOptionsPrices((prev) => ({ ...prev, sleeve: sleevePrice }));
      }
      if (savedShirtBack) {
        try {
          const shirtBack = JSON.parse(savedShirtBack);
          setSelectedOptionsPrices((prev) => ({
            ...prev,
            shirtBack: shirtBack?.price || 0,
          }));
        } catch {
          // If not JSON, treat as string (no price)
          setSelectedOptionsPrices((prev) => ({
            ...prev,
            shirtBack: 0,
          }));
        }
      }
      if (savedPlacket) {
        try {
          const placket = JSON.parse(savedPlacket);
          setSelectedOptionsPrices((prev) => ({
            ...prev,
            placket: placket?.price || 0,
          }));
        } catch {
          // If not JSON, treat as string (no price)
          setSelectedOptionsPrices((prev) => ({
            ...prev,
            placket: 0,
          }));
        }
      }
      if (savedPocket) {
        try {
          const pocket = JSON.parse(savedPocket);
          setSelectedOptionsPrices((prev) => ({
            ...prev,
            pocket: pocket?.price || 0,
          }));
        } catch {
          // If not JSON, treat as string (no price)
          setSelectedOptionsPrices((prev) => ({
            ...prev,
            pocket: 0,
          }));
        }
      }
      if (savedLogoMesh) {
        setSelectedOptionsPrices((prev) => ({ ...prev, logo: 25 }));
      }
      // Load button pricing
      const savedButtonStyle = localStorage.getItem("suit_selectedButtonStyle");
      if (savedButtonStyle) {
        let product = null;
        if (savedProduct) {
          try {
            product = JSON.parse(savedProduct);
          } catch (err) {
            // If parsing fails, product remains null
          }
        }
        
      }
      
      // Load lapel pricing
      const savedLapelStyle = localStorage.getItem("suit_selectedLapelStyle");
      const savedProduct = localStorage.getItem("suit_selectedProduct");

      //  Lapel Pricing Logic starts here
      
      if (savedLapelStyle) {
        let product = null;
        if (savedProduct) {
          try {
            product = JSON.parse(savedProduct);
          } catch (err) {
            // If parsing fails, product remains null
          }
        }
        
        const lapelPrice = getLapelPrice(savedLapelStyle, product);
        
        setSelectedOptionsPrices((prev) => ({
          ...prev,
          lapel: lapelPrice,
        }));
      }
      
      // Load jacket pocket pricing
      const savedJacketPocket = localStorage.getItem("suit_selectedJacketPocket");
      if (savedJacketPocket) {
        try {
          const jacketPocket = JSON.parse(savedJacketPocket);
          let product = null;
          if (savedProduct) {
            try {
              product = JSON.parse(savedProduct);
            } catch (err) {
              // If parsing fails, product remains null
            }
          }
          
          const jacketPocketPrice = getJacketPocketPrice(jacketPocket?.key, product);
          
          setSelectedOptionsPrices((prev) => ({
            ...prev,
            jacketPocket: jacketPocketPrice,
          }));
        } catch (err) {
          // If parsing fails, use default price
        }
      }
    } catch (err) {
    }
  }, []);

  // Add state for tracking prices
  const [selectedOptionsPrices, setSelectedOptionsPrices] = useState({
    fabric: 0,
    wholeFabric: 0,
    collar: 0,
    sleeve: 0,
    shirtBack: 0,
    placket: 0,
    beltloop: 0,
    pocket: 0,
    logo: 0,
    button: 0,
    lapel: 0,
    jacketPocket: 0,
  });
  const [showFrontView, setShowFrontView] = useState(true); // New state for front/back view
  const [isPocketSelected, setIsPocketSelected] = useState(false); // State for pocket zoom effect

  const [fabricsData, setFabricsData] = useState([]);
  const [collarsData, setCollarsData] = useState([]);
  const [liningData, setLiningData] = useState([]);
  const [buttonThreadColorData, setButtonThreadColorData] = useState([]);
  const [selectedCollar, setSelectedCollar] = useState(() => {
    // Load from localStorage on component mount
    try {
      const savedCollar = localStorage.getItem("suit_selectedCollar");
      if (savedCollar) {
        return JSON.parse(savedCollar);
      }
      return null; // Will be set after collars are loaded
    } catch (err) {
      return null;
    }
  });
  const [selectedButton, setSelectedButton] = useState(() => {
    // Load from localStorage on component mount
    try {
      const savedButton = localStorage.getItem("suit_selectedButton");
      if (savedButton) {
        return JSON.parse(savedButton);
      }
      return null; // Will be set after buttons are loaded
    } catch (err) {
      return null;
    }
  });


  const [selectedButtonStyle, setSelectedButtonStyle] = useState(() => {
    // Load from localStorage on component mount
    try {
      return localStorage.getItem("suit_selectedButtonStyle") || "1 Button, Single Breasted";
    } catch (err) {
      return "1 Button, Single Breasted";
    }
  });

  // Jacket Pocket state
  const [selectedJacketPocket, setSelectedJacketPocket] = useState(() => {
    // Load from localStorage on component mount
    try {
      const savedJacketPocket = localStorage.getItem("suit_selectedJacketPocket");
      if (savedJacketPocket) {
        return JSON.parse(savedJacketPocket);
      }
      return null; // Will be set to default after jacket pockets are loaded
    } catch (err) {
      return null;
    }
  });

  // Jacket Lining state
  const [selectedLining, setSelectedLining] = useState(() => {
    // Load from localStorage on component mount
    try {
      const savedLining = localStorage.getItem("suit_selectedLining");
      if (savedLining) {
        return JSON.parse(savedLining);
      }
      return null; // Will be set to default after linings are loaded
    } catch (err) {
      return null;
    }
  });

  // Button and Thread Color state
  const [selectedButtonThreadColor, setSelectedButtonThreadColor] = useState(() => {
    // Load from localStorage on component mount
    try {
      const savedButtonThreadColor = localStorage.getItem("suit_selectedButtonThreadColor");
      if (savedButtonThreadColor) {
        return JSON.parse(savedButtonThreadColor);
      }
      return null; // Will be set to default after fabrics are loaded
    } catch (err) {
      return null;
    }
  });

  // Set default button/thread color if none is selected
  useEffect(() => {
    if (!selectedButtonThreadColor && buttonThreadColorData.length > 0) {
      setSelectedButtonThreadColor(buttonThreadColorData[0]); // Default to first option
    }
  }, [selectedButtonThreadColor, buttonThreadColorData]);

  // Set default lining if none is selected
  useEffect(() => {
    if (!selectedLining && liningData.length > 0) {
      setSelectedLining(liningData[0]); // Default to first option
    }
  }, [selectedLining, liningData]);

  // Jacket Pocket data with proper image URLs
  const jacketPocketData = [
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

  // Set default jacket pocket if none is selected
  useEffect(() => {
    if (!selectedJacketPocket && jacketPocketData.length > 0) {
      setSelectedJacketPocket(jacketPocketData[0]); // Default to first option
    }
  }, [selectedJacketPocket, jacketPocketData]);

  // Handle jacket pocket selection
  const handleJacketPocketSelection = (pocket) => {
    setSelectedJacketPocket(pocket);
    
    // Use centralized jacket pocket pricing function
    const jacketPocketPrice = getJacketPocketPrice(pocket?.key, selectedProduct);
    
    setSelectedOptionsPrices((prev) => ({
      ...prev,
      jacketPocket: jacketPocketPrice,
    }));
    
    // Save to localStorage
    try {
      localStorage.setItem("suit_selectedJacketPocket", JSON.stringify(pocket));
    } catch (err) {
      console.error("Failed to save jacket pocket selection:", err);
    }
  };

  // Handle jacket lining selection
  const handleLiningSelection = (lining) => {
    setSelectedLining(lining);
    
    // Save to localStorage
    try {
      localStorage.setItem("suit_selectedLining", JSON.stringify(lining));
    } catch (err) {
      console.error("Failed to save lining selection:", err);
    }
  };

  const [selectedLapelStyle, setSelectedLapelStyle] = useState(() => {
    try {
      return localStorage.getItem("suit_selectedLapelStyle") || "Notch Lapel";
    } catch (err) {
      return "Notch Lapel";
    }
  });

  const [selectedBackPocketStyle, setSelectedBackPocketStyle] = useState(() => {
    // Load from localStorage on component mount
    try {
      return localStorage.getItem("suit_selectedBackPocketStyle") || "Single";
    } catch (err) {
      return "Single";
    }
  });


  // Product state
  const [selectedProduct, setSelectedProduct] = useState(() => {
    // Load from localStorage on component mount
    try {
      const savedProduct = localStorage.getItem("suit_selectedProduct");
      if (savedProduct) {
        return JSON.parse(savedProduct);
      }
      return null; // Will be set to default after products are loaded
    } catch (err) {
      return null;
    }
  });

  // Product data
  const productData = [
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

  // Set default product if none is selected
  useEffect(() => {
    if (!selectedProduct && productData.length > 0) {
      setSelectedProduct(productData[0]); // Default to Two Piece Suit
    }
  }, [selectedProduct, productData]);

  // Handle lapel style selection
  const handleLapelStyleSelection = (style) => {
    setSelectedLapelStyle(style);
    
    // Use centralized lapel pricing function
    const lapelPrice = getLapelPrice(style, selectedProduct);
    
    setSelectedOptionsPrices((prev) => ({
      ...prev,
      lapel: lapelPrice,
    }));
    
    // Save to localStorage
    try {
      localStorage.setItem("suit_selectedLapelStyle", style);
    } catch (err) {}
  };

  // Calculate total price - Base price + sidebar options with pricing
  const calculateTotalPrice = () => {
    // Get base price from selected product
    const basePrice = parseFloat(selectedProduct?.basePrice) || 0;
    
    // Only include prices for sidebar options that actually have pricing
    const wholeFabricPrice = parseFloat(selectedOptionsPrices.wholeFabric) || 0;
    const pocketPrice = parseFloat(selectedOptionsPrices.pocket) || 0;
    const beltloopPrice = parseFloat(selectedOptionsPrices.beltloop) || 0;
    const pantCuffPrice = parseFloat(selectedOptionsPrices.pantCuff) || 0;
    const buttonPrice = parseFloat(selectedOptionsPrices.button) || 0;
    const lapelPrice = parseFloat(selectedOptionsPrices.lapel) || 0;
    const jacketPocketPrice = parseFloat(selectedOptionsPrices.jacketPocket) || 0;

    // Calculate total - base price + options with actual pricing
    const totalPrice =
      basePrice +
      wholeFabricPrice +
      pocketPrice +
      beltloopPrice +
      pantCuffPrice +
      buttonPrice +
      lapelPrice +
      jacketPocketPrice;

    return totalPrice;
  };

  // Monitor product changes and update lapel, jacket pocket, and button pricing
  useEffect(() => {
    if (selectedLapelStyle) {
      const lapelPrice = getLapelPrice(selectedLapelStyle, selectedProduct);
      setSelectedOptionsPrices((prev) => ({
        ...prev,
        lapel: lapelPrice,
      }));
    }
    
    if (selectedJacketPocket) {
      const jacketPocketPrice = getJacketPocketPrice(selectedJacketPocket?.key, selectedProduct);
      setSelectedOptionsPrices((prev) => ({
        ...prev,
        jacketPocket: jacketPocketPrice,
      }));
    }
    
  }, [selectedProduct, selectedLapelStyle, selectedJacketPocket, selectedButtonStyle]);

  const [selectedFrontPocketStyle, setSelectedFrontPocketStyle] = useState(
    () => {
      // Load from localStorage on component mount
      try {
        return (
          localStorage.getItem("suit_selectedFrontPocketStyle") || "None"
        );
      } catch (err) {
        return "None";
      }
    }
  );

  const [repeatScale, setRepeatScale] = useState(() => {
    // Load from localStorage on component mount
    try {
      return parseFloat(localStorage.getItem("suit_repeatScale")) || 1;
    } catch (err) {
      return 1;
    }
  });
  const [showItalianCollar, setShowItalianCollar] = useState(() => {
    // Load from localStorage on component mount
    try {
      return localStorage.getItem("suit_showItalianCollar") === "true";
    } catch (err) {
      return false;
    }
  });
  const [showFranchCollar, setShowFranchCollar] = useState(() => {
    // Load from localStorage on component mount
    try {
      return localStorage.getItem("suit_showFranchCollar") === "true";
    } catch (err) {
      return false;
    }
  });
  const [collarFabricTextureUrl, setCollarFabricTextureUrl] = useState(() => {
    // Load from localStorage on component mount
    try {
      return localStorage.getItem("suit_collarFabricTextureUrl") || null;
    } catch (err) {
      return null;
    }
  });
  const [addToCartMessage, setAddToCartMessage] = useState("");
  const [selectedWholeFabric, setSelectedWholeFabric] = useState(() => {
    // Load from localStorage on component mount
    try {
      const savedWholeFabric = localStorage.getItem(
        "suit_selectedWholeFabric"
      );
      if (savedWholeFabric) {
        return JSON.parse(savedWholeFabric);
      }
      return null; // Will be set after fabrics are loaded
    } catch (err) {
      return null;
    }
  });
  const [selectedShirtBack, setSelectedShirtBack] = useState(() => {
    // Load from localStorage on component mount
    try {
      return localStorage.getItem("suit_selectedShirtBack") || "Plan";
    } catch (err) {
      return "Plan";
    }
  });
  const [selectedPlacket, setSelectedPlacket] = useState(() => {
    // Load from localStorage on component mount
    try {
      return localStorage.getItem("suit_selectedPlacket") || "SinglePlacket";
    } catch (err) {
      return "SinglePlacket";
    }
  });
  const [selectedBeltloop, setSelectedBeltloop] = useState(() => {
    // Load from localStorage on component mount
    try {
      return localStorage.getItem("suit_selectedBeltloop") || "None";
    } catch (err) {
      return "None";
    }
  });
  const [selectedPantCuff, setSelectedPantCuff] = useState(() => {
    // Load from localStorage on component mount
    try {
      return localStorage.getItem("suit_selectedPantCuff") || "Regular";
    } catch (err) {
      return "Regular";
    }
  });
  const [selectedPocket, setSelectedPocket] = useState(() => {
    // Load from localStorage on component mount
    try {
      return localStorage.getItem("suit_selectedPocket") || null;
    } catch (err) {
      return null;
    }
  });
  const [selectedLogoMesh, setSelectedLogoMesh] = useState(() => {
    // Load from localStorage on component mount
    try {
      return localStorage.getItem("suit_selectedLogoMesh") || null;
    } catch (err) {
      return null;
    }
  });
  const [logoImageUrl, setLogoImageUrl] = useState(() => {
    // Load from localStorage on component mount
    try {
      return localStorage.getItem("suit_logoImageDataUrl") || null;
    } catch (err) {
      return null;
    }
  });
  const [logoEnabled, setLogoEnabled] = useState(() => {
    // Load from localStorage on component mount
    try {
      return localStorage.getItem("suit_logoEnabled") === "true";
    } catch (err) {
      return false;
    }
  });

  // Notes state
  const [selectedNotes, setSelectedNotes] = useState(() => {
    // Load from localStorage on component mount
    try {
      return localStorage.getItem("suit_selectedNotes") || "";
    } catch (err) {
      return "";
    }
  });

  // Static placket data (similar to how collars work)
  const placketData = [
    {
      name: "Single Placket",
      key: "SinglePlacket",
      imageUrl: "/packlet/singleplacklet.svg",
      price: 0,
    },
    {
      name: "Box Placklet",
      key: "BoxPlacket",
      imageUrl: "/packlet/box_placklet.svg",
      price: 5,
    },
    {
      name: "Box Placket no Button",
      key: "boxPlackletNoButton",
      imageUrl: "/packlet/hiddenbtn.svg",
      price: 0,
    },
  ];

  // Static beltloop data
  const beltloopData = [
    {
      name: "None",
      key: "None",
      imageUrl: "/placeholder.png",
      price: 0,
    },
    {
      name: "Single",
      key: "Single",
      imageUrl: "/placeholder.png",
      price: 0,
    },
    {
      name: "Double",
      key: "Double",
      imageUrl: "/placeholder.png",
      price: 0,
    },
    {
      name: "Modern",
      key: "Modern",
      imageUrl: "/placeholder.png",
      price: 0,
    },
    {
      name: "None + Button Side Adjusters",
      key: "NoneButtonSideAdjusters",
      imageUrl: "/placeholder.png",
      price: 0,
    },
    {
      name: "None + Buckle Side Adjusters",
      key: "NoneBtnSideAdjusters",
      imageUrl: "/placeholder.png",
      price: 0,
    },
  ];


  // Clear old placket localStorage value and set new default
  useEffect(() => {
    try {
      // Force clear localStorage and set default
      localStorage.removeItem("suit_selectedPlacket");
      const defaultPlacket = placketData[0];
      setSelectedPlacket(defaultPlacket.key);
      localStorage.setItem("suit_selectedPlacket", defaultPlacket.key);
    } catch (err) {
    }
  }, []);

  useEffect(() => {
    try {
      // Force clear localStorage and set default
    } catch (err) {
    }
  }, []);

  const fetchFabrics = async () => {
    try {
      setLoadingProgress(30);
      const response = await fetchFabricsData();
      const fabrics = response.data;
      setFabricsData(fabrics);
      if (fabrics.length > 0) {
        if (!selectedWholeFabric) {
          setSelectedWholeFabric(fabrics[0]);
          // Update price for default selection
          const wholeFabricPrice = parseFloat(fabrics[0]?.price) || 0;
          setSelectedOptionsPrices((prev) => ({
            ...prev,
            wholeFabric: wholeFabricPrice,
          }));
        }
      }
    } catch (error) {
      console.error('Failed to fetch fabrics:', error);
      // Set empty array to prevent app crash
      setFabricsData([]);
    }
  };

  const fetchCollars = async () => {
    try {
      setLoadingProgress(60);
      const response = await fetchCollarsData();
      const collars = response.data;
      setCollarsData(collars);
      if (collars && collars.length > 0) {
        // Only set default if no saved selection exists
        if (!selectedCollar) {
          setSelectedCollar(collars[0]);
          setShowItalianCollar(collars[0].name === "Italian One Button");
          setShowFranchCollar(collars[0].name === "Franch Collar");

          // Update price for default collar selection
          const collarPrice = parseFloat(collars[0]?.price) || 0;
          setSelectedOptionsPrices((prev) => ({
            ...prev,
            collar: collarPrice,
          }));
        }
      }
    } catch (error) {
      console.error('Failed to fetch collars:', error);
      // Set empty array to prevent app crash
      setCollarsData([]);
    }
  };

  const fetchLining = async () => {
    try {
      setLoadingProgress(80);
      const response = await fetchLiningData();
      const lining = response.data;
      setLiningData(lining);
      if (lining && lining.length > 0) {
        // Only set default if no saved selection exists
        if (!selectedLining) {
          setSelectedLining(lining[0]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch lining data:", error);
      // Set empty array to prevent app crash
      setLiningData([]);
    }
  };

  const fetchButtonThreadColor = async () => {
    try {
      setLoadingProgress(85);
      const response = await fetchButtonThreadColorData();

      // Log the response to debug
      console.log('Button Thread Color API Response:', response);
      console.log('Button Thread Color Data:', response.data);

      const buttonThreadColor = response.data;
      setButtonThreadColorData(buttonThreadColor);
      if (buttonThreadColor && buttonThreadColor.length > 0) {
        // Only set default if no saved selection exists
        if (!selectedButtonThreadColor) {
          setSelectedButtonThreadColor(buttonThreadColor[0]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch button thread color data:", error);
      // Set empty array to prevent app crash
      setButtonThreadColorData([]);
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await Promise.all([fetchFabrics(), fetchCollars(), fetchLining(), fetchButtonThreadColor()]);
        setLoadingProgress(100);
        // Small delay to show 100% completion
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Failed to initialize app:", error);
        // Even if API calls fail, continue with empty data
        setLoadingProgress(100);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Debug: Log total price whenever prices change
  useEffect(() => {
    const total = calculateTotalPrice();
  }, [selectedOptionsPrices]);

  const randomColor = () =>
    "#" +
    Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0");

  // Update price when whole fabric changes
  const setSelectedWholeFabricWithPersistence = (fabric) => {
    setSelectedWholeFabric(fabric);
    // Update price tracking
    setSelectedOptionsPrices((prev) => ({
      ...prev,
      wholeFabric: fabric?.price || 0,
    }));
    // Save to localStorage
    try {
      localStorage.setItem("suit_selectedWholeFabric", JSON.stringify(fabric));
    } catch (err) {}
  };

  // Update price when collar changes
  const handleCollarSelection = (collar) => {
    setSelectedCollar(collar);
    // Update Italian collar visibility based on the selected collar
    setShowItalianCollar(collar.name === "Italian One Button");
    setShowFranchCollar(collar.name === "Franch Collar");
    // Update price tracking
    setSelectedOptionsPrices((prev) => ({
      ...prev,
      collar: collar?.price || 0,
    }));
    // Save to localStorage
    try {
      localStorage.setItem("suit_selectedCollar", JSON.stringify(collar));
      localStorage.setItem(
        "suit_showItalianCollar",
        (collar.name === "Italian One Button").toString()
      );
      localStorage.setItem(
        "suit_showFranchCollar",
        (collar.name === "Franch Collar").toString()
      );
    } catch (err) {}
  };

  const handleButtonThreadColorSelection = (fabric) => {
    setSelectedButtonThreadColor(fabric);
    // No price tracking needed since buttons/threads use selected fabric
    // Save to localStorage
    try {
      localStorage.setItem("suit_selectedButtonThreadColor", JSON.stringify(fabric));
    } catch (err) {}
  };

  // Update price when shirt back changes
  const setSelectedShirtBackWithPersistence = (shirtBack) => {
    setSelectedShirtBack(shirtBack);
    // Update price tracking
    setSelectedOptionsPrices((prev) => ({
      ...prev,
      shirtBack: shirtBack?.price || 0,
    }));
    // Save to localStorage
    try {
      localStorage.setItem("suit_selectedShirtBack", shirtBack);
    } catch (err) {}
  };

  // Update price when placket changes
  const setSelectedPlacketWithPersistence = (placket) => {
    setSelectedPlacket(placket);
    // Update price tracking
    setSelectedOptionsPrices((prev) => ({
      ...prev,
      placket: placket?.price || 0,
    }));
    // Save to localStorage
    try {
      localStorage.setItem("suit_selectedPlacket", placket);
    } catch (err) {}
  };

  // Update price when fabric effect changes
  const setSelectedBeltloopWithPersistence = (beltloop) => {
    setSelectedBeltloop(beltloop);
    // Save to localStorage
    try {
      localStorage.setItem("suit_selectedBeltloop", beltloop);
    } catch (err) {}
  };

  // Update price when pant cuff changes
  const setSelectedPantCuffWithPersistence = (pantCuff) => {
    setSelectedPantCuff(pantCuff);
    // Save to localStorage
    try {
      localStorage.setItem("suit_selectedPantCuff", pantCuff);
    } catch (err) {}
  };

  // Update price when pocket changes
  const setSelectedPocketWithPersistence = (pocket) => {
    setSelectedPocket(pocket);
    // Save to localStorage
    try {
      localStorage.setItem("suit_selectedPocket", JSON.stringify(pocket));
    } catch (err) {}
  };

  // Product selection with persistence
  const setSelectedProductWithPersistence = (product) => {
    setSelectedProduct(product);
    
    // Update lapel, jacket pocket, and button pricing based on new product selection
    if (selectedLapelStyle) {
      const lapelPrice = getLapelPrice(selectedLapelStyle, product);
      setSelectedOptionsPrices((prev) => ({
        ...prev,
        lapel: lapelPrice,
      }));
    }
    
    if (selectedJacketPocket) {
      const jacketPocketPrice = getJacketPocketPrice(selectedJacketPocket?.key, product);
      setSelectedOptionsPrices((prev) => ({
        ...prev,
        jacketPocket: jacketPocketPrice,
      }));
    }
    
    
    // Save to localStorage
    try {
      localStorage.setItem("suit_selectedProduct", JSON.stringify(product));
    } catch (err) {}
  };

  // Update price when logo changes
  const handleLogoSelection = (meshName) => {
    setSelectedLogoMesh(meshName);
    // Logo pricing logic - you can adjust this price
    const logoPrice = meshName ? 25 : 0; // Logo costs extra
    setSelectedOptionsPrices((prev) => ({
      ...prev,
      logo: logoPrice,
    }));
    // Save to localStorage
    try {
      localStorage.setItem("suit_selectedLogoMesh", meshName || "");
    } catch (err) {}
  };

  // Handle mesh visibility changes for pant cuff
  const handleMeshVisibility = (meshName, isVisible) => {
    // This function will be called by the pant cuff component
    // to control mesh visibility in the 3D model
    console.log(`Mesh ${meshName} visibility: ${isVisible}`);
    // You can add mesh visibility logic here if needed
  };

  // Update price when button changes
  const handleButtonSelection = (button) => {
    setSelectedButton(button);
    // Update price tracking
    setSelectedOptionsPrices((prev) => ({
      ...prev,
      button: button?.price || 0,
    }));
    // Save to localStorage
    try {
      localStorage.setItem("suit_selectedButton", JSON.stringify(button));
    } catch (err) {}
  };

  // Handle button style selection
  const handleButtonStyleSelection = (style) => {
    setSelectedButtonStyle(style);
    
    // Save to localStorage
    try {
      localStorage.setItem("suit_selectedButtonStyle", style);
    } catch (err) {
      console.error("Failed to save button style selection:", err);
    }
  };


  // Handle back pocket style selection
  const handleBackPocketStyleSelection = (style) => {
    setSelectedBackPocketStyle(style);
    // Automatically switch to SuitTrouser when back pocket is selected
    const trouserProduct = productData.find(product => product.key === "SuitTrouser");
    if (trouserProduct) {
      setSelectedProduct(trouserProduct);
      // Save to localStorage
      try {
        localStorage.setItem("suit_selectedProduct", JSON.stringify(trouserProduct));
      } catch (err) {}
    }
    // Automatically switch to back view when back pocket is selected
    setShowFrontView(false);
    // Trigger zoom effect
    setIsPocketSelected(true);
    // Reset zoom effect after 2 seconds
    setTimeout(() => setIsPocketSelected(false), 2000);
    // Save to localStorage
    try {
      localStorage.setItem("suit_selectedBackPocketStyle", style);
    } catch (err) {}
  };

  // Handle front pocket style selection
  const handleFrontPocketStyleSelection = (style) => {
    setSelectedFrontPocketStyle(style);
    // Automatically switch to SuitTrouser when front pocket is selected
    const trouserProduct = productData.find(product => product.key === "SuitTrouser");
    if (trouserProduct) {
      setSelectedProduct(trouserProduct);
      // Save to localStorage
      try {
        localStorage.setItem("suit_selectedProduct", JSON.stringify(trouserProduct));
      } catch (err) {}
    }
    // Automatically switch to front view when front pocket is selected
    setShowFrontView(true);
    // Trigger zoom effect
    setIsPocketSelected(true);
    // Reset zoom effect after 2 seconds
    setTimeout(() => setIsPocketSelected(false), 2000);
    // Save to localStorage
    try {
      localStorage.setItem("suit_selectedFrontPocketStyle", style);
    } catch (err) {}
  };


  // Add missing functions
  const setRepeatScaleWithPersistence = (scale) => {
    setRepeatScale(scale);
    try {
      localStorage.setItem("suit_repeatScale", scale.toString());
    } catch (err) {}
  };

  const setCollarFabricTextureUrlWithPersistence = (url) => {
    setCollarFabricTextureUrl(url);
    try {
      localStorage.setItem("suit_collarFabricTextureUrl", url || "");
    } catch (err) {}
  };

  // Utility function to clear all saved preferences
  const clearAllSavedPreferences = () => {
    try {
      localStorage.removeItem("suit_selectedCollar");
      localStorage.removeItem("suit_selectedButton");
      localStorage.removeItem("suit_selectedButtonStyle");

      localStorage.removeItem("suit_repeatScale");
      localStorage.removeItem("suit_showItalianCollar");
      localStorage.removeItem("suit_showFranchCollar");
      localStorage.removeItem("suit_collarFabricTextureUrl");
      localStorage.removeItem("suit_selectedWholeFabric");
      localStorage.removeItem("suit_selectedShirtBack");
      localStorage.removeItem("suit_selectedPlacket");
      localStorage.removeItem("suit_selectedBeltloop");
      localStorage.removeItem("suit_selectedPantCuff");
      localStorage.removeItem("suit_selectedPocket");
      localStorage.removeItem("suit_selectedSleeve");
      localStorage.removeItem("suit_selectedLogoMesh");
      localStorage.removeItem("suit_logoImageDataUrl");
      localStorage.removeItem("suit_logoEnabled");
      localStorage.removeItem("suit_selectedProduct");
      localStorage.removeItem("suit_selectedLapelStyle");
      localStorage.removeItem("suit_selectedJacketPocket");
      localStorage.removeItem("suit_selectedBackPocketStyle");
      localStorage.removeItem("suit_selectedFrontPocketStyle");
      localStorage.removeItem("suit_selectedNotes");
    } catch (err) {
      console.error("Failed to clear localStorage:", err);
    }
  };

  // Helper function to get sleeve display name
  const getSleeveDisplayName = (sleeveKey) => {
    const sleeveData = {
      "3_kissing_buttons": "3 Kissing Buttons",
      "3_standard_button": "3 Standard Button", 
      "4_kissing_button": "4 Kissing Button",
      "4_standard_buttons": "4 Standard Buttons",
      "5_kissing_button": "5 Kissing Button",
      "5_standard_buttons": "5 Standard Buttons"
    };
    return sleeveData[sleeveKey] || "Select Sleeve Button Style";
  };

  // Helper function to get pocket display name
  const getPocketDisplayName = (pocketKey) => {
    return pocketKey === "yes" ? "With Pocket" : "No Pocket";
  };

  // Helper function to get product display name
  const getProductDisplayName = (productKey) => {
    const productData = {
      "TwoPieceSuit": "Two Piece Suit",
      "SuitJacket": "Suit Jacket", 
      "SuitTrouser": "Suit Trouser"
    };
    return productData[productKey] || "Select Product Type";
  };


  // Function to generate cropped image as blob
  const generateCroppedImageBlob = () => {
    return new Promise((resolve, reject) => {
      try {
        // Get the canvas element from the Three.js renderer
        const canvas = document.querySelector('canvas');
        if (!canvas) {
          reject(new Error('Canvas not found'));
          return;
        }

        // Create a new canvas for cropping
        const croppedCanvas = document.createElement('canvas');
        const ctx = croppedCanvas.getContext('2d');
        
        // Set cropped canvas size based on product type
        const cropWidth = 500;  // Width of the cropped area
        
        // Dynamic crop height based on product type (same as download function)
        let cropHeight;
        if (selectedProduct?.key === "TwoPieceSuit") {
          cropHeight = 900; // Full suit - taller
        } else if (selectedProduct?.key === "SuitTrouser") {
          cropHeight = 600; // Trouser only - shorter
        } else if (selectedProduct?.key === "SuitJacket") {
          cropHeight = 600; // Jacket only - shorter
        } else {
          cropHeight = 800; // Default height
        }
        
        croppedCanvas.width = cropWidth;
        croppedCanvas.height = cropHeight;
        
        // Calculate crop position (center the model)
        const sourceX = (canvas.width - cropWidth) / 2;
        const sourceY = 0; // Crop from top (same as download function)
        
        // Draw the cropped portion
        ctx.drawImage(
          canvas,
          sourceX, sourceY, cropWidth, cropHeight, // Source rectangle
          0, 0, cropWidth, cropHeight // Destination rectangle
        );
        
        // Convert cropped canvas to blob with transparent background
        croppedCanvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob from cropped canvas'));
          }
        }, 'image/png'); // PNG format for transparency
        
      } catch (error) {
        reject(error);
      }
    });
  };

  // Simulate realistic progress animation
  const simulateProgress = ({ from, to, duration, updateMessage, message }) => {
    const startTime = Date.now();
    const startProgress = from;
    const progressRange = to - from;
    
    setAddToCartMessage(updateMessage);
    
    const animateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progressRatio = Math.min(elapsed / duration, 1);
      
      // Use easing function for more natural progress
      const easedProgress = 0.5 * (1 - Math.cos(Math.PI * progressRatio));
      const currentProgress = Math.round(startProgress + (progressRange * easedProgress));
      
      setProgressValue(currentProgress);
      
      if (progressRatio < 1) {
        // Continue animation
        setTimeout(animateProgress, 50);
      } else {
        // Reached target, now wait for backend response
        setAddToCartMessage(message);
        
        // Simulate waiting for backend response
        simulateBackendWaiting();
      }
    };
    
    animateProgress();
  };

  // Simulate backend processing (90%-100%)
  const simulateBackendWaiting = () => {
    let progress = 90;
    
    // Slowly progress from 90% to 95% while waiting
    const waitingInterval = setInterval(() => {
      progress = Math.min(progress + Math.random() * 0.5, 95);
      setProgressValue(Math.round(progress));
      
      // Random messages while waiting
      const messages = [
        "Adding to cart...",
        "Processing order...", 
        "Creating product...",
        "Finalizing customization...",
        "Almost done..."
      ];
      
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setAddToCartMessage(randomMessage);
      
    }, 800 + Math.random() * 1200); // Random interval between 800-2000ms
    
    // Complete after realistic backend response time
    setTimeout(() => {
      clearInterval(waitingInterval);
      
      // Final completion animation
      const finalAnimation = () => {
        progress = Math.min(progress + 1, 100);
        setProgressValue(progress);
        
        if (progress < 100) {
          setTimeout(finalAnimation, 150);
        } else {
          setAddToCartMessage("Product added to cart successfully!");
          setTimeout(() => {
            setShowProgress(false);
            setAddToCartMessage("");
          }, 1500);
        }
      };
      
      finalAnimation();
      
    }, 3000 + Math.random() * 2000); // Random completion time between 3-5 seconds
  };

  const handleAddToCart = async () => {
    try {
      // Show full screen progress
      setAddToCartMessage("Generating product image...");
      setShowProgress(true);
      setProgressValue(10);
      
      // Generate cropped image blob
      const imageBlob = await generateCroppedImageBlob();
      setProgressValue(30);
      setAddToCartMessage("Uploading image...");
      
      // Convert blob to base64 for API
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result; // PNG with transparent background
        setProgressValue(50);
        setAddToCartMessage("Creating product...");
        
        const title = `Custom Suit - ${
          selectedWholeFabric?.name || "Default Fabric"
        }`;

        const description =
          `A custom-designed Suit with the following options:<br/><br/>` +
          `Product Type: ${getProductDisplayName(selectedProduct?.key)} (SDG ${selectedProduct?.basePrice || 0})<br/>` +
          `Suit Fabric: ${selectedWholeFabric?.name || "N/A"}<br/>` +
          `Sleeve Style: ${getSleeveDisplayName(selectedSleeve)}<br/>` +
          `Button Style: ${selectedButtonStyle || "N/A"}${selectedOptionsPrices.button > 0 ? ` (SDG ${selectedOptionsPrices.button})` : ""}<br/>` +
          `Lapel Style: ${selectedLapelStyle || "N/A"}${selectedOptionsPrices.lapel > 0 ? ` (SDG ${selectedOptionsPrices.lapel})` : ""}<br/>` +
          `Jacket Pocket: ${selectedJacketPocket?.name || "N/A"}${selectedOptionsPrices.jacketPocket > 0 ? ` (SDG ${selectedOptionsPrices.jacketPocket})` : ""}<br/>` +
          `Beltloop: ${selectedBeltloop || "N/A"}<br/>` +
          `Pant Cuff: ${selectedPantCuff || "N/A"}${selectedOptionsPrices.pantCuff > 0 ? ` (SDG ${selectedOptionsPrices.pantCuff})` : ""}<br/>` +
          `Pocket: ${getPocketDisplayName(selectedPocket)}<br/>` +
          `Back Pocket Style: ${selectedBackPocketStyle || "N/A"}<br/>` +
          `Front Pocket Style: ${selectedFrontPocketStyle || "N/A"}<br/>` +
          `Notes: ${selectedNotes || "No notes added"}<br/>` +
          `Final Price: SDG ${calculateTotalPrice()}`;

        const customizationData = {
          type: "ADD_CUSTOM_SHIRT_TO_CART",
          payload: {
            title: title,
            description: description,
            price: calculateTotalPrice(),
            image: base64Image, // Base64 encoded PNG with transparent background
            customization_details: {
              "Product Type": `${getProductDisplayName(selectedProduct?.key)} (SDG ${selectedProduct?.basePrice || 0})`,
              "Suit Fabric": selectedWholeFabric?.name || "N/A",
              "Sleeve Style": getSleeveDisplayName(selectedSleeve),
              "Button Style": `${selectedButtonStyle || "N/A"}${selectedOptionsPrices.button > 0 ? ` (SDG ${selectedOptionsPrices.button})` : ""}`,
              "Lapel Style": `${selectedLapelStyle || "N/A"}${selectedOptionsPrices.lapel > 0 ? ` (SDG ${selectedOptionsPrices.lapel})` : ""}`,
              "Jacket Pocket": `${selectedJacketPocket?.name || "N/A"}${selectedOptionsPrices.jacketPocket > 0 ? ` (SDG ${selectedOptionsPrices.jacketPocket})` : ""}`,
              "Beltloop": selectedBeltloop || "N/A",
              "Pant Cuff": `${selectedPantCuff || "N/A"}${selectedOptionsPrices.pantCuff > 0 ? ` (SDG ${selectedOptionsPrices.pantCuff})` : ""}`,
              "Pocket": getPocketDisplayName(selectedPocket),
              "Back Pocket Style": selectedBackPocketStyle || "N/A",
              "Front Pocket Style": selectedFrontPocketStyle || "N/A",
              "Notes": selectedNotes || "No notes added",
              "Base Price": selectedProduct?.basePrice || 0,
              "Final Price": calculateTotalPrice()
            },
          },
        };

        // Send data to the parent window (Shopify) using postMessage
        window.parent.postMessage(customizationData, "*");

        // Simulate realistic progress from 50% to 90%
        simulateProgress({
          from: 50,
          to: 90,
          duration: 3000, // 3 seconds
          updateMessage: "Processing customization data...",
          message: "Sending to backend..."
        });
      };
      
      reader.readAsDataURL(imageBlob);
      
    } catch (error) {
      console.error('Error generating product image:', error);
      setAddToCartMessage("Error generating product image. Please try again.");
      setShowProgress(false);
    }
  };

  // ...Sleeve Start..
  const [selectedSleeve, setSelectedSleeve] = useState(() => {
    // Load from localStorage on component mount
    try {
      return localStorage.getItem("suit_selectedSleeve") || "3_standard_button";
    } catch (err) {
      return "3_standard_button";
    }
  });

  const handleSleeveSelection = (sleeveKey) => {
    setSelectedSleeve(sleeveKey);
    // Save to localStorage
    try {
      localStorage.setItem("suit_selectedSleeve", sleeveKey);
    } catch (err) {}
  };

  // Wrapper function for sleeve selection with persistence
  const setSelectedSleeveWithPersistence = (sleeveKey) => {
    setSelectedSleeve(sleeveKey);
    // Sleeve button pricing logic - you can adjust these prices
    const sleevePrice = sleeveKey.includes("4_") || sleeveKey.includes("5_") ? 25 : 0; // 4+ buttons cost extra
    setSelectedOptionsPrices((prev) => ({
      ...prev,
      sleeve: sleevePrice,
    }));
    // Save to localStorage
    try {
      localStorage.setItem("suit_selectedSleeve", sleeveKey);
    } catch (err) {}
  };

  // Wrapper function for notes selection with persistence
  const setSelectedNotesWithPersistence = (notes) => {
    setSelectedNotes(notes);
    // Save to localStorage
    try {
      localStorage.setItem("suit_selectedNotes", notes);
    } catch (err) {}
  };

  const setSelectedButtonThreadColorWithPersistence = (fabric) => {
    setSelectedButtonThreadColor(fabric);
    // Save to localStorage
    try {
      localStorage.setItem("suit_selectedButtonThreadColor", JSON.stringify(fabric));
    } catch (err) {}
  };

  // Wrapper function for Italian collar with persistence
  const setShowItalianCollarWithPersistence = (show) => {
    setShowItalianCollar(show);
    // Save to localStorage
    try {
      localStorage.setItem("suit_showItalianCollar", show.toString());
    } catch (err) {}
  };

  // Wrapper function for French collar with persistence
  const setShowFranchCollarWithPersistence = (show) => {
    setShowFranchCollar(show);
    // Save to localStorage
    try {
      localStorage.setItem("suit_showFranchCollar", show.toString());
    } catch (err) {}
  };

  // Wrapper function for logo image URL with persistence
  const setLogoImageUrlWithPersistence = (url) => {
    setLogoImageUrl(url);
    // Save to localStorage
    try {
      localStorage.setItem("suit_logoImageDataUrl", url || "");
    } catch (err) {}
  };

  // Wrapper function for logo enabled with persistence
  const setLogoEnabledWithPersistence = (enabled) => {
    setLogoEnabled(enabled);
    // Save to localStorage
    try {
      localStorage.setItem("suit_logoEnabled", enabled.toString());
    } catch (err) {}
  };
  // ...Sleeve End...

  return (
    <>
      {/* Loading Screen */}
      {isLoading && (
        <div className="loading-screen">
          <div className="loading-content">
            <div className="loading-logo">
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
                <path d="M7 7h.01" />
              </svg>
            </div>
            <h2>Playmaker Suit Customizer</h2>
            <p>Loading your customization options...</p>
            <div className="loading-progress">
              <div className="loading-bar">
                <div
                  className="loading-fill"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              <span className="loading-percentage">{loadingProgress}%</span>
            </div>
            <div className="loading-spinner">
              <div className="spinner-ring"></div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Screen for Add to Cart */}
      {showProgress && (
        <div className="progress-screen">
          <div className="progress-content">
            <div className="progress-logo">
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
                <path d="M7 7h.01" />
              </svg>
            </div>
            <h2>Saving Product...</h2>
            <p>{addToCartMessage}</p>
            <div className="progress-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progressValue}%` }}
                ></div>
              </div>
              <span className="progress-percentage">{progressValue}%</span>
            </div>
            <div className="progress-spinner">
              <div className="spinner-ring"></div>
            </div>
          </div>
        </div>
      )}

      <Sidebar
        fabrics={fabricsData}
        selectedButtonStyle={selectedButtonStyle}
        setSelectedButtonStyle={handleButtonStyleSelection}
        selectedLapelStyle={selectedLapelStyle}
        setSelectedLapelStyle={handleLapelStyleSelection}
        selectedJacketPocket={selectedJacketPocket}
        setSelectedJacketPocket={handleJacketPocketSelection}
        jacketPocketData={jacketPocketData}
        selectedLining={selectedLining}
        setSelectedLining={handleLiningSelection}
        liningData={liningData}
        selectedBackPocketStyle={selectedBackPocketStyle}
        setSelectedBackPocketStyle={handleBackPocketStyleSelection}
        selectedFrontPocketStyle={selectedFrontPocketStyle}
        setSelectedFrontPocketStyle={handleFrontPocketStyleSelection}
        repeatScale={repeatScale}
        setRepeatScale={setRepeatScaleWithPersistence}
        showItalianCollar={showItalianCollar}
        setShowItalianCollar={setShowItalianCollarWithPersistence}
        showFranchCollar={showFranchCollar}
        setShowFranchCollar={setShowFranchCollarWithPersistence}
        collarFabricTextureUrl={collarFabricTextureUrl}
        setCollarFabricTextureUrl={setCollarFabricTextureUrlWithPersistence}
        addToCartMessage={addToCartMessage}
        handleAddToCart={handleAddToCart}
        randomColor={randomColor}
        collars={collarsData}
        selectedCollar={selectedCollar}
        setSelectedCollar={handleCollarSelection}
        selectedSleeve={selectedSleeve}
        setSelectedSleeve={setSelectedSleeveWithPersistence}
        selectedWholeFabric={selectedWholeFabric}
        setSelectedWholeFabric={setSelectedWholeFabricWithPersistence}
        selectedShirtBack={selectedShirtBack}
        setSelectedShirtBack={setSelectedShirtBackWithPersistence}
        selectedPlacket={selectedPlacket}
        setSelectedPlacket={setSelectedPlacketWithPersistence}
        placketData={placketData}
        selectedBeltloop={selectedBeltloop}
        setSelectedBeltloop={setSelectedBeltloopWithPersistence}
        beltloopData={beltloopData}
        selectedPantCuff={selectedPantCuff}
        setSelectedPantCuff={setSelectedPantCuffWithPersistence}
        setSelectedOptionsPrices={setSelectedOptionsPrices}
        onMeshVisibilityChange={handleMeshVisibility}
        selectedPocket={selectedPocket}
        setSelectedPocket={setSelectedPocketWithPersistence}
        selectedLogoMesh={selectedLogoMesh}
        setSelectedLogoMesh={handleLogoSelection}
        logoImageUrl={logoImageUrl}
        setLogoImageUrl={setLogoImageUrlWithPersistence}
        logoEnabled={logoEnabled}
        setLogoEnabled={setLogoEnabledWithPersistence}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProductWithPersistence}
        productData={productData}
        selectedNotes={selectedNotes}
        setSelectedNotes={setSelectedNotesWithPersistence}
        selectedButtonThreadColor={selectedButtonThreadColor}
        setSelectedButtonThreadColor={handleButtonThreadColorSelection}
        buttonThreadColorData={buttonThreadColorData}
      />

      <div className="canvas-container">
          <Canvas
            shadows
            className="main-canvas"
            camera={{ position: [0, 16, 2], fov: 32 }}
            dpr={[1, 1.25]}
            gl={{
              antialias: true,
              powerPreference: "high-performance",
              toneMapping: ACESFilmicToneMapping,
              alpha: true,
              preserveDrawingBuffer: true,
              logarithmicDepthBuffer: true,
            }}
            onCreated={({ gl, camera }) => {
              gl.outputColorSpace = SRGBColorSpace;
              gl.toneMappingExposure = 1.2;
              gl.shadowMap.enabled = true;
              gl.shadowMap.type = PCFSoftShadowMap;
              gl.shadowMap.autoUpdate = true;
              gl.shadowMap.needsUpdate = true;
              
              // Enhanced shadow quality
              gl.shadowMap.autoUpdate = true;
              gl.shadowMap.needsUpdate = true;
              
              // Better pixel ratio handling
              const pixelRatio = Math.min(window.devicePixelRatio, 1.25);
              gl.setPixelRatio(pixelRatio);
              
              // Enhanced texture filtering
              gl.capabilities &&
                gl.getContext().getExtension("EXT_texture_filter_anisotropic");
              
              // Set camera properties for better quality
              camera.near = 0.1;
              camera.far = 1000;
              camera.updateProjectionMatrix();
            }}
          >
            <StudioLights />
            <SoftShadows size={6} samples={4} focus={0.5} flat={false} />
            {/* Backup: repeatScale was dynamic -> repeatScale={parseFloat(selectedFabric.textureRepeat)} */}
            <ShirtModel
              repeatScale={selectedWholeFabric ? parseFloat(selectedWholeFabric.textureRepeat) : 1}
              showItalianCollar={showItalianCollar}
              showFranchCollar={showFranchCollar}
              collarFabricTextureUrl={collarFabricTextureUrl}
              selectedCollar={selectedCollar}
              selectedSleeve={selectedSleeve}
              selectedWholeFabric={selectedWholeFabric}
              selectedShirtBack={selectedShirtBack}
              selectedPlacket={selectedPlacket}
              selectedBeltloop={selectedBeltloop}
              selectedPantCuff={selectedPantCuff}
              selectedPocket={selectedPocket}
              selectedLogoMesh={selectedLogoMesh}
              logoImageUrl={logoImageUrl}
              logoEnabled={logoEnabled}
              showFrontView={showFrontView} // Pass the state as a prop
              selectedButton={selectedButton}
              selectedButtonStyle={selectedButtonStyle}
              selectedLapelStyle={selectedLapelStyle}
              selectedJacketPocket={selectedJacketPocket}
              selectedBackPocketStyle={selectedBackPocketStyle}
              selectedFrontPocketStyle={selectedFrontPocketStyle}
              isPocketSelected={isPocketSelected}
              selectedProduct={selectedProduct}
              selectedLining={selectedLining}
              selectedButtonThreadColor={selectedButtonThreadColor}
            />
            <OrbitControls
              enableRotate={false}
              enableZoom={false}
              enablePan={false}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 2.05}
              target={[0, 0.5, 0]}
            />
          </Canvas>
          <div className="custom-shirt-info">
            <h4 id="finalPrice">SDG {calculateTotalPrice()}</h4>
            <h2 className="fs-30">Custom {getProductDisplayName(selectedProduct?.key) || "Suit"}</h2>

            {/* Price Breakdown - Base Price + Options with Pricing */}
            <div className="price-breakdown">
              {/* Base Price - Always show */}
              <div className="price-item base-price">
                <span>{selectedProduct?.name || "Product Type"}: </span>
                <span>SDG {selectedProduct?.basePrice || 0}</span>
              </div>

              {selectedOptionsPrices.wholeFabric > 0 && (
                <div className="price-item">
                  <span>Suit Fabric: </span>
                  <span>SDG {selectedOptionsPrices.wholeFabric}</span>
                </div>
              )}

              {selectedOptionsPrices.button > 0 && (
                <div className="price-item">
                  <span>Button Style: </span>
                  <span>SDG {selectedOptionsPrices.button}</span>
                </div>
              )}

              {selectedOptionsPrices.lapel > 0 && (
                <div className="price-item">
                  <span>Lapel Style: </span>
                  <span>SDG {selectedOptionsPrices.lapel}</span>
                </div>
              )}

              {selectedOptionsPrices.jacketPocket > 0 && (
                <div className="price-item">
                  <span>Jacket Pocket: </span>
                  <span>SDG {selectedOptionsPrices.jacketPocket}</span>
                </div>
              )}

              {selectedOptionsPrices.pocket > 0 && (
                <div className="price-item">
                  <span>Pocket: </span>
                  <span>SDG {selectedOptionsPrices.pocket}</span>
                </div>
              )}

              {selectedOptionsPrices.beltloop > 0 && (
                <div className="price-item">
                  <span>Beltloop: </span>
                  <span>SDG {selectedOptionsPrices.beltloop}</span>
                </div>
              )}

              {selectedOptionsPrices.pantCuff > 0 && (
                <div className="price-item">
                  <span>Pant Cuff: </span>
                  <span>SDG {selectedOptionsPrices.pantCuff}</span>
                </div>
              )}

              {/* Total Price */}
              <div className="price-item total-price">
                <span>Total Price: </span>
                <span>SDG {calculateTotalPrice()}</span>
              </div>
            </div>

            <div className="button-group">
              <button className="continue-btn" onClick={handleAddToCart}>
                Continue
              </button>
              <button
                className="reset-btn"
                onClick={() => {
                  // Show confirmation dialog
                  if (
                    window.confirm(
                      "Are you sure you want to reset everything? This will clear all selections and refresh the page."
                    )
                  ) {
                    // Clear all localStorage
                    try {
                      localStorage.clear();
                    } catch (err) {
                    }

                    // Reset all state to default values
                    setSelectedOptionsPrices({
                      fabric: 0,
                      wholeFabric: 0,
                      collar: 0,
                      sleeve: 0,
                      bottom: 0,
                      placket: 0,
                      pocket: 0,
                      logo: 0,
                      button: 0,
                      lapel: 0,
                      jacketPocket: 0,
                      beltloop: 0,
                    });

                    // Reset selected product to default (Two Piece Suit)
                    setSelectedProduct({
                      name: "Two Piece Suit",
                      key: "TwoPieceSuit",
                      imageUrl: "/product/two-piece-suit.svg",
                      basePrice: 99,
                    });

                    // Reset button thread color to default
                    if (buttonThreadColorData.length > 0) {
                      setSelectedButtonThreadColor(buttonThreadColorData[0]);
                    }

                    // Refresh the page
                    window.location.reload();
                  }
                }}
              >
                Reset All
              </button>
            </div>
            <p>Order Today, Receive in 2 weeks.</p>
          </div>
          <button
            className="view-toggle-btn"
            onClick={() => setShowFrontView((prev) => !prev)}
            style={{
              position: "absolute",
              bottom: "20px",
              right: "20px",
              background: "rgba(255, 255, 255, 0.7)",
              border: "none",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
              zIndex: 1000,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="23 4 23 10 17 10"></polyline>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
            </svg>
          </button>
        </div>
    </>
  );
}

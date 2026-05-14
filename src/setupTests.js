/**
 * TEST SETUP CONFIGURATION
 * =========================
 * 
 * This file configures the testing environment for the application.
 * It sets up Jest DOM matchers for better testing capabilities.
 * 
 * Features:
 * - Jest DOM custom matchers
 * - Enhanced DOM testing utilities
 * - React Testing Library integration
 * - Custom assertions for DOM elements
 * 
 * Available Matchers:
 * - toHaveTextContent: Check text content
 * - toBeInTheDocument: Check element presence
 * - toHaveClass: Check CSS classes
 * - toHaveAttribute: Check element attributes
 * - And many more DOM-specific matchers
 * 
 * @author Your Name
 * @version 1.0.0
 */

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

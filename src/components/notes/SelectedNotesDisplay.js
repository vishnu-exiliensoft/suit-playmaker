/**
 * SELECTED NOTES DISPLAY COMPONENT
 * =================================
 * 
 * This component displays the currently selected notes in the sidebar.
 * It shows a preview of the notes and allows users to click to open notes options.
 * 
 * Features:
 * - Displays notes preview with truncation for long text
 * - Clickable to open notes options panel
 * - Shows placeholder text when no notes are written
 * - Handles empty notes gracefully
 * 
 * @param {string} selectedNotes - Currently written notes
 * @param {Function} onClick - Function to call when component is clicked
 * @returns {JSX.Element} Selected notes display component
 */

import React from "react";

/**
 * SelectedNotesDisplay component shows the current notes preview.
 */
export default function SelectedNotesDisplay({ selectedNotes, onClick }) {
  const truncateText = (text, maxLength = 50) => {
    if (!text || text.trim() === "") return "Add notes...";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="selected-fabric-display" onClick={onClick}>
      <div className="notes-icon">
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
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10,9 9,9 8,9"/>
        </svg>
      </div>
      <div className="selected-fabric-name">{truncateText(selectedNotes)}</div>
    </div>
  );
}

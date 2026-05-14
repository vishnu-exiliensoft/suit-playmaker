/**
 * NOTES OPTIONS PANEL COMPONENT
 * ==============================
 * 
 * This component displays a textarea for writing notes.
 * Users can write and save their custom notes for the suit.
 * 
 * Features:
 * - Large textarea for writing notes
 * - Smooth slide-in/slide-out animations
 * - Auto-save functionality
 * - Character count display
 * - Clear and save buttons
 * - Responsive design
 * 
 * @param {string} selectedNotes - Currently written notes
 * @param {Function} setSelectedNotes - Function to update notes
 * @param {boolean} isVisible - Whether the panel is visible
 * @param {Function} onSelection - Callback function called after selection
 * @returns {JSX.Element} Notes options panel component
 */

import React, { useState, useEffect } from "react";

/**
 * NotesOptionsPanel component displays the notes textarea.
 */
export default function NotesOptionsPanel({
  selectedNotes,
  setSelectedNotes,
  isVisible,
  onSelection,
}) {
  const [notes, setNotes] = useState(selectedNotes || "");
  const [charCount, setCharCount] = useState(notes.length);

  useEffect(() => {
    setNotes(selectedNotes || "");
    setCharCount((selectedNotes || "").length);
  }, [selectedNotes]);

  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    setCharCount(newNotes.length);
  };

  const handleSave = () => {
    setSelectedNotes(notes);
    if (onSelection) {
      onSelection();
    }
  };

  const handleClear = () => {
    setNotes("");
    setCharCount(0);
    setSelectedNotes("");
  };

  return (
    <div
      className={`fabric-options-container ${isVisible ? "is-visible" : ""}`}
    >
      <h3 className="fabric-options-title">Add Notes</h3>
      <div className="notes-container">
        <textarea
          value={notes}
          onChange={handleNotesChange}
          placeholder="Write your notes here..."
          className="notes-textarea"
          rows={8}
          maxLength={500}
        />
        <div className="notes-footer">
          <div className="char-count">
            {charCount}/500 characters
          </div>
          <div className="notes-buttons">
            <button 
              className="notes-clear-btn"
              onClick={handleClear}
              disabled={!notes.trim()}
            >
              Clear
            </button>
            <button 
              className="notes-save-btn"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

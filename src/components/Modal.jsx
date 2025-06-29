// src/components/Modal.jsx
import React from 'react';
import '../styles/Modal.css';

export default function Modal({ title, children, onClose }) {
  return (
   <div className="modal-overlay">
   <div className="modal">
     <div className="modal-header">
       <h3>{title}</h3>
       <button className="modal-close-btn" onClick={onClose}>×</button>
     </div>
     <div className="modal-body">
       {children}
     </div>
   </div>
 </div>
  );
}
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import styles from './droppable_area.module.css';

function DroppableArea({ 
  id, 
  status, 
  children, 
  className = '',
  style = {}
}) {
  const { isOver, setNodeRef } = useDroppable({
    id,
    data: {
      status: status
    }
  });

  const dropStyles = {
    ...style,
    backgroundColor: isOver ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
    borderColor: isOver ? '#3b82f6' : 'transparent',
    borderWidth: isOver ? '2px' : '0px',
    borderStyle: 'dashed',
    borderRadius: '8px',
    transition: 'background-color 0.15s ease, border-color 0.15s ease', // Faster transition, only for visual feedback
    minHeight: 'auto',
    position: 'relative',
    padding: '8px'
  };

  return (
    <div 
      ref={setNodeRef}
      className={`${styles.droppableArea} ${className} ${isOver ? styles.isOver : ''}`}
      style={dropStyles}
      data-status={status}
    >
      {children}
    </div>
  );
}

export default DroppableArea;

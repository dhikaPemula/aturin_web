import styles from './filter.module.css';
import React from 'react';

function Filter({ currentIndex, setCurrentIndex }) {
  const items = [
    { label: 'Semua' },
    { label: 'Tugas' },
    { label: 'Aktivitas' },
  ];

  const barWidth = 100 / items.length;
  const barLeft = currentIndex * barWidth;

  return (
    <div className={styles.filterContainer} style={{ position: 'relative' }}>
      <div
        className={styles.activeBar}
        style={{
          width: `${barWidth}%`,
          left: `${barLeft}%`,
        }}
      />
      {items.map((item, idx) => (
        <div
          key={item.label}
          className={
            styles.filterItem +
            (currentIndex === idx ? ' ' + styles.active : '')
          }
          onClick={() => setCurrentIndex(idx)}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}
export default Filter;

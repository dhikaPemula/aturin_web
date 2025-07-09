import React from 'react';
import styles from './uppersection.module.css';
import warningCirclePurple from '../../../../../assets/task/warning-circle-purple.svg';

function UpperSection() {
  return (
    <div className={styles.upperSection}>
      <div className={styles.container}>
        <h1 className={styles.title}>Tugas</h1>
        <p className={styles.subtitle}>
          <img 
            src={warningCirclePurple} 
            alt="Info" 
            className={styles.infoIcon}
          />
          Seret dan lepas tugas antar kolom untuk mengubah status.
        </p>
      </div>
    </div>
  );
}

export default UpperSection;

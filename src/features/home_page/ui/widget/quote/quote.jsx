import React from 'react';
import styles from './quote.module.css';
import panaIcon from '../../../../../assets/home/pana.svg';

function Quote() {
  return (
    <div className={styles.quoteContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.quoteContent}>
          <h3 className={styles.quoteText}>
            “The way to get started is to quit talking and begin doing.”
          </h3>
          <p className={styles.quoteAuthor}>- Walt Disney</p>
        </div>
      </div>
      <img 
        src={panaIcon} 
        alt="Pana illustration" 
        className={styles.panaIcon}
      />
    </div>
  );
}

export default Quote;

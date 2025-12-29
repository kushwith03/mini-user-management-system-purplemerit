import React from 'react';
import styles from './Spinner.module.css';

const Spinner = ({ fullPage = false }) => {
  const containerClass = fullPage ? `${styles.container} ${styles.fullPage}` : styles.container;
  return (
    <div className={containerClass}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default Spinner;

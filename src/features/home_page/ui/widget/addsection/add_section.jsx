import styles from './add_section.module.css';
import Tugas from '../../../../../assets/home/addtask.svg';
import Aktivitas from '../../../../../assets/home/addactivity.svg';
import React from 'react';

function AddSection() {
  // Cek jika layar <= 640px (max-sm)
  const isMaxSm = typeof window !== 'undefined' && window.innerWidth <= 640;
  const [maxSm, setMaxSm] = React.useState(isMaxSm);

  React.useEffect(() => {
    const handleResize = () => setMaxSm(window.innerWidth <= 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={styles.addSection}>
        <button className={styles.addTask + ' ' + styles.purpleButton}>
          <img src={Tugas} alt="Tugas" className={styles.whiteIcon} />
          {'Tambah Tugas'}
        </button>
        <button className={styles.addActivity + ' ' + styles.purpleButton}>
          <img src={Aktivitas} alt="Aktivitas" className={styles.whiteIcon} />
          {'Tambah Aktivitas'}
        </button>
    </div>
  );
}
export default AddSection;

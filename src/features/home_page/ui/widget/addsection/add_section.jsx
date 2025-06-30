import styles from './add_section.module.css';
import Tugas from '../../../../../assets/icons/task-list.svg';
import Aktivitas from '../../../../../assets/icons/activity.svg';

function AddSection() {
  return (
    <div className={styles.addSection}>
        <button className={styles.addTask + ' ' + styles.purpleButton}>
          <img src={Tugas} alt="Tugas" className={styles.whiteIcon} />
          Tambah Tugas
        </button>
        <button className={styles.addActivity + ' ' + styles.purpleButton}>
          <img src={Aktivitas} alt="Aktivitas" className={styles.whiteIcon} />
          Tambah Aktivitas
        </button>
    </div>
  );
}
export default AddSection;

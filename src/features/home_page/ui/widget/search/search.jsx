import styles from './search.module.css';
import searchIcon from '../../../../../assets/icons/search.svg';

function Search() {
  return (
    <div className={styles.searchContainer}>
        <div className={styles.searchBox}>
            <img src={searchIcon} alt="Search Icon" className={styles.searchIcon} />
            <input type="text" placeholder="Cari Tugas atau Aktivitas..." className={styles.searchInput} />
        </div>   
    </div>
  );
}
export default Search;
import styles from './greeting.module.css';
import useBannerProfile from '../../../../../core/hooks/useBannerProfile';

function Greeting() {
  const { banner } = useBannerProfile();
  
  let name = 'Rakha Sigma';
  if (banner && banner.data && banner.data.user && banner.data.user.name) {
    name = banner.data.user.name;
  }
  
  const todayDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div className={styles.greetingcontainer}>
        <div className={styles.greeting}>
            <h1 className={styles.greetingTitle}>Selamat Datang, </h1>
            <h1 className={styles.greetingName}>{name}!</h1>
        </div>
        <div className={styles.today}>
            <div className={styles.todayItem}>
                <h1 className={styles.todayo}>Hari ini:</h1>
                <h1 className={styles.todayDate}>{todayDate}</h1>
            </div>
        </div>
    </div>
  );
}
export default Greeting;
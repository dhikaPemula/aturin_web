import Header from "../../../../core/widgets/header/header.jsx";
import styles from "./home_page.module.css";
import Greeting from "../widget/greeting/greeting.jsx";
import AddSection from "../widget/addsection/add_section.jsx";
import Search from "../widget/search/search.jsx";

function HomePage() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.upperSection}>
            <Greeting />
            <AddSection />
        </div>
        <Search />
        <p>Token: {localStorage.getItem('token')}</p>
      </div>
    </>
  );
}
export default HomePage;

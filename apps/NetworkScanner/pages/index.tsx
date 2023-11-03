import ScannerPage from "@/pages/ScannerPage/ScannerPage";
import globalStyles from '../../../components/globalStyles.module.css';

const Home = () => {
  return (
      <div className={globalStyles.globalStyles}>
        <ScannerPage/>
      </div>
  );
}

export default Home;
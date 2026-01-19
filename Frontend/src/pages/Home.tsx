import { motion } from "framer-motion";
import Toolbar from "../components/files/Toolbar";
import FileGrid from "../components/files/FileGrid";

const Home = () => {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Toolbar />
      <FileGrid />
    </motion.div>
  );
};

export default Home;
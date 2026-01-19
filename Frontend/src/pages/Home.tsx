import { motion } from "framer-motion";
import Toolbar from "../components/files/Toolbar";
import FileGrid from "../components/files/FileGrid";
import { useFileActions } from "../contexts/FileActionContext";

const Home = () => {
  const { handleMoveClick } = useFileActions();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Toolbar onMoveClick={handleMoveClick} />
      <FileGrid onMoveClick={handleMoveClick} />
    </motion.div>
  );
};

export default Home;
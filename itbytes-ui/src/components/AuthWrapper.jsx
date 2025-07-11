import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const slideVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

const AuthWrapper = ({ children, keyId }) => {
  return (
    <div className="login-container">
      <div className="login-image">
        {/* your static logo and image */}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={keyId}
          className="login-form"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={slideVariants}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AuthWrapper;

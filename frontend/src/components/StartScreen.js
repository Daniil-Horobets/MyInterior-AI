import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedGemini from './AnimatedGemini';
import './StartScreen.css';

function StartScreen() {
  const navigate = useNavigate();
  const [exiting, setExiting] = useState(false);

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0, scale: 1 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6 },
    },
    exit: {
      opacity: 0,
      scale: 0,
      transition: { duration: 0.3 },
    },
  };

  const handleGetStarted = () => {
    setExiting(true);
  };

  return (
    <motion.div
      className="start-screen"
      variants={pageVariants}
      initial="initial"
      animate={exiting ? 'exit' : 'animate'}
      onAnimationComplete={(latestAnimation) => {
        if (latestAnimation === 'exit') {
          navigate('/main');
        }
      }}
    >
      <AnimatedGemini />

      <div className="start-content">
        <div className="start-logo">MyInterior-AI</div>
        <h1>Welcome to the AI Interior Design</h1>
        <button
          className="btn-primary"
          onClick={handleGetStarted}
          disabled={exiting}
        >
          Get Started
        </button>
      </div>
    </motion.div>
  );
}

export default StartScreen;

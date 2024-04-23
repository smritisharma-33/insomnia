import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Instructions() {
  const navigate = useNavigate();
  const location = useLocation();
  const { idnum, cond, type } = location.state;

  const handleContinue = () => {
    navigate('/experiment', {
      state: {
        idnum: idnum,
        cond: cond,
        type: type
      }
    });
  };

  return (
    <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 'auto', 
        margin: '0 auto', 
        padding: '0 20px', 
        maxWidth: '800px' 
      }}>
        <h1>Judgment Task 2</h1>
        <h2>Instructions</h2>
        <p>In this part of the experiment, we are looking at how people make simple but quick judgments. For each trial, you will see a brief presentation of a simple painting.</p>
        <p style={{ color: 'blue' , fontWeight:'bold'}}>Your job is to judge the pleasantness of the painting.</p>
        <p>Each painting will remain on the screen for a brief time. When prompted, you should respond by indicating whether you think the painting you saw is more or less pleasant than average.</p>
        <p style={{ color: 'red' , fontWeight:'bold'}}>If it's more pleasant than average, press the 'K' key.</p>
        <p style={{ color: 'red' , fontWeight:'bold'}}>If it's less pleasant than average, press the 'D' key.</p>
        <p>When the study is fully loaded, the button below will activate. Click it to indicate you have read these instructions, and are ready to continue to the second page of instructions. (Refresh the page if the button does not become active.)</p>
        <p style={{ textDecoration: 'underline' }}>Please only proceed after you have CAREFULLY read these instructions and are definitely sure that you are ready!</p>
        <p>Immediately before each painting you rate, a photograph will appear very briefly.</p>
        <p>It is important to note that having just seen a positive photo can sometimes make you judge the painting more positively than you otherwise would. Likewise, having just seen a negative photo can make you judge the painting more negatively. Because we are interested in how people can avoid being biased, please try your absolute best not to let the photos bias your judgment of the paintings. Give us an honest assessment of the paintings, regardless of the photos that precede them.</p>
        <p>When you are ready to begin, place your fingers on the 'd' (less pleasant) and 'k' (more pleasant) keys, and press the space bar.</p>
        <button onClick={handleContinue}>Continue</button>
    </div>
  );
}

export default Instructions;
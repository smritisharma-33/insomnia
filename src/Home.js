import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Home() {
  const location = useLocation();
  const navigate = useNavigate(); 

  function useQuery() {
    return new URLSearchParams(location.search);
  }

  const query = useQuery();
  const idnum = query.get('idnum');
  const cond = query.get('cond');
  const type = query.get('type');

  const [countdown, setCountdown] = useState(3); 

  useEffect(() => {
    const timer = countdown > 0 && setInterval(() => {
      setCountdown(countdown - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleStart = () => {
    navigate('/instructions', {
      state: {
        idnum: idnum,
        cond: cond,
        type: type
      }
    });
  };  

  return (
  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 'auto' }}>
    <h1>Welcome to Page 1</h1>
    <p>Hello, we are interested in your opinions about a variety of things!</p>
    <p>When you are ready to start the experiment please press start to begin.</p>
    <p>You can continue in {countdown} seconds.</p>
    <button onClick={handleStart} disabled={countdown > 0}>Start</button>
  </div>
  );
}

export default Home;

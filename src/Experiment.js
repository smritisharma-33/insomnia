import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { utils, write } from 'xlsx';
import { saveAs } from 'file-saver';
import './Experiment.css'; // Ensure your styles are correctly set up in this CSS file

function Experiment() {
  const location = useLocation();
  const { idnum, cond, type } = location.state;
  const [iteration, setIteration] = useState(0);
  const [showFixation, setShowFixation] = useState(true);
  const [showImage, setShowImage] = useState(false);
  const [showPainting, setShowPainting] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [image, setImage] = useState(null);
  const [painting, setPainting] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [responses, setResponses] = useState([]);
  const [paintingNumber, setPaintingNumber] = useState(null);


  // Create an array of 40 elements with 20 'target' and 20 'control'
  const types = Array(20).fill('target').concat(Array(20).fill('control'));

  // Shuffle the array
  types.sort(() => Math.random() - 0.5);

  useEffect(() => {
    console.log(`idnum: ${idnum}, cond: ${cond}, type: ${type}`);
  }, [idnum, cond, type]);

  useEffect(() => {
    if (iteration < 40) {
      const timer = setTimeout(() => {
        setShowFixation(false);
        setShowImage(true);
        const imageTimer = setTimeout(() => {
          setShowImage(false);
          setShowPainting(true);
        }, 75 + Math.floor(Math.random() * 21) - 10); // 75 +/- 10 ms
        return () => clearTimeout(imageTimer);
      }, 250 + Math.floor(Math.random() * 51) - 25); // 250 +/- 25 ms
      return () => clearTimeout(timer);
    } else {
      // All iterations are done, generate the Excel file
      const wb = utils.book_new();
      const ws = utils.json_to_sheet(responses);
      utils.book_append_sheet(wb, ws, 'Responses');
      const wbout = write(wb, {bookType:'xlsx', type:'binary'});
      const blob = new Blob([s2ab(wbout)], {type:'application/octet-stream'});
      saveAs(blob, `${idnum}.xlsx`);

      window.location.href = `https://yalesurvey.ca1.qualtrics.com/jfe/form/SV_3eGwFDSbXv6tSbc?idnum=${idnum}&cond=${cond}&type=${type}`;
    }
  }, [iteration]);

  useEffect(() => {
    if (showImage && image === null) {
      const imageType = cond === '1' ? 'Dog' : 'Cat';
      const imageNumber = types[iteration] === 'target' ? type : Math.floor(Math.random() * 5) + 1;
      import(`./Images/Type/${imageType}/${imageType}${imageNumber}.jpg`)
        .then((importedImage) => {
          console.log(importedImage);
          setImage(importedImage.default);
          const imageTimer = setTimeout(() => {
            setShowImage(false);
            setShowPainting(true);
          }, 75 + Math.floor(Math.random() * 31) - 15); // 75 +/- 15 ms
          return () => clearTimeout(imageTimer);
        })
        .catch((error) => {
          console.error(`Error loading image: ${error}`);
        });
    }
  }, [showImage, cond, iteration, types]);
  useEffect(() => {
  if (showPainting) {
    const paintingNumber = Math.floor(Math.random() * 40) + 1;
    setPaintingNumber(paintingNumber);
    import(`./Images/Neutral/pic${paintingNumber}.png`)
      .then((image) => {
        console.log(image);
        setPainting(image.default);
        const paintingTimer = setTimeout(() => {
          setShowPainting(false);
          setShowPrompt(true);
          setStartTime(Date.now());
        }, 100 + Math.floor(Math.random() * 31) - 15); // 100 +/- 15 ms
        return () => clearTimeout(paintingTimer);
      })
      .catch((error) => {
        console.error(`Error loading painting: ${error}`);
      });
  }
}, [showPainting, setPainting]);

  useEffect(() => {
    if (showPrompt) {
      const handleKeyDown = (event) => {
        if (event.key === 'd' || event.key === 'k') {
          const endTime = Date.now();
          console.log(`Time taken: ${endTime - startTime} ms`);
          setShowPrompt(false);
          const nextTrialTimer = setTimeout(() => {
            setIteration(iteration + 1);
            if (iteration < 40) {
              setShowFixation(true);
              setImage(null);
              setPainting(null);
            }
            // Save the response
            setResponses(responses => [...responses, {
              idnum,
              cond,
              type,
              order: iteration + 1,
              imageName: `pic${paintingNumber}.png`,
              trialType: types[iteration],
              response: event.key,
              RT: endTime - startTime
            }]);
          }, 1000 + Math.floor(Math.random() * 501) - 250); // 1000 +/- 250 ms
          return () => clearTimeout(nextTrialTimer);
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      // Cleanup function to remove the event listener if the component unmounts
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [showPrompt, startTime, iteration]);

  if (idnum === null || cond === null || type === null) {
    return <div>Error: Missing required parameters.</div>;
  }
  
  return (
    <div className="experiment-container">
      {showFixation ? (
        <div className="fixation-cross">+</div>
      ) : showImage ? (
        <img src={image} alt="" />
      ) : showPainting ? (
        <img src={painting} alt="" />
      ) : showPrompt ? (
        <div className="prompt">Press 'd' or 'k'</div>
      ) : (
        <div className="black-screen"></div>
      )}
    </div>
  );
}

export default Experiment;

// Helper function to convert a string to an array buffer
function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}
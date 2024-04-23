import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { utils, write } from 'xlsx';
import { saveAs } from 'file-saver';
import './Experiment.css'; 

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


  const types = Array(20).fill('target').concat(Array(20).fill('control'));

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
          const paintingTimer = setTimeout(() => {
            setShowPainting(true);
          }, 3000);
          return () => clearTimeout(paintingTimer);
        }, 3000);
        return () => clearTimeout(imageTimer);
      }, 3000); 

      return () => clearTimeout(timer);
    } else {
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
          setImage(importedImage.default);
          const imageTimer = setTimeout(() => {
            setShowImage(false);
            setShowPainting(true);
          }, 3000);
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
          setPainting(image.default);
          const paintingTimer = setTimeout(() => {
            setShowPainting(false);
            setShowPrompt(true);
            setStartTime(Date.now());
          }, 3000);
          return () => clearTimeout(paintingTimer);
        })
        .catch((error) => {
          console.error(`Error loading painting: ${error}`);
        });
    }
  }, [showPainting]);

  useEffect(() => {
    if (showPrompt) {
      const handleKeyDown = (event) => {
        if (event.key === 'd' || event.key === 'k') {
          const endTime = Date.now();
          console.log(`Time taken: ${endTime - startTime} ms`);
          setShowPrompt(false);
          setIteration(iteration + 1);
          if (iteration < 40) {
            setShowFixation(true);
            setImage(null);
            setPainting(null);
          }
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
        }
      };

      window.addEventListener('keydown', handleKeyDown);

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

function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}
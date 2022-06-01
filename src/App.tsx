import React, { Ref, useEffect, useRef, useState } from 'react';
import './App.css';
import ProgressBar, { ImperativeProgressBar } from './components/ProgressBar';

type Image = {
  path: string;
};

const images: Array<Image> = [
  { path: '01' },
  { path: '02' },
  { path: '03' },
  { path: '04' },
  { path: '05' },
  { path: '06' },
  { path: '07' },
  { path: '08' },
  { path: '09' },
  { path: '010' },
];

function App() {
  const progressBarRefs = useRef<Array<ImperativeProgressBar | null>>(
    images.map(() => null)
  );

  const [currIndex, setCurrIndex] = useState(0);

  const changeCurrIndex = (newIndex: number) => {
    setCurrIndex(newIndex);
  };
  const handleNext = () => {
    if (currIndex < images.length) {
      setCurrIndex(currIndex + 1);
      progressBarRefs.current[currIndex + 1]?.play();
    }
  };

  const handlePrev = () => {
    const currentProgressControl = progressBarRefs.current[currIndex];

    if (currIndex > 0) {
      setCurrIndex(currIndex - 1);
      currentProgressControl?.reset();
      progressBarRefs.current[currIndex - 1]?.replay();
    } else {
      currentProgressControl?.isPause
        ? currentProgressControl?.resume()
        : currentProgressControl?.pause();
    }
  };
  return (
    <div className='App'>
      <div className='container'>
        {images.map((img, index) => {
          return (
            <ProgressBar
              style={{ width: `${100 / images.length}%` }}
              key={img.path}
              pause={index !== currIndex}
              isFinished={index < currIndex}
              onComplete={() => {
                if (index < images.length) {
                  changeCurrIndex(index + 1);
                  progressBarRefs.current[index + 1]?.play();
                }
              }}
              duration={3}
              ref={(ref) => (progressBarRefs.current[index] = ref)}
            />
          );
        })}
      </div>
      <div>
        <button onClick={handlePrev}>Prev</button>
        <button onClick={handleNext}>Next</button>
      </div>
    </div>
  );
}

export default App;

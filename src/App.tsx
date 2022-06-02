import React, { Ref, useEffect, useRef, useState } from "react";
import "./App.css";
import ProgressBar, { ImperativeProgressBar } from "./components/ProgressBar";

type Image = {
  path: string;
};

const images: Array<Image> = [
  {
    path: "https://images.unsplash.com/photo-1654106933587-df504eb45781?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
  },
  {
    path: "https://images.unsplash.com/photo-1654139368702-b79142c8dcaa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
  },
  {
    path: "https://images.unsplash.com/photo-1654096317770-8fbde5c88d2a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
  },
  {
    path: "https://images.unsplash.com/photo-1654140785899-6148f8fa06f9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
  },
  {
    path: "https://images.unsplash.com/photo-1638913660695-b490171d17c9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1772&q=80",
  },
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
    if (currIndex < images.length - 1) {
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
        ? currentProgressControl?.play()
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
                if (index < images.length - 1) {
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
        <img
          style={{ maxWidth: 400, objectFit: "cover" }}
          src={images[currIndex].path}
          alt=''
        />
      </div>
      <div>
        <button onClick={handlePrev}>Prev</button>
        <button onClick={handleNext}>Next</button>
      </div>
    </div>
  );
}

export default App;

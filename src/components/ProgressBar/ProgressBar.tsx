import { gsap } from "gsap";
import {
  CSSProperties,
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import "./ProgressBar.style.css";

export interface ImperativeProgressBar {
  replay: () => void;
  pause: () => void;
  play: () => void;
  finish: () => void;
  reset: () => void;
  isPause: boolean;
  resume: () => void;
}

interface ProgressBarProps {
  isFinished?: boolean;
  duration: number;
  pause?: boolean;
  onComplete?: () => void;
  style?: CSSProperties;
}

const ProgressBar = forwardRef(
  (
    { duration, isFinished, pause, onComplete, style }: ProgressBarProps,
    ref: Ref<ImperativeProgressBar>
  ) => {
    const progressRef = useRef(null);

    const [isPause, setIsPause] = useState(false);

    const tween = useRef<null | GSAPTimeline>(null);
    useEffect(() => {
      if (!tween.current) {
        tween.current = gsap
          .timeline({
            defaults: {
              duration,
              ease: "linear",
            },
          })
          .fromTo(
            progressRef.current,
            { width: 0 },
            {
              width: "100%",
            }
          )
          .eventCallback("onComplete", () => {
            onComplete?.();
          })
          .eventCallback("onStart", () => {
            setIsPause(false);
          });
      }
    }, []);

    const handleFinishProgress = () => {
      tween.current?.play(duration);
    };

    const hanldeReplay = () => {
      tween.current?.restart();
    };
    const handlePause = () => {
      tween.current?.pause();
      setIsPause(true);
    };

    const handlePlay = () => {
      tween.current?.play();
      setIsPause(false);
    };
    const handleReset = () => {
      tween.current?.play(0).pause();
      setIsPause(false);
    };
    const handleResume = () => {
      tween.current?.resume();
      setIsPause(false);
    };

    useImperativeHandle<ImperativeProgressBar, ImperativeProgressBar>(
      ref,
      () => ({
        replay: hanldeReplay,
        pause: handlePause,
        play: handlePlay,
        finish: handleFinishProgress,
        reset: handleReset,
        isPause,
        resume: handleResume,
      })
    );

    useEffect(() => {
      if (tween.current && pause) {
        handlePause();
      }
    }, [pause]);
    useEffect(() => {
      isFinished && handleFinishProgress();
    }, [isFinished]);

    return (
      <div className='progress-wrapper' style={style}>
        <div className='progress' ref={progressRef}></div>
      </div>
    );
  }
);

export default ProgressBar;

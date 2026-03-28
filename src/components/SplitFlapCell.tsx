import { useEffect, useMemo, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { audioEngine } from '../engine/audioEngine';
import {
  estimateStepDurationMs,
  getStepSequence,
  mechanicalCharacterSet,
} from '../engine/flapEngine';
import { useSplitFlapStore } from '../store/useSplitFlapStore';
import type { BoardThemeHint } from '../types';

interface SplitFlapCellProps {
  char: string;
  delayMs: number;
  hint?: BoardThemeHint;
}

interface FlipFrame {
  previous: string;
  current: string;
}

export function SplitFlapCell({ char, delayMs, hint = 'default' }: SplitFlapCellProps) {
  const { boardConfig, audio, reducedMotion } = useSplitFlapStore(useShallow((state) => ({
    boardConfig: state.boardConfig,
    audio: state.audio,
    reducedMotion: state.reducedMotion,
  })));

  const targetChar = useMemo(
    () => mechanicalCharacterSet(boardConfig.characterSet, char),
    [boardConfig.characterSet, char],
  );

  const [frame, setFrame] = useState<FlipFrame>({
    previous: targetChar,
    current: targetChar,
  });
  const [isFlipping, setIsFlipping] = useState(false);
  const timeoutIds = useRef<number[]>([]);
  const renderedChar = useRef(targetChar);

  const stepDurationMs = useMemo(
    () =>
      reducedMotion
        ? 24
        : estimateStepDurationMs(boardConfig.animationMode, boardConfig.flipDurationMs),
    [boardConfig.animationMode, boardConfig.flipDurationMs, reducedMotion],
  );

  useEffect(
    () => () => {
      timeoutIds.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeoutIds.current = [];
    },
    [],
  );

  useEffect(() => {
    const sequence = getStepSequence(renderedChar.current, targetChar, boardConfig);
    if (sequence.length === 1 && sequence[0] === renderedChar.current) return;

    timeoutIds.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    timeoutIds.current = [];

    if (reducedMotion) {
      const reducedTimeout = window.setTimeout(() => {
        renderedChar.current = targetChar;
        setFrame({
          previous: targetChar,
          current: targetChar,
        });
        setIsFlipping(false);
      }, delayMs);
      timeoutIds.current.push(reducedTimeout);
      return;
    }

    sequence.forEach((nextChar, index) => {
      const startAt = delayMs + index * stepDurationMs;
      const midpointAt = startAt + stepDurationMs * 0.52;

      const beginTimeout = window.setTimeout(() => {
        const previous = renderedChar.current;
        renderedChar.current = nextChar;
        setFrame({
          previous,
          current: nextChar,
        });
        setIsFlipping(true);
      }, startAt);

      const soundTimeout = window.setTimeout(() => {
        void audioEngine.resume();
        void audioEngine.triggerFlap({
          ...audio,
          intensity: Math.min(1.25, 0.7 + index * 0.08),
        });
      }, midpointAt);

      const endTimeout = window.setTimeout(() => {
        if (index === sequence.length - 1) {
          setIsFlipping(false);
        }
      }, startAt + stepDurationMs);

      timeoutIds.current.push(beginTimeout, soundTimeout, endTimeout);
    });
  }, [
    audio,
    boardConfig,
    delayMs,
    reducedMotion,
    stepDurationMs,
    targetChar,
  ]);

  const currentGlyph = frame.current === ' ' ? '\u00A0' : frame.current;
  const previousGlyph = frame.previous === ' ' ? '\u00A0' : frame.previous;
  const isBlank = frame.current === ' ' && !isFlipping;

  return (
    <div
      className={`splitFlapCell ${isFlipping ? 'is-flipping' : ''} ${
        isBlank ? 'is-blank' : 'has-content'
      } hint-${hint}`}
      style={{ ['--cell-duration' as string]: `${stepDurationMs}ms` }}
    >
      <div className="splitFlapCell__shadow" />
      <div className="splitFlapCell__face splitFlapCell__face--upper">
        <span className="splitFlapCell__glyph splitFlapCell__glyph--upper">
          {currentGlyph}
        </span>
      </div>
      <div className="splitFlapCell__hinge">
        <span className="splitFlapCell__hingePin" />
        <span className="splitFlapCell__hingePin" />
      </div>
      <div className="splitFlapCell__face splitFlapCell__face--lower">
        <span className="splitFlapCell__glyph splitFlapCell__glyph--lower">
          {currentGlyph}
        </span>
      </div>
      {isFlipping ? (
        <div className="splitFlapCell__flipper">
          <div className="splitFlapCell__flipperTop">
            <span className="splitFlapCell__glyph splitFlapCell__glyph--upper">
              {previousGlyph}
            </span>
          </div>
          <div className="splitFlapCell__flipperBottom">
            <span className="splitFlapCell__glyph splitFlapCell__glyph--lower">
              {currentGlyph}
            </span>
          </div>
        </div>
      ) : null}
      <div className="splitFlapCell__bevel" />
    </div>
  );
}

import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store/Store';
import html2canvas from 'html2canvas';

interface QuestPuzzleProps {
  id: string;
  width: number;
  height: number;
  pieceSize: number;
}

export const Puzzle: React.FC<QuestPuzzleProps> = (props) => {
  const puzzleRef = useRef<HTMLDivElement>(null);
  const headbreaker: any = require('headbreaker');
  const petImg = useSelector((state: RootState) => state.pet.petDetails?.profileImageUrl);

  useEffect(() => {
    const puzzle = puzzleRef.current;

    if (puzzle) {
      const vangogh = new Image();
      if (petImg) {
        vangogh.src = petImg;
      }

      vangogh.onload = () => {
        const background = new headbreaker.Canvas(puzzle, {
          width: 500,
          height: 500,
          pieceSize: 100,
          proximity: 10,
          borderFill: 10,
          strokeWidth: 2,
          lineSoftness: 0.12,
          image: vangogh,
          maxPiecesCount: { x: 1, y: 1 },
          preventOffstageDrag: true,
          fixed: true,
          painter: new headbreaker.painters.Konva(),
        });

        background.adjustImagesToPuzzleHeight();
        background.autogenerate({
          horizontalPiecesCount: 3,
          verticalPiecesCount: 3,
        });
        background.shuffle(0.7);
        background.draw();
      };
    }
  }, [props.height, props.pieceSize, props.width, petImg]);

  return (
    <div>
      <div
        ref={puzzleRef}
        id={props.id}
        style={{
          width: '100%',
          height: '50%',
          border: 'solid black 1px',
          display: 'flex',
          justifyContent: 'center',
        }}
      ></div>
      <button>누르면 캡처</button>
    </div>
  );
};

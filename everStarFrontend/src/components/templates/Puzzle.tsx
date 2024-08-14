import { ChangeEventHandler, Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
; // import를 사용하여 headbreaker 모듈을 가져옵니다.

interface QuestPuzzleProps {
  id: string;
  width: number;
  height: number;
  pieceSize: number;
}

export const Puzzle: React.FC<QuestPuzzleProps> = (props) => {
  const puzzleRef = useRef<HTMLDivElement>(null); // useRef의 타입을 명시적으로 지정합니다.
  const headbreaker: any = require('headbreaker')

  useEffect(() => {
    const puzzle = puzzleRef.current;

    if (puzzle) {
      const vangogh = new Image();
      vangogh.src = 'https://everstarbucket.s3.ap-northeast-2.amazonaws.com/%EB%B0%A9%EC%9A%B8.jpg';
      
      vangogh.onload = () => {
        const background = new headbreaker.Canvas(puzzle, {
          width: 1000, height: 1000,
          pieceSize: 100, proximity: 10,
          borderFill: 10, strokeWidth: 2,
          lineSoftness: 0.12, image: vangogh,
          maxPiecesCount: {x: 1, y: 1},
          painter: new headbreaker.painters.Konva()
        });

        background.adjustImagesToPuzzleHeight();
        background.autogenerate({
          horizontalPiecesCount: 3,
          verticalPiecesCount: 3
        });
        background.shuffle(0.7);
        background.draw();
      };
    }
  }, [props.height, props.pieceSize, props.width]);

  return <div ref={puzzleRef} id={props.id} style={{ width: props.width, height: props.height }}></div>;
}

import { useCallback, useEffect, useState } from "react";
import "./App.css";
import Board from "./components/Board";
import Control from "./components/Control";
import GameOver from "./components/GameOver";
import ScoreStatus from "./components/ScoreStatus";

export interface ContentModel {
  content: string;
  revealed: boolean;
}

export interface GameStateModel {
  points: number;
  currentFloor: number;
  roundsRemaining: number | null | string;
  isplaying: boolean;
  autoPlay: boolean;
  boxes: ContentModel[][];
  gameOver: boolean;
}

function App() {
  const generateBoxes = (
    difficulty: "Normal" | "Medium" | "Hard" | "Impossible" = "Normal"
  ) => {
    const boxconfigs = {
      Normal: { gems: 3, bombs: 1, boxesPerFloor: 4 },
      Medium: { gems: 2, bombs: 1, boxesPerFloor: 3 },
      Hard: { gems: 1, bombs: 2, boxesPerFloor: 3 },
      Impossible: { gems: 1, bombs: 3, boxesPerFloor: 4 },
    };

    const config = boxconfigs[difficulty];

    let floors = [];
    for (let i = 0; i < 8; i++) {
      // eslint-disable-next-line prefer-const
      let floorBoxes = [];
      let remainingGems = config?.gems;
      let remainingBombs = config?.bombs;
      for (let j = 0; j < config?.boxesPerFloor; j++) {
        while (remainingBombs > 0 || remainingGems > 0) {
          const content =
            Math.random() < remainingGems / (remainingGems + remainingBombs)
              ? "gems"
              : "bombs";
          if (content === "gems") {
            remainingGems--;
          } else if (content === "bombs") {
            remainingBombs--;
          }
          floorBoxes.push({ content, revealed: false });
        }
      }
      floors.push(floorBoxes);
    }
    return floors;
  };
  const [rounds, setRounds] = useState<number>(1);
  const [boxIndex, setBoxIndex] = useState<number | null>(null);
  const [timeoutId, setTimeoutId] = useState<any>(null);
  const [difficultvalue, setDifficultValue] = useState<
    "Normal" | "Medium" | "Hard" | "Impossible"
  >("Normal");

  const [gameState, setGameState] = useState<GameStateModel>({
    points: 50,
    currentFloor: 1,
    roundsRemaining: 1,
    isplaying: false,
    autoPlay: false,
    boxes: generateBoxes("Normal"),
    gameOver: false,
  });

  const resetGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      points: prev?.points < 0 || prev?.points === 0 ? 50 : prev?.points,
      currentFloor: 1,
      roundsRemaining: 1,
      isplaying: false,
      autoPlay: false,
      boxes: generateBoxes("Normal"),
      gameOver: false,
    }));
    setRounds(1);
  }, []);

  const handleBoxClick = (boxIndex: number) => {
    setBoxIndex(boxIndex);
    const newBoxes = [...gameState.boxes];
    const newBox = newBoxes?.[gameState.currentFloor - 1]?.[boxIndex];
    console.log(newBox?.content, gameState?.roundsRemaining, gameState?.points);

    if (newBox?.content === "gems") {
      newBox.revealed = true;
      setGameState((prev) => ({
        ...prev,
        boxes: newBoxes,
        currentFloor: gameState?.currentFloor + 1,
      }));
    } else {
      setGameState((prev) => ({
        ...prev,
        boxes: revealAll(newBoxes),
        points:
          prev?.roundsRemaining === "Infinity" ||
          (typeof prev?.roundsRemaining === "number" &&
            prev?.roundsRemaining > 0)
            ? prev?.points - 10
            : prev?.points,
        roundsRemaining:
          prev?.roundsRemaining !== null
            ? prev?.roundsRemaining !== "Infinity"
              ? Math.max((prev?.roundsRemaining as number) - 1, 0)
              : "Infinity"
            : null,
        currentFloor: gameState?.currentFloor + 1,
      }));
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (gameState?.points < 0 || gameState?.points === 0) {
        setGameState((prev) => ({
          ...prev,
          gameOver: true,
        }));
      }
    }, 500);
  }, [gameState?.points]);

  useEffect(() => {
    setTimeout(() => {
      if (
        ((gameState?.roundsRemaining as number) ?? 0) <= 0 ||
        (gameState?.currentFloor ?? 0) > 8
      ) {
        setGameState((prev) => ({
          ...prev,
          gameOver: true,
        }));
      }
    }, 1300);
  }, [gameState?.roundsRemaining, gameState?.points, gameState?.currentFloor]);

  // helpers
  const revealAll = (boxes: ContentModel[][]) => {
    return boxes?.map((floor, idx) => {
      if (idx === gameState?.currentFloor - 1) {
        return floor?.map((box, _) => ({
          ...box,
          revealed: true,
        }));
      } else {
        return floor;
      }
    });
  };

  useEffect(() => {
    if (
      gameState?.autoPlay === true &&
      gameState?.roundsRemaining !== null &&
      ((typeof gameState?.roundsRemaining === "number" &&
        gameState.roundsRemaining > 0) ||
        gameState?.roundsRemaining === "Infinity")
    ) {
      if (
        (gameState?.currentFloor < 8 || gameState?.currentFloor === 8) &&
        gameState?.points > 0
      ) {
        const timeOutId = setInterval(() => {
          const boxIndex = Math.floor(
            Math.random() *
              gameState?.boxes?.[gameState?.currentFloor - 1]?.length
          );
          handleBoxClick(boxIndex);
          timeOutId !== null && setTimeoutId(timeOutId);
        }, 2000);
        return () => clearInterval(timeOutId);
      }
    }
  }, [
    gameState?.autoPlay,
    gameState?.roundsRemaining,
    gameState?.currentFloor,
    gameState?.points,
  ]);

  const handleSetRemainingRound = () => {
    if (rounds === 0) {
      setRounds(1);
    } else {
      setGameState((prev) => ({
        ...prev,
        roundsRemaining: rounds,
      }));
    }
  };

  const handleAutoplayClick = () => {
    setGameState((prev) => ({
      ...prev,
      roundsRemaining: "Infinity",
      autoPlay: true,
      isplaying: true,
    }));
  };

  const handleManualPlayClick = () => {
    setGameState((prev) => ({
      ...prev,
      isplaying: true,
      points: prev?.points - 5,
    }));
  };

  const handleStopManualPlayClick = () => {
    setGameState((prev) => ({
      ...prev,
      isplaying: false,
      autoPlay: false,
      boxes: generateBoxes(difficultvalue),
      currentFloor: 1,
      roundsRemaining:
        prev?.roundsRemaining === "Infinity" ? 1 : prev?.roundsRemaining,
    }));
    clearInterval(timeoutId);
  };

  const handleDifficultySelect = (
    value: "Normal" | "Medium" | "Hard" | "Impossible"
  ) => {
    setDifficultValue(value);
  };

  const changeGameLevel = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      boxes: generateBoxes(difficultvalue),
    }));
  }, [difficultvalue]);

  const handleAutoPlayStopClick = () => {
    clearInterval(timeoutId);
    setTimeoutId(null);
    setGameState((prev) => ({
      ...prev,
      autoPlay: false,
      isplaying: true,
      roundsRemaining: rounds,
    }));
  };

  useEffect(() => {
    changeGameLevel();
  }, [changeGameLevel]);

  return (
    <>
      <div className="w-full">
        {gameState?.gameOver === true ? (
          <GameOver gameState={gameState} resetGame={resetGame} />
        ) : (
          <div className="w-full min-h-screen max-w-[80%] mx-auto pt-3 flex flex-col">
            <div className="w-full max-w-[800px] mx-auto">
              <ScoreStatus gameState={gameState} />
              <Control
                difficultvalue={difficultvalue}
                gameState={gameState}
                handleAutoPlayStopClick={handleAutoPlayStopClick}
                handleAutoplayClick={handleAutoplayClick}
                handleDifficultySelect={handleDifficultySelect}
                handleManualPlayClick={handleManualPlayClick}
                handleSetRemainingRound={handleSetRemainingRound}
                handleStopManualPlayClick={handleStopManualPlayClick}
                rounds={rounds}
                setRounds={setRounds}
              />
            </div>

            <Board
              boxIndex={boxIndex}
              gameState={gameState}
              handleBoxClick={handleBoxClick}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default App;

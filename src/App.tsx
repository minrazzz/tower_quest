import { Bomb, Gem, Pause, Play } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import "./App.css";

interface ContentModel {
  content: string;
  revealed: boolean;
}

interface GameStateModel {
  points: number;
  currentFloor: number;
  roundsRemaining: number | null | string;
  isplaying: boolean;
  autoPlay: boolean;
  boxes: ContentModel[][];
  gameOver: boolean;
}

const difficultyLevel = [
  {
    label: "Normal",
    value: "Normal",
  },
  {
    label: "Medium",
    value: "Medium",
  },
  {
    label: "Hard",
    value: "Hard",
  },
  {
    label: "Impossible",
    value: "Impossible",
  },
];

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
          <div className="w-full min-h-screen flex justify-center items-center">
            <div className="flex flex-col items-center">
              {gameState?.currentFloor > 8 ? (
                <h1 className="font-bold text-[50px] text-blue-700 font-mono">
                  You WON !!
                </h1>
              ) : (
                <h1 className="font-bold text-[50px] text-blue-700 font-mono">
                  You Loose !!
                </h1>
              )}
              <button
                onClick={resetGame}
                className="text-sm border px-4 py-2 rounded-md bg-green-700 text-white flex items-center hover:opacity-85"
              >
                Please start the game
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full min-h-screen max-w-[80%] mx-auto pt-3 flex flex-col">
            <div className="w-full max-w-[800px] mx-auto">
              <div className="w-full item-center flex justify-between">
                <div className="space-x-1 py-1 flex items-end">
                  <span className="text-lg font-mono text-blue-700">
                    Auto-Play Rounds:
                  </span>
                  <span className="font-bold text-red-700 text-3xl">
                    {gameState?.roundsRemaining === "Infinity" ? (
                      <span>Auto</span>
                    ) : (
                      <span>
                        {(gameState?.roundsRemaining as number) < 0
                          ? "0"
                          : gameState?.roundsRemaining}
                      </span>
                    )}
                  </span>
                </div>
                <div className="space-x-1 py-1 flex items-end">
                  <span className="text-lg font-mono text-blue-700 text-center">
                    Current Floor
                  </span>
                  <span className="font-bold text-red-700 text-3xl">
                    {gameState?.currentFloor}
                  </span>
                </div>
                <div className="space-x-3 py-1 flex items-end">
                  <span className="text-lg text-blue-700 font-mono">
                    Points Remaining :
                  </span>
                  <span className="text-3xl text-red-700 font-bold font-mono">
                    {gameState?.points < 0 ? "0" : gameState?.points}
                  </span>
                </div>
              </div>
              <nav className="w-full flex items-center p-3   gap-x-7 border border-[#0000003b] rounded-md border-blue-400 bg-blue-100">
                {gameState?.isplaying === false ? (
                  <button
                    className=" flex flex-col items-center p-1 "
                    onClick={handleManualPlayClick}
                  >
                    <div className="w-[60px] h-[60px] rounded-full border flex items-center justify-center bg-green-700">
                      <Play className="" stroke="white" />
                    </div>

                    <span className="font-semibold text-green-700">
                      Start Game
                    </span>
                  </button>
                ) : (
                  <button
                    className=" flex flex-col items-center p-1 "
                    onClick={handleStopManualPlayClick}
                  >
                    <div className="w-[60px] h-[60px] rounded-full border flex items-center justify-center bg-red-700">
                      <Pause className="" stroke="white" />
                    </div>

                    <span className="font-semibold text-red-700">
                      Stop Game
                    </span>
                  </button>
                )}
                <div className="flex-1 flex flex-col w-full">
                  {gameState?.isplaying === false &&
                  gameState?.autoPlay === false ? (
                    <div className="w-full flex gap-x-1">
                      <input
                        type="number"
                        placeholder="Enter the required rounds"
                        className="w-full max-w-[250px] p-2 border outline-none focus:outline-none rounded-md"
                        value={rounds as number}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setRounds(Number(e.target.value));
                        }}
                      />
                      <button
                        onClick={handleSetRemainingRound}
                        type="submit"
                        className="border border-l-0 px-3 p-2 bg-blue-700 text-white rounded-md hover:opacity-80"
                      >
                        AddRounds
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-end gap-x-1">
                      <span className="text-lg font-semibold text-blue-700">
                        Difficulty
                      </span>
                      <span className="text-3xl font-semibold text-blue-800">
                        {difficultvalue}
                      </span>
                    </div>
                  )}
                  <p className="text-sm font-semibold text-blue-700 pl-7">or</p>
                  {gameState?.autoPlay === false ? (
                    <button
                      onClick={handleAutoplayClick}
                      className="w-fit px-4 border py-1 bg-blue-700 text-white rounded-md hover:opacity-80"
                    >
                      Play-Auto
                    </button>
                  ) : (
                    <button
                      onClick={handleAutoPlayStopClick}
                      className="w-fit px-4 border py-1 bg-red-700 text-white rounded-md hover:opacity-80"
                    >
                      Stop Auto
                    </button>
                  )}
                </div>
                {gameState?.isplaying === false &&
                  gameState?.autoPlay === false && (
                    <select
                      name=""
                      id=""
                      value={difficultvalue}
                      className="p-1 outline-none focus:outline-none rounded-md"
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        handleDifficultySelect(
                          e.target.value as
                            | "Normal"
                            | "Medium"
                            | "Hard"
                            | "Impossible"
                        )
                      }
                    >
                      {difficultyLevel?.map((item, idx) => (
                        <option key={idx} value={`${item?.value}`}>
                          {item?.label}
                        </option>
                      ))}
                    </select>
                  )}
              </nav>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center">
              {(gameState?.isplaying || gameState?.autoPlay) && (
                <div className=" w-full max-w-[500px] space-y-1 border flex  flex-col-reverse">
                  {gameState?.boxes &&
                    gameState?.boxes?.length > 0 &&
                    gameState?.boxes?.map((floor, idxs) => (
                      <div
                        key={idxs}
                        className={`relative w-full p-1  flex  items-center  justify-between border-r last:border-none h-[50px] gap-x-2 gap-y-100 rounded-lg ${
                          gameState?.currentFloor - 1 === idxs
                            ? "bg-blue-700"
                            : ""
                        }`}
                      >
                        {floor &&
                          floor?.length > 0 &&
                          floor?.map((box, idx) => (
                            <div
                              key={idx}
                              className={`flex-1 h-full  text-center flex items-center justify-center border ${
                                box?.revealed === true &&
                                (gameState?.currentFloor - 1 == idxs ||
                                  gameState?.currentFloor - 2 === idxs)
                                  ? boxIndex === idx
                                    ? box?.content == "gems"
                                      ? "bg-green-700 text-white"
                                      : "bg-red-700 text-white"
                                    : "bg-blue-100 text-blue-500"
                                  : "bg-[#0000003a] text-blue-700"
                              }`}
                            >
                              <button
                                disabled={
                                  gameState?.currentFloor - 1 !== idxs ||
                                  gameState?.gameOver === true
                                }
                                className={`w-full h-full ${box}`}
                                onClick={() => handleBoxClick(idx as number)}
                              >
                                <div
                                  className={`flex items-center justify-center ${
                                    box?.revealed === true
                                      ? "opacity-1"
                                      : "opacity-0"
                                  }`}
                                >
                                  {box?.content === "gems" ? (
                                    <span className="">
                                      <Gem size={20} />
                                    </span>
                                  ) : (
                                    <span>
                                      <Bomb />
                                    </span>
                                  )}
                                </div>
                              </button>
                            </div>
                          ))}
                        <span className="absolute -left-20 font-mo">
                          <span className="text-blue-70  font-semibold">
                            Floor
                          </span>{" "}
                          <span className="text-green-700">{idxs + 1}</span>
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;

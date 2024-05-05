import React, { useEffect, useState } from "react";
import { Play } from "lucide-react";
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
  const [rounds, setRounds] = useState<number>(0);
  const [difficultvalue, setDifficultValue] = useState<
    "Normal" | "Medium" | "Hard" | "Impossible"
  >("Normal");

  const [gameState, setGameState] = useState<GameStateModel>({
    points: 100,
    currentFloor: 1,
    roundsRemaining: 0,
    isplaying: true,
    autoPlay: false,
    boxes: generateBoxes("Normal"),
  });

  // console.log(gameState?.roundsRemaining);

  const handleBoxClick = (boxIndex: number) => {
    // console.log("hello");
    const newBoxes = [...gameState.boxes];
    const newBox = newBoxes?.[gameState.currentFloor - 1]?.[boxIndex];
    console.log(newBox?.content);

    if (newBox?.content === "gems") {
      newBox.revealed = true;
      setGameState((prev) => ({
        ...prev,
        boxes: newBoxes,
        currentFloor: Math.min(prev.currentFloor + 1, 8),
      }));
    } else {
      setGameState((prev) => ({
        ...prev,
        boxes: revealAll(newBoxes),
        points: prev?.autoPlay ? Math.max(prev?.points - 10, 0) : prev?.points,
      }));
    }
  };

  // helpers
  const revealAll = (boxes: ContentModel[][]) => {
    return boxes?.map((floor, _) =>
      floor?.map((box, _) => ({
        ...box,
        revealed: true,
      }))
    );
  };

  console.log(gameState?.currentFloor, gameState?.roundsRemaining);

  useEffect(() => {
    if (
      gameState?.autoPlay === true &&
      ((typeof gameState?.roundsRemaining === "number" &&
        gameState.roundsRemaining > 0) ||
        gameState?.roundsRemaining === "Infinity")
    ) {
      // if (gameState?.currentFloor !== 8) {
      //   setGameState((prev) => ({
      //     ...prev,
      //     points: Math.max(prev?.points - 5, 0),
      //   }));
      // }

      if (gameState?.currentFloor < 8) {
        console.log("hello");
        const timeOutId = setInterval(() => {
          const boxIndex = Math.floor(
            Math.random() *
              gameState?.boxes?.[gameState?.currentFloor - 1]?.length
          );
          handleBoxClick(boxIndex);

          setGameState((prev) => ({
            ...prev,
            autoPlay: false,
            roundsRemaining: 0,
          }));
        }, 1000);
        if (gameState?.currentFloor === 8) {
          return () => clearInterval(timeOutId);
        }
      }

      // return () => clearInterval(timeOutId);
    }
  }, [
    gameState?.autoPlay,
    gameState?.roundsRemaining,
    gameState?.currentFloor,
  ]);

  // useEffect(() => {
  //   if (gameState?.autoPlay === false) {
  //     alert("hello");
  //   }
  // }, [gameState?.autoPlay]);
  const handleSetRemainingRound = () => {
    setGameState((prev) => ({
      ...prev,
      roundsRemaining: rounds,
    }));
    setRounds(0);
  };

  const handleAutoplayClick = () => {
    setGameState((prev) => ({
      ...prev,
      roundsRemaining: "Infinity",
      autoPlay: true,
    }));
  };

  const handleDifficultySelect = (
    value: "Normal" | "Medium" | "Hard" | "Impossible"
  ) => {
    setDifficultValue(value);
  };

  useEffect(() => {
    setGameState((prev) => ({
      ...prev,
      boxes: generateBoxes(difficultvalue),
    }));
  }, [difficultvalue]);

  return (
    <>
      <div className="w-full">
        <div className="w-full min-h-screen max-w-[80%] mx-auto pt-12 flex flex-col">
          <nav className="w-full flex items-center p-3 max-w-[800px] mx-auto gap-x-7 border border-[#0000003b] rounded-md border-blue-400 bg-blue-100">
            <button className=" flex flex-col items-center p-1 ">
              <div className="w-[60px] h-[60px] rounded-full border flex items-center justify-center bg-green-700">
                <Play className="" stroke="white" />
              </div>

              <span className="font-semibold text-green-700">Start Game</span>
            </button>
            <div className="flex-1 flex flex-col">
              <div className="space-x-1 py-1">
                <span className="text-lg font-mono text-blue-700">
                  Auto-Play Rounds:
                </span>
                <span className="font-semibold text-green-700">
                  {gameState?.roundsRemaining === "Infinity" ? (
                    <span>Auto</span>
                  ) : (
                    <span>{gameState?.roundsRemaining}</span>
                  )}
                </span>
              </div>
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
              <p className="text-sm font-semibold text-blue-700 pl-7">or</p>
              <button
                onClick={handleAutoplayClick}
                className="w-fit px-4 border py-1 bg-blue-700 text-white rounded-md hover:opacity-80"
              >
                Play-Auto
              </button>
            </div>
            <select
              name=""
              id=""
              value={difficultvalue}
              className="p-1 outline-none focus:outline-none rounded-md"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                handleDifficultySelect(
                  e.target.value as "Normal" | "Medium" | "Hard" | "Impossible"
                )
              }
            >
              {difficultyLevel?.map((item, idx) => (
                <option key={idx} value={`${item?.value}`}>
                  {item?.label}
                </option>
              ))}
            </select>
          </nav>
          <div className="flex-1 flex flex-col items-center justify-center">
            {(gameState?.isplaying || gameState?.autoPlay) && (
              <div className=" w-full max-w-[500px] space-y-1 border flex  flex-col-reverse">
                {gameState?.boxes &&
                  gameState?.boxes?.length > 0 &&
                  gameState?.boxes?.map((floor, idxs) => (
                    <div
                      key={idxs}
                      className={`w-full p-1  flex  items-center  justify-between border-r last:border-none h-[50px] gap-x-2 gap-y-100 rounded-lg ${
                        gameState?.currentFloor - 1 === idxs ? "bg-red-500" : ""
                      }`}
                    >
                      {floor &&
                        floor?.length > 0 &&
                        floor?.map((box, idx) => (
                          <div
                            key={idx}
                            className={`flex-1 h-full  text-center flex items-center justify-center 
                     
                      `}
                          >
                            <button
                              disabled={gameState?.currentFloor - 1 !== idxs}
                              className=""
                              onClick={() => handleBoxClick(idx as number)}
                            >
                              <span className="text-black">{box?.content}</span>
                            </button>
                          </div>
                        ))}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

import { Pause, Play } from "lucide-react";
import { GameStateModel } from "../App";
import { Dispatch, SetStateAction } from "react";

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

interface ControlProps {
  gameState: GameStateModel;
  handleManualPlayClick: () => void;
  handleStopManualPlayClick: () => void;
  handleSetRemainingRound: () => void;
  handleAutoplayClick: () => void;
  handleAutoPlayStopClick: () => void;
  handleDifficultySelect: (
    value: "Normal" | "Medium" | "Hard" | "Impossible"
  ) => void;
  rounds: number;
  difficultvalue: "Normal" | "Medium" | "Hard" | "Impossible";
  setRounds: Dispatch<SetStateAction<number>>;
}

export default function Control({
  gameState,
  handleManualPlayClick,
  handleStopManualPlayClick,
  rounds,
  setRounds,
  handleSetRemainingRound,
  handleAutoplayClick,
  handleAutoPlayStopClick,
  handleDifficultySelect,
  difficultvalue,
}: ControlProps) {
  return (
    <nav className="w-full flex items-center p-3   gap-x-7 border border-[#0000003b] rounded-md border-blue-400 bg-blue-100">
      {gameState?.isplaying === false ? (
        <button
          className=" flex flex-col items-center p-1 "
          onClick={handleManualPlayClick}
        >
          <div className="w-[60px] h-[60px] rounded-full border flex items-center justify-center bg-green-700">
            <Play className="" stroke="white" />
          </div>

          <span className="font-semibold text-green-700">Start Game</span>
        </button>
      ) : (
        <button
          className=" flex flex-col items-center p-1 "
          onClick={handleStopManualPlayClick}
        >
          <div className="w-[60px] h-[60px] rounded-full border flex items-center justify-center bg-red-700">
            <Pause className="" stroke="white" />
          </div>

          <span className="font-semibold text-red-700">Stop Game</span>
        </button>
      )}
      <div className="flex-1 flex flex-col w-full">
        {gameState?.isplaying === false && gameState?.autoPlay === false ? (
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
      {gameState?.isplaying === false && gameState?.autoPlay === false && (
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
      )}
    </nav>
  );
}

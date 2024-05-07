import { Bomb, Gem } from "lucide-react";
import { GameStateModel } from "../App";

interface BoardProps {
  gameState: GameStateModel;
  boxIndex: null | number;
  handleBoxClick: (value: number) => void;
}

export default function Board({
  gameState,
  boxIndex,
  handleBoxClick,
}: BoardProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      {(gameState?.isplaying || gameState?.autoPlay) && (
        <div className=" w-full max-w-[500px] space-y-1 border flex  flex-col-reverse">
          {gameState?.boxes &&
            gameState?.boxes?.length > 0 &&
            gameState?.boxes?.map((floor, idxs) => (
              <div
                key={idxs}
                className={`relative w-full p-1  flex  items-center  justify-between border-r last:border-none h-[50px] gap-x-2 gap-y-100 rounded-lg ${
                  gameState?.currentFloor - 1 === idxs ? "bg-blue-700" : ""
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
                            box?.revealed === true ? "opacity-1" : "opacity-0"
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
                  <span className="text-blue-70  font-semibold">Floor</span>{" "}
                  <span className="text-green-700">{idxs + 1}</span>
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

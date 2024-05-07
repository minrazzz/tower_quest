import { GameStateModel } from "../App";

interface GameOverProps {
  gameState: GameStateModel;
  resetGame: () => void;
}

export default function GameOver({ gameState, resetGame }: GameOverProps) {
  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <div className="flex flex-col items-center">
        {gameState?.currentFloor > 8 &&
        gameState?.points > 0 &&
        (gameState?.roundsRemaining as number) > 0 ? (
          <h1 className="font-bold text-[50px] text-blue-700 font-mono">
            Game Over{""}
            <div>
              <span>Rounds</span>
              <span>{gameState?.roundsRemaining}</span>
            </div>
            <div>
              <span>Rounds</span>
              <span>{gameState?.points}</span>
            </div>
          </h1>
        ) : (
          <h1 className="font-bold text-[50px] text-blue-700 font-mono">
            Game Over{" "}
            {gameState?.points === 0 ||
              (gameState?.points < 0 && (
                <span>
                  Points{" "}
                  <span className="text-red-500">{gameState?.points}</span>
                </span>
              ))}{" "}
            {gameState?.roundsRemaining === 0 && (
              <span>
                Rounds remaining{" "}
                <span className="text-red-500">
                  {gameState?.roundsRemaining}
                </span>
              </span>
            )}
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
  );
}

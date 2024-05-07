import { GameStateModel } from "../App";

interface ScoreStatusProps {
  gameState: GameStateModel;
}

export default function ScoreStatus({ gameState }: ScoreStatusProps) {
  return (
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
  );
}

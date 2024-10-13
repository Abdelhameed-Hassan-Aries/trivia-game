import { useState } from "react";
import CategorySelection from "./components/CategorySelection";
import QuestionScreen from "./components/QuestionScreen";
import ScoreScreen from "./components/ScoreScreen";
import WelcomeScreen from "./components/WelcomeScreen";
import { GameState } from "./types";

function App() {
  const [gameState, setGameState] = useState<GameState>({
    playerName: "",
    difficulty: "",
    token: "",
    selectedCategories: [],
    currentCategory: null,
    score: 0,
    totalQuestions: 0,
    answers: [],
    gameCompleted: false,
  });

  return (
    <>
      {!gameState.playerName ? (
        <WelcomeScreen setGameState={setGameState} />
      ) : !gameState.currentCategory && !gameState.gameCompleted ? (
        <CategorySelection gameState={gameState} setGameState={setGameState} />
      ) : gameState.gameCompleted ? (
        <ScoreScreen gameState={gameState} setGameState={setGameState} />
      ) : (
        <QuestionScreen gameState={gameState} setGameState={setGameState} />
      )}
    </>
  );
}

export default App;

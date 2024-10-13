// src/components/ScoreScreen.tsx
import React from "react";
import { Box, Button, Typography, Container } from "@mui/material";
import Chart from "react-apexcharts";
import { GameState } from "../types";

interface ScoreScreenProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const ScoreScreen: React.FC<ScoreScreenProps> = ({
  gameState,
  setGameState,
}) => {
  const correctAnswers = gameState.answers.filter(
    (a) => a.correct && !a.skipped
  ).length;
  const incorrectAnswers = gameState.answers.filter(
    (a) => !a.correct && !a.skipped
  ).length;
  const skippedAnswers = gameState.answers.filter((a) => a.skipped).length;

  const totalTimeSpent = gameState.answers.reduce(
    (total, answer) => total + answer.timeTaken,
    0
  );

  const pieOptions = {
    labels: ["Correct", "Incorrect", "Skipped"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
        },
      },
    ],
  };
  const pieSeries = [correctAnswers, incorrectAnswers, skippedAnswers];

  const startNewGame = () => {
    setGameState({
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
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Congratulations, {gameState.playerName}!
      </Typography>
      <Typography variant="h6" gutterBottom>
        Total Time Spent: {Math.round(totalTimeSpent)} seconds
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Chart options={pieOptions} series={pieSeries} type="pie" width="500" />
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={startNewGame}
        sx={{ mt: 4 }}
      >
        Start New Game
      </Button>
    </Container>
  );
};

export default ScoreScreen;

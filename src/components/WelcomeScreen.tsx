// src/components/WelcomeScreen.tsx
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Container,
} from "@mui/material";
import { fetchToken } from "../api";
import { GameState } from "../types";

interface WelcomeScreenProps {
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ setGameState }) => {
  const [playerName, setPlayerName] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const difficulties = ["easy", "medium", "hard"];

  const startGame = async () => {
    const token = await fetchToken();
    setGameState((prev) => ({
      ...prev,
      playerName,
      difficulty,
      token,
    }));
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Trivia Game
      </Typography>
      <TextField
        label="Enter your name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        select
        label="Select Difficulty"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        fullWidth
        margin="normal"
      >
        {difficulties.map((option) => (
          <MenuItem key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </MenuItem>
        ))}
      </TextField>
      <Button
        variant="contained"
        color="primary"
        onClick={startGame}
        disabled={!playerName || !difficulty}
        fullWidth
        sx={{ mt: 2 }}
      >
        Start Game
      </Button>
    </Container>
  );
};

export default WelcomeScreen;

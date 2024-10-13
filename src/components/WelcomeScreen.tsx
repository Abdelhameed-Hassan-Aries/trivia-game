// src/components/WelcomeScreen.tsx
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Stack,
} from "@mui/material";
import { fetchToken } from "../api";
import { GameState } from "../types";
import { styled } from "@mui/material/styles";

interface WelcomeScreenProps {
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const BackgroundBox = styled(Box)(({ theme }) => ({
  background: "#D9D9D9",
  maxWidth: "616px",
  maxHeight: "448px",
  borderRadius: "22px",
  padding: "100px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const PlayerNameInput = styled(TextField)({
  width: "410px",
  height: "110px",
  borderRadius: "4px",
  border: "1px solid black",
  backgroundColor: "#F2F2F2",
  marginBottom: "38px",
  fontSize: "25px",
  "& .MuiInputBase-root": {
    height: "100%",
    fontSize: "25px",
  },
});

const DifficultyButton = styled(Button)<{ selected: boolean }>(
  ({ selected }) => ({
    width: "100px",
    height: "100px",
    borderRadius: "4px",
    border: selected ? "2px solid #1976d2" : "1px solid black",
    margin: "0 10px",
    backgroundColor: "#B6B6B6",
    color: "#000",
    fontSize: "25px",
    boxSizing: "border-box",
  })
);

const PlayButton = styled(Button)(({ theme }) => ({
  width: "192px",
  height: "46px",
  borderRadius: "4px",
  border: "1px solid black",
  marginTop: "46px",
  fontSize: "25px",
  backgroundColor: "#B6B6B6",
  color: "rgba(0, 0, 0, 0.38)", // Default disabled text color
  "&:hover": {
    backgroundColor: "transparent",
  },
  "&:disabled": {
    color: "rgba(0, 0, 0, 0.38)", // Disabled text color
  },
  "&:not(:disabled)": {
    color: "black", // Enabled text color
  },
}));

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ setGameState }) => {
  const [playerName, setPlayerName] = useState("");
  const [difficulty, setDifficulty] = useState("easy");

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
    <Container
      maxWidth="sm"
      sx={{
        height: "100vh",
        mt: 5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack sx={{ alignItems: "center" }}>
        <BackgroundBox>
          <PlayerNameInput
            placeholder="Player Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            variant="outlined"
            InputProps={{ disableUnderline: true }}
          />
          <Box
            sx={{
              display: "flex",
            }}
          >
            {difficulties.map((level) => (
              <DifficultyButton
                key={level}
                onClick={() => setDifficulty(level)}
                selected={difficulty === level}
              >
                {level.charAt(0) + level.slice(1)}
              </DifficultyButton>
            ))}
          </Box>
        </BackgroundBox>

        <PlayButton
          variant="contained"
          onClick={startGame}
          disabled={!playerName}
        >
          Play
        </PlayButton>
      </Stack>
    </Container>
  );
};

export default WelcomeScreen;

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Container,
  Stack,
  Typography,
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
  width: "616px",
  maxHeight: "448px",
  height: "448px",
  borderRadius: "22px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
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
    textTransform: "none",
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
  color: "rgba(0, 0, 0, 0.38)",
  "&:disabled": {
    color: "rgba(0, 0, 0, 0.38)",
  },
  "&:not(:disabled)": {
    color: "black",
  },
  textTransform: "uppercase",
}));

const InstructionBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: "20px",
  left: "20px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  color: "#000",
}));

const ShortcutKey = styled(Box)(({ theme }) => ({
  backgroundColor: "#B6B6B6",
  padding: "2px 6px",
  borderRadius: "4px",
  fontWeight: "bold",
  marginRight: "5px",
}));

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ setGameState }) => {
  const [playerName, setPlayerName] = useState("");
  const [difficulty, setDifficulty] = useState("easy");

  const difficulties = ["easy", "medium", "hard"];

  const nameInputRef = useRef<HTMLInputElement>(null);
  const playButtonRef = useRef<HTMLButtonElement>(null);
  const difficultyRefs = {
    easy: useRef<HTMLButtonElement>(null),
    medium: useRef<HTMLButtonElement>(null),
    hard: useRef<HTMLButtonElement>(null),
  };

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const startGame = async () => {
    const token = await fetchToken();
    setGameState((prev) => ({
      ...prev,
      playerName,
      difficulty,
      token,
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (document.activeElement === nameInputRef.current) {
      return;
    }

    if (e.key === "Enter") {
      if (document.activeElement === difficultyRefs[difficulty]?.current) {
        if (playerName) {
          startGame();
        }
      } else if (document.activeElement === playButtonRef.current) {
        if (playerName) {
          startGame();
        }
      }
    } else if (e.key.toLowerCase() === "e") {
      setDifficulty("easy");
      difficultyRefs["easy"].current?.focus();
    } else if (e.key.toLowerCase() === "m") {
      setDifficulty("medium");
      difficultyRefs["medium"].current?.focus();
    } else if (e.key.toLowerCase() === "h") {
      setDifficulty("hard");
      difficultyRefs["hard"].current?.focus();
    } else if (e.key.toLowerCase() === "p") {
      if (playerName) {
        playButtonRef.current?.click();
      }
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <Stack sx={{ alignItems: "center" }}>
        <BackgroundBox>
          <PlayerNameInput
            placeholder="Player Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            variant="outlined"
            InputProps={{ disableUnderline: true }}
            inputRef={nameInputRef}
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
                ref={difficultyRefs[level]}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </DifficultyButton>
            ))}
          </Box>
        </BackgroundBox>

        <PlayButton
          variant="contained"
          onClick={startGame}
          disabled={!playerName}
          ref={playButtonRef}
        >
          Play
        </PlayButton>
      </Stack>

      <InstructionBox>
        <Box sx={{ display: "flex", gap: "5px", ml: 2 }}>
          {["E", "M", "H", "P"].map((key, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
              <ShortcutKey>{key}</ShortcutKey>
              <Typography variant="body1">
                {key === "E"
                  ? "asy"
                  : key === "M"
                  ? "edium"
                  : key === "H"
                  ? "ard"
                  : "lay"}
              </Typography>
            </Box>
          ))}
        </Box>
      </InstructionBox>
    </Container>
  );
};

export default WelcomeScreen;

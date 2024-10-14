import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../api";
import {
  Box,
  Button,
  Typography,
  Container,
  CircularProgress,
  Grid,
} from "@mui/material";
import { GameState, Category } from "../types";
import { styled } from "@mui/material/styles";
import KeyboardIcon from "@mui/icons-material/Keyboard";

interface CategorySelectionProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const CategoryButton = styled(Button)<{ selected: boolean }>(
  ({ selected }) => ({
    width: "100%",
    height: "100px",
    backgroundColor: "#B6B6B6",
    color: "#000",
    border: selected ? "2px solid #1976d2" : "1px solid black",
    textTransform: "none",
    fontSize: "20px",
    textWrap: "balance",
    "&:disabled": {
      opacity: 0.5,
    },
  })
);

const StartButton = styled(Button)(({ theme }) => ({
  width: "192px",
  height: "46px",
  borderRadius: "4px",
  border: "1px solid black",
  marginTop: "60px",
  marginBottom: "60px",
  fontSize: "25px",
  backgroundColor: "#B6B6B6",
  color: "#000",
  textTransform: "uppercase",
  "&:hover": {
    backgroundColor: "#B6B6B6",
  },
  "&:disabled": {
    opacity: 0.5,
  },
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

const CategorySelection: React.FC<CategorySelectionProps> = ({
  gameState,
  setGameState,
}) => {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const [selectedCategory, setSelectedCategory] = useState<
    number | "random" | null
  >(null);

  const categoryRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const startButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (categoryRefs.current[0]) {
      categoryRefs.current[0].focus();
    }
  }, [categories]);

  const handleSelectCategory = (categoryId: number | "random") => {
    setSelectedCategory(categoryId);
  };

  const startGame = () => {
    let categoryId: number | null = selectedCategory as number;

    if (selectedCategory === "random" && categories) {
      const availableCategories = categories.filter(
        (category) => !gameState.selectedCategories.includes(category.id)
      );

      if (availableCategories.length === 0) {
        alert("No more categories available.");
        return;
      }

      const randomCategory =
        availableCategories[
          Math.floor(Math.random() * availableCategories.length)
        ];

      categoryId = randomCategory.id;
    }

    setGameState((prev) => ({
      ...prev,
      currentCategory: categoryId,
      selectedCategories: [...prev.selectedCategories, categoryId],
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = categoryRefs.current.findIndex(
      (ref) => ref === document.activeElement
    );

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex =
        currentIndex + 1 < categoryRefs.current.length
          ? currentIndex + 1
          : currentIndex;
      categoryRefs.current[nextIndex]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = currentIndex - 1 >= 0 ? currentIndex - 1 : 0;
      categoryRefs.current[prevIndex]?.focus();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (document.activeElement instanceof HTMLButtonElement) {
        document.activeElement.click();
      }
    } else if (e.key.toLowerCase() === "s") {
      if (selectedCategory !== null) {
        startGame();
      }
    }
  };

  if (isLoading)
    return (
      <Container
        maxWidth="sm"
        sx={{ mt: 5, textAlign: "center" }}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <CircularProgress />
      </Container>
    );

  return (
    <Container
      sx={{
        minWidth: "100%",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: 5,
        color: "#000",
        margin: "16px",
        position: "relative",
      }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <Typography variant="h2" gutterBottom sx={{ marginBottom: "60px" }}>
        Questions Category
      </Typography>
      <Box sx={{ width: "100%", maxWidth: 1000 }}>
        <Grid container spacing={5} justifyContent="center">
          {categories?.map((category, index) => (
            <Grid item xs={12} sm={4} md={4} key={category.id}>
              <CategoryButton
                onClick={() => handleSelectCategory(category.id)}
                disabled={gameState.selectedCategories.includes(category.id)}
                selected={selectedCategory === category.id}
                ref={(el) => (categoryRefs.current[index] = el)}
              >
                {category.name}
              </CategoryButton>
            </Grid>
          ))}
          <Grid item xs={12}>
            <CategoryButton
              onClick={() => handleSelectCategory("random")}
              selected={selectedCategory === "random"}
              ref={(el) => (categoryRefs.current[categories?.length || 0] = el)}
            >
              Random Category
            </CategoryButton>
          </Grid>
        </Grid>
      </Box>
      <StartButton
        onClick={startGame}
        disabled={selectedCategory === null}
        ref={startButtonRef}
      >
        START
      </StartButton>

      <InstructionBox>
        <KeyboardIcon />
        <Typography variant="body1">Move Around</Typography>
        <Box sx={{ display: "flex", alignItems: "center", ml: 2, gap: "10px" }}>
          <ShortcutKey>Space</ShortcutKey>
          <Typography variant="body1">Select</Typography>
          <ShortcutKey>S</ShortcutKey>
          <Typography variant="body1">tart</Typography>
        </Box>
      </InstructionBox>
    </Container>
  );
};

export default CategorySelection;

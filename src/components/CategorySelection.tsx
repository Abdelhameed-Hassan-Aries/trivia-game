// src/components/CategorySelection.tsx
import React, { useState } from "react";
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

interface CategorySelectionProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

// Styled Components
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

  const handleSelectCategory = (categoryId: number | "random") => {
    setSelectedCategory(categoryId);
  };

  const startGame = () => {
    let categoryId: number | null = selectedCategory as number;

    if (selectedCategory === "random" && categories) {
      // Filter out categories that have already been selected
      const availableCategories = categories.filter(
        (category) => !gameState.selectedCategories.includes(category.id)
      );

      if (availableCategories.length === 0) {
        alert("No more categories available.");
        return;
      }

      // Pick a random category from available categories
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

  if (isLoading)
    return (
      <Container maxWidth="sm" sx={{ mt: 5, textAlign: "center" }}>
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
      }}
    >
      <Typography variant="h2" gutterBottom sx={{ marginBottom: "60px" }}>
        Questions Category
      </Typography>
      <Box sx={{ width: "100%", maxWidth: 1000 }}>
        <Grid container spacing={5} justifyContent="center">
          {categories?.map((category) => (
            <Grid item xs={12} sm={4} md={4} key={category.id}>
              <CategoryButton
                onClick={() => handleSelectCategory(category.id)}
                disabled={gameState.selectedCategories.includes(category.id)}
                selected={selectedCategory === category.id}
              >
                {category.name}
              </CategoryButton>
            </Grid>
          ))}
          <Grid item xs={12}>
            <CategoryButton
              onClick={() => handleSelectCategory("random")}
              selected={selectedCategory === "random"}
            >
              Random Category
            </CategoryButton>
          </Grid>
        </Grid>
      </Box>
      <StartButton onClick={startGame} disabled={selectedCategory === null}>
        START
      </StartButton>
    </Container>
  );
};

export default CategorySelection;

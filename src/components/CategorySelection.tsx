// src/components/CategorySelection.tsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../api";
import {
  Box,
  Button,
  Grid,
  Typography,
  Container,
  CircularProgress,
} from "@mui/material";
import { GameState, Category } from "../types";

interface CategorySelectionProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const CategorySelection: React.FC<CategorySelectionProps> = ({
  gameState,
  setGameState,
}) => {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const selectCategory = (categoryId: number | null) => {
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
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Select a Category
      </Typography>
      <Grid container spacing={2}>
        {categories?.map((category) => (
          <Grid item xs={6} md={4} key={category.id}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => selectCategory(category.id)}
              disabled={gameState.selectedCategories.includes(category.id)}
            >
              {category.name}
            </Button>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={() => selectCategory(null)}
          >
            Random Category
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CategorySelection;

// src/components/QuestionScreen.tsx
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Container,
  LinearProgress,
} from "@mui/material";
import { fetchQuestions } from "../api";
import he from "he";
import { GameState, QuestionResponse } from "../types";

interface QuestionScreenProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const QuestionScreen: React.FC<QuestionScreenProps> = ({
  gameState,
  setGameState,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [timer, setTimer] = useState(90);
  const N = 3; // Number of questions per category
  const M = 3; // Number of categories to complete

  const difficultyTimes: Record<string, number> = {
    easy: 90,
    medium: 60,
    hard: 30,
  };

  const params = {
    amount: N,
    category: gameState.currentCategory,
    difficulty: gameState.difficulty,
    token: gameState.token,
    type: "multiple",
  };

  const { data: questions, isLoading } = useQuery<QuestionResponse[]>({
    queryKey: ["questions", params],
    queryFn: () => fetchQuestions(params),
  });

  useEffect(() => {
    setTimer(difficultyTimes[gameState.difficulty]);
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          handleSkip();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex]);

  const handleSubmit = () => {
    if (!questions) return;
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    setGameState((prev) => ({
      ...prev,
      score: isCorrect ? prev.score + 1 : prev.score,
      totalQuestions: prev.totalQuestions + 1,
      answers: [
        ...prev.answers,
        {
          question: currentQuestion.question,
          correct: isCorrect,
          skipped: false,
          timeTaken: difficultyTimes[gameState.difficulty] - timer,
        },
      ],
    }));
    moveToNextQuestion();
  };

  const handleSkip = () => {
    if (!questions) return;
    const currentQuestion = questions[currentQuestionIndex];
    setGameState((prev) => ({
      ...prev,
      totalQuestions: prev.totalQuestions + 1,
      answers: [
        ...prev.answers,
        {
          question: currentQuestion.question,
          correct: false,
          skipped: true,
          timeTaken: difficultyTimes[gameState.difficulty] - timer,
        },
      ],
    }));
    moveToNextQuestion();
  };

  const moveToNextQuestion = () => {
    setSelectedAnswer("");
    if (questions && currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else if (gameState.selectedCategories.length >= M) {
      setGameState((prev) => ({
        ...prev,
        gameCompleted: true,
        currentCategory: null,
      }));
    } else {
      setGameState((prev) => ({
        ...prev,
        currentCategory: null,
      }));
    }
  };

  if (isLoading)
    return (
      <Container maxWidth="sm" sx={{ mt: 5, textAlign: "center" }}>
        <LinearProgress />
      </Container>
    );

  if (!questions || questions.length === 0)
    return (
      <Container maxWidth="sm" sx={{ mt: 5, textAlign: "center" }}>
        <Typography variant="h6">No questions available.</Typography>
      </Container>
    );

  const currentQuestion = questions[currentQuestionIndex];
  const answers = [
    currentQuestion.correct_answer,
    ...currentQuestion.incorrect_answers,
  ].sort(() => Math.random() - 0.5);

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h6">Time Left: {timer} seconds</Typography>
      <Box sx={{ my: 2 }}>
        <Typography variant="h5">
          {he.decode(currentQuestion.question)}
        </Typography>
      </Box>
      <RadioGroup
        value={selectedAnswer}
        onChange={(e) => setSelectedAnswer(e.target.value)}
      >
        {answers.map((answer, index) => (
          <FormControlLabel
            key={index}
            value={answer}
            control={<Radio />}
            label={he.decode(answer)}
          />
        ))}
      </RadioGroup>
      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!selectedAnswer}
          sx={{ mr: 2 }}
        >
          Submit Answer
        </Button>
        <Button variant="outlined" onClick={handleSkip}>
          Skip Question
        </Button>
      </Box>
    </Container>
  );
};

export default QuestionScreen;

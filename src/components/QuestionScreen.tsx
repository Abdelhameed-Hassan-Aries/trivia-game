import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Button,
  Typography,
  Container,
  LinearProgress,
  Grid,
  Stack,
} from "@mui/material";
import { fetchQuestions } from "../api";
import he from "he";
import { GameState, QuestionResponse } from "../types";
import { styled } from "@mui/material/styles";
import KeyboardIcon from "@mui/icons-material/Keyboard";

interface QuestionScreenProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const OptionButton = styled(Button)<{ selected: boolean }>(
  ({ selected, theme }) => ({
    width: "100%",
    minHeight: "100px",
    backgroundColor: "#B6B6B6",
    color: "#000",
    fontSize: "20px",
    textTransform: "none",
    textAlign: "center",
    whiteSpace: "normal",
    border: selected ? "2px solid #1976d2" : "1px solid black",
    [theme.breakpoints.down("sm")]: {
      minHeight: "80px",
      fontSize: "16px",
      width: "fit-content",
      paddingX: 2,
    },
  })
);

const ActionButton = styled(Button)(({ theme }) => ({
  width: "150px",
  height: "50px",
  backgroundColor: "#B6B6B6",
  color: "#000",
  fontSize: "20px",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#B6B6B6",
  },
  [theme.breakpoints.down("sm")]: {
    width: "130px",
    height: "45px",
    fontSize: "18px",
  },
}));

const InstructionBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  color: "#000",
  [theme.breakpoints.down("xs")]: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "5px",
  },
  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
  },
}));

const ShortcutKey = styled(Box)(({ theme }) => ({
  backgroundColor: "#B6B6B6",
  padding: "2px 6px",
  borderRadius: "4px",
  fontWeight: "bold",
  marginRight: "5px",
  [theme.breakpoints.down("xs")]: {
    marginRight: "0px",
    marginBottom: "5px",
    fontSize: "0.8rem",
  },
}));

const QuestionScreen: React.FC<QuestionScreenProps> = ({
  gameState,
  setGameState,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [timer, setTimer] = useState(90);
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
  const [questionType, setQuestionType] = useState<"multiple" | "boolean">(
    "multiple"
  );
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
  };

  const { data: questions, isLoading } = useQuery<QuestionResponse[]>({
    queryKey: ["questions", params],
    queryFn: () => fetchQuestions(params),
  });

  const answerRefs = useRef<(HTMLButtonElement | null)[]>([]);

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
  }, [currentQuestionIndex, gameState.difficulty]);

  useEffect(() => {
    if (questions && questions[currentQuestionIndex]) {
      const currentQuestion = questions[currentQuestionIndex];
      setQuestionType(currentQuestion.type);
      if (currentQuestion.type === "multiple") {
        const answers = [
          currentQuestion.correct_answer,
          ...currentQuestion.incorrect_answers,
        ];

        const shuffled = [...answers].sort(() => Math.random() - 0.5);
        setShuffledAnswers(shuffled);
      } else {
        setShuffledAnswers(["True", "False"]);
      }
    }
  }, [currentQuestionIndex, questions]);

  useEffect(() => {
    answerRefs.current[0]?.focus();
  }, [shuffledAnswers]);

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
          category: currentQuestion.category,
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
          category: currentQuestion.category,
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (questionType === "multiple") {
      if (["1", "2", "3", "4"].includes(e.key)) {
        const index = parseInt(e.key) - 1;
        if (shuffledAnswers[index]) {
          setSelectedAnswer(shuffledAnswers[index]);
        }
      }
    } else {
      if (e.key.toLowerCase() === "t") {
        setSelectedAnswer("True");
      } else if (e.key.toLowerCase() === "f") {
        setSelectedAnswer("False");
      }
    }

    if (e.key.toLowerCase() === "n" || e.key === "Enter") {
      if (selectedAnswer) {
        handleSubmit();
      }
    } else if (e.key.toLowerCase() === "s") {
      handleSkip();
    }
  };

  if (isLoading)
    return (
      <Container
        maxWidth="sm"
        sx={{
          mt: 5,
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          paddingX: 2,
        }}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <LinearProgress sx={{ width: "100%" }} />
      </Container>
    );

  if (!questions || questions.length === 0)
    return (
      <Container
        maxWidth="sm"
        sx={{
          mt: 5,
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          paddingX: 2,
        }}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <Typography variant="h6">No questions available.</Typography>
      </Container>
    );

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pt: 5,
        pb: { xs: "50px", sm: 5 },
        color: "#000",
        paddingX: 2,
        position: "relative",
        overflowX: "hidden",
      }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <Box sx={{ textAlign: "center", width: "100%", maxWidth: "700px" }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: "24px", sm: "30px" },
            mb: 2,
          }}
        >
          Time Left: {timer} seconds
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: "24px", sm: "32px" },
            mb: 3,
          }}
        >
          {he.decode(currentQuestion.question)}
        </Typography>

        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="center"
          sx={{
            rowGap: { xs: "30px", sm: "40px" },
            columnGap: { xs: "10px", sm: "20px" },
            maxWidth: "700px",
            margin: "0 auto",
          }}
        >
          {shuffledAnswers.map((answer, index) => (
            <Grid
              item
              key={index}
              xs={12}
              sm={6}
              md={6}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <OptionButton
                onClick={() => setSelectedAnswer(answer)}
                selected={selectedAnswer === answer}
                ref={(el) => (answerRefs.current[index] = el)}
                sx={{
                  width: { xs: "fit-content", sm: "100%" },
                }}
              >
                {he.decode(answer)}
              </OptionButton>
            </Grid>
          ))}
        </Grid>

        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          gap={4}
          sx={{
            mt: { xs: 4, sm: 4 },
            mb: { xs: "50px", sm: 4 }, // Set margin-bottom to 50px on small screens
          }}
        >
          <ActionButton variant="contained" onClick={handleSkip}>
            Skip
          </ActionButton>
          <ActionButton
            variant="contained"
            onClick={handleSubmit}
            disabled={!selectedAnswer}
          >
            Next
          </ActionButton>
        </Stack>
      </Box>

      <InstructionBox
        sx={{
          position: "fixed",
          bottom: {
            xs: "10px",
            sm: "20px",
          },
          left: {
            xs: "10px",
            sm: "20px",
          },
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            flexDirection: { xs: "row", sm: "row" },
            mb: { xs: 1, sm: 0 },
          }}
        >
          {questionType === "multiple"
            ? ["1", "2", "3", "4"].map((key) => (
                <ShortcutKey key={key}>{key}</ShortcutKey>
              ))
            : ["T", "F"].map((key) => (
                <ShortcutKey key={key}>{key}</ShortcutKey>
              ))}
          <Typography variant="body1">Answer</Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            flexDirection: { xs: "row", sm: "row" },
            mb: { xs: 1, sm: 0 },
          }}
        >
          <KeyboardIcon />
          <Typography variant="body1">Answer</Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            flexDirection: { xs: "row", sm: "row" },
          }}
        >
          <ShortcutKey>S</ShortcutKey>
          <Typography variant="body1">kip</Typography>
          <ShortcutKey>N</ShortcutKey>
          <Typography variant="body1">ext</Typography>
        </Box>
      </InstructionBox>
    </Container>
  );
};

export default QuestionScreen;

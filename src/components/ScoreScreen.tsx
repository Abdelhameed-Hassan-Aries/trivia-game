import React from "react";
import { Box, Button, Typography, Container, Grid } from "@mui/material";
import Chart from "react-apexcharts";
import { GameState } from "../types";
import { styled } from "@mui/material/styles";
import { ApexOptions } from "apexcharts";

interface ScoreScreenProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

// Styled Components
const NewGameButton = styled(Button)(({ theme }) => ({
  width: "330px",
  height: "100px",
  backgroundColor: "#B6B6B6",
  color: "#000",
  fontSize: "25px",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#B6B6B6",
  },
}));

const CardBox = styled(Box)(({ theme }) => ({
  backgroundColor: "#D9D9D9",
  padding: "20px",
  borderRadius: "8px",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}));

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

  const categories = [...new Set(gameState.answers.map((a) => a.category))];

  const stackedBarSeries = [
    {
      name: "Correct",
      data: categories.map(
        (category) =>
          gameState.answers.filter(
            (a) => a.correct && !a.skipped && a.category === category
          ).length
      ),
    },
    {
      name: "Incorrect",
      data: categories.map(
        (category) =>
          gameState.answers.filter(
            (a) => !a.correct && !a.skipped && a.category === category
          ).length
      ),
    },
    {
      name: "Skipped",
      data: categories.map(
        (category) =>
          gameState.answers.filter((a) => a.skipped && a.category === category)
            .length
      ),
    },
  ];

  const stackedBarOptions: ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
      animations: {
        enabled: false,
      },
    },
    xaxis: {
      categories: categories,
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    yaxis: {
      title: {
        text: "Number of Answers",
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => val.toString(),
      },
    },
    colors: ["#00E396", "#FF4560", "#775DD0"],
    legend: {
      position: "bottom",
    },
  };

  const lineChartSeries = [
    {
      name: "Time Taken (s)",
      data: gameState.answers.map((a) => a.timeTaken),
    },
  ];

  const lineChartOptions: ApexOptions = {
    chart: {
      animations: {
        enabled: false,
      },
    },
    xaxis: {
      categories: gameState.answers.map((_, index) => `Q${index + 1}`),
      title: {
        text: "Question Number",
      },
    },
    yaxis: {
      title: {
        text: "Time Taken (seconds)",
      },
    },
    dataLabels: {
      enabled: false,
    },
  };

  const pieOptions: ApexOptions = {
    labels: ["Correct", "Incorrect", "Skipped"],
    legend: {
      position: "bottom",
    },
    chart: {
      animations: {
        enabled: false,
      },
    },
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
    <Container
      maxWidth="md"
      sx={{
        textAlign: "center",
        padding: "32px",
        boxSizing: "border-box",
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ mb: "34px" }}>
        Player name: {gameState.playerName}
      </Typography>

      <Grid
        container
        sx={{
          mb: "75px",
          rowGap: "34px",
          columnGap: "100px",
          justifyContent: "center",
        }}
      >
        <Grid item xs={12} sm={5}>
          <CardBox>
            <Typography variant="h5" gutterBottom>
              Total Time Spent
            </Typography>
            <Typography variant="h4">
              {Math.round(totalTimeSpent)} seconds
            </Typography>
          </CardBox>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} sm={5}>
          <CardBox>
            <Typography variant="h5" gutterBottom>
              Answer Breakdown
            </Typography>
            <Chart
              options={pieOptions}
              series={pieSeries}
              type="pie"
              width="100%"
            />
          </CardBox>
        </Grid>

        {/* Stacked Bar Chart */}
        <Grid item xs={12} sm={5}>
          <CardBox>
            <Typography variant="h5" gutterBottom>
              Category Performance
            </Typography>
            <Chart
              options={stackedBarOptions}
              series={stackedBarSeries}
              type="bar"
              width="100%"
              height="300px"
            />
          </CardBox>
        </Grid>

        {/* Line Chart */}
        <Grid item xs={12} sm={5}>
          <CardBox>
            <Typography variant="h5" gutterBottom>
              Time per Question
            </Typography>
            <Chart
              options={lineChartOptions}
              series={lineChartSeries}
              type="line"
              width="100%"
              height="300px"
            />
          </CardBox>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <NewGameButton onClick={startNewGame}>New Game</NewGameButton>
      </Box>
    </Container>
  );
};

export default ScoreScreen;

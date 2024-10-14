# OpenTrivia Quiz Game

Welcome to the **OpenTrivia Quiz Game**! This application is a web-based trivia game that tests your knowledge across various categories and difficulty levels. It's built using modern web technologies and integrates with the [Open Trivia DB API](https://opentdb.com/) to fetch questions dynamically.

## Table of Contents

- [Installation and Setup](#installation-and-setup)
- [Running the Application](#running-the-application)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Game Flow](#game-flow)
- [Project Structure](#project-structure)

---

## Installation and Setup

### Prerequisites

- **Node.js**: Ensure you have Node.js installed (version 14 or above recommended).
- **npm**: Comes with Node.js, but ensure it's up to date.

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/open-trivia-quiz-game.git
   cd open-trivia-quiz-game
   ```

2. **Install Dependencies**

   Install all the required npm packages:

   ```bash
   npm install
   ```

3. **Environment Variables**

   No special environment variables are required for this project. However, if you plan to extend the project and need to store API keys or other sensitive data, create a `.env` file in the root directory.

---

## Running the Application

### Development Mode

To start the application in development mode with hot reloading:

```bash
npm run dev
```

The app should now be running on [http://localhost:3000](http://localhost:3000).

### Production Build

To build the application for production:

```bash
npm run build
```

This will create an optimized production build in the `dist` folder.

---

## Features

- **User-Friendly Interface**: A clean and intuitive UI built with Material-UI (MUI) for a seamless user experience.
- **Dynamic Questions**: Fetches questions from the Open Trivia DB API, ensuring a fresh game every time.
- **Multiple Categories**: Choose from various trivia categories to test your knowledge.
- **Difficulty Levels**: Select from easy, medium, or hard difficulty settings.
- **Timed Questions**: Each question comes with a timer based on the selected difficulty.
- **Real-Time Feedback**: Immediate indication of correct, incorrect, or skipped answers.
- **Detailed Score Screen**:
  - Total time spent on questions.
  - Pie chart showing the breakdown of correct, incorrect, and skipped answers.
  - Stacked bar chart displaying performance per category.
  - Line chart showing time taken per question.
- **Responsive Design**: Optimized for both desktop and mobile devices.

---

## Tech Stack

- **Frontend Framework**: [React](https://reactjs.org/)
- **TypeScript**: For type safety and better code maintainability.
- **State Management**: React Hooks and Context API.
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Styling**: [Material-UI (MUI)](https://mui.com/) components and styling solutions.
- **Charts**: [ApexCharts](https://apexcharts.com/) integrated via [react-apexcharts](https://github.com/apexcharts/react-apexcharts)
- **Data Fetching and Caching**: [React Query](https://tanstack.com/query/latest)
- **Routing**: [React Router](https://reactrouter.com/) (if applicable)
- **Utilities**:
  - [he](https://github.com/mathiasbynens/he): For decoding HTML entities in API responses.

---

## Game Flow

1. **Welcome Screen**:

   - The player enters their name.
   - Selects a difficulty level: Easy (90s), Medium (60s), or Hard (30s).
   - Proceeds to the category selection screen.

2. **Category Selection**:

   - Displays a list of available trivia categories fetched from the API.
   - The player selects a category to start the game.

3. **Question Screen**:

   - Displays a question with a timer based on the selected difficulty.
   - Multiple-choice questions are presented in a 2x2 grid.
   - True/False questions are displayed side by side.
   - The player selects an answer or skips the question.
   - The timer counts down, and if it reaches zero, the question is marked as skipped.

4. **Score Screen**:
   - Shows the player's name at the top.
   - Displays four key metrics in a 2x2 grid:
     - Total time spent on questions.
     - Pie chart with the breakdown of answers (correct, incorrect, skipped).
     - Stacked bar chart showing performance per category.
     - Line chart displaying time taken per question.
   - A "New Game" button at the bottom allows the player to restart the game.

---

## Project Structure

```
├── src
│   ├── api
│   │   └── index.ts          # API calls and configurations
│   ├── components
│   │   ├── WelcomeScreen.tsx
│   │   ├── CategorySelection.tsx
│   │   ├── QuestionScreen.tsx
│   │   └── ScoreScreen.tsx
│   ├── types
│   │   └── index.ts          # TypeScript interfaces and types
│   ├── App.tsx
│   ├── index.tsx
│   └── ...
├── public
│   └── index.html
├── package.json
├── tsconfig.json
└── README.md
```

- **src/api**: Contains API-related functions, including fetching questions and categories.
- **src/components**: All React components representing different screens and UI elements.
- **src/types**: TypeScript types and interfaces for props, state, and data models.
- **App.tsx**: The root component where the game state is managed.
- **index.tsx**: Entry point of the React application.

---

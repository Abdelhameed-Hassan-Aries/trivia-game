import axios from "axios";
import { Category, QuestionResponse } from "./types";

const API_BASE = "https://opentdb.com";

export const fetchToken = async (): Promise<string> => {
  const response = await axios.get(`${API_BASE}/api_token.php?command=request`);
  return response.data.token;
};

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await axios.get(`${API_BASE}/api_category.php`);
  return response.data.trivia_categories;
};

export const fetchQuestions = async (
  params: Record<string, string | number | null>
): Promise<QuestionResponse[]> => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      queryParams.append(key, String(value));
    }
  });
  const response = await axios.get(
    `${API_BASE}/api.php?${queryParams.toString()}`
  );
  return response.data.results;
};

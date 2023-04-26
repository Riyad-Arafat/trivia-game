import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import App from "./App";

describe("App", () => {
  beforeEach(() => {
    const mockQuestion = {
      category: "Entertainment: Film",
      type: "multiple",
      difficulty: "easy",
      question:
        'What is the name of the protagonist in the movie "The Terminator"?',
      correct_answer: "Kyle Reese",
      incorrect_answers: ["John Connor", "Sarah Connor", "The Terminator"],
    };
    // Mock fetch API to return a fixed question
    act(() => {
      global.fetch = jest.fn().mockImplementation(() =>
        Promise.resolve({
          json: () => Promise.resolve({ results: [mockQuestion] }),
        })
      );
    });
  });

  test("renders loading text when question is not fetched yet", () => {
    render(<App />);
    const loadingText = screen.getByText("Loading...");
    expect(loadingText).toBeInTheDocument();
  });

  test("renders question text when question is fetched", async () => {
    render(<App />);
    await waitFor(() => {
      const questionElement = screen.getByText(
        /What is the name of the protagonist/i
      );
      expect(questionElement).toBeInTheDocument();
    });
  });

  test("displays error message if user submits empty answer", async () => {
    render(<App />);
    const submitButton = await screen.findByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);
    const errorMessage = await screen.findByText(/Please enter an answer/i);
    expect(errorMessage).toBeInTheDocument();
  });

  test("displays correct message if user submits correct answer", async () => {
    render(<App />);
    const answerInput = await screen.findByLabelText(/enter your answer/i);
    fireEvent.change(answerInput, { target: { value: "Kyle Reese" } });
    const submitButton = await screen.findByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);
    const resultMessage = await screen.findByText(/Correct!/i);
    expect(resultMessage).toBeInTheDocument();
  });

  test("displays incorrect message if user submits incorrect answer", async () => {
    render(<App />);
    const answerInput = await screen.findByLabelText(/enter your answer/i);
    fireEvent.change(answerInput, { target: { value: "John Connor" } });
    const submitButton = await screen.findByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);
    const resultMessage = await screen.findByText(/Incorrect!/i);
    expect(resultMessage).toBeInTheDocument();
  });
});

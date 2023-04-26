import React from "react";
import "./App.css";

export type Question = {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

export function App() {
  const [loading, setLoading] = React.useState(false);
  const [question, setQuestion] = React.useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = React.useState("");
  const [submittedWithoutAnswer, setSubmittedWithoutAnswer] =
    React.useState(false);
  const [result, setResult] = React.useState<"Correct!" | "Incorrect!" | "">(
    ""
  );

  React.useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://opentdb.com/api.php?amount=1");
      const data = await response.json();
      const formattedData: Question = {
        ...data.results[0],
      };
      setQuestion(formattedData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserAnswer(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userAnswer) {
      setSubmittedWithoutAnswer(true);
      return;
    }
    if (userAnswer.toLowerCase() === question?.correct_answer.toLowerCase()) {
      setResult("Correct!");
    } else {
      setResult("Incorrect!");
    }
    setUserAnswer("");
    setSubmittedWithoutAnswer(false);
    fetchQuestion();
  };

  if (!question) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="container">
        <h1 className="title">Trivia Game</h1>
        <div className="card">
          <div className="card-header">{question.category}</div>
          <div className="card-body">
            <p className="card-text">
              {loading ? (
                "Loading..."
              ) : (
                <>
                  <span
                    dangerouslySetInnerHTML={{ __html: question.question }}
                  />
                </>
              )}
            </p>
            <form className="form-group" onSubmit={handleSubmit}>
              <label htmlFor="answer" hidden>
                Enter your answer:
              </label>
              <input
                type="text"
                id="answer"
                className="form-control"
                placeholder="Enter your answer"
                value={userAnswer}
                onChange={handleAnswerChange}
                aria-label="Enter your answer"
              />
              {submittedWithoutAnswer && (
                <div className="error" role="alert">
                  Please enter an answer
                </div>
              )}
              <button
                className={`btn btn-primary ${loading ? "btn-loading" : ""}`}
                aria-label="Submit your answer"
                type="submit"
              >
                {loading ? "Loading..." : "Submit"}
              </button>
            </form>
            {result && (
              <div
                className={`
                result result-${result === "Correct!" ? "correct" : "incorrect"}
              `}
                role="status"
                aria-live="assertive"
              >
                {result}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

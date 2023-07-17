import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./PollPage.css";

const PollPage = () => {
  const { pollId } = useParams();
  const [poll, setPoll] = useState({});
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pollResponse = await axios.get(
          `http://localhost:4000/getPoll/${pollId}`
        );
        setPoll(pollResponse.data);

        const questionsResponse = await axios.get(
          `http://localhost:4000/getQuestions/${pollId}`
        );
        setQuestions(questionsResponse.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [pollId]);

  const handleResponseChange = (questionId, optionId, value) => {
    setResponses((prevResponses) => {
      const otherResponses = prevResponses.filter(
        (response) => response.questionId !== questionId
      );
      if (value) {
        const currentResponse = prevResponses.find(
          (response) => response.questionId === questionId
        );
        const updatedResponse = {
          questionId,
          optionIds: currentResponse
            ? [...currentResponse.optionIds, optionId]
            : [optionId],
        };
        return [...otherResponses, updatedResponse];
      } else {
        const currentResponse = prevResponses.find(
          (response) => response.questionId === questionId
        );
        const updatedOptionIds = currentResponse.optionIds.filter(
          (currentOptionId) => currentOptionId !== optionId
        );
        if (updatedOptionIds.length > 0) {
          const updatedResponse = { questionId, optionIds: updatedOptionIds };
          return [...otherResponses, updatedResponse];
        } else {
          return otherResponses;
        }
      }
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let participantToken = localStorage.getItem("participantToken");

    if (!participantToken) {
      participantToken =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      localStorage.setItem("participantToken", participantToken);
    }

    try {
      await axios.post(`http://localhost:4000/submitResponses/${pollId}`, {
        participantToken,
        responses,
      });
      alert("Thank you for your submission!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>{poll.title}</h1>
      <p>{poll.description}</p>
      <form onSubmit={handleSubmit}>
        {questions.map((question) => (
          <div key={question.id}>
            <h2>{question.question_text}</h2>
            {question.question_type === "text" && (
              <input
                type="text"
                value={
                  responses.find(
                    (response) => response.questionId === question.id
                  )?.responseValue || ""
                }
                onChange={(e) =>
                  handleResponseChange(question.id, null, e.target.value)
                }
              />
            )}

            {question.question_type === "radio" &&
              question.answers.map((answer) => (
                <div key={answer.id}>
                  <input
                    type="radio"
                    name={question.id}
                    onChange={() =>
                      handleResponseChange(
                        question.id,
                        answer.id,
                        answer.answer_text
                      )
                    }
                  />
                  <label>{answer.answer_text}</label>
                </div>
              ))}
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PollPage;

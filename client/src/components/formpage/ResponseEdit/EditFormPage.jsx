import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Button } from "@mui/material";

const EditFormPage = () => {
  const { formId } = useParams();
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/getPoll/${formId}`
        );
        setFormTitle(response.data.title);
        setFormDescription(response.data.description);

        const questionsResponse = await axios.get(
          `http://localhost:4000/getQuestions/${formId}`
        );
        setQuestions(questionsResponse.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchFormData();
  }, [formId]);

  const updateForm = async () => {
    try {
      await axios.put(`http://localhost:4000/updatePoll/${formId}`, {
        title: formTitle,
        description: formDescription,
      });

      for (const question of questions) {
        if (question.id) {
          await axios.put(
            `http://localhost:4000/updateQuestion/${question.id}`,
            question
          );
        } else {
          await axios.post(
            `http://localhost:4000/addQuestion/${formId}`,
            question
          );
        }
      }

      navigate("/forms");
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddQuestion = () => {
    const newQuestion = { question_text: "", answers: [{ answer_text: "" }] };
    setQuestions([...questions, newQuestion]);
  };

  const handleQuestionTextChange = (event, index) => {
    const newQuestions = [...questions];
    newQuestions[index].question_text = event.target.value;
    setQuestions(newQuestions);
  };

  const handleAnswerTextChange = (event, questionIndex, answerIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers[answerIndex].answer_text =
      event.target.value;
    setQuestions(newQuestions);
  };

  const handleAddAnswer = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers.push({ answer_text: "" });
    setQuestions(newQuestions);
  };

  return (
    <div>
      <h2>Edit Form</h2>
      <TextField
        label="Title"
        value={formTitle}
        onChange={(e) => setFormTitle(e.target.value)}
      />
      <TextField
        label="Description"
        value={formDescription}
        onChange={(e) => setFormDescription(e.target.value)}
      />
      {questions.map((question, questionIndex) => (
        <div key={questionIndex}>
          <TextField
            label={`Question ${questionIndex + 1}`}
            value={question.question_text}
            onChange={(e) => handleQuestionTextChange(e, questionIndex)}
          />
          {question.answers.map((answer, answerIndex) => (
            <TextField
              label={`Answer ${answerIndex + 1}`}
              value={answer.answer_text}
              onChange={(e) =>
                handleAnswerTextChange(e, questionIndex, answerIndex)
              }
            />
          ))}
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleAddAnswer(questionIndex)}
          >
            Add Answer
          </Button>
        </div>
      ))}
      <Button variant="contained" color="primary" onClick={handleAddQuestion}>
        Add Question
      </Button>
      <Button variant="contained" color="secondary" onClick={updateForm}>
        Update Form
      </Button>
    </div>
  );
};

export default EditFormPage;

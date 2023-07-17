import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewResponsesPage = () => {
  const { formId } = useParams();
  console.log("formId:", formId); // Add this console.log statement

  const [formResponses, setFormResponses] = useState([]);

  useEffect(() => {
    const fetchFormResponses = async () => {
      try {
        const response = await axios.get(`http://localhost:5173/${formId}/responses`);
        setFormResponses(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchFormResponses();
  }, [formId]);

  if (formResponses.length === 0) {
    return <div>No responses found.</div>;
  }

  return (
    <div>
      <h2>View Responses for Form: {formId}</h2>
      <h3>Responses</h3>
    </div>
  );
};

export default ViewResponsesPage;

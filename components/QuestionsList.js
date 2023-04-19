import React from "react";

const QuestionsList = ({ questions }) => {
    return (
        <div>
            <h2>Questions:</h2>
            <ul>
                {questions.map((question) => (
                    <li key={question.id}>
                        <p>Question: {question.question}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default QuestionsList;


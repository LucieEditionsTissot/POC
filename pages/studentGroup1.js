import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000", {
    query: { group: "studentGroup1" },
});

export default function StudentTablet1() {
    const [questions, setQuestions] = useState([]);

        socket.on("questions", questions => {
            console.log(questions);
            setQuestions(questions);
        });

    return (
        <div>
            <h1>Student Tablet</h1>
            <h3>Questions:</h3>
            <ul>
                {questions.map((question, index) => (
                    <li key={index}>
                        <p>Question: {question.question}</p>
                        <p>Réponse: {question.reponse}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

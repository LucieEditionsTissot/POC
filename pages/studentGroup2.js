import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000", {
    query: { group: "studentGroup2" },
});

export default function StudentTablet2() {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        socket.on("questions", questions => {
            setQuestions(questions);
        });

        return () => {
            socket.off("questions");
        };
    }, []);

    return (
        <div>
            <h1>Student Tablet</h1>
            <h3>Questions:</h3>
            <ul>
                {questions.map((question, index) => (
                    <li key={index}>{question}</li>
                ))}
            </ul>
        </div>
    );
}

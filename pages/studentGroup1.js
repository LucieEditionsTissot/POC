import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

export default function StudentTablet1() {
    const [questions, setQuestions] = useState([]);
    const [reponses, setReponses] = useState([]);

    useEffect(() => {
        // Enregistrement du StudentGroup1
        socket.emit("registerStudent1");

        socket.on("questions", (questions) => {
            setQuestions(questions);
        });

        socket.on("reponses", (reponses) => {
            setReponses(reponses);
        });
        return () => {
            socket.off("questions");
            socket.off("reponses");
        };
    }, []);

    const handleReponse = (questionId, reponseId) => {
        socket.emit("reponseQuestion", { questionId, reponseId });
    };

    return (
        <div>
            <h1>Student Tablet</h1>
            <h3>Questions:</h3>
            <ul>
                    <li>
                        <p>Question: {questions.question}</p>

                            <ul>

                                {reponses.map((reponse) => (
                                    <li
                                        key={reponse.id}
                                        onClick={() => handleReponse(question.id, reponse.id)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        Réponse: {reponse.animal}
                                    </li>
                                ))}
                            </ul>
                    </li>
            </ul>
        </div>
    );
}

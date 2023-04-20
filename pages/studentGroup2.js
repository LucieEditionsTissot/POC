import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

export default function StudentTablet2() {
    const [questions, setQuestions] = useState([]);
    const [reponses, setReponses] = useState([]);
    const [reponseSoumise, setReponseSoumise] = useState(false);
    const [reponseChoisie, setReponseChoisie] = useState(null);
    const [reponseCorrecte, setReponseCorrecte] = useState(false);
    const [attenteReponse, setAttenteReponse] = useState(false);
    const [choixFaits, setChoixFaits] = useState(false);
    const [clientId, setClientId] = useState(null);

    useEffect(() => {
        socket.emit("registerStudent2");

        socket.on("questions", (questions) => {
            setQuestions(questions);
        });

        socket.on("reponses", (reponses) => {
            const reponsesAvecId = reponses.map((reponse) => ({
                ...reponse,
                id: Math.random().toString(36).substring(2),
            }));
            setReponses(reponsesAvecId);
        });

        socket.on("choixFaits", ({ clientId }) => {
            console.log(`Le client ${clientId} a déjà fait un choix`);
            setClientId(clientId);
        });
        socket.on("reloadClient", () => {
                window.location.reload();
        });

        return () => {
            socket.off("questions");
            socket.off("reponses");
        };
    }, []);

    const handleReponse = (reponseId) => {
        const reponseSelectionnee = reponses.find(reponse => reponse.id === reponseId);
        if (reponseSelectionnee) {
            const isReponseCorrecte = reponseSelectionnee.isCorrect;
            socket.emit("reponseQuestion", { reponseId, isCorrect: isReponseCorrecte });
            setReponseSoumise(true);
            setReponseChoisie(reponseSelectionnee.animal);
            setReponseCorrecte(isReponseCorrecte);
            setAttenteReponse(true);
        }
    };
    useEffect(() => {
        if (clientId && reponseChoisie) {
            socket.emit("choixFaits", { clientId });
            setAttenteReponse(false);
            setChoixFaits(true);
        }
    }, [clientId, reponseChoisie]);

    return (
        <div>
            <h1>Student Tablet</h1>
            <h3>Questions:</h3>
            <p>{questions.question}</p>
            <ul>
                {reponses.map((reponse, index) => (
                    <li key={index}
                        onClick={() => !reponseSoumise && handleReponse(reponse.id)}
                        style={{ cursor: reponseSoumise ? "not-allowed" : "pointer" }}
                    >
                        {reponse.animal}
                    </li>
                ))}
            </ul>
            {reponseChoisie && (
                <p>
                    Votre choix: {reponseChoisie}{" "}
                    {reponseCorrecte ? "(Correct)" : "(Incorrect)"}
                </p>
            )}
            {attenteReponse && (
                <p>En attente du deuxième groupe</p>
            )}
            {choixFaits && (
                <p>Les choix ont été faits sur les deux tablettes.</p>
            )}
        </div>
    );
}




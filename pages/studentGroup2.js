import React, {useState, useEffect} from "react";
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
    const [selectedTheme, setSelectedTheme] = useState("");


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

        socket.on("choixFaits", ({clientId}) => {
            setClientId(clientId);
            socket.emit('showThemeAndAnswers', selectedTheme);
        });
        socket.on('themeChosen', (selectedTheme) => {
            setSelectedTheme(selectedTheme);
        });
        socket.on("reloadClient", () => {
            window.location.reload();
        });

        return () => {
            socket.off("questions");
            socket.off("reponses");
        };
    }, []);

    useEffect(() => {
        if (clientId && reponseChoisie) {
            socket.emit("choixFaits", {clientId});
            socket.emit("animation");
            setAttenteReponse(false);
            setChoixFaits(true);
        }
    }, [clientId, reponseChoisie]);

    const handleReponse = (reponseId, e) => {
        if (document.querySelectorAll('.answer:not(.disabled)').length > 2) {
            e.target.classList.add('disabled')
        } else {
            e.target.classList.add('disabled')
            const lastAnswerNotSelectedId = document.querySelector('.answer:not(.disabled)').id;
            const reponseSelectionnee = reponses.find(reponse => reponse.id === lastAnswerNotSelectedId);
            if (reponseSelectionnee) {
                const isReponseCorrecte = reponseSelectionnee.isCorrect;
                socket.emit("reponseQuestion", {reponseId, isCorrect: isReponseCorrecte});
                setReponseSoumise(true);
                setReponseChoisie(reponseSelectionnee.animal);
                setReponseCorrecte(isReponseCorrecte);
                setAttenteReponse(true);
            }
        }
    };

    return (
        <div>
            <h1>Tablette groupe 2</h1>
            {questions.question && (
                <>
                    <h3>Question : {questions.question}</h3>
                    <p>Cliquer sur les animaux pour les supprimer, le but est d'obtenir un seul animal que vous pensez être le bon</p>

                </>
            )}
            <div style={{display: "flex", justifyContent: "center"}}>
                <ul>
                    {reponses.map((reponse, index) => (
                        <h3  className={"answer"} key={index} id={reponse.id}
                             onClick={(e) => !reponseSoumise && handleReponse(reponse.id, e)}
                             style={{
                                 padding: "1rem",
                                 margin: "1rem",
                                 border: "1px solid black",
                                 cursor: reponseSoumise ? "not-allowed" : "pointer"
                             }}
                        >
                            {reponse.animal}
                        </h3>
                    ))}
                </ul>
            </div>
            {reponseChoisie && (
                <p>
                    Votre choix: {reponseChoisie}{" "}
                    {reponseCorrecte ? "(Correct)" : "(Incorrect)"}
                </p>
            )}

            {attenteReponse && (
                <p>En attente du premier groupe</p>
            )}
            {choixFaits && (
                <p>Les choix ont été faits sur les deux tablettes.</p>
            )}
        </div>
    );
}




import React, {useState, useEffect} from "react";
import io from "socket.io-client";
import Head from "next/head";

const socket = io("http://localhost:3000");

export default function StudentTablet1() {
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
        socket.emit("registerStudent1");
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
        socket.on('themeChosen', (selectedTheme) => {
            setSelectedTheme(selectedTheme);
        });

        socket.on("choixFaits", ({clientId}) => {
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

    useEffect(() => {
        if (clientId && reponseChoisie) {
            socket.emit("choixFaits", {clientId});
            socket.emit("reloadClient");
            setAttenteReponse(false)
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
        <>
            <Head>
                <title>Tablette groupe 1</title>
            </Head>
            <div className={"global-wrapper"}>
                <h5 className={"type"}>Tablette groupe 1</h5>
                {questions.question && (
                    <>
                        <h3 className={"question"}>Question : {questions.question}</h3>
                        <p className={"info"}>Cliquer sur les animaux pour les supprimer, le but est d'obtenir un seul animal que vous
                            pensez
                            être le bon</p>

                    </>
                )}
                <div className={"questionWrapper"}>
                        {reponses.map((reponse, index) => (
                            <h2 className={"answer"} key={index} id={reponse.id}
                                onClick={(e) => !reponseSoumise && handleReponse(reponse.id, e)}
                                style={{
                                    padding: "1rem",
                                    margin: "1rem",
                                    border: "1px solid black",
                                    cursor: reponseSoumise ? "not-allowed" : "pointer"
                                }}
                            >
                                {reponse.animal}
                            </h2>
                        ))}
                </div>
                <div className={"answerWrapper"}>

                    {reponseChoisie && (
                        <p>{reponseCorrecte ? "Correct" : "Incorrect"}</p>
                    )}

                    {attenteReponse && (
                        <h5>, en attente du deuxième groupe</h5>
                    )}

                    {choixFaits && (
                        <h5>, les choix ont été faits sur les deux tablettes.</h5>
                    )}

                </div>
            </div>
        </>
    );
}





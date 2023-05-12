import React, {useState, useEffect} from "react";
import io from "socket.io-client";
import Head from "next/head";

const socket = io("192.168.43.196:3000");

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

    const handleClickOnAnswer = (e) => {
        e.target.classList.toggle('disabled')
        const numberOfAnswersLeft = document.querySelectorAll('.answer:not(.disabled)').length;
        if (numberOfAnswersLeft === 1) {
            document.querySelector('.buttonValidate').classList.add('readyToClick')
        } else {
            document.querySelector('.buttonValidate').classList.remove('readyToClick')
        }

    };

    const handleClickOnValidateButton = () => {
        const numberOfAnswers = document.querySelectorAll('.answer').length;
        const numberOfDisabledAnswers = document.querySelectorAll('.answer.disabled').length;

        if (numberOfDisabledAnswers === numberOfAnswers - 1) {
            const lastAnswerNotSelected = document.querySelector('.answer:not(.disabled)');
            const lastAnswerNotSelectedId = lastAnswerNotSelected.id
            const reponseSelectionnee = reponses.find(reponse => reponse.id === lastAnswerNotSelectedId);

            if (reponseSelectionnee) {
                const isReponseCorrecte = reponseSelectionnee.isCorrect;
                socket.emit("reponseQuestion", {lastAnswerNotSelectedId, isCorrect: isReponseCorrecte});
                setReponseSoumise(true);
                setReponseChoisie(reponseSelectionnee.animal);
                setReponseCorrecte(isReponseCorrecte);
                setAttenteReponse(true);
            }

        }
    }

    return (
        <>
            <Head>
                <title>Tablette groupe 2</title>
            </Head>
            <div className={"global-wrapper"}>
                <h5 className={"type"}>Tablette groupe 2</h5>
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
                            onClick={(e) => !reponseSoumise && handleClickOnAnswer(e)}
                            style={{
                                cursor: reponseSoumise ? "not-allowed" : "pointer"
                            }}
                        >
                            {reponse.animal}
                        </h2>
                    ))}
                </div>
                {questions.question && (
                    <div className={"buttonValidate"} onClick={() => handleClickOnValidateButton()}>
                        <p>Valider</p>
                    </div>
                )}
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




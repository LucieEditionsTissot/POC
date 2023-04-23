import React, {useEffect, useState} from 'react';
import io from 'socket.io-client';
import Head from "next/head";

const socket = io("http://localhost:3000");

const Client3 = () => {
    const [selectedTheme, setSelectedTheme] = useState('');
    const [selectedAnimation, setSelectedAnimation] = useState('');
    const [correctAnswers, setCorrectAnswers] = useState([]);

    useEffect(() => {
        socket.emit("registerAnimationClient");

        socket.on('themeChosen', (theme, animation) => {
            setSelectedTheme(theme);
            setSelectedAnimation(animation);
        });

        socket.on('reponsesCorrectes', (reponses) => {
            setCorrectAnswers(reponses);
        });
        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <>
            <Head>
                <title>Animation</title>
            </Head>
            <div className={"global-wrapper"}>
                <h5 className={"type"}>Animation</h5>
                {selectedTheme && (
                    <div>
                        <h2 className={"question"}>{selectedTheme}</h2>
                        <h3 className={"selectedAnimation"}>{selectedAnimation}</h3>
                        {correctAnswers.length > 0 ? (
                            <div className={"answerWrapper"}>

                                <h5>Réponses correctes : </h5>

                                {correctAnswers.map((reponse, index) => (
                                    <p key={index}>{reponse.animal}</p>
                                ))}

                            </div>
                        ) : (
                            <p>Aucune réponse correcte n'a encore été reçue.</p>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default Client3;


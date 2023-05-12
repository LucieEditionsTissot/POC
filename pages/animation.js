import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Head from 'next/head';
import VideoPlayer from '../pages/components/VideoPlayer';

const socket = io('localhost:3000');

const Client3 = () => {
    const themes = ['Mutualisme', 'Predation', 'Commensalisme'];
    const [selectedTheme, setSelectedTheme] = useState('');
    const [selectedAnimation, setSelectedAnimation] = useState('');
    const [correctAnswers, setCorrectAnswers] = useState([]);
    const [indices, setIndices] = useState([]);
    const [prevIndices, setPrevIndices] = useState([]);

    useEffect(() => {
        socket.emit('registerAnimationClient');

        getThemeRandomly()

        socket.on('choicesBothDone', (theme, animation) => {
            setSelectedAnimation(animation);
        });
        socket.on('indices', (indices) => {
           // setIndices((prevIndices) => [...prevIndices, ...indices]);
            console.log("Indices reçus :", indices);
        });
        socket.on('reponsesCorrectes', (reponses) => {
            setCorrectAnswers(reponses);
        });
        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (prevIndices.length > 0) {
            const timerId = setInterval(() => {
                setIndices((indices) => [...indices, prevIndices[indices.length]]);
                if (indices.length === prevIndices.length) {
                    clearInterval(timerId);
                    setPrevIndices([]);
                }
            }, 15000);
        }
    }, [prevIndices]);

    function getThemeRandomly() {
        const selectedTheme = themes[Math.floor(Math.random() * themes.length)];
        socket.emit('themeChoisi', selectedTheme);
        setSelectedTheme(selectedTheme);
        console.log("Theme choisi :", selectedTheme);
    }

    return (
        <>
            <Head>
                <title>Animation</title>
            </Head>
            <div className={"global-wrapper"}>
                <h5 className={"type"}>Animation</h5>

                {indices.length > 0 && (
                    <div>
                        <h3>Indices :</h3>

                        <ul>
                            {indices.map((indice, index) => (
                                <li key={index}>{indices}</li>
                            ))}
                        </ul>

                    </div>
                )}
                {selectedTheme && (
                    <div>
                        <h2 className={'question'}>Thème tiré au hasard : {selectedTheme}</h2>
                        <h3 className={'selectedAnimation'}>{selectedAnimation}</h3>

                        {correctAnswers.length > 0 ? (
                            <div className={'answerWrapper'}>
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
                {selectedTheme && <VideoPlayer />}
            </div>
        </>
    );
};

export default Client3;





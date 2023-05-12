import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Head from 'next/head';
import VideoPlayer from '../pages/components/VideoPlayer';

const socket = io('192.168.43.196:3000');

const Client3 = () => {
    const [selectedTheme, setSelectedTheme] = useState('');
    const [selectedAnimation, setSelectedAnimation] = useState('');
    const [correctAnswers, setCorrectAnswers] = useState([]);
    const [indices, setIndices] = useState([]);
    const [prevIndices, setPrevIndices] = useState([]);

    useEffect(() => {
        socket.emit('registerAnimationClient');

        socket.on('themeChosen', (theme, animation) => {
            setSelectedTheme(theme);
            setSelectedAnimation(animation);
        });
        socket.on('indices', (indices) => {
            setIndices((prevIndices) => [...prevIndices, ...indices]);
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
                {selectedTheme && <VideoPlayer />}
                {selectedTheme && (
                    <div>
                        <h2 className={'question'}>{selectedTheme}</h2>
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
            </div>
        </>
    );
};

export default Client3;





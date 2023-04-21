import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

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
        <div>
            <h1>Animation</h1>
            {selectedTheme && (
                <div>
                    <h2>Avec le thème choisi : {selectedTheme}</h2>
                    <h3>{selectedAnimation}</h3>
                    {correctAnswers.length > 0 ? (
                        <div>
                            <h3>Et les réponses correctes :</h3>
                            <ul>
                                {correctAnswers.map((reponse, index) => (
                                    <li key={index}>{reponse.animal}</li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p>Aucune réponse correcte n'a encore été reçue.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Client3;


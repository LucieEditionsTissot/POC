import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io("http://localhost:3000");

const Client3 = () => {
    const [selectedTheme, setSelectedTheme] = useState("");

    useEffect(() => {
        socket.emit("registerAnimationClient");

        socket.on('animation', () => {
            handleThemeChoice(selectedTheme);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleThemeChoice = (theme) => {
        socket.emit("themeChoisi", theme);
        setSelectedTheme(theme);
    };

    return (
        <div>
            <h1>Client 3</h1>
            {selectedTheme && (
                <div>
                    <h2>Thème choisi : {selectedTheme}</h2>
                    <h2>Bonnes réponses :</h2>
                    <ul>
                        {/* Afficher les bonnes réponses */}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Client3;

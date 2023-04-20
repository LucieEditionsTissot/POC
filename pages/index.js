import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000", {
    query: { group: "teacher" },
});

export default function TeacherTablet() {
    const [selectedTheme, setSelectedTheme] = useState("");
    const [themes, setThemes] = useState([]);
    const [reponsesCorrectes, setReponsesCorrectes] = useState([]);

    useEffect(() => {
        socket.on('themes', (themes) => {
            setThemes(themes);
        });
        socket.on("reloadClient", () => {
            window.location.reload();
        });
        socket.on('reponsesCorrectes', (reponsesCorrectes) => {
            setReponsesCorrectes(reponsesCorrectes);
            console.log('Bonnes réponses :', reponsesCorrectes);
        });
        return () => {
            socket.off('themes');
        };
    }, []);

    const handleThemeChoice = (theme) => {
        socket.emit("themeChoisi", selectedTheme);
        setSelectedTheme(theme);
    };
    return (
        <div>
            <h1>Teacher Tablet</h1>
            <h3>Choisissez un thème :</h3>
            <input
                type="text"
                value={selectedTheme}
            />
            <h3>Thèmes sur la biodiversité :</h3>
            <ul>
                <button onClick={() => handleThemeChoice("biodiversite")}>Biodiversité</button>
                <button onClick={() => handleThemeChoice("environnement")}>Environnement</button>
            </ul>
            <ul>
                {reponsesCorrectes.map((reponse, index) => (
                    <li key={index}>{reponse.animal}</li>
                ))}
            </ul>
        </div>
    );
};

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
        socket.emit("themeChoisi", theme);
        setSelectedTheme(theme);
        console.log("Thème choisi : ", theme);
    };

    return (
        <div>
            <h1>Tablette professeur</h1>
            <h3>Thèmes sur le mutualisme :</h3>
            <div style={{display: "flex", justifyContent: "center"}}>
            <ul>
                <h2 style={{padding: "1rem", margin: "1rem", border: "1px solid black", cursor: "pointer"}} onClick={() => handleThemeChoice("ocean")}>Océan</h2>
                <h2 style={{padding: "1rem", margin: "1rem", border: "1px solid black", cursor: "pointer"}} onClick={() => handleThemeChoice("foret")}>Forêt</h2>
                <h2 style={{padding: "1rem", margin: "1rem", border: "1px solid black", cursor: "pointer"}} onClick={() => handleThemeChoice("montagne")}>Montagne</h2>
                <h2 style={{padding: "1rem", margin: "1rem", border: "1px solid black", cursor: "pointer"}} onClick={() => handleThemeChoice("prairie")}>Prairie</h2>
                <h2 style={{padding: "1rem", margin: "1rem", border: "1px solid black", cursor: "pointer"}} onClick={() => handleThemeChoice("jardin")}>Jardin</h2>
            </ul>
            </div>
            <ul>
                {reponsesCorrectes.map((reponse, index) => (
                    <li key={index}>{reponse.animal}</li>
                ))}
            </ul>
        </div>
    );
};

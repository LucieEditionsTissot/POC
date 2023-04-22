import React, {useState, useEffect} from "react";
import io from "socket.io-client";
import Head from "next/head";

const socket = io("http://localhost:3000", {
    query: {group: "teacher"},
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

    const handleThemeChoice = (theme, e) => {
        e.target.classList.add("selected");
        socket.emit("themeChoisi", theme);
        setSelectedTheme(theme);
        console.log("Thème choisi : ", theme);
    };

    return <>
        <Head>
            <title>Tablette professeur</title>
        </Head>
        <div className={"teacherWrapper"}>
            <h5 className={"type"}>Tablette professeur</h5>
            <h3 className={"theme"}>Thèmes sur le mutualisme :</h3>
            <div className={"themeWrapper"}>
                <h2 onClick={(e) => handleThemeChoice("ocean", e)}>Océan</h2>
                <h2 onClick={(e) => handleThemeChoice("foret", e)}>Forêt</h2>
                <h2 onClick={(e) => handleThemeChoice("montagne", e)}>Montagne</h2>
                <h2 onClick={(e) => handleThemeChoice("prairie", e)}>Prairie</h2>
                <h2 onClick={(e) => handleThemeChoice("jardin", e)}>Jardin</h2>
            </div>
            {selectedTheme && (
                <>
                    <div className={"answerWrapper"}>
                        <h5>Les réponses sont : </h5>
                        {reponsesCorrectes.map((reponse, index) => (
                            <p key={index}>{reponse.animal}</p>
                        ))}
                    </div>
                </>
            )}
        </div>
    </>
};

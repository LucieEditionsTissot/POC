import { useState, useEffect } from "react";
import io from "socket.io-client";
import QuestionsList from "../components/QuestionsList";

const socket = io("http://localhost:3000", {
    query: { group: "teacher" },
});

export default function TeacherTablet() {
    const [themes, setThemes] = useState([]);

    function handleAnimalsThemeSelect() {
        const selectedTheme = "animals";
        console.log(`Theme selected: ${selectedTheme}`);

        socket.emit("themeSelected", selectedTheme);
    }

    function handleColorsThemeSelect() {
        const selectedTheme = "colors";
        console.log(`Theme selected: ${selectedTheme}`);

        socket.emit("themeSelected", selectedTheme);
    }

    useEffect(() => {
        socket.on("themesSent", (themes) => {
            console.log(`Themes received: ${themes}`);
            setThemes(themes);
        });
    }, []);

    return (
        <div>
            <h1>Teacher Tablet</h1>
            <button onClick={() => handleAnimalsThemeSelect()}>
                Select Animals Theme
            </button>
            <button onClick={() => handleColorsThemeSelect()}>
                Select Colors Theme
            </button>
            <ul>
                {themes.map((theme) => (
                    <li key={theme}>{theme}</li>
                ))}
            </ul>
        </div>
    );
}
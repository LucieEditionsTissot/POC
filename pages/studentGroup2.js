import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000", {
    query: { group: "studentGroup2" },
});

export default function StudentTablet2() {
    const [choices, setChoices] = useState([]);

    useEffect(() => {
        // When the theme is selected by the teacher
        socket.on("themeSelected", (theme) => {
            console.log(`Theme selected: ${theme}`);

            // Update the choices displayed on the tablet
            if (theme === "animals") {
                setChoices(["cat", "dog", "bird"]);
            } else if (theme === "colors") {
                setChoices(["red", "blue", "green"]);
            }
        });
    }, []);

    // When the student makes a choice
    function handleChoice(choice) {
        console.log(`Choice made: ${choice}`);

        // Send the choice to the server
        socket.emit("choiceMade", choice);
    }

    return (
        <div>
            <h1>Student Tablet</h1>
            <ul>
                {choices.map((choice) => (
                    <li key={choice} onClick={() => handleChoice(choice)}>
                        {choice}
                    </li>
                ))}
            </ul>
        </div>
    );
}
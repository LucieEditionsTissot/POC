import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io("http://localhost:3000", {
    query: { group: "studentGroup1" },
});

const StudentPage = () => {
    const [themes, setThemes] = useState([]);

    useEffect(() => {
        socket.on('themesSent', (themes) => {
            console.log('Themes received:', themes);
            setThemes(themes);
        });
    }, []);

    return (
        <div>
            <h1>Student View</h1>
            <p>Select a choice:</p>
            {themes.map((theme, index) => (
                <div key={index}>
                    <input type="radio" name="choice" value={theme} />
                    <label>{theme.value}</label>
                </div>
            ))}
        </div>
    );
}


export default StudentPage;

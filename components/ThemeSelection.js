import React from 'react';

const ThemeSelection = ({ themes, onThemeSelected }) => {
    return (
        <div>
            <h2>Choisissez un thème:</h2>
            <ul>
                {themes.map((theme) => (
                    <li key={theme}>
                        <button onClick={() => onThemeSelected(theme)}>{theme}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default ThemeSelection;

import React from 'react';
import PropTypes from 'prop-types';
function QuestionsList(props) {
    return (
        <div>
            <h2>Liste des questions</h2>
            <ul>
                {props.questions.map((questions, index) => (
                    <li key={index}>
                        <p>{questions.text}</p>
                        <p>Proposition 1 : {questions.choice1}</p>
                        <p>Proposition 2 : {questions.choice2}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

QuestionsList.propTypes = {
    questions: PropTypes.arrayOf(
        PropTypes.shape({
            text: PropTypes.string,
            choice1: PropTypes.string,
            choice2: PropTypes.string,
        })
    ),
};

export default QuestionsList;

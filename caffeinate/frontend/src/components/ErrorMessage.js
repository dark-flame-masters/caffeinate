import '../styling/ErrorMessage.css';
import React from 'react';

export default function ErrorMessage(props) {
    const { error, setError } = props;
    
    const clearError = () => {
        setError('');
    }

    return (
        <div id="error_box" onClick={() => clearError()}>
            <p>{error}<br/><br/>
            <span className="error_close">click to close</span></p>
        </div>
    );
};
import React from 'react';

const Loader = ({children}) => {
    return (
        <div style={{ marginTop: 20, textAlign: "center" }}>
            <div className="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active"></div>
            <p>{children}</p>
        </div>
    )
};

export default Loader;

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './avenir-std.css';
import './material.css';
import 'material-design-lite/material.js';
import 'getmdl-select/getmdl-select.min.css';
import 'getmdl-select/getmdl-select.min.js';
import './index.css';
import {loadSource} from "./util";
import Loader from "./components/Loader";

const rootElement = document.getElementById('root');

ReactDOM.render(<Loader/>, rootElement);

loadSource()
    .then(() => {
        ReactDOM.render(<App />, rootElement);
    })
    .catch(e => {
        console.error(e);
    });



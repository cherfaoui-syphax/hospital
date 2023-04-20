import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Amplify from 'aws-amplify';
import "@aws-amplify/ui-react/styles.css";
import {AmplifyProvider, Authenticator} from "@aws-amplify/ui-react";
import awsconfig from './aws-exports';
import { BrowserRouter } from "react-router-dom";

Amplify.configure(awsconfig);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className="app-container">
      <AmplifyProvider>
        {/* <Authenticator.Provider> */}
        <BrowserRouter>
          <App />
          <a 
          className="cant-log-in"
          href="#"
        >Can't log in?</a>
          <div className="bottom-navbar">
            <a href="#">Security noticeboard</a>
            <a href="#">Terms of use</a>
            <a href="#">Privacy</a>
            <a href="#">Help center</a>
            <a href="#">Sign up</a>
          </div>
        </BrowserRouter> 
        {/* </Authenticator.Provider> */}
      </AmplifyProvider>
    </div>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

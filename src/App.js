import './App.css';
import React, { useState } from 'react';
import MainContainer  from'./components/MainContainer/MainContainer';
import { 
  Sidebar
} from './ui-components';
import { Paper, Input, Grid, TextField, Typography } from '@mui/material';
// import { Authenticator } from '@aws-amplify/ui-react';
import { Storage } from 'aws-amplify';
import { useAuthenticator, Authenticator, withAuthenticator } from '@aws-amplify/ui-react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

function App() {

  return (
  //   <>
  //   {authStatus === 'configuring' && 'Loading...'}
  //   {authStatus !== 'authenticated' ? <>logged out</> : <>logged in</>}
  // </>
  <>
  <LocalizationProvider dateAdapter={AdapterMoment}>
    <Authenticator hideDefault={true}>
      {({ signOut, user }) => (
        <>
          <div id="frame">
            <MainContainer signOut={signOut} />
          </div>
        </>
      )}
    </Authenticator>
  </LocalizationProvider>
  </>
  );
}

export default withAuthenticator(App)

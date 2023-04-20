import React, { useState } from 'react';
import { Paper } from '@mui/material';

function CustomForm({children}) {
  return (
    <Paper style={{ borderRadius: '10px' }} elevation={3}>
      {children}
    </Paper>
  );
}

export default CustomForm;

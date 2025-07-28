import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // or 'dark'
    primary: {
      main: '#259c43ff', // your custom primary color
    },
    secondary: {
      main: '#b0276cff', // your custom secondary color
    },
    background: {
      default: '#f4f4f4',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#555555',
    },
    // You can add custom color categories too:
    success: {
      main: '#4caf50',
    },
    warning: {
      main: '#ffae00ff',
    },
    error: {
      main: '#f44336',
    },
    info: {
      main: '#2196f3',
    },
  },
  typography: {
    fontFamily: 'Montserrat, monospace, sans-serif',
  },
});

export default theme;

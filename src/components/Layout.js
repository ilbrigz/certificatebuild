import React, { useRef, useEffect, useState, useMemo } from 'react';
import Editor from './Editor'
import Container from '@material-ui/core/Container';
import { ThemeProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles';
import Header from './Header'


const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#00adb5',
        },
        secondary: {
            light: '#ff7961',
            main: '#f44336',
            dark: '#ba000d',
            contrastText: '#000',
        },
    },
});

const useStyles = makeStyles(theme => ({

    container: {
        backgroundColor: "#f0ece2",
        padding: "1rem 1rem 1rem 1rem",
        minHeight: '80vh'
    }
}));


export default function Layout() {
    const classes = useStyles();
    return (
        <div style={{ backgroundColor: '#393e46', minHeight: "100vh" }}>
            <ThemeProvider theme={theme}>
                <Header />
                <Container fixed className={classes.container}>
                    <div><Editor /></div>
                </Container>
                {/* <div style={{ fontFamily: 'OldEnglish' }}>&nbsp;</div>
                <div style={{ fontFamily: 'OldEnglish', fontWeight: 'bold' }}>&nbsp;</div>
                <div style={{ fontFamily: 'OldEnglish', fontWeight: 'bold', fontStyle: 'italic' }}>&nbsp;</div>
                <div style={{ fontFamily: 'OldEnglish', fontStyle: 'italic' }}>&nbsp;</div> */}
            </ThemeProvider>
        </div>
    )
}

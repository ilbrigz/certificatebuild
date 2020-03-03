import React, { useRef, useEffect, useState, useMemo } from 'react';
import Editor from './Editor'
import Container from '@material-ui/core/Container';
import { ThemeProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles';
import Header from './Header'

const theme = createMuiTheme({
    // palette: {
    //     type: 'dark',
    // },
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
            </ThemeProvider>
        </div>
    )
}

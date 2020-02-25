import React, { useRef, useEffect, useState, useMemo } from 'react';
import Editor from './Editor'
import Container from '@material-ui/core/Container';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Header from './Header'

const theme = createMuiTheme({
    // palette: {
    //     type: 'dark',
    // },
});

export default function Layout() {
    return (
        <ThemeProvider theme={theme}>
            <Header />
            <Container fixed>
                <Editor />
            </Container>
        </ThemeProvider>
    )
}

import React, { useRef, useEffect, useState, useMemo } from 'react';
import Editor from './Editor'
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Header from './Header'
export default function Layout() {
    return (
        <>
            <Header />
            <Container fixed>
                <Editor />
            </Container>
        </>
    )
}

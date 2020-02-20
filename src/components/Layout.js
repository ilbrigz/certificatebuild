import React, { useRef, useEffect, useState, useMemo } from 'react';
import Editor from './Editor'

import Header from './Header'

export default function Layout() {
    return (
        <>
            <Header />
            <Editor />
        </>
    )
}

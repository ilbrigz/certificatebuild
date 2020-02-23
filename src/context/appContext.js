import React, { createContext, useRef } from 'react'
export const Context = createContext({});


export const Provider = ({ children }) => {
    const [selectedObject, setSelectedObject] = React.useState({})
    const fabricRef = useRef(null)
    const jexcelRef = useRef(null)


    const context = { selectedObject, setSelectedObject, fabricRef, jexcelRef }

    return <Context.Provider value={context}>{children}</Context.Provider>
}

export const { Consumer } = Context;
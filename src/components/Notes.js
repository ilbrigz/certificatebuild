import React from 'react'
import { Box, List, ListItem, Typography } from '@material-ui/core'

const Notes = () => {
    return (
        <>
            <Box width="auto" bgcolor="#f0f7da">
                <Box m={2}>
                    <Typography variant="subtitle2" >"Start by editing the data on the above table and clicking the download button on the bottom center."</Typography>
                    <Typography variant="body2" gutterBottom>You can copy tables from any excel spreadscheet.</Typography>
                </Box>
                <Box m={2}>
                    <Typography variant="subtitle2" >"Every Column above coresponds to placeholder on the left(those surounded with brackets)."</Typography>
                    <Typography variant="body2" gutterBottom>Deleting a placeholder will also delete a column above or vice versa.</Typography>
                </Box>
                <Box m={2}>
                    <Typography variant="subtitle2" >Column Header can be deleted or renamed by right clicking the column header.</Typography>
                    <Typography variant="body2" gutterBottom>Renaming the header will reflect in the placeholder. Handy if you want to preview your data.</Typography>
                </Box>
                <Box m={2}>
                    <Typography variant="subtitle2" >"Non-dynamic data (those not enclosed with brackets) can be edited by double clicking them"</Typography>
                    <Typography variant="body2" gutterBottom>You can also insert texts and images or delete existing elements.</Typography>
                </Box>
            </Box >
            <Box width="auto" bgcolor="#fccac2">
                <Box m={2}>
                    <Typography variant="subtitle2" >Disclaimer: "It is by no mean perfect. It's just my attempt to reduce redundant works"</Typography>
                    <Typography variant="body2" gutterBottom>Corrections and Suggestions would be highly appreciated.Please email those at ilogirb23@yahoo.com</Typography>
                </Box>
            </Box >
        </>
    )
}

export default Notes
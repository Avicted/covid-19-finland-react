import { createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        background: {
            default: '#0c111f',
            paper: '#121729',
        },
        primary: {
            main: '#d81b60',
        },
        secondary: {
            main: '#9c27b0',
        },
    },
})

export default theme

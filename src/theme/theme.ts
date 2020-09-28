import { createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        background: {
            default: '#0c111f',
            paper: '#121929',
        },
        primary: {
            main: '#7dc7ff',
        },
        secondary: {
            main: '#7d8bff',
        },
    },
})

export default theme

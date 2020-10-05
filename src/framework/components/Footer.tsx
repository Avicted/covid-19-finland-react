import React from 'react'
import { Typography, makeStyles, Box, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => ({
    wrapper: {
        textAlign: 'center',
        marginTop: 30,
        marginBottom: 30,
        fontFamily: 'Roboto',
    },
    text: {
        fontWeight: 'inherit',
    },
    link: {
        color: theme.palette.primary.main,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
            color: theme.palette.primary.light,
        }
    },
}))

interface FooterProps {}

export const Footer: React.FunctionComponent<FooterProps> = () => {
    const classes = useStyles();

    return (
        <div className={classes.wrapper}>
            <Box fontWeight="fontWeightRegular">
                <Typography className={classes.text} variant="body1" align="center" gutterBottom>
                    <a className={classes.link} href="https://github.com/Avicted/covid-19-finland-react">
                        Source code
                    </a>
                </Typography>
                <Typography className={classes.text} variant="body1" align="center" gutterBottom>
                    <a className={classes.link} href="https://github.com/HS-Datadesk/koronavirus-avoindata">
                        Finland data source
                    </a>{' '}
                    | Helsingin Sanomat
                </Typography>
                <Typography className={classes.text} variant="body1" align="center" gutterBottom>
                    <a className={classes.link} href="https://ourworldindata.org/coronavirus-source-data">
                        Global data source
                    </a>{' '}
                    | World Health Organization (WHO)
                </Typography>
                <Typography className={classes.text} variant="body1" align="center" gutterBottom>
                    Developed by:{' '}
                    <a className={classes.link} href="https://twitter.com/Victoranderssen">
                        Victor Anderssén
                    </a>
                </Typography>
            </Box>
        </div>
    )
}

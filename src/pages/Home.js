import React from 'react';
import Header from '../components/Header'
import {
    AppBar, Toolbar, Typography, Container, Grid, Card, CardContent, Button, Box,
    Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, TextField,
    Switch, Snackbar, Alert, Fab, Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions, CircularProgress, LinearProgress, Chip, Avatar, Divider, CardMedia
  } from '@mui/material';
import MLjpg from '../assets/ML.jpg'
import Visualisation from '../assets/Visualisation.jpg'
import { Link } from 'react-router-dom';
import background from '../assets/background.jpg'

function Home() {
    return(
        <div>
            <Header/>
            <Box
                sx={{
                    position: 'relative',
                    backgroundImage: `url(${background})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'bottom',
                    display: 'flex',
                    height: 'fit-content',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: 5,
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(to bottom right, rgba(0,0,0,0.5), rgba(0,0,0,0.3))',
                        zIndex: 1,
                    }
                }}
            >
                <Container component="main" sx={{ mt: 8, mb: 2, flex: 1, zIndex: 2 }}>
                    <Typography variant="h3" component="h2" gutterBottom sx={{
                            position: 'relative',
                            textAlign: 'center',
                            fontWeight: 'bold'
                        }}>
                        Welcome to Weather Blog - A Melbourne weather prediction website
                    </Typography>
                    <Typography variant="h6" component="h5" gutterBottom sx={{
                            position: 'relative',
                            textAlign: 'center',
                            pl:12,
                            pr:12
                        }}>
                        By utlising the weather data recorded in Melbourne weather station, provided by Bureau of Meteorology, we have developed
                        machine learning models for predicting elements that are related to weather data.
                    </Typography>
                    <Box sx={{position: 'flex', justifyContent:'center', textAlign:'center', mt:2, mb:3}} >
                        <Button 
                            size="medium" 
                            variant="contained"
                            sx={{color:'#ffffff'}} 
                            component={Link}
                            to='/about'
                            >
                            Discover our team
                        </Button>
                    </Box>
                    
                </Container>
            </Box>

            <Container component="main" sx={{ mt: 8, mb: 2, flex: 1 }}>

            
            
            <Typography variant="h4" component="h3" gutterBottom sx={{
                            position: 'relative',
                            textAlign: 'center',
                            fontWeight: 'bold'
                        }}>
                Discover the features of the website below.
            </Typography>
            <Grid container spacing={4} sx={{ mt: 4 }}>
                {[{feature: "Machine learning predictions", route: "/Predictions", image: MLjpg, desc: "By taking meteorological data, various machine learning process that analyze and produces prediction."}, 
                  {feature: "Data visualisation", route: "/Weather", image: Visualisation, desc: "Produces data visualisations from historical data that shows relationships between meteorological elements."}, 
                ].map((card) => (
                //To set the columns number in a grid, it will take 12/ [divisive] = [num of columns final]
                <Grid item key={card} xs={12} sm={6} md={6}> 
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flexGrow: 1 }}>     
                            <CardMedia
                                sx={{ height: 140 }}
                                image= {card.image}
                            />
                            <Typography gutterBottom variant="h5" component="h2">
                                {card.feature}
                            </Typography>
                            <Typography>
                                {card.desc}
                            </Typography>
                        </CardContent>
                        <Box sx={{ p: 2 }}>
                            <Button size="small" variant="contained" component={Link} to={card.route}>Discover</Button>
                        </Box>
                    </Card>
                </Grid>
                ))}
            </Grid>
            
            </Container>
        </div>
        
    );
}
export default Home
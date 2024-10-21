import React from 'react';
import Header from '../components/Header'
import {
    AppBar, Toolbar, Typography, Container, Grid, Card, CardContent, Button, Box,
    Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, TextField, Accordion, AccordionSummary, AccordionDetails,
    Switch, Snackbar, Alert, Fab, Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions, CircularProgress, LinearProgress, Chip, Avatar, Divider, CardMedia
  } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Temp from '../assets/Temperature.jpg'
import Visualisation from '../assets/Visualisation.jpg'
import { Link } from 'react-router-dom';
import { fontWeight, shadows } from '@mui/system';
import AccountCircle from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import Profile from '../assets/profile.png'

function About(){
    return(
        <div>
            <Header/>
            <Box
                sx={{
                    position: 'relative',
                    backgroundImage: `url(${Temp})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    height: '30vh',
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
                    <Typography variant="h4" component="h3" gutterBottom
                        sx={{
                            position: 'relative',
                            textAlign: 'center',
                            fontWeight: 'bold'
                        }}
                    >
                        ABOUT OUR TEAM
                    </Typography>
                    <Typography component="h5" gutterBottom
                        sx={{
                            position: 'relative',
                            textAlign: 'center',
                            paddingLeft: '20vh',
                            paddingRight: '20vh'
                        }}
                    >
                        Our team is a group of 3 students studying in Swinburne University of Technology. This project was made as part of a study for react website building and machine learning with Python.
                    </Typography>
                </Container>
            </Box>

            <Typography variant="h3" component="h2" gutterBottom
                        sx={{
                            position: 'relative',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            mt:5
                        }}
                    >
                        MEET THE TEAM
            </Typography>

            <Container component="main" sx={{ mt: 4, mb: 2, flex: 1 }}>
                <Grid container spacing={4} sx={{ mt: 4 }}>
                    {[{feature: "Thanh Tai Tran", desc: "I am interested in playing video games, working out and generally fascinated by technology studies.",email:"104090322@student.swin.edu.au"}, 
                      {feature: "Christian van der Merwe", desc: "Produces data visualisations from historical data that shows relationships between meteorological elements.",email:"104891800@student.swin.edu.au"}, 
                      {feature: "Mohammad Khalid", desc: "Produces data visualisations from historical data that shows relationships between meteorological elements.",email:"103838204@student.swin.edu.au"}
                    ].map((card) => (
                    //To set the columns number in a grid, it will take 12/ [divisive] = [num of columns final]
                    <Grid item key={card} xs={12} sm={6} md={4}> 
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flexGrow: 1 }}>     
                                <CardMedia
                                    image={Profile}
                                    sx={{ height: 140, 
                                          width: 140,
                                          display: 'flex',
                                          position: 'relative',
                                          justifyContent: 'center',  
                                          mx: 'auto'
                                    }}
                                />
                                <Typography gutterBottom variant="h5" component="h2"
                                    sx={{
                                        textAlign:'center',
                                        position: 'relative'
                                    }}
                                >
                                    {card.feature}
                                </Typography>
                                <Typography 
                                    sx={{
                                        textAlign:'center',
                                        position: 'relative'
                                    }}
                                >
                                    {card.desc}
                                </Typography>
                                <Accordion sx={{mt:3}}>
                                    <AccordionSummary
                                    expandIcon={<ArrowDropDownIcon />}
                                    aria-controls="panel1-content"
                                    id="panel1-header"
                                    >
                                    <ListItemIcon><EmailIcon/></ListItemIcon>
                                    <Typography>Email</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                    <Typography>
                                        {card.email}
                                    </Typography>
                                    </AccordionDetails>
                                </Accordion>                   
                            </CardContent>
                        </Card>
                    </Grid>
                    ))}
                </Grid>
            </Container> 

            
        </div>
        
    );
}
export default About
import React from 'react';
import Header from '../components/Header'
import {
    AppBar, Toolbar, Typography, Container, Grid, Card, CardContent, Button, Box,
    Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, TextField,
    Switch, Snackbar, Alert, Fab, Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions, CircularProgress, LinearProgress, Chip, Avatar, Divider, CardMedia, Tab, Tabs, CustomTabPanel
  } from '@mui/material';
import MaxTemp from '../assets/Temperature.jpg'
import Clouds from '../assets/Clouds.jpg'
import Electricity from '../assets/Electricity.jpg'
import BasicTabs from '../components/Tabs';
import MaxTempPrediction from '../components/MaxTempPrediction';
import CloudPrediction from '../components/CloudPrediction';
import ElectricityDemandPrediction from '../components/eletricityDemandPrediction';

function Predictions(){
    return(
        <div>
            <Header/>
            <BasicTabs 
                maxTempPredictionComponent = {<MaxTempPrediction/>}
                cloudPredictionComponent = {<CloudPrediction/>}
                electricityDemandPredictionComponent = {<ElectricityDemandPrediction/>}
                > 
            </BasicTabs>
        </div>
        
    );
}
export default Predictions
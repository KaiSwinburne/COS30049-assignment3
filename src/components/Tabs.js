import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {
    AppBar, Toolbar, Typography, Container, Grid, Card, CardContent, Button, Box,
    Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, TextField,
    Switch, Snackbar, Alert, Fab, Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions, CircularProgress, LinearProgress, Chip, Avatar, Divider, CardMedia
  } from '@mui/material';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs({maxTempPredictionComponent, cloudPredictionComponent, electricityDemandPredictionComponent}) {
    //Styling for the div
    const styles={
        tabs:{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
        }
    };

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Box class="tabs" sx={{ borderBottom: 1, borderColor: 'divider' }} style={styles.tabs}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Max Temperature" {...a11yProps(0)} />
          <Tab label="Cloud Condition" {...a11yProps(1)} />
          <Tab label="Electricity demand" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <Box>
        <CustomTabPanel value={value} index={0}>
            <Container sx={{ mt: 2, mb: 2, flex: 1}}>
                {maxTempPredictionComponent}
            </Container>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
            <Container sx={{ mt: 2, mb: 2, flex: 1}}>
                {cloudPredictionComponent}
            </Container>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <Container sx={{ mt: 2, mb: 2, flex: 1}}>
              {electricityDemandPredictionComponent}
          </Container>
        </CustomTabPanel>
      </Box>
    </div>
  );
}
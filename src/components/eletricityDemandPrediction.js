import React, { useState } from 'react';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, BarElement, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { 
    Container, InputLabel , MenuItem, FormControl, Select,
    Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, 
    Button, 
    Paper, 
    Grid,
    Box,
    CircularProgress
  } from '@mui/material';
import Viz from '../assets/Electricity.jpg'
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';

  // Registering Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

function ElectricityDemandPrediction(){
    const [RRP, setRRP] = useState('');
    const [SolarExposure, setSolarExposure] = useState('');
    const [MaxTemp, setMaxTemp] = useState('');
    const [frac_at_neg_RRP, setfrac_at_neg_RRP] = useState('');
    const [RRP_negative, setRRP_negative] = useState('');
    const [Rainfall, setRainfall] = useState('');
    const [minTemp, setMinTemp] = useState('');

    //prediction results state and loading, error handling
    const [error, setError] = useState('');
    const [predictedTotalDemand, setPredictedTotalDemand] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);

    //input validations
    const [RRPErrors, setRRPErrors] = useState('');
    const [SolarExposureErrors, setSolarExposureErrors] = useState('');
    const [MaxTempErrors, setMaxTempErrors] = useState('');
    const [frac_at_neg_RRPErrors, setfrac_at_neg_RRPErrors] = useState('');
    const [RRP_negativeErrors, setRRP_negativeErrors] = useState('');
    const [RainfallErrors, setRainfallErrors] = useState('');
    const [minTempErrors, setMinTempErrors] = useState('');

    //chart x_axis size
    const [chartSampleSize, setChartSampleSize] = useState(10) //10 is the default size

    //regex pattern
    const wordsOnly = /[a-zA-z]/;

    //table
    function createData(name, description) {
        return { name, description};
    }

    const rows = [
        createData('Actual Total demand', 'This is the actual total electricity demand in the dataset'),
        createData('Actual Max Temp', 'This is the actual max temperature data in the dataset'),
        createData('Predicted Total demand', 'The prediction generated from the machine learning model'),
        createData('Input Max Temp', 'This is the max temperature taken from your input'),
      ];

    //increment the chart datasize and update the chart accordingly
    const incrementChartSampleSize = async () =>{
        if (chartSampleSize >= 30) return; //The maximum of the sample size
        setLoading(true);
        try{
            const newSize = chartSampleSize + 1;
            setChartSampleSize(newSize);

            const response = await axios.put(`http://localhost:8000/predict/XGBoost/${newSize}`);

            //create a label array that starts from 1 based on sample size: 
            const labels = Array.from({ length: newSize+1 }, (x, i) => i+1);
            
            const ActualMaxTempRate = response.data.actual_maxTempxg;
            const ActualTotalDemand = response.data.actual_totalDemand;

            const inputMaxTemp = parseFloat(MaxTemp); //input MaxTemp from users

            const newChartdata = {
            labels: labels,
            datasets: [
                {
                    label: 'Actual Max Temp (*C)',
                    data: ActualMaxTempRate,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    yaxisID: 'yMaxTemp'
                },
                {
                    label: 'Input MaxTemp (*C)',  
                    data: [...Array(newSize-1).fill(null), inputMaxTemp], // All null except the last one
                    backgroundColor: 'rgba(255, 206, 86, 0.6)', 
                    borderColor: 'rgba(255, 206, 86, 1)',
                    order: 1,
                    yaxisID: 'yMaxTemp'
                },
                {
                    label: 'Actual Total Demand (MWh)',
                    data: ActualTotalDemand,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    type: 'line',
                    order: 0,
                },
                {
                    label: 'Predicted Total Demand (MWh)',  
                    data: [...Array(newSize-1).fill(null), predictedTotalDemand], // All null except the last one
                    backgroundColor: 'rgba(101, 99, 255, 0.6)',  
                    borderColor: 'rgba(101, 99, 255, 0.6)',
                    type: 'line',
                },
            ]
            };
            setChartData(newChartdata);
        } catch (err){
            setError('Error updating sample size');
            console.error(err);
        } finally{
            setLoading(false);
        }
    }

    //decrement the chart datasize and update the chart accordingly
    const decrementChartSampleSize = async () =>{
        if (chartSampleSize >= 30) return; //The maximum of the sample size
        setLoading(true);
        try{
            const newSize = chartSampleSize - 1;
            setChartSampleSize(newSize);

            const response = await axios.put(`http://localhost:8000/predict/XGBoost/${newSize}`);

            //create a label array that starts from 1 based on sample size: 
            const labels = Array.from({ length: newSize+1 }, (x, i) => i+1);
            
            const ActualMaxTempRate = response.data.actual_maxTempxg;
            const ActualTotalDemand = response.data.actual_totalDemand;

            const inputMaxTemp = parseFloat(MaxTemp); //input MaxTemp from users

            const newChartdata = {
            labels: labels,
            datasets: [
                {
                    label: 'Actual Max Temp (*C)',
                    data: ActualMaxTempRate,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    yaxisID: 'yMaxTemp'
                },
                {
                    label: 'Input MaxTemp (*C)',  
                    data: [...Array(newSize-1).fill(null), inputMaxTemp], // All null except the last one
                    backgroundColor: 'rgba(255, 206, 86, 0.6)', 
                    borderColor: 'rgba(255, 206, 86, 1)',
                    order: 1,
                    yaxisID: 'yMaxTemp'
                },
                {
                    label: 'Actual Total Demand (MWh)',
                    data: ActualTotalDemand,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    type: 'line',
                    order: 0,
                },
                {
                    label: 'Predicted Total Demand (MWh)',  
                    data: [...Array(newSize-1).fill(null), predictedTotalDemand], // All null except the last one
                    backgroundColor: 'rgba(101, 99, 255, 0.6)',  
                    borderColor: 'rgba(101, 99, 255, 0.6)',
                    type: 'line',
                },
            ]
            };
            setChartData(newChartdata);
        } catch (err){
            setError('Error updating sample size');
            console.error(err);
        } finally{
            setLoading(false);
        }
    }
    //chart config
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setPredictedTotalDemand(null);

        // Clear errors and chart
        setRRPErrors('');
        setSolarExposureErrors('');
        setMaxTempErrors('');
        setfrac_at_neg_RRPErrors('');
        setRRP_negativeErrors('');
        setRainfallErrors('');
        setMinTempErrors('');
        setChartSampleSize(10);
        setChartData(null)

        //errors catching
        let validation = true;

        //RRP input validation
        if (!RRP || RRP < 0 || wordsOnly.test(RRP)){
            if ( wordsOnly.test(RRP)){
                setRRPErrors('Invalid Input - numbers only')
            }
            else{
                setRRPErrors('RRP cannot be negative')
            }
            validation = false;
        }

        //MaxTemp input validation
        if (!MaxTemp || MaxTemp < 0 || wordsOnly.test(MaxTemp)){
            if (wordsOnly.test(MaxTemp)){
                setMaxTempErrors('Invalid Input - numbers only')
            }
            else{
                setMaxTempErrors('MaxTemp cannot be negative')     
            }
            validation = false;
        }

        //SolarExposure input validation
        if (!SolarExposure || SolarExposure < 0 || wordsOnly.test(SolarExposure)){
            if (wordsOnly.test(SolarExposure)){
                setSolarExposureErrors('Invalid Input - numbers only')
            }
            else{
                setSolarExposureErrors('SolarExposure cannot be negative')
            }
            validation = false;
        }

        //frac_at_neg_RRP input validation
        if (!frac_at_neg_RRP || frac_at_neg_RRP  < 0 || frac_at_neg_RRP > 1 || wordsOnly.test(frac_at_neg_RRP)){
            if (wordsOnly.test(frac_at_neg_RRP)){
                setfrac_at_neg_RRPErrors('Invalid Input - numbers only')
            }
            else if (frac_at_neg_RRP > 1){
                setfrac_at_neg_RRPErrors('The frac_at_neg_RRP should ranges 0-1')
            }
            else{
                setfrac_at_neg_RRPErrors('frac_at_neg_RRP cannot be negative')
            }
            validation = false;
        }

        //RRP_negative input validation
        if (!RRP_negative || RRP_negative > 0 || wordsOnly.test(RRP_negative)){
            if (wordsOnly.test(RRP_negative)){
                setRRP_negativeErrors('Invalid Input - numbers only')
            }
            else {
                setRRP_negativeErrors('RRP_negative cannot be positive')
            }
            validation = false;
        }

        //rainfall input validations
        if (!Rainfall || Rainfall < 0 || wordsOnly.test(Rainfall)){
            if (wordsOnly.test(Rainfall)){
                setRainfallErrors('Invalid Input - numbers only');
            }
            else{
                setRainfallErrors('Rainfall cannot be negative');
            }
            validation = false;
        }

        if (!minTemp || minTemp < 0 || wordsOnly.test(minTemp)){
            if (wordsOnly.test(minTemp)){
                setMinTempErrors('Invalid Input - numbers only')
            }
            else{
                setMinTempErrors('Min Temperature cannot be negative')
            }
            validation = false;
        }

        //do not submit the form if there's errors
        if (!validation){
            return;
        }

        setLoading(true);
        try{
            //Bridging start here
            const response = await axios.get(`http://localhost:8000/predict/XGBoost/${RRP}/${SolarExposure}/${MaxTemp}/${frac_at_neg_RRP}/${RRP_negative}/${Rainfall}/${minTemp}/${chartSampleSize}`);
            setPredictedTotalDemand(response.data.predicted_totalDemand);

            //create a label array that starts from 1 based on sample size: 
            const labels = Array.from({ length: chartSampleSize+1 }, (x, i) => i+1);
            
            const ActualMaxTempRate = response.data.actual_maxTempxg;
            const ActualTotalDemand = response.data.actual_totalDemand;

            const inputMaxTemp = parseFloat(MaxTemp); //input MaxTemp from users

            const predictedTotalDemand = response.data.predicted_totalDemand

            const newChartdata = {
            labels: labels,
            datasets: [
                {
                    label: 'Actual Max Temp (*C)',
                    data: ActualMaxTempRate,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    yaxisID: 'yMaxTemp'
                },
                {
                    label: 'Input MaxTemp (*C)',  
                    data: [...Array(chartSampleSize-1).fill(null), inputMaxTemp], // All null except the last one
                    backgroundColor: 'rgba(255, 206, 86, 0.6)', 
                    borderColor: 'rgba(255, 206, 86, 1)',
                    order: 1,
                    yaxisID: 'yMaxTemp'
                },
                {
                    label: 'Actual Total Demand (MWh)',
                    data: ActualTotalDemand,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    type: 'line',
                    order: 0,
                },
                {
                    label: 'Predicted Total Demand (MWh)',  
                    data: [...Array(chartSampleSize-1).fill(null), predictedTotalDemand], // All null except the last one
                    backgroundColor: 'rgba(101, 99, 255, 0.6)',  
                    borderColor: 'rgba(101, 99, 255, 0.6)',
                    type: 'line',
                },
            ]
            };
            setChartData(newChartdata);
        } catch (err){
            setError('Error predicting total demand');
            console.error(err);
        } finally{
            setLoading(false);
        }
    };

    return(
        <div>
            <Box
                sx={{
                    position: 'relative',
                    backgroundImage: `url(${Viz})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    //dynamically change height
                    height: {
                        xs: '45vh',
                        sm: '40vh',
                        md: '30vh'
                      },
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: 2,
                    mb: 5,
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
                    <Typography variant="h3" component="h2" gutterBottom 
                    sx={{
                        fontWeight:'bold',
                        //dynamically change font-size
                        fontSize:{
                            xs: '2rem',
                            sm: '2.5rem',
                            md: '3rem'
                        }
                    }}>
                        Electricity Demand Predictor
                        <BatteryChargingFullIcon sx={{fontSize:'inherit'}}/>
                    </Typography>
                    
                    <Typography variant="h5" component="h4" gutterBottom>
                        This prediction machine uses XGBoost model for predicting eletricity demand 
                        based on eletricity usage values, and some meteorological data.
                    </Typography>
                </Container>
            </Box>

            <Container >
                {/*Input fields */}
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {/*RRP */}
                        <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            
                            label="RRP($/Mwh)"
                            variant="outlined"
                            value={RRP}
                            onChange={(e) => setRRP(e.target.value)}
                            error={!!RRPErrors}
                            helperText={RRPErrors}
                            required
                        />
                        </Grid>
                        {/*SolarExposure */}
                        <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            
                            label="SolarExposure(MJ/m^2)"
                            variant="outlined"
                            value={SolarExposure}
                            onChange={(e) => setSolarExposure(e.target.value)}
                            error={!!SolarExposureErrors}
                            helperText={SolarExposureErrors}
                            required
                        />
                        </Grid>
                        {/*MaxTemp*/}
                        <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            
                            label="MaxTemp(*C)"
                            variant="outlined"
                            value={MaxTemp}
                            onChange={(e) => setMaxTemp(e.target.value)}
                            error={!!MaxTempErrors}
                            helperText={MaxTempErrors}
                            required
                        />
                        </Grid>
                        {/*MinTemp*/}
                        <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            
                            label="MinTemp(*C)"
                            variant="outlined"
                            value={minTemp}
                            onChange={(e) => setMinTemp(e.target.value)}
                            error={!!minTempErrors}
                            helperText={minTempErrors}
                            required
                        />
                        </Grid>
                        {/*frac_at_neg_RRP*/}
                        <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            
                            label="frac_at_neg_RRP"
                            variant="outlined"
                            value={frac_at_neg_RRP}
                            onChange={(e) => setfrac_at_neg_RRP(e.target.value)}
                            error={!!frac_at_neg_RRPErrors}
                            helperText={frac_at_neg_RRPErrors}
                            required
                        />
                        </Grid>
                        {/*RRP_negative*/}
                        <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            
                            label="RRP_negative($/MWh)"
                            variant="outlined"
                            value={RRP_negative}
                            onChange={(e) => setRRP_negative(e.target.value)}
                            error={!!RRP_negativeErrors}
                            helperText={RRP_negativeErrors}
                            required
                        />
                        </Grid>
                        {/*Rainfall*/}
                        <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            
                            label="Rainfall(mm)"
                            variant="outlined"
                            value={Rainfall}
                            onChange={(e) => setRainfall(e.target.value)}
                            error={!!RainfallErrors}
                            helperText={RainfallErrors}
                            required
                        />
                        </Grid>
                        <Grid item xs={12}>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary" 
                            fullWidth
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Predict'}
                        </Button>
                        </Grid>
                    </Grid>
                </form>

                {/*Show error message*/}
                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                    </Typography>
                )}

                {predictedTotalDemand && (
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            Predicted Total Demand: {predictedTotalDemand.toLocaleString()} MWh
                        </Typography>
                    </Paper>
                )}

                {/* Show chart*/}
                {chartData && (
                    <Box mt={4}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                {/*remove sample*/}
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    fullWidth
                                    disabled={loading}
                                    onClick={decrementChartSampleSize}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Remove sample'}
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {/*Add sample*/}
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    fullWidth
                                    onClick={incrementChartSampleSize}
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Add sample'}
                                </Button>
                            </Grid>
                        </Grid>

                        {/*Visualisation graph*/}
                        <Bar data={chartData} 
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: 'Total Demand vs Max Temperature (Predicted and Actual)'
                                }
                            },
                            scales: {
                                x: {
                                type: 'linear',
                                position: 'bottom',
                                title: {
                                    display: true,
                                    text: 'Sample number'
                                }
                                },
                                y: {
                                    title: {
                                    display: true,
                                    text: 'Total Demand (MWh)'
                                    }
                                },
                                yMaxTemp: {
                                type: 'linear',
                                position: 'right',
                                title: {
                                    display: true,
                                    text: 'Max Temperature(*C)'
                                }
                                }
                            }
                        }}
                        
                        />

                         {/*the table that shows the classification */}
                        <Paper elevation={3} sx={{ p: 3 , mt: 5, height: 'fit-content'}}>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                    <TableRow>
                                        <TableCell>Graph label</TableCell>
                                        <TableCell >Full Explanation</TableCell>
                                    </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {rows.map((row) => (
                                        <TableRow
                                        key={row.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                        <TableCell component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell >{row.description}</TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Typography variant="h5" component="h4" sx={{mt: 5}}gutterBottom>
                                The graph above shows the actual data and the prediction generated, as well as the input from the
                                users to further see the prediction in relation to the inputs.
                            </Typography>
                        </Paper>
                    </Box>
                )}       
            </Container>
        </div>
        
    );
}
export default ElectricityDemandPrediction
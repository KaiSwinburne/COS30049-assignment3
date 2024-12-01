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
import Viz from '../assets/MaxTemp.jpg';
import ThermostatIcon from '@mui/icons-material/Thermostat';

  // Registering Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

function MaxTempPrediction(){
    const [rainFall, setRainFall] = useState('');
    const [evaporation, setEvaporation] = useState('');
    const [sunshine, setSunshine] = useState('');
    const [humidity9am, setHumidity9am] = useState('');
    const [humidity3pm, setHumidity3pm] = useState('');
    const [windGustSpeed, setWindGustSpeed] = useState('');
    const [minTemp, setMinTemp] = useState('');

    //prediction results state and loading, error handling
    const [error, setError] = useState('');
    const [predictedMaxTemp, setPredictedMaxTemp] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);

    //input validations
    const [rainFallErrors, setRainFallErrors] = useState('');
    const [evaporationErrors, setEvaporationErrors] = useState('');
    const [sunshineErrors, setSunshineErrors] = useState('');
    const [humidity9amErrors, setHumidity9amErrors] = useState('');
    const [humidity3pmErrors, setHumidity3pmErrors] = useState('');
    const [windGustSpeedErrors, setWindGustSpeedErrors] = useState('');
    const [minTempErrors, setMinTempErrors] = useState('');

    //model type

    //regex pattern
    const wordsOnly = /[a-zA-z]/;

    //table
    function createData(name, description) {
        return { name, description};
    }

    const rows = [
        createData('Actual Sunshine Rate', 'This is the actual sunshine rate in the dataset'),
        createData('Actual Max Temp', 'This is the actual max temperature data in the dataset'),
        createData('Predicted Max Temp', 'The prediction generated from the machine learning model'),
        createData('Input Sunshine', 'This is the sunshine rate taken from your input'),
      ];

    //chart x_axis size
    const [chartSampleSize, setChartSampleSize] = useState(10) //10 is the default size

    //increment the chart datasize and update the chart accordingly
    const incrementChartSampleSize = async () =>{
        if (chartSampleSize >= 30) return; //The maximum of the sample size
        setLoading(true);
        try{
            const newSize = chartSampleSize + 1;

            setChartSampleSize(newSize);
            const response = await axios.put(`http://localhost:8000/predict/ridge_regression/${newSize}`);
                
            //create a label array that starts from 1 based on sample size: 
            const labels = Array.from({ length: newSize+1 }, (x, i) => i+1);

            //Actual data of sunshine feature & max temp prediction target
            const ActualSunshineRate = response.data.actual_sunshine; 
            const ActualmaxTemp = response.data.actual_maxTemp;

            const inputSunshine = parseFloat(sunshine); //input sunshine from users

            const newChartdata = {
            labels: labels,
            datasets: [
                {
                    label: 'Actual Sunshine Rate (hours/day)',
                    data: ActualSunshineRate,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    yaxisID: 'ySunshine'
                },
                {
                    label: 'Input Sunshine (hours/day)',  
                    data: [...Array(newSize-1).fill(null), inputSunshine], // All null except the last one
                    backgroundColor: 'rgba(255, 206, 86, 0.6)', 
                    borderColor: 'rgba(255, 206, 86, 1)',
                    order: 1,
                    yaxisID: 'ySunshine'
                },
                {
                    label: 'Actual Max Temp (*C)',
                    data: ActualmaxTemp,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    type: 'line',
                    order: 0,
                },
                {
                    label: 'Predicted Max Temp (*C)',  
                    data: [...Array(newSize-1).fill(null), predictedMaxTemp], // All null except the last one
                    backgroundColor: 'rgba(101, 99, 255, 0.6)',  
                    borderColor: 'rgba(101, 99, 255, 0.6)',
                    type: 'line',
                },
            ]
            };
            setChartData(newChartdata);
        }
        catch (err){
            setError('Error updating chart');
            console.error(err);
        } finally{
            setLoading(false);
        } 
    }

    //increment the chart datasize and update the chart accordingly
    const decrementChartSampleSize = async () =>{
        if (chartSampleSize <= 5) return; //The minimum of the sample size
        setLoading(true);
        try{
            const newSize = chartSampleSize - 1;
            setChartSampleSize(newSize);
            const response = await axios.put(`http://localhost:8000/predict/ridge_regression/${newSize}`);

            //create a label array that starts from 1 based on sample size: 
            const labels = Array.from({ length: newSize+1 }, (x, i) => i+1);

            //Actual data of sunshine feature & max temp prediction target
            const ActualSunshineRate = response.data.actual_sunshine; 
            const ActualmaxTemp = response.data.actual_maxTemp;

            const inputSunshine = parseFloat(sunshine); //input sunshine from users

            const newChartdata = {
            labels: labels,
            datasets: [
                {
                    label: 'Actual Sunshine Rate (hours/day)',
                    data: ActualSunshineRate,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    yaxisID: 'ySunshine'
                },
                {
                    label: 'Input Sunshine (hours/day)',  
                    data: [...Array(newSize-1).fill(null), inputSunshine], // All null except the last one
                    backgroundColor: 'rgba(255, 206, 86, 0.6)', 
                    borderColor: 'rgba(255, 206, 86, 1)',
                    order: 1,
                    yaxisID: 'ySunshine'
                },
                {
                    label: 'Actual Max Temp (*C)',
                    data: ActualmaxTemp,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    type: 'line',
                    order: 0,
                },
                {
                    label: 'Predicted Max Temp (*C)',  
                    data: [...Array(newSize-1).fill(null), predictedMaxTemp], // All null except the last one
                    backgroundColor: 'rgba(101, 99, 255, 0.6)',  
                    borderColor: 'rgba(101, 99, 255, 0.6)',
                    type: 'line',
                },
            ]
            };
            setChartData(newChartdata);
        }
        catch (err){
            setError('Error updating chart');
            console.error(err);
        } finally{
            setLoading(false);
        } 
    }

    //chart submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setPredictedMaxTemp(null);

        // Clear errors and chart
        setRainFallErrors('');
        setEvaporationErrors('');
        setSunshineErrors('');
        setHumidity9amErrors('');
        setHumidity3pmErrors('');
        setWindGustSpeedErrors('');
        setMinTempErrors('');
        setChartSampleSize(10);
        setChartData(null);

        //errors catching
        let validation = true;

        //rainfall input validations
        if (!rainFall || rainFall < 0 || wordsOnly.test(rainFall)){
            if (wordsOnly.test(rainFall)){
                setRainFallErrors('Invalid Input - numbers only');
            }
            else{
                setRainFallErrors('Rainfall cannot be negative');
            }
            validation = false;
        }

        //sunshine input validations
        if (!sunshine || sunshine  < 0 || sunshine > 24 || wordsOnly.test(sunshine)){
            if (sunshine > 24){
                setSunshineErrors('Sunshine cannot be bigger than 24 hours');    
            }
            else if(wordsOnly.test(sunshine)){
                setSunshineErrors('Invalid Input - numbers only');
            }
            else{
                setSunshineErrors('Sunshine cannot be negative');
            }       
            validation = false;
        }

        //evaporation input validations
        if (!evaporation || evaporation < 0 || wordsOnly.test(evaporation)){
            if (wordsOnly.test(evaporation)){
                setEvaporationErrors('Invalid Input - numbers only');
            }
            else {
                setEvaporationErrors('Evaporation cannot be negative');
            }
            validation = false;
        }

        //humidity9am input validations
        if (!humidity9am || humidity9am < 0 || wordsOnly.test(humidity9am)){
            if (wordsOnly.test(humidity9am)){
                setHumidity9amErrors('Invalid Input - numbers only');
            }
            else{
                setHumidity9amErrors('Humidity cannot be negative');
            }
            
            validation = false;
        }

        //humidity3pm input validations
        if (!humidity3pm || humidity3pm < 0 || wordsOnly.test(humidity3pm)){
            if (wordsOnly.test(humidity3pm)){
                setHumidity3pmErrors('Invalid Input - numbers only');
            }
            else{
                setHumidity3pmErrors('Humidity cannot be negative');
            }  
            validation = false;
        }

        //windGustSpeed input validations
        if (!windGustSpeed || windGustSpeed < 0 || wordsOnly.test(windGustSpeed)){
            if (wordsOnly.test(windGustSpeed)){
                setWindGustSpeedErrors('Invalid Input - numbers only');
            }
            else{
                setWindGustSpeedErrors('Wind gust cannot be negative');
            }
            validation = false;
        }

        //minTemp input validations
        if (!minTemp || minTemp < 0 || wordsOnly.test(minTemp)){
            if (wordsOnly.test(minTemp)){
                setMinTempErrors('Invalid Input - numbers only');
            }
            else{
                setMinTempErrors('Min Temperature cannot be negative');
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
            const response = await axios.get(`http://localhost:8000/predict/ridge_regression/${rainFall}/${evaporation}/${sunshine}/${humidity9am}/${humidity3pm}/${windGustSpeed}/${minTemp}/${chartSampleSize}`);
            setPredictedMaxTemp(response.data.predicted_maxTemp);  
            
            //create a label array that starts from 1 based on sample size: 
            const labels = Array.from({ length: chartSampleSize+1 }, (x, i) => i+1);

            //Actual data of sunshine feature & max temp prediction target
            const ActualSunshineRate = response.data.actual_sunshine; 
            const ActualmaxTemp = response.data.actual_maxTemp;

            const inputSunshine = parseFloat(sunshine); //input sunshine from users

            //the Predicted Max Temperature
            const predictedMaxTemp = response.data.predicted_maxTemp

            const newChartdata = {
            labels: labels,
            datasets: [
                {
                    label: 'Actual Sunshine Rate (hours/day)',
                    data: ActualSunshineRate,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    yaxisID: 'ySunshine'
                },
                {
                    label: 'Input Sunshine (hours/day)',  
                    data: [...Array(chartSampleSize-1).fill(null), inputSunshine], // All null except the last one
                    backgroundColor: 'rgba(255, 206, 86, 0.6)', 
                    borderColor: 'rgba(255, 206, 86, 1)',
                    order: 1,
                    yaxisID: 'ySunshine'
                },
                {
                    label: 'Actual Max Temp (*C)',
                    data: ActualmaxTemp,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    type: 'line',
                    order: 0,
                },
                {
                    label: 'Predicted Max Temp (*C)',  
                    data: [...Array(chartSampleSize-1).fill(null), predictedMaxTemp], // All null except the last one
                    backgroundColor: 'rgba(101, 99, 255, 0.6)',  
                    borderColor: 'rgba(101, 99, 255, 0.6)',
                    type: 'line',
                },
            ]
            };
            setChartData(newChartdata);
        } catch (err){
            setError('Error predicting max temp');
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
                        fontSize:{
                            xs: '2rem',
                            sm: '2.5rem',
                            md: '3rem'
                        }
                        }}>
                        Max Temperature Predictor
                        <ThermostatIcon sx={{fontSize:'inherit'}}/>
                    </Typography>
                    
                    <Typography variant="h5" component="h4" gutterBottom>
                        This prediction machine uses Ridge Rigression model for predicting maximum temperature in Melbourne using meteorological features.
                    </Typography>
                </Container>
            </Box>

            <Container >
                {/*Input fields */}
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {/*Rainfall */}
                        <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Rainfall(mm)"
                            variant="outlined"
                            value={rainFall}
                            onChange={(e) => setRainFall(e.target.value)}
                            error={!!rainFallErrors}
                            helperText={rainFallErrors}
                            required
                        />
                        </Grid>
                        {/*Evaporation */}
                        <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            
                            label="Evaporation(mm/day)"
                            variant="outlined"
                            value={evaporation}
                            onChange={(e) => setEvaporation(e.target.value)}
                            error={!!evaporationErrors}
                            helperText={evaporationErrors}
                            required
                        />
                        </Grid>
                        {/*Sunshine*/}
                        <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            
                            label="Sunshine(hours/day)"
                            variant="outlined"
                            value={sunshine}
                            onChange={(e) => setSunshine(e.target.value)}
                            error={!!sunshineErrors}
                            helperText={sunshineErrors}
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
                        {/*Humidity9am*/}
                        <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            
                            label="Humidity9am(%)"
                            variant="outlined"
                            value={humidity9am}
                            onChange={(e) => setHumidity9am(e.target.value)}
                            error={!!humidity9amErrors}
                            helperText={humidity9amErrors}
                            required
                        />
                        </Grid>
                        {/*Humidity3pm*/}
                        <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            
                            label="Humidity3pm(%)"
                            variant="outlined"
                            value={humidity3pm}
                            onChange={(e) => setHumidity3pm(e.target.value)}
                            error={!!humidity3pmErrors}
                            helperText={humidity3pmErrors}
                            required
                        />
                        </Grid>
                        {/*WindGustSpeed*/}
                        <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            
                            label="WindGustSpeed(km/h)"
                            variant="outlined"
                            value={windGustSpeed}
                            onChange={(e) => setWindGustSpeed(e.target.value)}
                            error={!!windGustSpeedErrors}
                            helperText={windGustSpeedErrors}
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

                {predictedMaxTemp && (
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            Predicted Max Temperature: {predictedMaxTemp.toLocaleString()}*C
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
                        
                        <Bar 
                            data={chartData} 
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                    title: {
                                        display: true,
                                        text: 'Max Temp vs Sunshine (Predicted and Actual)'
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
                                        text: 'Max Temperature (*C)'
                                        }
                                    },
                                    ySunshine: {
                                    type: 'linear',
                                    position: 'right',
                                    title: {
                                        display: true,
                                        text: 'Sunshine(hours/day)'
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
export default MaxTempPrediction
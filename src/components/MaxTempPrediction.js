import React, { useState } from 'react';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, BarElement, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { 
    Container, 
    Typography, 
    TextField, 
    Button, 
    Paper, 
    Grid,
    Box,
    CircularProgress
  } from '@mui/material';

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

    //chart config

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
        setChartData(null)

        //errors catching
        let validation = true;
        if (!rainFall || rainFall < 0){
            setRainFallErrors('Rainfall cannot be negative')
            validation = false;
        }
        if (!sunshine || sunshine  < 0 || sunshine > 24){
            if (sunshine > 24){
                setSunshineErrors('Sunshine cannot be bigger than 24 hours')        
            }
            else{
                setSunshineErrors('Sunshine cannot be negative')
            }
            
            validation = false;
        }
        if (!evaporation || evaporation < 0){
            setEvaporationErrors('Evaporation cannot be negative')
            validation = false;
        }
        if (!humidity9am || humidity9am  < 0){
            setHumidity9amErrors('Humidity cannot be negative')
            validation = false;
        }
        if (!humidity3pm || humidity3pm < 0){
            setHumidity3pmErrors('Humidity cannot be negative')
            validation = false;
        }
        if (!windGustSpeed || windGustSpeed < 0){
            setWindGustSpeedErrors('Wind gust cannot be negative')
            validation = false;
        }
        if (!minTemp || minTemp < 0){
            setMinTempErrors('Min Temperature cannot be negative')
            validation = false;
        }

        //do not submit the form if there's errors
        if (!validation){
            return;
        }

        setLoading(true);
        try{
            //Bridging start here
            //const response = await axios.get(`http://localhost:8000/predict/${rainFall}/${evaporation}/${sunshine}/${humidity9am}/${humidity3pm}/${windGustSpeed}/${minTemp}`);
                 
            //TODO: Replace the dummy data with the actual ones retrieved using Axios
            const labels = [1,2,3,4,5,6,7,8,9,10] //Sample number
            const ActualSunshineRate = [5, 6, 8, 7, 4, 9,10,12,11,null]; //sunshine
            const ActualmaxTemp = [12, 10, 8, 7, 13, 16,17,14,16,null];

            const inputSunshine = parseFloat(sunshine); //input sunshine from users
            //dummy predicted values
            const predictedMaxTemp = Math.floor(Math.random() * 10) + 10;  // Dummy range: 20°C to 30°C

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
                    data: [...Array(9).fill(null), inputSunshine], // All null except the last one
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
                    data: [...Array(9).fill(null), predictedMaxTemp], // All null except the last one
                    backgroundColor: 'rgba(101, 99, 255, 0.6)',  
                    borderColor: 'rgba(101, 99, 255, 0.6)',
                    type: 'line',
                },
            ]
            };

            setPredictedMaxTemp(predictedMaxTemp);
            setChartData(newChartdata);
        } catch (err){
            setError('Error predicting max temp');
            console.error(err);
        } finally{
            setLoading(false);
        }
    };

    return(
        <Container>
            <Typography variant="h3" component="h2" gutterBottom>
                Max Temperature Predictor
            </Typography>
            <Typography variant="h5" component="h4" gutterBottom>
                This prediction machine uses Ridge Rigression model for predicting maximum temperature in Melbourne using meteorological features.
            </Typography>

            {/*Input fields */}
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    {/*Rainfall */}
                    <Grid item xs={12} sm={4}>
                    <TextField
                        fullWidth
                        type="number"
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
                        type="number"
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
                        type="number"
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
                        type="number"
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
                        type="number"
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
                        type="number"
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
                        type="number"
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
                    <Bar data={chartData} 
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
                </Box>
            )}

            
        </Container>
    );
}
export default MaxTempPrediction
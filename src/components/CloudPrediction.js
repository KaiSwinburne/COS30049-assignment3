import React, { useState } from 'react';
import axios from 'axios';
import { Doughnut, Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, BarElement, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { 
    Container, InputLabel , MenuItem, FormControl, Select,
    Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, 
    Button, 
    Paper, 
    Grid,
    Box,
    CircularProgress,
    Link
  } from '@mui/material';
import Viz from '../assets/Clouds.jpg'
import CloudIcon from '@mui/icons-material/Cloud';

  // Registering Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

function CloudPrediction(){
    const [rainFall, setRainFall] = useState('');
    const [evaporation, setEvaporation] = useState('');
    const [sunshine, setSunshine] = useState('');
    const [humidity9am, setHumidity9am] = useState('');
    const [Temp9am, setTemp9am] = useState('');
    const [WindSpeed9am, setWindSpeed9am] = useState('');

    //prediction results state and loading, error handling
    const [error, setError] = useState('');
    const [predictedCloudCondtion, setpredictedCloudCondtion] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);

    //input validations
    const [rainFallErrors, setRainFallErrors] = useState('');
    const [evaporationErrors, setEvaporationErrors] = useState('');
    const [sunshineErrors, setSunshineErrors] = useState('');
    const [humidity9amErrors, setHumidity9amErrors] = useState('');
    const [Temp9amErrors, setTemp9amErrors] = useState('');
    const [WindSpeed9amErrors, setWindSpeed9amErrors] = useState('');

    //regex pattern
    const wordsOnly = /[a-zA-z]/;

    //table
    function createData(name, description) {
        return { name, description};
    }

    const rows = [
        createData('SKC', 'Clear Sky'),
        createData('FEW', 'Few Clouds'),
        createData('SCT', 'Scatter Clouds'),
        createData('BKN', 'Broken Clouds'),
        createData('OVC', 'Overcast'),
      ];

    //chart type
    const [chartType, setChartType] = useState('doughnut')
    const handleChartType = (e) => {
        setChartType(e.target.value);
    }
    const renderChart = () => {

        //cancel if no data is retrieved
        if (!chartData) return null;

        const chartCommonOptions ={
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Cloud conditions distribution in the dataset'
                }
            }
        };

        const barOptions ={
            ...chartCommonOptions, //add the common options along with the bar exclusive ones
            scales:{
                y:{
                    title: {
                        display: true,
                        text: 'Sample Count'
                    },
                },
                x:{
                    title: {
                        display: true,
                        text: 'Cloud conditions'
                    }
                }
            }
        }

        switch (chartType){
            case 'doughnut':
                return <Doughnut data={chartData} options={chartCommonOptions}/>
            case 'pie':
                return <Pie data={chartData} options={chartCommonOptions}/>
            case 'bar':
                return <Bar data={chartData} options={barOptions}/>
        }
    }


    //chart config
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setpredictedCloudCondtion(null);

        //the default chart
        setChartType('doughnut');

        // Clear errors and chart
        setRainFallErrors('');
        setEvaporationErrors('');
        setSunshineErrors('');
        setHumidity9amErrors('');
        setTemp9amErrors('');
        setWindSpeed9amErrors('');
        setChartData(null)

        //errors catching
        let validation = true;

        //rainfall input validations
        if (!rainFall || rainFall < 0 || wordsOnly.test(rainFall)){
            if (wordsOnly.test(rainFall)){
                setRainFallErrors('Invalid Input - numbers only')
            }
            else{
                setRainFallErrors('Rainfall cannot be negative')
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

        if (!Temp9am || Temp9am < 0 || wordsOnly.test(Temp9am)){
            if ( wordsOnly.test(Temp9am)){
                setTemp9amErrors('Invalid Input - numbers only')
            }
            else{
                setTemp9amErrors('Temperature cannot be negative')
            }
            validation = false;
        }
        if (!WindSpeed9am || WindSpeed9am < 0 || wordsOnly.test(WindSpeed9am)){
            if (wordsOnly.test(WindSpeed9am)){
                setWindSpeed9amErrors('Invalid Input - numbers only')
            }
            else{
                setWindSpeed9amErrors('Wind speed cannot be negative')
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
            const response = await axios.get(`http://localhost:8000/predict/random_forest_classifier/${rainFall}/${evaporation}/${sunshine}/${humidity9am}/${Temp9am}/${WindSpeed9am}`);
                 
            const labels = response.data.labels //cloud names

            //get the support score of the model
            const sampleCountData = Object.values(response.data.support_score)

            const predictedCloudCondtion = response.data.predicted_cloud9am
            const newChartdata = {
            labels: labels,
            datasets: [
                {
                    label: 'Condition count in the dataset',
                    data: sampleCountData,
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(237, 222, 94)',
                        'rgb(99, 255, 179)',
                        'rgb(99, 219, 255)',
                        'rgb(246, 99, 255)'
                      ],
                    hoverOffset: 4
                },
            ]
            };

            setpredictedCloudCondtion(predictedCloudCondtion);
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
                        //dynamically change font-size
                        fontSize:{
                            xs: '2rem',
                            sm: '2.5rem',
                            md: '3rem'
                        }
                        }}>
                        Cloud Condition Predictor 
                        <CloudIcon sx={{ ml: 2, fontSize:'inherit'}}/>
                    </Typography>
                    
                    <Typography variant="h5" component="h4" gutterBottom>
                        This predictor uses Random Forest Classifier model to predict the Melbourne's cloud condition
                        at 9am using meteorological features.
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
                        {/*Temp9am*/}
                        <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            
                            label="Temp9am(*C)"
                            variant="outlined"
                            value={Temp9am}
                            onChange={(e) => setTemp9am(e.target.value)}
                            error={!!Temp9amErrors}
                            helperText={Temp9amErrors}
                            required
                        />
                        </Grid>
                        {/*WindSpeed9am*/}
                        <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            
                            label="WindSpeed9am(km/h)"
                            variant="outlined"
                            value={WindSpeed9am}
                            onChange={(e) => setWindSpeed9am(e.target.value)}
                            error={!!WindSpeed9amErrors}
                            helperText={WindSpeed9amErrors}
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

                {predictedCloudCondtion && (
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            Predicted cloud condtion: {predictedCloudCondtion.toLocaleString()}
                        </Typography>
                    </Paper>
                )}

                {/* Show chart*/}
                {chartData && (
                    <Box>
                        {/*Chart type selection*/}

                        <Paper elevation={3} sx={{ p: 3 , mt: 5, width:'fit-content'}}>
                            <Grid container spacing={2} sx={{ml:0}}>
                                <Grid xs={12} md={6} sx={{width:'50vh',display:'flex',justifyContent:'center',alignItems:'center'}}>
                                    <Typography variant="h5" component="h4" >
                                        Select chart type:
                                    </Typography>
                                </Grid>
                                <Grid xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="chart-select-label">Select Chart</InputLabel>
                                    <Select
                                        labelId="chart-select-label"
                                        id="chart-select-label"
                                        value={chartType}
                                        label="Select Chart"
                                        onChange={handleChartType}
                                    >
                                        <MenuItem value="doughnut">Doughtnut</MenuItem>
                                        <MenuItem value="pie">Pie</MenuItem>
                                        <MenuItem value="bar">Bar</MenuItem>
                                    </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Paper>


                        {/*Chart display*/}
                        <Box mt={4} sx={{height: 400,  display: 'flex', justifyContent: 'center'}}>
                            {renderChart()}
                        </Box>

                        {/*the table that shows the classification */}
                        <Paper elevation={3} sx={{ p: 3 , mt: 5, height: 'fit-content'}}>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                    <TableRow>
                                        <TableCell>Classification name</TableCell>
                                        <TableCell >Full description</TableCell>
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
                            <Typography variant="h6" component="h6" sx={{ p: 3 , mt: 3}}>
                                Cloud condition description followed this website: <Link href="https://windy.app/blog/okta-cloud-cover.html" underline="none">https://windy.app/blog/okta-cloud-cover.html</Link>   
                            </Typography>
                            <Typography variant="h5" component="h4" sx={{mt: 3}}gutterBottom>
                                The graph above shows the distribution of classification labels throughout the dataset. This
                                shows if the prediction result is biased to any labels or none at all.
                            </Typography>
                        </Paper>
                    </Box>
                )}       
            </Container>
        </div>
        
    );
}
export default CloudPrediction
import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Grid,
  Paper,
  TextField,
  Box,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Radio,
  RadioGroup,
  Container,
} from "@mui/material";
import linegraph from '../assets/linegraph.png';
import barchart from '../assets/barchart.png';
import Skyline from '../assets/Albert_Park_Lake_&_Melbourne_City_Skyline,_2016.png';
import Header from '../components/Header'
import Papa from "papaparse";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, BarChart, Bar } from "recharts";

function Weather(){

      const [csvData, setCsvData] = useState([]);
      const [selectedParameter, setSelectedParameter] = useState("MaxTemp(*C)");
      const [filteredData, setFilteredData] = useState([]);
      const [startDate, setStartDate] = useState("2008-07-01");  // Date range start
      const [endDate, setEndDate] = useState("2014-12-31");  // Date range end
      const [startDateError, setStartDateError] = useState(""); // Error for start date
      const [endDateError, setEndDateError] = useState("");     // Error for end date

      // Min and Max dates for date selection
      const MIN_DATE = "2008-07-01";
      const MAX_DATE = "2014-12-31";

      //parameter renaming for the title
      const parameterNames = (parameter) =>{
        const parametersDict = {
          "MaxTemp(*C)": "Max Temperature",
          "MinTemp(*C)": "Min Temperature",
          "Humidity9am(%)": "Humidity at 9am",
          "Humidity3pm(%)": "Humidity at 3pm" ,
          "Rainfall(mm)":"Rainfall",
          "Sunshine(hours/day)":"Sunshine rate",
          "WindSpeed9am(km/h)":"Wind speed at 9am (km/h)",
          "WindSpeed3pm(km/h)":"Wind speed at 3pm (km/h)",
          "WindGustSpeed(km/h)":"Wind gust speed (km/h)",
          "Evaporation(mm/day)":"Evaporation(mm/day)"
        }
        return parametersDict[parameter];
      }


      const handleStartDateChange = (event) => {
        const date = event.target.value;
        setStartDate(date);

        // Check if the date is valid
        if (date && date < MIN_DATE) {
          setStartDateError("Start date must be on or after 2008-07-01.");
        } else {
          setStartDateError(""); // Clear error if valid
        }
      };
      
      const handleEndDateChange = (event) => {
        const date = event.target.value;
        setEndDate(date);
    
        // Check if the date is valid
        if (date && date > MAX_DATE) {
          setEndDateError("End date must be on or before 2014-12-31.");
        } else {
          setEndDateError(""); // Clear error if valid
        }
      };

      // Fetch and parse CSV data from the public folder using Axios
      useEffect(() => {
        const fetchCSV = async () => {
          try {
            const response = await axios.get("http://localhost:8000/dataset/", { responseType: "text" });
            Papa.parse(response.data, {
              header: true,
              dynamicTyping: true,
              complete: (results) => {
                console.log("Parsed Data:", results.data); // Log parsed data
                setCsvData(results.data);
               
              },
            });
          } catch (error) {
            console.error("Error fetching CSV data:", error);
          }
        };
        fetchCSV();
      }, []);

      // Filter data whenever date range or selected parameter changes
      useEffect(() => {
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
      
        // Filter data based on date range and selected parameter
        const filtered = csvData
          .filter((row) => {
            const rowDate = new Date(row.Date); // Ensure 'Date' matches the date column in CSV
            const isWithinDateRange =
              (!start || rowDate >= start) &&
              (!end || rowDate <= end);
            return isWithinDateRange;
          })
          .map((row) => ({
            time: row.Date,
            value: row[selectedParameter],
          }));
      
        setFilteredData(filtered);

        // Calculate max, average, and min values for the selected parameter
        if (filtered.length > 0) {
          const values = filtered.map(data => data.value);

          const max = Math.max(...values);
          const min = Math.min(...values);
          const avg = values.reduce((a, b) => a + b, 0) / values.length;

          setMaxValue(max.toFixed(2));
          setAvgValue(avg.toFixed(2));
          setMinValue(min.toFixed(2));
        } else {
          // Reset values if there's no data
          setMaxValue("--");
          setAvgValue("--");
          setMinValue("--");
        }
      }, [startDate, endDate, selectedParameter, csvData]);

      // Handle parameter change
    const handleParameterChange = (event) => {
      const parameter = event.target.value;
      setSelectedParameter(parameter);
    };

    // For summary/results table
    const [maxValue, setMaxValue] = useState("--");
    const [avgValue, setAvgValue] = useState("--");
    const [minValue, setMinValue] = useState("--");

    // Graph type selection
    const [chartType, setChartType] = useState("Line"); // Default to line chart

    //graph title
    const graphTitle = `${chartType} chart of ${parameterNames(selectedParameter)} trend in Melbourne from ${startDate} to ${endDate}`
    const yAxisLabel = `${selectedParameter}`;
    
    return(
        <div>
            <Header/>
            <Box
                sx={{
                  position: 'relative', // Page banner config
                  backgroundImage: `url(${Skyline})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
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
                  <Typography variant="h4" component="h3" gutterBottom
                      sx={{
                          position: 'relative',
                          textAlign: 'center',
                          fontWeight: 'bold'
                      }}
                  >
                      Historical Data
                  </Typography>
                  <Typography component="h5" gutterBottom
                      sx={{
                          position: 'relative',
                          textAlign: 'center',
                          paddingLeft: '20vh',
                          paddingRight: '20vh'
                      }}
                  >
                      View previous observations for Melbourne enhanced by machine learning models
                  </Typography>
              </Container>
          </Box>
            

            {/* main content section */}
            <Grid container spacing={2} sx={{ padding: "20px" }}>
            {/* data input section */}
            <Grid item xs={12} sm={3}>
                <Paper sx={{ padding: "20px"}} elevation={3}>
                    <Grid container justifyContent="space-between" alignItems="center" sx={{ marginBottom: "20px" }}>
                    </Grid>

                    {/* date input */}
                    <Typography variant="body1" sx={{ marginTop: "10px", fontWeight: "bold" }}>
                    Select Date Range
                    </Typography>

                    {/* from date input */}
                    <TextField
                      label="From"
                      type="date"
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                      value={startDate}
                      onChange={handleStartDateChange}
                      error={!!startDateError} // Highlights in red if there's an error
                      helperText={startDateError} // Shows the error text
                    />

                    {/* to date input */}
                    <TextField
                      label="To"
                      type="date"
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                      value={endDate}
                      onChange={handleEndDateChange}
                      error={!!endDateError} // Highlights in red if there's an error
                      helperText={endDateError} // Shows the error text
                    />

                    <Box marginY={2}>
                    <Typography sx={{ marginTop: "20px", fontWeight: "bold" }}>
                        Select parameters
                    </Typography>
                    <RadioGroup name="parameters" value={selectedParameter} onChange={handleParameterChange}>
                      <FormControlLabel value="MaxTemp(*C)" control={<Radio />} label="Max Temperature (°C)" />
                      <FormControlLabel value="MinTemp(*C)" control={<Radio />} label="Min Temperature (°C)" />
                      <FormControlLabel value="Humidity9am(%)" control={<Radio />} label="Humidity 9am (%)" />
                      <FormControlLabel value="Humidity3pm(%)" control={<Radio />} label="Humidity 3pm (%)" />
                      <FormControlLabel value="Rainfall(mm)" control={<Radio />} label="Rainfall (mm)" />
                      <FormControlLabel value="Sunshine(hours/day)" control={<Radio />} label="Sunshine (hours/day)" />
                      <FormControlLabel value="WindSpeed9am(km/h)" control={<Radio />} label="Windspeed 9am (km/h)" />
                      <FormControlLabel value="WindSpeed3pm(km/h)" control={<Radio />} label="Windspeed 3pm (km/h)" />
                      <FormControlLabel value="WindGustSpeed(km/h)" control={<Radio />} label="Wind Gust Speed (km/h)" />
                      <FormControlLabel value="Evaporation(mm/day)" control={<Radio />} label="Evaporation(mm/day)" />   
                    </RadioGroup>
                    </Box>
                </Paper>
            </Grid>

            {/* main graph section */}
            <Grid item xs={12} sm={6} sx={{width: "100%"}}>
              <Paper sx={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }} elevation={3}>
                <Box sx={{ width: "100%", textAlign: "center", marginBottom: "20px" }}>
                  <Typography variant="h6"
                    sx={{
                      position: 'relative',
                      textAlign: 'center',
                      fontWeight: 'bold'
                  }}
                  >{graphTitle}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
                  {chartType === "Line" ? (
                  <LineChart width={850} height={600} data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" 
                            label={{ 
                            value: "Date",
                            position: "bottom",
                            offset: 10
                          }}
                  />
                    <YAxis label={{ 
                          value: yAxisLabel,
                          angle: -90,
                          position: "insideLeft",
                        }}
                  />
                    <ChartTooltip />
                    <Legend position="relative" width="fit-content" justifyContent="center"/>
                    <Line type="monotone" dataKey="value" name={parameterNames(selectedParameter)} stroke="#8884d8" dot={false} />
                  </LineChart>
                  ) : chartType === "Bar" ? (
                    <BarChart width={850} height={600} data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" 
                            label={{ 
                            value: "Date",
                            position: "bottom",
                            offset: 10
                          }}/>
                    <YAxis label={{ 
                          value: yAxisLabel,
                          angle: -90,
                          position: "insideLeft",
                        }}
                  />
                    <ChartTooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" name={parameterNames(selectedParameter)}/>
                  </BarChart>
                ) : null}
                </Box>
              </Paper>
            </Grid> 

            {/* results and graph selection section */}
        <Grid item xs={12} sm={3}>
          <Paper sx={{ padding: "20px"}} elevation={3}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Results
            </Typography>

            {/* graph selection */}
            <Typography variant="h6" sx={{ marginTop: "20px", fontSize: "18px" }}>
              Graph Selection
            </Typography>
            <Grid container spacing={2} sx={{ marginTop: "10px" }}>
              {/* graph option 1 */}
              <Grid item>
                <Tooltip title="Line Graph">
                  <Button variant="outlined" onClick={() => setChartType("Line")}>
                    <img src={linegraph} alt="Graph 1" style={{ width: '100px', height: '100px' }} />
                  </Button>
                </Tooltip>
              </Grid>
              {/* graph option 2 */}
              <Grid item>
                <Tooltip title="Bar Chart">
                   <Button variant="outlined" onClick={() => setChartType("Bar")}>
                    <img src={barchart} alt="Graph 2" style={{ width: '100px', height: '100px' }} />
                  </Button>
                </Tooltip>
              </Grid>
            </Grid>

            {/* results table -- will be properly implemented when back end is ready */}
            <Typography variant="body1" sx={{ marginTop: "20px", fontWeight: "bold" }}>
              Summary
            </Typography>
            <TableContainer sx={{ marginTop: "0px" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Max</TableCell>
                    <TableCell>Average</TableCell>
                    <TableCell>Min</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{selectedParameter}</TableCell>
                    <TableCell>{maxValue}</TableCell>
                    <TableCell>{avgValue}</TableCell>
                    <TableCell>{minValue}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>  
        </Grid>      
        </div>    
          
    );
}
export default Weather
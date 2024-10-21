import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Grid,
  Paper,
  TextField,
  MenuItem,
  Box,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import uploadIcon from '../assets/uploadIcon.png'; // import images
import linegraph from '../assets/linegraph.png';
import boxplot from '../assets/boxplot.png';
import piechart from '../assets/piechart.png';
import Header from '../components/Header'

function Weather(){
    return(
        <div>
            <Header/>
            <Box
                sx={{
                textAlign: "left",
                marginBottom: "20px",
                paddingLeft: "20px",
                backgroundColor: "#f7be54",
                padding: "20px",
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: "bold", fontFamily: "Arial" }}>
                Historical Data
                </Typography>
                <Typography variant="subtitle1" sx={{ color: "#666" }}>
                Enter location to view previous observations enhanced by machine learning models
                </Typography>
            </Box>

            {/* main content section */}
            {/* data input section */}
            <Grid item xs={3}>
                <Paper sx={{ padding: "20px", height: "100%" }} elevation={3}>
                    <Grid container justifyContent="space-between" alignItems="center" sx={{ marginBottom: "20px" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Data Input
                    </Typography>

                    {/* upload button with icon */}
                    <Grid container justifyContent="flex-end" alignItems="center" sx={{ marginTop: 0 }}>
                        <img src={uploadIcon} alt="Upload Icon" style={{ width: '20px', height: '20px', marginRight: '10px', marginTop: '0px' }} />
                        <Button variant="contained" component="label">
                        Upload
                        <input type="file" hidden />
                        </Button>
                    </Grid>
                    </Grid>

                    {/* select weather station input */}
                    <TextField
                    label="Select Weather Station"
                    select
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    >
                    <MenuItem value="Melbourne">Melbourne</MenuItem>
                    {/* add more options later */}
                    </TextField>

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
                    />

                    {/* to date input */}
                    <TextField
                    label="To"
                    type="date"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    />

                    <Box marginY={2}>
                    <Typography sx={{ marginTop: "20px", fontWeight: "bold" }}>
                        Select parameters
                    </Typography>
                    <FormControlLabel control={<Checkbox />} label="Temperature (°C)" />
                    <FormControlLabel control={<Checkbox />} label="Cloud Coverage" />
                    <FormControlLabel control={<Checkbox />} label="Humidity" />
                    <FormControlLabel control={<Checkbox />} label="Rainfall (mm)" />
                    <FormControlLabel control={<Checkbox />} label="Windspeed" />
                    <FormControlLabel control={<Checkbox />} label="Weather type" />
                    </Box>
                    <TextField
                    label="Select element"
                    select
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    >
                    <MenuItem value="Rainfall">Rainfall (mm)</MenuItem>
                    {/* add more options later */}
                    </TextField>
                    <Button variant="contained" color="primary" fullWidth sx={{ marginTop: "20px" }}>
                    Execute
                    </Button>
                </Paper>
            </Grid>

            {/* main graph section */}
            <Grid item xs={6}>
            <Paper sx={{ height: "400px", marginBottom: "20px" }} elevation={3}>
                <Typography variant="h6">graph placeholder</Typography>
            </Paper>
            </Grid> 

            {/* results and graph selection section */}
        <Grid item xs={3}>
          <Paper sx={{ padding: "20px" }} elevation={3}>
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
                  <Button variant="outlined">
                    <img src={linegraph} alt="Graph 1" style={{ width: '100px', height: '100px' }} />
                  </Button>
                </Tooltip>
              </Grid>
              {/* graph option 2 */}
              <Grid item>
                <Tooltip title="Box Plot">
                   <Button variant="outlined">
                    <img src={boxplot} alt="Graph 2" style={{ width: '100px', height: '100px' }} />
                  </Button>
                </Tooltip>
              </Grid>
              {/* graph option 3 */}
              <Grid item>
                <Tooltip title="Pie Chart">
                  <Button variant="outlined">
                    <img src={piechart} alt="Graph 3" style={{ width: '100px', height: '100px' }} />
                  </Button>
                </Tooltip>
              </Grid>
              {/* graph option 4 */}
              <Grid item>
                <Tooltip title="Pie Chart">
                  <Button variant="outlined">
                    <img src={linegraph} alt="Graph 4" style={{ width: '100px', height: '100px' }} />
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
                    <TableCell>Temperature (°C)</TableCell>
                    <TableCell>--</TableCell>
                    <TableCell>--</TableCell>
                    <TableCell>--</TableCell>
                  </TableRow>
                </TableBody>
                <TableBody>
                  <TableRow>
                    <TableCell>Precipitation (mm)</TableCell>
                    <TableCell>--</TableCell>
                    <TableCell>--</TableCell>
                    <TableCell>--</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>        
        </div>    
          
    );
}
export default Weather
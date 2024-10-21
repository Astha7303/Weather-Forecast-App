import React, { useEffect, useState } from 'react';
import {
  Paper, InputBase, IconButton, Card, CardContent,
  Typography, CircularProgress,
  Grid2,
  ThemeProvider,
  createTheme,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import GrainIcon from '@mui/icons-material/Grain';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import axios from 'axios';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import './WeatherInfoPage.css'; 

const WeatherInfoPage = () => {
  const [mode, setMode] = useState('light');
  const [cityName, setCityName] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [weatherData, setWeatherData] = useState(null);
  const [fiveDayWeather, setFiveDayWeather] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

//on input of search bar find location using lan and lat
  const handleChange = async (event) => {
    const value = event.target.value;
    setCityName(value);
    if (value) {
      try {
        const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=91c88bc7a7f2ad2ccb9939857104f543`);
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error in getting city suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }

    if (value === '') {
      setWeatherData(null);
      setFiveDayWeather([]);
      setLatitude(0);
      setLongitude(0);
    }
  };
  //click on suggestion-go to searchclick function
  const handleSuggestionClick = (suggestion) => {
    setCityName(suggestion.name);
    searchCityLatLong()
    setSuggestions([]);
  };
  const searchCityLatLong = async () => {
    if (!cityName) return;
    setLoading(true);
    try {
      // getapi to search lat and long for city
      const res = await axios.get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=91c88bc7a7f2ad2ccb9939857104f543`
      );
      if (res.data.length > 0) {
        const { lat, lon } = res.data[0];
        setLatitude(lat);
        setLongitude(lon);
        await getWeather(lat, lon);
        await getFiveDayForecast(lat, lon);
      } else {
        console.log("City not found");
      }
    } catch (error) {
      console.error("Error finding city:", error);
    }
    setLoading(false);
  };

  const getWeather = async (lat, lon) => {
    try {
      // getapi for searching weather data onclick of search icon 
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=91c88bc7a7f2ad2ccb9939857104f543`
      );
      setWeatherData(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const getFiveDayForecast = async (lat, lon) => {
    try {
      //get api for 5 day forecasting
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=91c88bc7a7f2ad2ccb9939857104f543`
      );
      const forecastData = res.data.list;
      const dailyForecast = forecastData.filter(forecast =>
        forecast.dt_txt.includes("12:00:00")
      ).slice(0, 5);
      setFiveDayWeather(dailyForecast);
    } catch (error) {
      console.error("Error fetching 5-day forecast:", error);
    }
  };

  // For light-dark theme change
  const handletheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  }
  const themee = createTheme({
    palette: {
      mode,
    },
  })

  // Condition for icon according to weather
  const renderWeatherIcon = (main) => {
    switch (main) {
      case 'Clear':
        return <WbSunnyIcon style={{ color: '#fbc02d' }} />;
      case 'Clouds':
        return <CloudIcon style={{ color: '#90a4ae' }} />;
      case 'Rain':
        return <GrainIcon style={{ color: '#1565c0' }} />;
      case 'Snow':
        return <AcUnitIcon style={{ color: '#90caf9' }} />;
      default:
        return <CloudIcon />;
    }
  };
//to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    getCurrentLocation()
  }, [])

  //to get current location by using geolocation
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setLatitude(lat);
          setLongitude(lon);
           getWeather(lat, lon);
           getFiveDayForecast(lat, lon);
          setCityName('');
          setLoading(false);
        },
        (error) => {
          console.error("Error in current location:", error);
          setLoading(false);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <ThemeProvider theme={themee}>
      <div className="weather-container">
        <Typography variant="h4" gutterBottom>
          Weather Information
        </Typography>
        <Button sx={{
          bgcolor: 'background.default',
          color: 'text.primary',
        }} onClick={handletheme} color="inherit">
          Change Theme
          {themee.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </Button><br /><br />
        <Button onClick={getCurrentLocation} sx={{
          bgcolor: 'background.default',
          color: 'text.primary',
        }}>
          current location
        </Button>
        <Paper
          component="form"
          className="search-bar"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search City Name"
            inputProps={{ 'aria-label': 'search city' }}
            onChange={handleChange}
            value={cityName}
          />
          <IconButton
            type="button"
            sx={{ p: '10px' }}
            aria-label="search"
            onClick={searchCityLatLong}
          >
            <SearchIcon />
          </IconButton>
        </Paper>
        <Card>
          {suggestions.length > 0 && (
            <CardContent >
              {suggestions.map((suggestion) => (
                <Typography className='cursor-pointer' key={suggestion.name} onClick={() => handleSuggestionClick(suggestion)}>
                  {suggestion.name}, {suggestion.country}
                </Typography>
              ))}
            </CardContent>
          )}
        </Card>
        {/* Graph  */}
        {/* <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={500}
          height={400}
          data={fiveDayWeather.map((x)=>{return x.main.temp})}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer> */}
        <br /><br />
        {/* Loader for data loading */}
        {loading ? (
          <CircularProgress className="loading-spinner" />
        ) : (
          <>
          {/* Onclick of search icon get data  */}
            {weatherData ? (
              <Card className="weather-card">
                <CardContent>
                  <Typography className='alignall'>
                    <LocationCityIcon /> City Name: {weatherData.name}
                  </Typography>
                  <Typography className='alignall'>
                    {renderWeatherIcon(weatherData.weather[0].main)} Weather: {weatherData.weather[0].main} - {weatherData.weather[0].description}
                  </Typography>
                  <Typography className='alignall'>
                    <DeviceThermostatIcon />Temperature: {Math.floor(weatherData.main.temp - 273.15)} °C
                  </Typography>
                  <Typography className='alignall'>
                    <DeviceThermostatIcon />Real feel like: {Math.floor(weatherData.main.feels_like - 273.15)} °C
                  </Typography>
                  <Typography className='alignall'>
                    <WaterDropIcon /> Humidity: {weatherData.main.humidity}%
                  </Typography>
                  <Typography className='alignall'>
                    <GrainIcon /> Wind Speed: {weatherData.wind.speed} m/s
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Typography className='alignall no-data-message'>
                No weather data available.
              </Typography>
            )}
          </>
        )}
        {/* Five day forecast data */}
        <div className="forecast-section">
          <Typography >
            Five-Day Forecast
          </Typography>
          <Grid2 container spacing={2}>
            {fiveDayWeather.length > 0 ? (
              fiveDayWeather.map((forecast, index) => (
                  <Card className="forecast-card" xs={12} sm={6} md={4} key={index}>
                    <CardContent>
                      <Typography className='alignall'>
                        <CalendarMonthIcon />Date: {formatDate(forecast.dt_txt)}</Typography>
                      <Typography className='alignall'>
                        {renderWeatherIcon(forecast.weather[0].main)} Weather: {forecast.weather[0].main} - {forecast.weather[0].description}
                      </Typography>
                      <Typography className='alignall'>
                        <DeviceThermostatIcon /> Temperature: {Math.floor(forecast.main.temp - 273.15)} °C
                      </Typography>
                      <Typography className='alignall'>
                        <WaterDropIcon /> Humidity: {forecast.main.humidity}%
                      </Typography>
                      <Typography className='alignall'>
                        <GrainIcon /> Wind Speed: {forecast.wind.speed} m/s
                      </Typography>
                    </CardContent>
                  </Card>
              ))
            ) : (
              <></>
            )}
          </Grid2>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default WeatherInfoPage;

import { Button, Card, CardContent, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import './home.css'
const Homepage = () => {
  //to apply routing
  const navigate = useNavigate();

  return (
    <Card className='card'>
      <CardContent className='template'>
        <Typography > Welcome to Weather Forecast App !!</Typography>
        <Button onClick={() => navigate('/weatherinfopage')}>Tap here to know your weather</Button>
      </CardContent>
    </Card>
  )
}

export default Homepage

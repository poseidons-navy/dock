import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const card = (
  <React.Fragment>
    <CardContent>
      <Typography sx={{ fontSize: 14 }} color="black" className='font-semibold' gutterBottom>
        Javascript club
      </Typography>
      
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
      Explain Like I'm Five is the best forum and archive on the internet for
        layperson-friendly explanations. Don't Panic!
      </Typography>
      <Typography variant="body2">
        Created Jul 28, 2011
       
      </Typography>
    </CardContent>
    <CardActions className='flex justify-center items-center'>
      <Button  className=''>Create Proposal</Button>
    </CardActions>
  </React.Fragment>
);

export default function OutlinedCard() {
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">{card}</Card>
    </Box>
  );
}

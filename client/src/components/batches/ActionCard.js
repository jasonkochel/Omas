import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const ActionCard = ({ caption, buttonText, onClick }) => (
  <Card>
    <CardContent>
      <Typography variant="body1" component="p">
        {caption}
      </Typography>
    </CardContent>
    <CardActions>
      <Button variant="contained" color="primary" fullWidth onClick={onClick}>
        {buttonText}
      </Button>
    </CardActions>
  </Card>
);

export default ActionCard;

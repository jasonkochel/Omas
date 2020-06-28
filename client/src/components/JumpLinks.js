import { Chip, Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';

const useStyles = makeStyles(theme => ({
  chipLink: {
    textDecoration: 'none',
  },
  chip: {
    marginBottom: '10px',
    marginRight: '10px',
  },
  flexShrink: {
    flexGrow: 0,
  },
  noWrap: {
    whiteSpace: 'nowrap',
  },
}));

const scrollWithOffset = el => {
  const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
  const yOffset = -75;
  window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' });
};

const JumpLinks = ({ catalog }) => {
  const classes = useStyles();

  if (catalog === null) return;

  return (
    <Grid container spacing={3}>
      <Grid item xs className={classes.flexShrink}>
        <Typography variant="h6" className={classes.noWrap}>
          Jump To:
        </Typography>
      </Grid>
      <Grid item xs>
        {catalog.map(cat => (
          <Link
            key={cat.categoryId}
            to={`order#cat-${cat.categoryId}`}
            scroll={scrollWithOffset}
            className={classes.chipLink}
          >
            <Chip label={cat.name} clickable color="primary" className={classes.chip} />
          </Link>
        ))}
      </Grid>
    </Grid>
  );
};

export default JumpLinks;

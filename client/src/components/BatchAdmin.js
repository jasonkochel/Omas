import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import api from '../api/api';
import BatchActions from './BatchActions';
import BatchHistory from './BatchHistory';

const BatchAdmin = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState(null);

  useEffect(() => {
    api
      .getBatches()
      // 10 most recent, by date
      .then(data => data.sort((a, b) => (a.deliveryDate < b.deliveryDate ? 1 : -1)).slice(0, 10))
      .then(data => {
        setTableData(data);
        setSelectedBatch(data[0]);
      })
      .catch(() => setTableData([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={3}>
        <BatchHistory
          loading={loading}
          data={tableData}
          selectedId={selectedBatch?.batchId}
          onSelect={setSelectedBatch}
        />
      </Grid>
      <Grid item xs={8}>
        {selectedBatch && (
          <Grid container spacing={3}>
            <BatchActions
              batch={selectedBatch}
              isLatest={selectedBatch.batchId === tableData[0].batchId}
            />
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default BatchAdmin;

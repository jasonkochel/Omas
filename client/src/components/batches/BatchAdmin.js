import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import api from '../../api';
import BatchActions from './BatchActions';
import BatchHistory from './BatchHistory';

const BatchAdmin = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatchId, setSelectedBatchId] = useState(null);

  useEffect(() => {
    api
      .getBatches()
      // 10 most recent, by date
      .then(data => data.sort((a, b) => (a.deliveryDate < b.deliveryDate ? 1 : -1)).slice(0, 10))
      .then(data => {
        setTableData(data);
        setSelectedBatchId(data[0].batchId);
      })
      .catch(() => setTableData([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={4}>
        <BatchHistory
          loading={loading}
          data={tableData}
          selectedId={selectedBatchId}
          onSelect={setSelectedBatchId}
        />
      </Grid>
      <Grid item xs={8}>
        {selectedBatchId && (
          <Grid container spacing={3}>
            <BatchActions
              batchId={selectedBatchId}
              isLatest={selectedBatchId === tableData[0].batchId}
            />
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default BatchAdmin;

import { Grid } from '@material-ui/core';
import { useConfirm } from 'material-ui-confirm';
import React, { useState } from 'react';
import { queryCache, useQuery } from 'react-query';
import { toast } from 'react-toastify';
import api from '../../api';
import fns from '../../fns';
import BatchActions from './BatchActions';
import BatchHistory from './BatchHistory';
import EditBatchDatesModal from './EditBatchDatesModal';

const BatchAdmin = () => {
  const [selectedBatchId, setSelectedBatchId] = useState();
  const [editingDates, setEditingDates] = useState(false);

  const confirm = useConfirm();

  const getBatches = async () => {
    const data = await api.getBatches();
    return fns.sortArray(data, 'deliveryDate', fns.sortDir.DESC).slice(0, 10);
  };

  const { isLoading, data: batchHistory } = useQuery('BatchHistory', getBatches);

  const { data: selectedBatch } = useQuery(['BatchHistory', selectedBatchId], api.getBatch, {
    enabled: selectedBatchId,
  });

  const handleCloseOrdering = () =>
    confirm({ description: 'Are you sure you want to close ordering?' }).then(async () => {
      await api.updateBatch({ ...selectedBatch, isOpen: false });
      queryCache.invalidateQueries('BatchHistory');
    });

  const handleOpenOrdering = () =>
    confirm({ description: 'Are you sure you want to re-open ordering?' }).then(async () => {
      await api.updateBatch({ ...selectedBatch, isOpen: true });
      queryCache.invalidateQueries('BatchHistory');
    });

  const handleStartEditingDates = () => setEditingDates(true);

  const handleEditDates = async data => {
    setEditingDates(false);
    await api.updateBatch(data);
    queryCache.invalidateQueries('BatchHistory');
  };

  const handleEmailBatch = async () => {
    await api.emailBatch(selectedBatchId);
    toast.info('Emails Sent');
  };

  if (selectedBatchId == null && batchHistory?.length > 0) {
    setSelectedBatchId(batchHistory[0].batchId);
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <BatchHistory
            loading={isLoading}
            data={batchHistory}
            selectedId={selectedBatchId}
            onSelect={setSelectedBatchId}
          />
        </Grid>
        <Grid item xs={8}>
          {selectedBatch && (
            <Grid container spacing={3}>
              <BatchActions
                batch={selectedBatch}
                isLatest={selectedBatchId === batchHistory[0].batchId}
                onCloseOrdering={handleCloseOrdering}
                onOpenOrdering={handleOpenOrdering}
                onStartEditingDates={handleStartEditingDates}
                onEmailBatch={handleEmailBatch}
              />
            </Grid>
          )}
        </Grid>
      </Grid>
      {selectedBatch && (
        <EditBatchDatesModal
          key={selectedBatchId}
          open={editingDates}
          data={selectedBatch}
          onSave={handleEditDates}
          onCancel={() => setEditingDates(false)}
        />
      )}
    </>
  );
};

export default BatchAdmin;

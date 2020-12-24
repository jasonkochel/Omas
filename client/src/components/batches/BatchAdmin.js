import { Grid, makeStyles } from '@material-ui/core';
import { useConfirm } from 'material-ui-confirm';
import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import api from '../../api';
import fns from '../../fns';
import ActionCard from './ActionCard';
import BatchActions from './BatchActions';
import BatchHistory from './BatchHistory';
import EditBatchDatesModal from './EditBatchDatesModal';

const useStyles = makeStyles(theme => ({
  paddedCard: {
    marginBottom: '15px',
  },
}));

const BatchAdmin = () => {
  const classes = useStyles();
  const queryClient = useQueryClient();

  const [selectedBatchId, setSelectedBatchId] = useState();
  const [editingDates, setEditingDates] = useState(false);
  const [editDatesData, setEditDatesData] = useState({});

  const confirm = useConfirm();

  const getBatches = async () => {
    const data = await api.getBatches();
    return fns.sortArray(data, 'deliveryDate', fns.sortDir.DESC).slice(0, 10);
  };

  const { data: settings } = useQuery('Settings', api.getSettings);

  const { isLoading, data: batchHistory } = useQuery('BatchHistory', getBatches);

  const { data: selectedBatch } = useQuery(
    ['BatchHistory', selectedBatchId],
    () => api.getBatch(selectedBatchId),
    {
      enabled: !!selectedBatchId,
    }
  );

  const handleCloseOrdering = () =>
    confirm({ description: 'Are you sure you want to close ordering?' }).then(async () => {
      await api.updateBatch({ ...selectedBatch, isOpen: false });
      queryClient.invalidateQueries('BatchHistory');
    });

  const handleOpenOrdering = () =>
    confirm({ description: 'Are you sure you want to re-open ordering?' }).then(async () => {
      await api.updateBatch({ ...selectedBatch, isOpen: true });
      queryClient.invalidateQueries('BatchHistory');
    });

  const handleCreateNewBatch = () =>
    confirm({ description: 'Are you sure you want to create a new ordering cycle?' }).then(
      async () => {
        setEditDatesData({
          batchId: 0,
          orderDate: null,
          deliveryDate: null,
          isOpen: true,
          taxRate: settings.taxRate,
          shippingRate: settings.shippingRate,
        });
        setEditingDates(true);
      }
    );

  const handleStartEditingDates = () => {
    setEditDatesData({ ...selectedBatch });
    setEditingDates(true);
  };

  const handleEditDates = async data => {
    setEditingDates(false);
    if (data.batchId === 0) {
      await api.createBatch(data);
    } else {
      await api.updateBatch(data);
    }
    queryClient.invalidateQueries('BatchHistory');
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
          {Array.isArray(batchHistory) && batchHistory[0].isOpen ? null : (
            <ActionCard
              className={classes.paddedCard}
              buttonText="Create New Ordering Cycle"
              caption="Click below to set up the next ordering cycle.  Only one ordering cycle can be open at a time.  If you closed the prior ordering cycle prematurely, use the 'Re-Open Ordering' button to the right."
              onClick={handleCreateNewBatch}
            />
          )}
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
          data={editDatesData}
          onSave={handleEditDates}
          onCancel={() => setEditingDates(false)}
        />
      )}
    </>
  );
};

export default BatchAdmin;

export const chartQueries = {
  getCrops: 'SELECT crop_id FROM crops',
  getAllTransactionsData:
    'SELECT transaction_id, crop_id, price, created_at FROM transactions WHERE crop_id = $1 ORDER BY transaction_id ASC',
  getAllTransactionUpperTime:
    'SELECT transaction_id, crop_id, price, created_at FROM transactions WHERE crop_id = $1 AND created_at >= $2 ORDER BY transaction_id ASC'
};

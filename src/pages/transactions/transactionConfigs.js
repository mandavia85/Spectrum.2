import * as ds from '../../services/dataService';

export const transactionConfigs = {
  'payment-received': {
    title: 'Payment Received', service: ds.paymentsReceivedService, entityLabel: 'Payment',
    fields: [
      { key: 'date', label: 'Date', type: 'date', required: true },
      { key: 'customerId', label: 'Customer BP Code', required: true },
      { key: 'invoiceRef', label: 'Invoice Reference' },
      { key: 'amount', label: 'Amount', type: 'number', default: 0 },
      { key: 'bank', label: 'Bank Account' },
      { key: 'method', label: 'Method', type: 'select', options: ['ACH', 'Wire Transfer', 'Cheque', 'Cash'], default: 'ACH' },
      { key: 'status', label: 'Status', type: 'select', options: ['Completed', 'Pending'], default: 'Completed' },
    ],
  },
  'payment-made': {
    title: 'Payment Made', service: ds.paymentsMadeService, entityLabel: 'Payment',
    fields: [
      { key: 'date', label: 'Date', type: 'date', required: true },
      { key: 'vendorId', label: 'Vendor BP Code', required: true },
      { key: 'invoiceRef', label: 'Invoice Reference' },
      { key: 'amount', label: 'Amount', type: 'number', default: 0 },
      { key: 'bank', label: 'Bank Account' },
      { key: 'method', label: 'Method', type: 'select', options: ['Wire Transfer', 'Cheque', 'Cash'], default: 'Wire Transfer' },
      { key: 'status', label: 'Status', type: 'select', options: ['Completed', 'Pending'], default: 'Completed' },
    ],
  },
  'bank': {
    title: 'Bank Transactions', service: ds.bankTransactionService, entityLabel: 'Bank Transaction',
    fields: [
      { key: 'date', label: 'Date', type: 'date', required: true },
      { key: 'bank', label: 'Bank Account', required: true },
      { key: 'type', label: 'Type', type: 'select', options: ['Deposit', 'Withdrawal', 'Transfer', 'Payment', 'Receipt'], default: 'Deposit' },
      { key: 'reference', label: 'Reference' },
      { key: 'amount', label: 'Amount', type: 'number', default: 0 },
      { key: 'status', label: 'Status', type: 'select', options: ['Reconciled', 'Unreconciled'], default: 'Unreconciled' },
    ],
  },
  'expense': {
    title: 'Expense Transactions', service: ds.expenseTransactionService, entityLabel: 'Expense',
    fields: [
      { key: 'date', label: 'Date', type: 'date', required: true },
      { key: 'payee', label: 'Employee / Vendor', required: true },
      { key: 'category', label: 'Expense Category' },
      { key: 'amount', label: 'Amount', type: 'number', default: 0 },
      { key: 'tax', label: 'Tax %', type: 'number', default: 15 },
      { key: 'costCenter', label: 'Cost Center' },
      { key: 'description', label: 'Description' },
      { key: 'approvalStatus', label: 'Approval Status', type: 'select', options: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
      { key: 'paymentStatus', label: 'Payment Status', type: 'select', options: ['Unpaid', 'Paid'], default: 'Unpaid' },
    ],
    columns: [
      { key: 'date', label: 'Date' }, { key: 'payee', label: 'Payee' }, { key: 'category', label: 'Category' },
      { key: 'amount', label: 'Amount', render: (r) => `$${r.amount}` }, { key: 'approvalStatus', label: 'Approval' }, { key: 'paymentStatus', label: 'Payment' },
    ],
  },
  'journal-entry': {
    title: 'Journal Entries', service: ds.journalEntryService, entityLabel: 'Journal Entry',
    fields: [
      { key: 'date', label: 'Date', type: 'date', required: true },
      { key: 'reference', label: 'Reference' },
      { key: 'debitAccount', label: 'Debit Account', required: true },
      { key: 'creditAccount', label: 'Credit Account', required: true },
      { key: 'amount', label: 'Amount', type: 'number', default: 0 },
      { key: 'description', label: 'Description' },
      { key: 'status', label: 'Status', type: 'select', options: ['Draft', 'Posted'], default: 'Draft' },
    ],
  },
  'stock-transfer': {
    title: 'Stock Transfer', service: ds.stockTransferService, entityLabel: 'Stock Transfer',
    fields: [
      { key: 'date', label: 'Date', type: 'date', required: true },
      { key: 'item', label: 'Item Code', required: true },
      { key: 'fromWarehouse', label: 'From Warehouse' },
      { key: 'toWarehouse', label: 'To Warehouse' },
      { key: 'qty', label: 'Quantity', type: 'number', default: 0 },
      { key: 'status', label: 'Status', type: 'select', options: ['Pending', 'Completed'], default: 'Pending' },
    ],
  },
};

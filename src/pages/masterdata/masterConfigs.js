import * as ds from '../../services/dataService';

// Each config drives a fully functional CRUD screen via <GenericMaster config={...} />.
// fields: used both for the add/edit form and, unless column.render is given, for the table.

export const masterConfigs = {
  'material-groups': {
    title: 'Material Groups', service: ds.materialGroupService, entityLabel: 'Material Group',
    fields: [
      { key: 'code', label: 'Group Code', required: true },
      { key: 'name', label: 'Group Name', required: true },
      { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], default: 'Active' },
    ],
  },
  'expense-master': {
    title: 'Expense Master', service: ds.expenseMasterService, entityLabel: 'Expense Type',
    fields: [
      { key: 'code', label: 'Expense Code', required: true },
      { key: 'name', label: 'Expense Name', required: true },
      { key: 'category', label: 'Category', type: 'select', options: ['Operating', 'Administrative', 'Capital'], default: 'Operating' },
      { key: 'glAccount', label: 'GL Account' },
      { key: 'tax', label: 'Tax Code' },
      { key: 'costCenter', label: 'Cost Center' },
      { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], default: 'Active' },
    ],
  },
  'bank-master': {
    title: 'Bank Master', service: ds.bankMasterService, entityLabel: 'Bank Account',
    fields: [
      { key: 'code', label: 'Bank Code', required: true },
      { key: 'name', label: 'Bank Name', required: true },
      { key: 'branch', label: 'Branch' },
      { key: 'accountNumber', label: 'Account Number' },
      { key: 'iban', label: 'IBAN' },
      { key: 'currency', label: 'Currency', type: 'select', options: ['USD', 'EUR', 'GBP', 'SGD'], default: 'USD' },
      { key: 'openingBalance', label: 'Opening Balance', type: 'number', default: 0 },
      { key: 'currentBalance', label: 'Current Balance', type: 'number', default: 0 },
      { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], default: 'Active' },
    ],
  },
  'asset-class': {
    title: 'Asset Class', service: ds.assetClassService, entityLabel: 'Asset Class',
    fields: [
      { key: 'code', label: 'Class Code', required: true },
      { key: 'name', label: 'Class Name', required: true },
      { key: 'depreciationMethod', label: 'Depreciation Method', type: 'select', options: ['Straight Line', 'Reducing Balance'], default: 'Straight Line' },
      { key: 'defaultRate', label: 'Default Rate (%)', type: 'number', default: 10 },
      { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], default: 'Active' },
    ],
  },
  'tax-master': {
    title: 'Tax Master', service: ds.taxMasterService, entityLabel: 'Tax Code',
    fields: [
      { key: 'code', label: 'Tax Code', required: true },
      { key: 'name', label: 'Tax Name', required: true },
      { key: 'rate', label: 'Rate (%)', type: 'number', default: 0 },
      { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], default: 'Active' },
    ],
  },
  'cost-center': {
    title: 'Cost Center', service: ds.costCenterService, entityLabel: 'Cost Center',
    fields: [
      { key: 'code', label: 'Cost Center Code', required: true },
      { key: 'name', label: 'Cost Center Name', required: true },
      { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], default: 'Active' },
    ],
  },
  'profit-center': {
    title: 'Profit Center', service: ds.profitCenterService, entityLabel: 'Profit Center',
    fields: [
      { key: 'code', label: 'Profit Center Code', required: true },
      { key: 'name', label: 'Profit Center Name', required: true },
      { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], default: 'Active' },
    ],
  },
  'warehouse': {
    title: 'Warehouse', service: ds.warehouseService, entityLabel: 'Warehouse',
    fields: [
      { key: 'code', label: 'Warehouse Code', required: true },
      { key: 'name', label: 'Warehouse Name', required: true },
      { key: 'address', label: 'Address' },
      { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], default: 'Active' },
    ],
  },
  'bin-location': {
    title: 'Bin Location', service: ds.binLocationService, entityLabel: 'Bin Location',
    fields: [
      { key: 'code', label: 'Bin Code', required: true },
      { key: 'name', label: 'Description', required: true },
      { key: 'warehouse', label: 'Warehouse' },
      { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], default: 'Active' },
    ],
  },
  'uom': {
    title: 'Unit of Measure', service: ds.uomService, entityLabel: 'UOM',
    fields: [
      { key: 'code', label: 'UOM Code', required: true },
      { key: 'name', label: 'UOM Name', required: true },
      { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], default: 'Active' },
    ],
  },
  'uom-conversion': {
    title: 'UOM Conversion', service: ds.uomConversionService, entityLabel: 'Conversion Rule',
    fields: [
      { key: 'fromUom', label: 'From UOM', required: true },
      { key: 'toUom', label: 'To UOM', required: true },
      { key: 'factor', label: 'Conversion Factor', type: 'number', default: 1 },
      { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], default: 'Active' },
    ],
    columns: [
      { key: 'fromUom', label: 'From' }, { key: 'toUom', label: 'To' }, { key: 'factor', label: 'Factor' }, { key: 'status', label: 'Status' },
    ],
  },
  'currency': {
    title: 'Currency', service: ds.currencyService, entityLabel: 'Currency',
    fields: [
      { key: 'code', label: 'Currency Code', required: true },
      { key: 'name', label: 'Currency Name', required: true },
      { key: 'symbol', label: 'Symbol' },
      { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], default: 'Active' },
    ],
  },
  'exchange-rate': {
    title: 'Exchange Rate', service: ds.exchangeRateService, entityLabel: 'Exchange Rate',
    fields: [
      { key: 'currency', label: 'Currency', required: true },
      { key: 'rate', label: 'Rate (vs USD)', type: 'number', default: 1 },
      { key: 'date', label: 'Effective Date', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], default: 'Active' },
    ],
    columns: [
      { key: 'currency', label: 'Currency' }, { key: 'rate', label: 'Rate' }, { key: 'date', label: 'Effective Date' }, { key: 'status', label: 'Status' },
    ],
  },
  'payment-terms': {
    title: 'Payment Terms', service: ds.paymentTermsService, entityLabel: 'Payment Term',
    fields: [
      { key: 'code', label: 'Term Code', required: true },
      { key: 'name', label: 'Term Name', required: true },
      { key: 'days', label: 'Days', type: 'number', default: 30 },
      { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], default: 'Active' },
    ],
  },
  'chart-of-accounts': {
    title: 'Chart of Accounts', service: ds.chartOfAccountsService, entityLabel: 'GL Account',
    fields: [
      { key: 'code', label: 'Account Code', required: true },
      { key: 'name', label: 'Account Name', required: true },
      { key: 'type', label: 'Account Type', type: 'select', options: ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'], default: 'Asset' },
      { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], default: 'Active' },
    ],
  },
};

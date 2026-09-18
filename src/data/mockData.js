// Seed data for ERP prototype. Structured to mirror future SQL tables.

export const seedMaterialGroups = [
  { id: 'MG001', code: 'MG001', name: 'Raw Materials', status: 'Active' },
  { id: 'MG002', code: 'MG002', name: 'Finished Goods', status: 'Active' },
  { id: 'MG003', code: 'MG003', name: 'Packaging', status: 'Active' },
  { id: 'MG004', code: 'MG004', name: 'Spare Parts', status: 'Active' },
  { id: 'MG005', code: 'MG005', name: 'Consumables', status: 'Inactive' },
];

export const seedMaterials = [
  { id: 'MAT001', code: 'MAT-1001', name: 'Steel Rod 12mm', description: 'Cold-rolled steel rod, 12mm diameter', group: 'Raw Materials', type: 'Raw Material', uom: 'KG', purchasePrice: 145, salesPrice: 189, tax: 15, warehouse: 'WH-Main', minStock: 500, maxStock: 5000, reorderLevel: 800, batchManaged: true, serialManaged: false, expiryManaged: false, status: 'Active', stockOnHand: 3200, committedStock: 400 },
  { id: 'MAT002', code: 'MAT-1002', name: 'Aluminum Sheet 2mm', description: 'Anodized aluminum sheet', group: 'Raw Materials', type: 'Raw Material', uom: 'SHEET', purchasePrice: 320, salesPrice: 410, tax: 15, warehouse: 'WH-Main', minStock: 100, maxStock: 1000, reorderLevel: 200, batchManaged: true, serialManaged: false, expiryManaged: false, status: 'Active', stockOnHand: 145, committedStock: 60 },
  { id: 'MAT003', code: 'MAT-2001', name: 'Industrial Motor 5HP', description: '5HP three-phase induction motor', group: 'Finished Goods', type: 'Finished Good', uom: 'PCS', purchasePrice: 2400, salesPrice: 3200, tax: 15, warehouse: 'WH-FG', minStock: 10, maxStock: 100, reorderLevel: 20, batchManaged: false, serialManaged: true, expiryManaged: false, status: 'Active', stockOnHand: 34, committedStock: 8 },
  { id: 'MAT004', code: 'MAT-3001', name: 'Corrugated Box L', description: 'Large corrugated shipping box', group: 'Packaging', type: 'Packaging', uom: 'PCS', purchasePrice: 8, salesPrice: 12, tax: 15, warehouse: 'WH-Pack', minStock: 2000, maxStock: 20000, reorderLevel: 3000, batchManaged: false, serialManaged: false, expiryManaged: false, status: 'Active', stockOnHand: 1450, committedStock: 200 },
  { id: 'MAT005', code: 'MAT-4001', name: 'Bearing Assembly 608ZZ', description: 'Sealed ball bearing', group: 'Spare Parts', type: 'Spare Part', uom: 'PCS', purchasePrice: 4.5, salesPrice: 7, tax: 15, warehouse: 'WH-Main', minStock: 500, maxStock: 5000, reorderLevel: 1000, batchManaged: true, serialManaged: false, expiryManaged: false, status: 'Active', stockOnHand: 890, committedStock: 100 },
  { id: 'MAT006', code: 'MAT-5001', name: 'Industrial Lubricant 5L', description: 'High-temp lubricant', group: 'Consumables', type: 'Consumable', uom: 'CAN', purchasePrice: 35, salesPrice: 52, tax: 15, warehouse: 'WH-Main', minStock: 50, maxStock: 500, reorderLevel: 100, batchManaged: true, serialManaged: false, expiryManaged: true, status: 'Active', stockOnHand: 62, committedStock: 10 },
  { id: 'MAT007', code: 'MAT-2002', name: 'Control Panel Assembly', description: 'PLC-based control panel', group: 'Finished Goods', type: 'Finished Good', uom: 'PCS', purchasePrice: 5200, salesPrice: 6900, tax: 15, warehouse: 'WH-FG', minStock: 5, maxStock: 50, reorderLevel: 10, batchManaged: false, serialManaged: true, expiryManaged: false, status: 'Active', stockOnHand: 12, committedStock: 4 },
  { id: 'MAT008', code: 'MAT-1003', name: 'Copper Wire 2.5mm', description: 'Insulated copper wire, coil of 100m', group: 'Raw Materials', type: 'Raw Material', uom: 'COIL', purchasePrice: 68, salesPrice: 89, tax: 15, warehouse: 'WH-Main', minStock: 200, maxStock: 2000, reorderLevel: 400, batchManaged: true, serialManaged: false, expiryManaged: false, status: 'Inactive', stockOnHand: 15, committedStock: 0 },
];

export const seedBusinessPartners = [
  { id: 'BP001', code: 'C-1001', name: 'Meridian Manufacturing LLC', type: 'Customer', contactPerson: 'Sarah Chen', phone: '+1 415 555 0142', email: 'sarah.chen@meridianmfg.com', address: '4820 Industrial Pkwy, Fremont, CA', taxNumber: 'US-84-1029384', paymentTerms: 'Net 30', creditLimit: 250000, currency: 'USD', bankInfo: 'Wells Fargo - 4482910', status: 'Active', outstandingBalance: 48250, totalSales: 612000 },
  { id: 'BP002', code: 'C-1002', name: 'Northgate Retail Group', type: 'Customer', contactPerson: 'James Whitfield', phone: '+1 312 555 0198', email: 'j.whitfield@northgateretail.com', address: '110 Lakeshore Dr, Chicago, IL', taxNumber: 'US-36-5567234', paymentTerms: 'Net 15', creditLimit: 120000, currency: 'USD', bankInfo: 'Chase - 9982104', status: 'Active', outstandingBalance: 18900, totalSales: 289500 },
  { id: 'BP003', code: 'C-1003', name: 'Pacific Rim Electronics', type: 'Customer', contactPerson: 'Mei Lin', phone: '+65 6555 0122', email: 'mei.lin@pacificrim.sg', address: '88 Marina Blvd, Singapore', taxNumber: 'SG-201900123K', paymentTerms: 'Net 45', creditLimit: 400000, currency: 'USD', bankInfo: 'DBS - 0011223344', status: 'Active', outstandingBalance: 92300, totalSales: 1204000 },
  { id: 'BP004', code: 'S-2001', name: 'Alloy Source Industrial', type: 'Supplier', contactPerson: 'Robert Dunn', phone: '+1 216 555 0177', email: 'rdunn@alloysource.com', address: '2200 Foundry Rd, Cleveland, OH', taxNumber: 'US-34-9982341', paymentTerms: 'Net 30', creditLimit: 0, currency: 'USD', bankInfo: 'PNC - 7723190', status: 'Active', outstandingBalance: 34200, totalPurchases: 458200 },
  { id: 'BP005', code: 'S-2002', name: 'Shenzhen Component Works', type: 'Supplier', contactPerson: 'Wei Zhang', phone: '+86 755 5550 133', email: 'wei.zhang@szcomponent.cn', address: 'Bao\'an District, Shenzhen', taxNumber: 'CN-914403001', paymentTerms: 'Net 60', creditLimit: 0, currency: 'USD', bankInfo: 'Bank of China - 6222001', status: 'Active', outstandingBalance: 61800, totalPurchases: 892400 },
  { id: 'BP006', code: 'S-2003', name: 'Continental Packaging Co', type: 'Supplier', contactPerson: 'Anna Kowalski', phone: '+49 30 5550 199', email: 'a.kowalski@contpack.de', address: 'Industriestrasse 12, Berlin', taxNumber: 'DE-812093847', paymentTerms: 'Net 30', creditLimit: 0, currency: 'EUR', bankInfo: 'Deutsche Bank - 3321098', status: 'Active', outstandingBalance: 9400, totalPurchases: 112300 },
  { id: 'BP007', code: 'C-1004', name: 'Summit Energy Solutions', type: 'Customer', contactPerson: 'David Torres', phone: '+1 713 555 0164', email: 'd.torres@summitenergy.com', address: '900 Bayou City Blvd, Houston, TX', taxNumber: 'US-75-1123409', paymentTerms: 'Net 30', creditLimit: 300000, currency: 'USD', bankInfo: 'Bank of America - 5512309', status: 'Inactive', outstandingBalance: 0, totalSales: 78400 },
];

export const seedWarehouses = [
  { id: 'WH001', code: 'WH-Main', name: 'Main Warehouse', address: 'Building A, Plant 1', status: 'Active' },
  { id: 'WH002', code: 'WH-FG', name: 'Finished Goods Warehouse', address: 'Building B, Plant 1', status: 'Active' },
  { id: 'WH003', code: 'WH-Pack', name: 'Packaging Store', address: 'Building C, Plant 1', status: 'Active' },
  { id: 'WH004', code: 'WH-Ret', name: 'Returns Warehouse', address: 'Building D, Plant 2', status: 'Active' },
];

export const seedBinLocations = [
  { id: 'BIN001', code: 'A-01-01', name: 'Aisle A, Rack 1, Bin 1', warehouse: 'WH-Main', status: 'Active' },
  { id: 'BIN002', code: 'A-01-02', name: 'Aisle A, Rack 1, Bin 2', warehouse: 'WH-Main', status: 'Active' },
  { id: 'BIN003', code: 'B-02-01', name: 'Aisle B, Rack 2, Bin 1', warehouse: 'WH-FG', status: 'Active' },
];

export const seedUOM = [
  { id: 'U001', code: 'KG', name: 'Kilogram', status: 'Active' },
  { id: 'U002', code: 'PCS', name: 'Pieces', status: 'Active' },
  { id: 'U003', code: 'SHEET', name: 'Sheet', status: 'Active' },
  { id: 'U004', code: 'COIL', name: 'Coil', status: 'Active' },
  { id: 'U005', code: 'CAN', name: 'Can', status: 'Active' },
];

export const seedUOMConversion = [
  { id: 'UC001', fromUom: 'KG', toUom: 'TON', factor: 0.001, status: 'Active' },
  { id: 'UC002', fromUom: 'PCS', toUom: 'BOX', factor: 0.0417, status: 'Active' },
];

export const seedCurrencies = [
  { id: 'CUR001', code: 'USD', name: 'US Dollar', symbol: '$', status: 'Active' },
  { id: 'CUR002', code: 'EUR', name: 'Euro', symbol: '€', status: 'Active' },
  { id: 'CUR003', code: 'GBP', name: 'British Pound', symbol: '£', status: 'Active' },
  { id: 'CUR004', code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', status: 'Active' },
];

export const seedExchangeRates = [
  { id: 'ER001', currency: 'EUR', rate: 1.09, date: '2026-09-15', status: 'Active' },
  { id: 'ER002', currency: 'GBP', rate: 1.27, date: '2026-09-15', status: 'Active' },
  { id: 'ER003', currency: 'SGD', rate: 0.74, date: '2026-09-15', status: 'Active' },
];

export const seedPaymentTerms = [
  { id: 'PT001', code: 'NET15', name: 'Net 15 Days', days: 15, status: 'Active' },
  { id: 'PT002', code: 'NET30', name: 'Net 30 Days', days: 30, status: 'Active' },
  { id: 'PT003', code: 'NET45', name: 'Net 45 Days', days: 45, status: 'Active' },
  { id: 'PT004', code: 'NET60', name: 'Net 60 Days', days: 60, status: 'Active' },
  { id: 'PT005', code: 'COD', name: 'Cash on Delivery', days: 0, status: 'Active' },
];

export const seedTaxMaster = [
  { id: 'TX001', code: 'VAT15', name: 'Standard VAT', rate: 15, status: 'Active' },
  { id: 'TX002', code: 'VAT5', name: 'Reduced VAT', rate: 5, status: 'Active' },
  { id: 'TX003', code: 'ZERO', name: 'Zero Rated', rate: 0, status: 'Active' },
];

export const seedCostCenters = [
  { id: 'CC001', code: 'CC-PROD', name: 'Production', status: 'Active' },
  { id: 'CC002', code: 'CC-SALES', name: 'Sales & Marketing', status: 'Active' },
  { id: 'CC003', code: 'CC-ADMIN', name: 'Administration', status: 'Active' },
  { id: 'CC004', code: 'CC-LOG', name: 'Logistics', status: 'Active' },
];

export const seedProfitCenters = [
  { id: 'PC001', code: 'PC-IND', name: 'Industrial Division', status: 'Active' },
  { id: 'PC002', code: 'PC-CONS', name: 'Consumer Division', status: 'Active' },
  { id: 'PC003', code: 'PC-EXP', name: 'Export Division', status: 'Active' },
];

export const seedBankMaster = [
  { id: 'BNK001', code: 'BNK-001', name: 'Wells Fargo Operating', branch: 'Fremont, CA', accountNumber: '4482910', iban: 'US64WFBA0000004482910', currency: 'USD', openingBalance: 500000, currentBalance: 612400, status: 'Active' },
  { id: 'BNK002', code: 'BNK-002', name: 'Chase Payroll Account', branch: 'Chicago, IL', accountNumber: '9982104', iban: 'US64CHAS0000009982104', currency: 'USD', openingBalance: 200000, currentBalance: 148900, status: 'Active' },
  { id: 'BNK003', code: 'BNK-003', name: 'Deutsche Bank EUR', branch: 'Berlin', accountNumber: '3321098', iban: 'DE89370400440532013000', currency: 'EUR', openingBalance: 80000, currentBalance: 92150, status: 'Active' },
];

export const seedAssetClass = [
  { id: 'AC001', code: 'AC-MACH', name: 'Machinery & Equipment', depreciationMethod: 'Straight Line', defaultRate: 10, status: 'Active' },
  { id: 'AC002', code: 'AC-VEH', name: 'Vehicles', depreciationMethod: 'Straight Line', defaultRate: 20, status: 'Active' },
  { id: 'AC003', code: 'AC-IT', name: 'IT Equipment', depreciationMethod: 'Straight Line', defaultRate: 33.3, status: 'Active' },
  { id: 'AC004', code: 'AC-FURN', name: 'Furniture & Fixtures', depreciationMethod: 'Straight Line', defaultRate: 12.5, status: 'Active' },
];

export const seedFixedAssets = [
  { id: 'FA001', code: 'FA-1001', name: 'CNC Machining Center', assetClass: 'AC-MACH', acquisitionDate: '2023-02-10', acquisitionCost: 185000, usefulLife: 10, depreciationMethod: 'Straight Line', depreciationRate: 10, accumulatedDepreciation: 51800, currentBookValue: 133200, location: 'Plant 1 - Bay 3', responsibleEmployee: 'Mark Lindqvist', status: 'Active' },
  { id: 'FA002', code: 'FA-1002', name: 'Delivery Truck - Ford F450', assetClass: 'AC-VEH', acquisitionDate: '2024-06-01', acquisitionCost: 62000, usefulLife: 5, depreciationMethod: 'Straight Line', depreciationRate: 20, accumulatedDepreciation: 15500, currentBookValue: 46500, location: 'Logistics Yard', responsibleEmployee: 'Carlos Mendez', status: 'Active' },
  { id: 'FA003', code: 'FA-1003', name: 'Server Rack - Dell PowerEdge', assetClass: 'AC-IT', acquisitionDate: '2024-11-20', acquisitionCost: 28500, usefulLife: 3, depreciationMethod: 'Straight Line', depreciationRate: 33.3, accumulatedDepreciation: 9500, currentBookValue: 19000, location: 'HQ Server Room', responsibleEmployee: 'Priya Nair', status: 'Active' },
  { id: 'FA004', code: 'FA-1004', name: 'Office Workstation Set', assetClass: 'AC-FURN', acquisitionDate: '2022-04-15', acquisitionCost: 14200, usefulLife: 8, depreciationMethod: 'Straight Line', depreciationRate: 12.5, accumulatedDepreciation: 6390, currentBookValue: 7810, location: 'HQ Floor 2', responsibleEmployee: 'Admin Pool', status: 'Disposed' },
];

export const seedExpenseMaster = [
  { id: 'EX001', code: 'EXP-TRV', name: 'Travel & Transport', category: 'Operating', glAccount: '6100', tax: 'VAT15', costCenter: 'CC-SALES', status: 'Active' },
  { id: 'EX002', code: 'EXP-UTIL', name: 'Utilities', category: 'Operating', glAccount: '6200', tax: 'VAT15', costCenter: 'CC-ADMIN', status: 'Active' },
  { id: 'EX003', code: 'EXP-MAINT', name: 'Repairs & Maintenance', category: 'Operating', glAccount: '6300', tax: 'VAT15', costCenter: 'CC-PROD', status: 'Active' },
  { id: 'EX004', code: 'EXP-MKT', name: 'Marketing & Advertising', category: 'Operating', glAccount: '6400', tax: 'VAT15', costCenter: 'CC-SALES', status: 'Active' },
];

export const seedChartOfAccounts = [
  { id: 'GL001', code: '1000', name: 'Cash and Bank', type: 'Asset', status: 'Active' },
  { id: 'GL002', code: '1100', name: 'Accounts Receivable', type: 'Asset', status: 'Active' },
  { id: 'GL003', code: '1200', name: 'Inventory', type: 'Asset', status: 'Active' },
  { id: 'GL004', code: '1500', name: 'Fixed Assets', type: 'Asset', status: 'Active' },
  { id: 'GL005', code: '2000', name: 'Accounts Payable', type: 'Liability', status: 'Active' },
  { id: 'GL006', code: '2100', name: 'Tax Payable', type: 'Liability', status: 'Active' },
  { id: 'GL007', code: '3000', name: 'Share Capital', type: 'Equity', status: 'Active' },
  { id: 'GL008', code: '3100', name: 'Retained Earnings', type: 'Equity', status: 'Active' },
  { id: 'GL009', code: '4000', name: 'Sales Revenue', type: 'Revenue', status: 'Active' },
  { id: 'GL010', code: '5000', name: 'Cost of Goods Sold', type: 'Expense', status: 'Active' },
  { id: 'GL011', code: '6100', name: 'Travel & Transport', type: 'Expense', status: 'Active' },
  { id: 'GL012', code: '6200', name: 'Utilities', type: 'Expense', status: 'Active' },
];

// ---- Transactions ----

export const seedPurchaseInvoices = [
  {
    id: 'PI-10025', docNo: 'PI-10025', postingDate: '2026-09-10', vendorId: 'BP004', vendorRef: 'ALY-8823',
    currency: 'USD', paymentTerms: 'Net 30', dueDate: '2026-10-10', remarks: 'Q3 steel restock', status: 'Open',
    approvalStatus: 'Approved', createdBy: 'noman', createdDate: '2026-09-10T09:12:00',
    lines: [
      { item: 'MAT-1001', description: 'Steel Rod 12mm', qty: 2000, uom: 'KG', unitPrice: 145, discount: 2, tax: 15, warehouse: 'WH-Main', lineTotal: 327590 },
      { item: 'MAT-1003', description: 'Copper Wire 2.5mm', qty: 150, uom: 'COIL', unitPrice: 68, discount: 0, tax: 15, warehouse: 'WH-Main', lineTotal: 11730 },
    ],
    subtotal: 314700, discount: 6300, tax: 46484, grandTotal: 339210, paidAmount: 150000, outstanding: 189210,
    docFlow: { pr: 'Completed', rfq: 'Completed', sq: 'Completed', po: 'Completed', gr: 'Completed', invoice: 'Current', payment: 'Pending' },
  },
  {
    id: 'PI-10026', docNo: 'PI-10026', postingDate: '2026-09-12', vendorId: 'BP005', vendorRef: 'SZ-4471',
    currency: 'USD', paymentTerms: 'Net 60', dueDate: '2026-11-11', remarks: 'Bearing assembly bulk order', status: 'Open',
    approvalStatus: 'Pending', createdBy: 'noman', createdDate: '2026-09-12T14:02:00',
    lines: [
      { item: 'MAT-4001', description: 'Bearing Assembly 608ZZ', qty: 5000, uom: 'PCS', unitPrice: 4.5, discount: 1, tax: 15, warehouse: 'WH-Main', lineTotal: 25596 },
    ],
    subtotal: 22500, discount: 225, tax: 3341, grandTotal: 25616, paidAmount: 0, outstanding: 25616,
    docFlow: { pr: 'Completed', rfq: 'Completed', sq: 'Completed', po: 'Completed', gr: 'Completed', invoice: 'Current', payment: 'Pending' },
  },
  {
    id: 'PI-10024', docNo: 'PI-10024', postingDate: '2026-08-28', vendorId: 'BP006', vendorRef: 'CP-1102',
    currency: 'EUR', paymentTerms: 'Net 30', dueDate: '2026-09-27', remarks: 'Packaging supplies', status: 'Closed',
    approvalStatus: 'Approved', createdBy: 'noman', createdDate: '2026-08-28T11:40:00',
    lines: [
      { item: 'MAT-3001', description: 'Corrugated Box L', qty: 10000, uom: 'PCS', unitPrice: 8, discount: 0, tax: 15, warehouse: 'WH-Pack', lineTotal: 92000 },
    ],
    subtotal: 80000, discount: 0, tax: 12000, grandTotal: 92000, paidAmount: 92000, outstanding: 0,
    docFlow: { pr: 'Completed', rfq: 'Completed', sq: 'Completed', po: 'Completed', gr: 'Completed', invoice: 'Completed', payment: 'Completed' },
  },
];

export const seedSalesInvoices = [
  {
    id: 'SI-20041', docNo: 'SI-20041', postingDate: '2026-09-11', customerId: 'BP001', customerRef: 'PO-99213',
    currency: 'USD', paymentTerms: 'Net 30', dueDate: '2026-10-11', salesEmployee: 'Elena Ross', remarks: 'Motor batch shipment', status: 'Open',
    approvalStatus: 'Approved', createdBy: 'noman', createdDate: '2026-09-11T10:20:00',
    lines: [
      { item: 'MAT-2001', description: 'Industrial Motor 5HP', qty: 8, uom: 'PCS', unitPrice: 3200, discount: 3, tax: 15, warehouse: 'WH-FG', lineTotal: 28563 },
    ],
    subtotal: 25600, discount: 768, tax: 3731, grandTotal: 28563, receivedAmount: 10000, outstanding: 18563,
    docFlow: { quotation: 'Completed', order: 'Completed', delivery: 'Completed', invoice: 'Current', payment: 'Pending' },
  },
  {
    id: 'SI-20042', docNo: 'SI-20042', postingDate: '2026-09-13', customerId: 'BP003', customerRef: 'PR-77120',
    currency: 'USD', paymentTerms: 'Net 45', dueDate: '2026-10-28', salesEmployee: 'Elena Ross', remarks: 'Control panel order', status: 'Open',
    approvalStatus: 'Pending', createdBy: 'noman', createdDate: '2026-09-13T16:05:00',
    lines: [
      { item: 'MAT-2002', description: 'Control Panel Assembly', qty: 4, uom: 'PCS', unitPrice: 6900, discount: 0, tax: 15, warehouse: 'WH-FG', lineTotal: 31740 },
    ],
    subtotal: 27600, discount: 0, tax: 4140, grandTotal: 31740, receivedAmount: 0, outstanding: 31740,
    docFlow: { quotation: 'Completed', order: 'Completed', delivery: 'Current', invoice: 'Pending', payment: 'Pending' },
  },
  {
    id: 'SI-20038', docNo: 'SI-20038', postingDate: '2026-08-20', customerId: 'BP002', customerRef: 'RET-4471',
    currency: 'USD', paymentTerms: 'Net 15', dueDate: '2026-09-04', salesEmployee: 'Devon Park', remarks: 'Retail box order', status: 'Closed',
    approvalStatus: 'Approved', createdBy: 'noman', createdDate: '2026-08-20T08:55:00',
    lines: [
      { item: 'MAT-3001', description: 'Corrugated Box L', qty: 3000, uom: 'PCS', unitPrice: 12, discount: 0, tax: 15, warehouse: 'WH-Pack', lineTotal: 41400 },
    ],
    subtotal: 36000, discount: 0, tax: 5400, grandTotal: 41400, receivedAmount: 41400, outstanding: 0,
    docFlow: { quotation: 'Completed', order: 'Completed', delivery: 'Completed', invoice: 'Completed', payment: 'Completed' },
  },
];

export const seedPaymentsMade = [
  { id: 'PM-3301', docNo: 'PM-3301', date: '2026-09-14', vendorId: 'BP004', invoiceRef: 'PI-10025', amount: 150000, bank: 'BNK-001', method: 'Wire Transfer', status: 'Completed' },
  { id: 'PM-3302', docNo: 'PM-3302', date: '2026-08-30', vendorId: 'BP006', invoiceRef: 'PI-10024', amount: 92000, bank: 'BNK-003', method: 'Wire Transfer', status: 'Completed' },
];

export const seedPaymentsReceived = [
  { id: 'PR-4401', docNo: 'PR-4401', date: '2026-09-15', customerId: 'BP001', invoiceRef: 'SI-20041', amount: 10000, bank: 'BNK-001', method: 'ACH', status: 'Completed' },
  { id: 'PR-4402', docNo: 'PR-4402', date: '2026-08-25', customerId: 'BP002', invoiceRef: 'SI-20038', amount: 41400, bank: 'BNK-002', method: 'ACH', status: 'Completed' },
];

export const seedBankTransactions = [
  { id: 'BT001', date: '2026-09-14', bank: 'BNK-001', type: 'Payment', reference: 'PM-3301', amount: -150000, status: 'Reconciled' },
  { id: 'BT002', date: '2026-09-15', bank: 'BNK-001', type: 'Receipt', reference: 'PR-4401', amount: 10000, status: 'Unreconciled' },
  { id: 'BT003', date: '2026-08-30', bank: 'BNK-003', type: 'Payment', reference: 'PM-3302', amount: -92000, status: 'Reconciled' },
];

export const seedExpenseTransactions = [
  { id: 'ET001', date: '2026-09-08', payee: 'Elena Ross', category: 'EXP-TRV', amount: 840, tax: 15, costCenter: 'CC-SALES', description: 'Client site visit - Houston', approvalStatus: 'Approved', paymentStatus: 'Paid' },
  { id: 'ET002', date: '2026-09-11', payee: 'Facilities Dept', category: 'EXP-UTIL', amount: 3200, tax: 15, costCenter: 'CC-ADMIN', description: 'September utilities', approvalStatus: 'Pending', paymentStatus: 'Unpaid' },
  { id: 'ET003', date: '2026-09-05', payee: 'Maintenance Team', category: 'EXP-MAINT', amount: 1560, tax: 15, costCenter: 'CC-PROD', description: 'CNC machine service', approvalStatus: 'Approved', paymentStatus: 'Paid' },
];

export const seedJournalEntries = [
  { id: 'JE001', date: '2026-09-10', reference: 'PI-10025', debitAccount: '1200', creditAccount: '2000', amount: 339210, description: 'Purchase invoice posting', status: 'Posted' },
  { id: 'JE002', date: '2026-09-11', reference: 'SI-20041', debitAccount: '1100', creditAccount: '4000', amount: 28563, description: 'Sales invoice posting', status: 'Posted' },
];

export const seedStockTransfers = [
  { id: 'ST001', date: '2026-09-09', item: 'MAT-1001', fromWarehouse: 'WH-Main', toWarehouse: 'WH-FG', qty: 200, status: 'Completed' },
  { id: 'ST002', date: '2026-09-13', item: 'MAT-4001', fromWarehouse: 'WH-Main', toWarehouse: 'WH-Ret', qty: 50, status: 'Pending' },
];

// ---- HR / Payroll ----

export const seedEmployees = [
  { id: 'EMP001', empId: 'EMP-001', name: 'Noman Ahmed', department: 'Administration', designation: 'ERP Administrator', joiningDate: '2021-03-01', employmentStatus: 'Active', bankAccount: 'BNK-002-8871', basicSalary: 6500, costCenter: 'CC-ADMIN' },
  { id: 'EMP002', empId: 'EMP-002', name: 'Elena Ross', department: 'Sales', designation: 'Senior Sales Executive', joiningDate: '2022-01-15', employmentStatus: 'Active', bankAccount: 'BNK-002-8872', basicSalary: 5200, costCenter: 'CC-SALES' },
  { id: 'EMP003', empId: 'EMP-003', name: 'Mark Lindqvist', department: 'Production', designation: 'Production Supervisor', joiningDate: '2019-07-20', employmentStatus: 'Active', bankAccount: 'BNK-002-8873', basicSalary: 4800, costCenter: 'CC-PROD' },
  { id: 'EMP004', empId: 'EMP-004', name: 'Priya Nair', department: 'IT', designation: 'Systems Engineer', joiningDate: '2023-05-10', employmentStatus: 'Active', bankAccount: 'BNK-002-8874', basicSalary: 5600, costCenter: 'CC-ADMIN' },
  { id: 'EMP005', empId: 'EMP-005', name: 'Carlos Mendez', department: 'Logistics', designation: 'Fleet Coordinator', joiningDate: '2020-11-02', employmentStatus: 'Active', bankAccount: 'BNK-002-8875', basicSalary: 4200, costCenter: 'CC-LOG' },
  { id: 'EMP006', empId: 'EMP-006', name: 'Devon Park', department: 'Sales', designation: 'Sales Executive', joiningDate: '2024-02-19', employmentStatus: 'Active', bankAccount: 'BNK-002-8876', basicSalary: 4400, costCenter: 'CC-SALES' },
];

export const seedPayrollRuns = [
  { id: 'PR-2026-08', period: 'August 2026', employeeId: 'EMP001', basic: 6500, allowances: 800, overtime: 0, deductions: 200, tax: 1095, gross: 7300, net: 6005, status: 'Paid' },
  { id: 'PR-2026-08-2', period: 'August 2026', employeeId: 'EMP002', basic: 5200, allowances: 600, overtime: 150, deductions: 100, tax: 878, gross: 5950, net: 4972, status: 'Paid' },
  { id: 'PR-2026-08-3', period: 'August 2026', employeeId: 'EMP003', basic: 4800, allowances: 500, overtime: 320, deductions: 150, tax: 800, gross: 5620, net: 4670, status: 'Paid' },
  { id: 'PR-2026-09-1', period: 'September 2026', employeeId: 'EMP001', basic: 6500, allowances: 800, overtime: 0, deductions: 200, tax: 1095, gross: 7300, net: 6005, status: 'Draft' },
  { id: 'PR-2026-09-2', period: 'September 2026', employeeId: 'EMP002', basic: 5200, allowances: 600, overtime: 90, deductions: 100, tax: 861, gross: 5890, net: 4929, status: 'Draft' },
];

// ---- Users & Security ----

export const seedUsers = [
  { id: 'USR001', userId: 'U-001', username: 'noman', employee: 'Noman Ahmed', email: 'noman@company.com', role: 'Administrator', status: 'Active', lastLogin: '2026-09-16T09:00:00' },
  { id: 'USR002', userId: 'U-002', username: 'e.ross', employee: 'Elena Ross', email: 'elena.ross@company.com', role: 'Sales Manager', status: 'Active', lastLogin: '2026-09-15T17:20:00' },
  { id: 'USR003', userId: 'U-003', username: 'm.lindqvist', employee: 'Mark Lindqvist', email: 'mark.l@company.com', role: 'Production Supervisor', status: 'Active', lastLogin: '2026-09-14T08:10:00' },
  { id: 'USR004', userId: 'U-004', username: 'p.nair', employee: 'Priya Nair', email: 'priya.nair@company.com', role: 'IT Administrator', status: 'Active', lastLogin: '2026-09-16T07:45:00' },
  { id: 'USR005', userId: 'U-005', username: 'c.mendez', employee: 'Carlos Mendez', email: 'carlos.m@company.com', role: 'Logistics Coordinator', status: 'Inactive', lastLogin: '2026-08-02T12:30:00' },
];

export const seedRoles = [
  { role: 'Administrator', module: 'All Modules', view: true, add: true, edit: true, delete: true, approve: true },
  { role: 'Sales Manager', module: 'Sales / Transactions', view: true, add: true, edit: true, delete: false, approve: true },
  { role: 'Sales Manager', module: 'Master Data', view: true, add: true, edit: false, delete: false, approve: false },
  { role: 'Production Supervisor', module: 'Inventory', view: true, add: true, edit: true, delete: false, approve: false },
  { role: 'IT Administrator', module: 'Users & Security', view: true, add: true, edit: true, delete: true, approve: false },
  { role: 'Logistics Coordinator', module: 'Transactions', view: true, add: true, edit: false, delete: false, approve: false },
];

export const seedNotifications = [
  { id: 'N001', type: 'Approval Pending', message: 'Purchase Invoice PI-10026 awaiting approval', date: '2026-09-16T08:00:00', read: false },
  { id: 'N002', type: 'Invoice Due', message: 'Sales Invoice SI-20041 due in 5 days', date: '2026-09-16T06:00:00', read: false },
  { id: 'N003', type: 'Low Stock', message: 'Aluminum Sheet 2mm below reorder level', date: '2026-09-15T18:00:00', read: true },
  { id: 'N004', type: 'Payroll Processing', message: 'September payroll draft ready for review', date: '2026-09-15T10:00:00', read: false },
  { id: 'N005', type: 'Payment Due', message: 'Payment to Shenzhen Component Works due in 12 days', date: '2026-09-14T09:00:00', read: true },
];

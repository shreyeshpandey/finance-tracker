import React from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ExportButtons({ data, filters }) {
  const getFileName = (ext) => {
    const site = filters.site || 'all-sites';
    const month = filters.month || 'all-months';
    return `transactions-${site}-${month}.${ext}`;
  };

  const getSummary = () => {
   return data.reduce(
     (acc, txn) => {
       if (txn.type === 'credit') acc.credit += txn.amount;
       else if (txn.type === 'debit') acc.debit += txn.amount;
       return acc;
     },
     { credit: 0, debit: 0 }
   );
 };

 const handleExcelExport = () => {
  const sheetData = data.map((txn) => ({
    Amount: txn.amount,
    Site: txn.site,
    Vendor: txn.vendor,
    Type: txn.type,
    Remark: txn.remark,
    Date: new Date(txn.date.seconds * 1000).toLocaleDateString(),
   }));

   const summary = getSummary();
   sheetData.push({});
  sheetData.push({ Type: 'Total Credit', Amount: summary.credit });
  sheetData.push({ Type: 'Total Debit', Amount: summary.debit });
  sheetData.push({ Type: 'Net Balance', Amount: summary.credit - summary.debit });

   const worksheet = XLSX.utils.json_to_sheet(sheetData);
   const workbook = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
   XLSX.writeFile(workbook, getFileName('xlsx'));
 };

 const handlePdfExport = () => {
   const doc = new jsPDF();

   const rows = data.map((txn) => [
     txn.amount,
     txn.site,
     txn.vendor,
     txn.type,
     txn.remark,
     new Date(txn.date.seconds * 1000).toLocaleDateString(),
   ]);

   const summary = getSummary();

   rows.push(['', '', '', '', '', '']);
   rows.push(['', '', '', 'Total Credit', '', summary.credit]);
   rows.push(['', '', '', 'Total Debit', '', summary.debit]);
   rows.push(['', '', '', 'Net Balance', '', summary.credit - summary.debit]);

  autoTable(doc, {
    head: [['Amount', 'Site', 'Vendor', 'Type', 'Remark', 'Date']],
    body: rows,
   });

   doc.save(getFileName('pdf'));
} ;

  return (
    <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
      <button onClick={handleExcelExport}>📊 Export to Excel</button>
      <button onClick={handlePdfExport}>📄 Export to PDF</button>
    </div>
  );
}
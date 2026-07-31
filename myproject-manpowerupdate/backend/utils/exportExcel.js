const ExcelJS = require('exceljs');

async function exportToExcel(res, filename, columns, rows) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Sheet1');

  sheet.columns = columns;
  sheet.addRows(rows);

  sheet.getRow(1).font = { bold: true };
  sheet.columns.forEach((col) => {
    let maxLen = (col.header || '').length;
    rows.forEach((r) => {
      const val = r[col.key] != null ? String(r[col.key]) : '';
      if (val.length > maxLen) maxLen = val.length;
    });
    col.width = Math.min(Math.max(maxLen + 2, 12), 60);
  });

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  await workbook.xlsx.write(res);
  res.end();
}

module.exports = { exportToExcel };

import type { Application, Contact, Job } from './types';

type ExcelJs = { Workbook: new () => any };

declare global {
  interface Window {
    ExcelJS?: ExcelJs;
  }
}

let excelLoader: Promise<ExcelJs> | undefined;

function loadExcelJs(): Promise<ExcelJs> {
  if (window.ExcelJS) return Promise.resolve(window.ExcelJS);
  if (excelLoader) return excelLoader;

  excelLoader = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = '/vendor/exceljs.min.js';
    script.onload = () => window.ExcelJS ? resolve(window.ExcelJS) : reject(new Error('Excel library could not load.'));
    script.onerror = () => reject(new Error('Excel download library could not load. Refresh the page and try again.'));
    document.head.appendChild(script);
  });
  return excelLoader;
}

async function downloadWorkbook(
  fileName: string,
  sheetName: string,
  headers: string[],
  rows: Array<Array<string | number>>
) {
  const ExcelJS = await loadExcelJs();
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  worksheet.addRow(headers);
  rows.forEach((row) => worksheet.addRow(row));
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } };
  worksheet.views = [{ state: 'frozen', ySplit: 1 }];
  worksheet.autoFilter = { from: 'A1', to: `${String.fromCharCode(64 + headers.length)}1` };
  worksheet.columns.forEach((column: any, index: number) => {
    const longest = Math.max(headers[index].length, ...rows.map((row) => String(row[index] ?? '').length));
    column.width = Math.min(Math.max(longest + 2, 14), 42);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const url = URL.createObjectURL(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

const date = (value?: string) => value ? new Date(value).toLocaleString() : '';

export function downloadApplicationsExcel(items: Application[]) {
  return downloadWorkbook(
    'job-applications.xlsx',
    'Applications',
    ['Applicant Name', 'Email', 'Phone', 'Job Title', 'Location', 'Cover Letter', 'CV File Name', 'Applied On'],
    items.map((item) => [item.name, item.email, item.phone || '', item.job?.title || '', item.job?.location || '', item.cover_letter || '', item.cv_file_name || '', date(item.created_at)])
  );
}

export function downloadContactsExcel(items: Contact[]) {
  return downloadWorkbook(
    'contact-messages.xlsx',
    'Contacts',
    ['Name', 'Email', 'Phone', 'Subject', 'Message', 'Received On'],
    items.map((item) => [item.name, item.email, item.phone || '', item.subject || '', item.message, date(item.created_at)])
  );
}

export function downloadJobsExcel(items: Job[]) {
  return downloadWorkbook(
    'job-listings.xlsx',
    'Jobs',
    ['Job Title', 'Company', 'Location', 'Job Type', 'Category', 'Salary', 'Vacancies', 'Status', 'Description', 'Created On'],
    items.map((item) => [item.title, item.company || '', item.location || '', item.type || '', item.category || '', item.salary || '', item.vacancies || 0, item.is_active ? 'Active' : 'Inactive', item.description || '', date(item.created_at)])
  );
}

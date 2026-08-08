/**
 * Triggers a real browser download of a CSV file with given filename and content
 */
export const downloadCsv = (filename, dataRows, headers) => {
  const csvRows = [];
  if (headers && headers.length > 0) {
    csvRows.push(headers.join(','));
  }

  dataRows.forEach(row => {
    const values = row.map(val => {
      const escaped = ('' + val).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvRows.join('\n'));
  const link = document.createElement('a');
  link.setAttribute('href', csvContent);
  link.setAttribute('download', filename || 'alumni_connect_export.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

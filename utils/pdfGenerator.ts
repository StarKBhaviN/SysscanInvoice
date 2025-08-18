interface Column {
  key: string;
  title: string;
}

interface DataRow {
  [key: string]: any;
}

export const generateInvoiceHtml = (
  columns: Column[],
  data: DataRow[]
): string => {
  const tableHeaders = columns.map((col) => `<th>${col.title}</th>`).join("");
  const tableRows = data
    .map((row) => {
      const cells = columns.map((col) => `<td>${row[col.key]}</td>`).join("");
      return `<tr>${cells}</tr>`;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Helvetica, sans-serif; color: #333; }
          h1 { text-align: center; color: #4a4a4a; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 10px; text-align: left; font-size: 14px; }
          th { background-color: #f2f2f2; font-weight: bold; }
          tr:nth-child(even) { background-color: #f9f9f9; }
        </style>
      </head>
      <body>
        <h1>Invoice Report</h1>
        <table>
          <thead>
            <tr>${tableHeaders}</tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
    </html>
  `;
};

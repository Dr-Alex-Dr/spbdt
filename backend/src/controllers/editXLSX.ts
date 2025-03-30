import ExcelJS from "exceljs";

export const editXLSX = async (filePath: string) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  workbook.worksheets.forEach((worksheet) => {
    for (let i = 0; i < 9; i++) {
      worksheet.spliceRows(1, 1);
    }
  });

  await workbook.xlsx.writeFile(filePath);
  console.log(`Updated file saved as ${filePath}`);
};

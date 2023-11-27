
//En este archivo index,leemos y traemos toda la data del archivo "SwetroData.xlsx"

const ExcelJS = require('exceljs');
const path = require('path');

const workbook = new ExcelJS.Workbook();

const excelFilePath = path.join(__dirname, '../SwetroData.xlsx');

workbook.xlsx.readFile(excelFilePath)
  .then(() => {
    const worksheetName = 'Random activities';
    const worksheet = workbook.getWorksheet(worksheetName);

    if (worksheet) {
      // Nombres de columnas
      const columnNames = [
        'Id',
        'UserId',
        'StartTimeInSeconds',
        'DurationInSeconds',
        'DistanceInMeters',
        'Steps',
        'AverageSpeedInMetersPerSecond',
        'AveragePaceInMinutesPerKilometer',
        'TotalElevationGainInMeters',
        'AverageHeartRateInBeatsPerMinute'
      ];

     
      worksheet.eachRow({ includeEmpty: false, includeFormulas: true }, (row, rowNumber) => {
        if (rowNumber !== 1) { 
          const rowData = {};
          row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            rowData[columnNames[colNumber - 1] || `Columna ${colNumber}`] = cell.value;
          });

          console.log(`Fila ${rowNumber}:`, rowData);
        }
      });
    } else {
      console.error(`La hoja de trabajo '${worksheetName}' no se encontró.`);
    }
  })
  .catch(error => console.error('Error al leer el archivo Excel:', error));


//Este es script, para inciar en la terminal para leer la data.
//npm run read-excel






  

  
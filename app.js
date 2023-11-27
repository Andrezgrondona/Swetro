
const ExcelJS = require('exceljs');
const express = require('express');
const path = require('path');


//Base de tados basada en personas de "30 años" para comparar con la data del archivo "SwetroData.xlsx"
const SOSPECHOSO_SEGUNDOS = 3000;
const SOSPECHOSO_METROS = 10000;
const SOSPECHOSO_PASOS = 6000;
const SOSPECHOSO_V_MEDIA = 5;
const SOSPECHOSO_RITMO = 7;
const SOSPECHOSO_ELEV_METROS = 70;
const SOSPECHOSO_R_CARDIACO = 200;


//Configuracion Express
const app = express();
const PORT = process.env.PORT || 3000;

//Motor de plantillas EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//Ruta para manejar las solicitudes
app.get('/usuarios-sospechosos', async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const excelFilePath = path.join(__dirname, 'SwetroData.xlsx');
    await workbook.xlsx.readFile(excelFilePath);

    const worksheetName = 'Random activities';
    const worksheet = workbook.getWorksheet(worksheetName);

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

    const usuariosSospechosos = [];

    // Contador de  sospechosos
    let totalSospechosos = 0;

    worksheet.eachRow({ includeEmpty: false, includeFormulas: true }, (row, rowNumber) => {
      if (rowNumber !== 1) {
        const rowData = {};
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          rowData[columnNames[colNumber - 1] || `Columna ${colNumber}`] = cell.value;
        });

        // Comparacion de la informacion entre la data de "SwetroData.xlsx", con Base de tados basada en personas de "30 años"
        if (
          rowData.DurationInSeconds > SOSPECHOSO_SEGUNDOS ||
          rowData.DistanceInMeters > SOSPECHOSO_METROS ||
          rowData.Steps > SOSPECHOSO_PASOS ||
          rowData.AverageSpeedInMetersPerSecond > SOSPECHOSO_V_MEDIA ||
          rowData.AveragePaceInMinutesPerKilometer > SOSPECHOSO_RITMO ||
          rowData.TotalElevationGainInMeters > SOSPECHOSO_ELEV_METROS ||
          rowData.AverageHeartRateInBeatsPerMinute > SOSPECHOSO_R_CARDIACO
        ) {
          totalSospechosos++; 
          usuariosSospechosos.push(rowData);
        }
      }
    });


    res.render('usuarios-sospechosos', { 
        totalSospechosos, 
        usuariosSospechosos,
        SOSPECHOSO_SEGUNDOS,
        SOSPECHOSO_METROS,
        SOSPECHOSO_PASOS,
        SOSPECHOSO_V_MEDIA,
        SOSPECHOSO_RITMO,
        SOSPECHOSO_ELEV_METROS,
        SOSPECHOSO_R_CARDIACO 
     });
  } catch (error) {
    console.error('Error al leer el archivo Excel:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

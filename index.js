function createClientReports() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Проверяем, что лист с исходными данными существует
    const sourceSheet = ss.getSheetByName('Отчет');
    if (!sourceSheet) {
      throw new Error('Лист с именем "Отчет" не найден! Проверьте имя листа.');
    }
  
    // Проверяем, что на листе есть данные
    const data = sourceSheet.getDataRange().getValues();
    if (data.length === 0) {
      throw new Error('Лист "Отчет" пустой. Добавьте данные.');
    }
  
    Logger.log('Данные успешно загружены. Количество строк: ' + data.length);
  
    // Удаляем все листы, кроме исходного и "Данные клиентов"
    deleteAllSheetsExcept(['Отчет', 'Данные клиентов']);
  
    // Загружаем данные из листа с клиентами и ценами
    const clientDataSheet = ss.getSheetByName('Данные клиентов'); // Убедитесь, что лист существует
    if (!clientDataSheet) {
      throw new Error('Лист с именем "Данные клиентов" не найден! Проверьте имя листа.');
    }
  
    const clientData = clientDataSheet.getDataRange().getValues();
    const clientMap = createClientMap(clientData); // Создаем карту клиентов и цен
  
    // Создаем объект для хранения данных по клиентам
    const clients = {};
  
    // Проходим по всем строкам данных
    data.forEach((row, index) => {
      if (index === 0) return; // Пропускаем заголовок
      const clientComment = row[1]; // Комментарий находится во 2-м столбце (индекс 1)
  
      // Проверяем, что комментарий не пустой
      if (!clientComment || clientComment.trim() === '') {
        Logger.log('Найдена строка с пустым комментарием. Пропускаем.');
        return; // Пропускаем строки с пустыми комментариями
      }
  
      // Заменяем комментарий на название клиента
      const clientName = clientMap.names[clientComment.trim().toUpperCase()] || clientComment; // Если название не найдено, оставляем комментарий
      if (!clients[clientName]) {
        clients[clientName] = [];
      }
      clients[clientName].push(row);
    });
  
    Logger.log('Найдено клиентов: ' + Object.keys(clients).length);
  
    // Создаем отдельные листы для каждого клиента
    for (const client in clients) {
      // Проверяем, что имя клиента не пустое
      if (!client || client.trim() === '') {
        Logger.log('Найден клиент с пустым именем. Пропускаем.');
        continue; // Пропускаем клиентов с пустыми именами
      }
  
      const clientSheet = ss.insertSheet(client); // Создаем лист с именем клиента
  
      // Добавляем заголовки
      clientSheet.appendRow([
        'Номер карты', // Объединенный заголовок для столбцов A, B, C, D
        '', '', '', // Пустые ячейки для объединения
        'Дата транзакции', // Столбец E
        'Вид топлива', // Столбец F
        'Кол-во', // Столбец G
        'Единица измерения', // Столбец H
        'Цена клиента' // Столбец I
      ]);
  
      // Объединяем ячейки для заголовка "Номер карты"
      clientSheet.getRange(1, 1, 1, 4).merge(); // Объединяем первые четыре ячейки в заголовке
  
      // Выравниваем заголовки по центру
      const headerRange = clientSheet.getRange(1, 1, 1, 9);
      headerRange.setHorizontalAlignment('center');
  
      // Создаем объект для хранения сумм по видам топлива
      const fuelSummary = {};
  
      // Сортируем данные по дате (столбец E, индекс 4)
      const sortedClientData = clients[client].sort((a, b) => {
        const dateA = new Date(a[4]); // Дата из столбца E
        const dateB = new Date(b[4]); // Дата из столбца E
        return dateA - dateB; // Сортировка по возрастанию
      });
  
      sortedClientData.forEach(row => {
        const fuelType = row[10].trim().toUpperCase(); // Товар (марка топлива, столбец K), убираем пробелы и приводим к верхнему регистру
        const quantity = parseFloat(row[11]); // Количество (столбец L)
  
        // Получаем цену для клиента и вида топлива
        const clientPrice = getClientPrice(clientMap.prices, client.trim().toUpperCase(), fuelType); // Цена из листа "Данные клиентов"
        const originalPrice = parseFloat(row[13]); // Цена из исходных данных
  
        // Если цена для клиента и вида топлива не найдена, выводим предупреждение
        if (clientPrice === null) {
          Logger.log(`Внимание: Для клиента "${client}" и топлива "${fuelType}" цена не указана в таблице "Данные клиентов". Используется исходная цена: ${originalPrice}`);
        }
  
        // Используем цену клиента, если она есть, иначе оставляем исходную цену
        const price = clientPrice !== null ? clientPrice : originalPrice;
  
        // Отладочный вывод
        Logger.log(`Клиент: ${client}, Топливо: ${fuelType}, Цена клиента: ${clientPrice}, Исходная цена: ${originalPrice}, Примененная цена: ${price}`);
  
        // Разбиваем номер карты на 4 части по 4 цифры
        const cardNumber = row[0].toString(); // Номер карты как строка
        const cardPart1 = cardNumber.slice(0, 4); // Первые 4 цифры
        const cardPart2 = cardNumber.slice(4, 8); // Следующие 4 цифры
        const cardPart3 = cardNumber.slice(8, 12); // Следующие 4 цифры
        const cardPart4 = cardNumber.slice(12, 16); // Последние 4 цифры
  
        // Добавляем данные в таблицу
        const newRow = [
          cardPart1, // Первые 4 цифры номера карты
          cardPart2, // Следующие 4 цифры
          cardPart3, // Следующие 4 цифры
          cardPart4, // Последние 4 цифры
          row[4], // Дата транзакции (столбец E)
          fuelType, // Вид топлива (столбец F)
          quantity, // Литры (столбец G)
          'Литры', // Единица измерения (столбец H)
          price // Цена клиента (столбец I)
        ];
        clientSheet.appendRow(newRow);
  
        // Устанавливаем текстовый формат для номеров карт
        const lastRow = clientSheet.getLastRow();
        clientSheet.getRange(lastRow, 1, 1, 4).setNumberFormat('@'); // Форматируем все 4 части как текст
  
        // Считаем сумму по видам топлива
        if (!fuelSummary[fuelType]) {
          fuelSummary[fuelType] = {
            totalQuantity: 0,
            totalCost: 0
          };
        }
        fuelSummary[fuelType].totalQuantity += quantity;
        fuelSummary[fuelType].totalCost += quantity * price;
      });
  
      // Увеличиваем ширину столбцов E, F, G, H, I в полтора раза
      const currentWidthA = clientSheet.getColumnWidth(1);
      const currentWidthB = clientSheet.getColumnWidth(2);
      const currentWidthC = clientSheet.getColumnWidth(3);
      const currentWidthD = clientSheet.getColumnWidth(4);
      const currentWidthE = clientSheet.getColumnWidth(5);
      const currentWidthF = clientSheet.getColumnWidth(6);
      const currentWidthG = clientSheet.getColumnWidth(7);
      const currentWidthH = clientSheet.getColumnWidth(8);
      const currentWidthI = clientSheet.getColumnWidth(9);
  
      clientSheet.setColumnWidth(1, currentWidthA * 0.5); // Столбец A (Номер карты)
      clientSheet.setColumnWidth(2, currentWidthB * 0.5); // Столбец B (Номер карты)
      clientSheet.setColumnWidth(3, currentWidthC * 0.5); // Столбец C (Номер карты)
      clientSheet.setColumnWidth(4, currentWidthD * 0.5); // Столбец D (Номер карты)
      clientSheet.setColumnWidth(5, currentWidthE * 1.5); // Столбец E (Дата транзакции)
      clientSheet.setColumnWidth(6, currentWidthF * 1.5); // Столбец F (Вид топлива)
      clientSheet.setColumnWidth(7, currentWidthG * 1.5); // Столбец G (Литры)
      clientSheet.setColumnWidth(8, currentWidthH * 1.5); // Столбец H (Единица измерения)
      clientSheet.setColumnWidth(9, currentWidthI * 1.5); // Столбец I (Цена клиента)
  
      // Добавляем пустую строку перед строкой с "Вид топлива"
      const lastRow = clientSheet.getLastRow();
      clientSheet.insertRowsAfter(lastRow, 1);
  
      // Добавляем заголовки для сводной информации
      const summaryHeaderRow = lastRow + 2;
      clientSheet.getRange(summaryHeaderRow, 1, 1, 9).setValues([['', '', '', '', '', 'Вид топлива', 'Сумма литров', 'Единица измерения', 'Сумма стоимости']]);
  
      // Оформляем заголовок сводной информации
      const summaryHeaderRange = clientSheet.getRange(summaryHeaderRow, 5, 1, 5);
      summaryHeaderRange.setFontWeight('bold'); // Жирный шрифт
      summaryHeaderRange.setFontColor('#FFFFFF'); // Белый текст
      summaryHeaderRange.setBackground('#6D9EEB'); // Голубой фон
      summaryHeaderRange.setBorder(true, true, true, true, true, true); // Границы
  
      let totalOverall = 0; // Общая сумма по всем видам топлива
  
      for (const fuelType in fuelSummary) {
        const totalQuantity = fuelSummary[fuelType].totalQuantity;
        const totalCost = fuelSummary[fuelType].totalCost;
  
        // Округляем суммы до двух знаков после запятой
        const roundedTotalQuantity = Math.round(totalQuantity * 100) / 100;
        const roundedTotalCost = Math.round(totalCost * 100) / 100;
  
        clientSheet.appendRow([
          '', '', '', '', '', // Пустые ячейки для первых пяти столбцов
          fuelType, // Вид топлива
          roundedTotalQuantity, // Сумма литров
          'Литры', // Единица измерения
          roundedTotalCost // Сумма стоимости
        ]);
        totalOverall += totalCost; // Добавляем к общей сумме
      }
  
      // Округляем итоговую сумму до двух знаков после запятой
      const roundedTotalOverall = Math.round(totalOverall * 100) / 100;
  
      // Добавляем строку с прочерками перед "ИТОГО"
      clientSheet.appendRow(['------', '------', '------', '------', '------', '------', '------', '------', '------']);
  
      // Добавляем итоговую сумму
      clientSheet.appendRow(['', '', '', '', '', '', '', 'ИТОГО', roundedTotalOverall]);
  
      // Выравниваем весь текст по центру
      const lastRowFinal = clientSheet.getLastRow();
      const lastColumn = clientSheet.getLastColumn();
      const dataRange = clientSheet.getRange(1, 1, lastRowFinal, lastColumn);
      dataRange.setHorizontalAlignment('center');
  
      // Оформление (с комментариями)
      applyStyling(clientSheet);
    }
  
    Logger.log('Отчеты успешно созданы!');
  }
  
  // Функция для создания карты клиентов и цен
  function createClientMap(clientData) {
    const clientMap = {
      names: {}, // Для хранения названий клиентов
      prices: {} // Для хранения цен на топливо
    };
  
    clientData.forEach((row, index) => {
      if (index === 0) return; // Пропускаем заголовок
      const comment = row[0].trim().toUpperCase(); // Комментарий, убираем пробелы и приводим к верхнему регистру
      const clientName = row[1].trim().toUpperCase(); // Название клиента, убираем пробелы и приводим к верхнему регистру
      const fuelType = row[2].trim().toUpperCase(); // Вид топлива, убираем пробелы и приводим к верхнему регистру
      const price = parseFloat(row[3]); // Цена
  
      // Сохраняем название клиента
      if (!clientMap.names[comment]) {
        clientMap.names[comment] = clientName;
      }
  
      // Сохраняем цены на топливо
      if (!clientMap.prices[clientName]) {
        clientMap.prices[clientName] = {};
      }
      clientMap.prices[clientName][fuelType] = price;
    });
  
    return clientMap;
  }
  
  // Функция для получения цены для клиента и вида топлива
  function getClientPrice(pricesMap, clientName, fuelType) {
    if (pricesMap[clientName] && pricesMap[clientName][fuelType] !== undefined) {
      return pricesMap[clientName][fuelType];
    }
    return null; // Если цена не найдена
  }
  
  // Функция для удаления всех листов, кроме указанных
  function deleteAllSheetsExcept(sheetsToKeep) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = ss.getSheets();
    sheets.forEach(sheet => {
      if (!sheetsToKeep.includes(sheet.getName())) {
        ss.deleteSheet(sheet);
      }
    });
    Logger.log('Все листы, кроме "' + sheetsToKeep.join(', ') + '", удалены.');
  }
  
  // Функция для оформления (с комментариями)
  function applyStyling(sheet) {
    const lastRow = sheet.getLastRow();
    const lastColumn = sheet.getLastColumn();
  
    // Оформление заголовков
    const headerRange = sheet.getRange(1, 1, 1, lastColumn);
    headerRange.setFontWeight('bold'); // Жирный шрифт
    headerRange.setFontColor('#FFFFFF'); // Белый текст
    headerRange.setBackground('#4A86E8'); // Синий фон
    headerRange.setBorder(true, true, true, true, true, true); // Границы
  
    // Оформление строки с "ИТОГО"
    const totalRange = sheet.getRange(lastRow, 1, 1, lastColumn);
    totalRange.setFontWeight('bold'); // Жирный шрифт
    totalRange.setFontColor('#FFFFFF'); // Белый текст
    totalRange.setBackground('#4A86E8'); // Синий фон
    totalRange.setBorder(true, true, true, true, true, true); // Границы
  
    // Оформление строки с прочерками
    const separatorRange = sheet.getRange(lastRow - 1, 1, 1, lastColumn);
    separatorRange.setFontWeight('normal'); // Обычный шрифт
    separatorRange.setFontColor('#000000'); // Черный текст
    separatorRange.setBackground('#FFFFFF'); // Белый фон
    separatorRange.setBorder(false, false, false, false, false, false); // Нет границ
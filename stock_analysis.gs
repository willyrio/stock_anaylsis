/**
 * Stock Analysis Google Apps Script
 * Creates and manages the Stock Picker tab for the trading system
 * Provides functionality to update technical indicators and signals
 *
 * @author Will
 * @version 1.0.0
 * @lastModified 2025-07-26
 */

/**
 * Creates the Stock Analysis tab in the Google Sheet
 */
function createStockAnalysisTab() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("Stock Picker") || spreadsheet.insertSheet("Stock Picker");
  
  try {
    // Set up headers
    var headers = ["Symbol", "Price", "RSI", "Stochastic", "ADX", "Volume", 
                  "IV", "IV Rank", "Delta", "Theta", "Signal", "Hedge Flag", "Last Updated"];
    
    sheet.getRange(1, 1, 1, headers.length).setValues([headers])
      .setBackground("#D3D3D3")
      .setFontWeight("bold");
    
    // Format columns
    sheet.getRange("B2:B100").setNumberFormat("$#,##0.00");  // Price
    sheet.getRange("C2:E100").setNumberFormat("0.00");       // RSI, Stochastic, ADX
    sheet.getRange("F2:F100").setNumberFormat("#,##0");      // Volume
    sheet.getRange("G2:G100").setNumberFormat("0.00%");      // IV
    sheet.getRange("H2:J100").setNumberFormat("0.00");       // IV Rank, Delta, Theta
    
    // Add conditional formatting for signals
    var rules = sheet.getConditionalFormatRules();
    
    // A+ signal - Green
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("A+")
      .setBackground("#00CC00")
      .setRanges([sheet.getRange("K2:K100")])
      .build());
    
    // B+ signal - Yellow
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("B+")
      .setBackground("#FFFF00")
      .setRanges([sheet.getRange("K2:K100")])
      .build());
    
    // PROTECTIVE_PUT - Yellow
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("PROTECTIVE_PUT")
      .setBackground("#FFFF00")
      .setRanges([sheet.getRange("L2:L100")])
      .build());
    
    sheet.setConditionalFormatRules(rules);
    
    // Freeze header row and autosize columns
    sheet.setFrozenRows(1);
    for (var i = 1; i <= headers.length; i++) {
      sheet.autoResizeColumn(i);
    }
    
    Logger.log("Created Stock Picker tab");
    return sheet;
  } catch (error) {
    Logger.log("Error creating Stock Picker tab: " + error.message);
    throw error;
  }
}

/**
 * Updates the Stock Picker tab with data from the Python backend
 */
function updateStockAnalysis() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("Stock Picker");
  
  if (!sheet) {
    sheet = createStockAnalysisTab();
  }
  
  var ui = SpreadsheetApp.getUi();
  
  // Show a loading message
  ui.alert('Updating Stock Analysis', 'Fetching stock data from APIs. This may take a moment...', ui.ButtonSet.OK);
  
  var url = "http://localhost:5000/update_stock_analysis";  // Local Python server endpoint
  var options = {
    method: "POST",
    muteHttpExceptions: true
  };
  
  try {
    var response = UrlFetchApp.fetch(url, options);
    var statusCode = response.getResponseCode();
    
    if (statusCode == 200) {
      Logger.log("Stock Analysis update successful: " + response.getContentText());
      
      // Update timestamp
      var now = new Date();
      var timestamp = Utilities.formatDate(now, Session.getScriptTimeZone(), "MM/dd/yyyy HH:mm:ss");
      sheet.getRange("M2").setValue("Last updated: " + timestamp);
      
      ui.alert('Success', 'Stock Analysis updated successfully. Check the Stock Picker tab for updates.', ui.ButtonSet.OK);
    } else {
      Logger.log("Stock Analysis update failed with status code: " + statusCode);
      ui.alert('Error', 'Failed to update Stock Analysis. Status code: ' + statusCode, ui.ButtonSet.OK);
    }
  } catch (e) {
    Logger.log("Error updating Stock Analysis: " + e.toString());
    ui.alert('Error', 'Error updating Stock Analysis: ' + e.toString(), ui.ButtonSet.OK);
  }
}
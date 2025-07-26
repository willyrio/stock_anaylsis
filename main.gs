/**
 * Stock Analysis System - Main Entry Point
 * Creates menu options for the Stock Picker functionality
 * 
 * @author Will
 * @version 1.0.0
 * @lastModified 2025-07-26
 */

/**
 * Creates a custom menu in Google Sheets when the spreadsheet is opened
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Stock Picker')
    .addItem('Create Stock Analysis Tab', 'createStockAnalysisTab')
    .addItem('Update Stock Analysis', 'updateStockAnalysis')
    .addToUi();
}
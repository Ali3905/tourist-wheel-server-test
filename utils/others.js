const fs = require('fs');
const path = require('path');

const formatDate = (mongoDate) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' };
  const formated = new Intl.DateTimeFormat('en-GB', options).format(mongoDate);
  return formated


};

function formatTime(mongoDate) {
  // Convert mongoDate to a Date object if it is not already one
  const date = new Date(mongoDate);

  // Check if the date is valid
  if (isNaN(date)) {
    throw new Error('Invalid date');
  }

  // Extract hours and minutes
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');

  // Determine AM or PM
  const ampm = hours >= 12 ? 'pm' : 'am';

  // Convert hours to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  // Combine the components into the desired format
  return `${hours}:${minutes} ${ampm}`;
}

// Example usage
try {
  const mongoDate = new Date(); // Example MongoDB date
} catch (error) {
  console.error(error.message);
}


// Create a logging function
const logRequest = (req) => {
  const logData = {
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    body: req.body,
    files: req.files,
    timestamp: new Date().toISOString()
  };

  const logString = JSON.stringify(logData, null, 2);
  const logFilePath = path.join(__dirname, '../upload_logs.txt');
  
  fs.appendFile(logFilePath, logString + '\n\n', (err) => {
    if (err) {
      console.error('Failed to write log:', err);
    }
  });
};
const logError = (err) => {
  const logData = {
    error: err.message,
    timestamp: new Date().toISOString()
  };

  const logString = JSON.stringify(logData, null, 2);
  const logFilePath = path.join(__dirname, '../upload_errors.txt');
  
  fs.appendFile(logFilePath, logString + '\n\n', (err) => {
    if (err) {
      console.error('Failed to write log:', err);
    }
  });
};


module.exports = {
  formatDate,
  formatTime,
  logRequest,
  logError
}
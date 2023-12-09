
const API_KEY = 'YOUR_API_KEY_HERE';
const SHEET_NAME = 'lifeList'; 


const getSpreadsheetId = async ()=> {
  
    // Check for existing spreadsheet
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets?q=title=${SHEET_NAME}&key=${API_KEY}`,
    );
    const data = await response.json();
  
    // Get spreadsheet ID if existing
    if (data.spreadsheets.length > 0) {
      return data.spreadsheets[0].spreadsheetId;
    }
  
    // Create new spreadsheet if not existing
    const createResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          properties: {
            title: SHEET_NAME,
          },
        }),
      },
    );
    const createData = await createResponse.json();
  
    // Return the newly created spreadsheet ID
    return createData.spreadsheetId;
  }

  async function authorizeUser() {
    try {
      const accessToken = await chrome.identity.getAuthToken({ interactive: true });
      if (!accessToken) {
        throw new Error('User not authorized.');
      }
      return accessToken;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  async function pushTodoInSpreadsheet(todoData) {
    const accessToken = await authorizeUser();
    const spreadsheetId = await getSpreadsheetId();
    
  
    // Build the API request URL
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${SHEET_NAME}:append?key=${API_KEY}&valueInputOption=USER_ENTERED`;
  
    // Prepare the body data
    const body = {
      values: [[
        todoData.createdAt,
        todoData.endTime,
        todoData.startTime,
        todoData.isDone ? 'true' : 'false',
        todoData.todo,
      ]],
    };
  
    // Send the request
    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then((response) => {
      if (response.ok) {
        console.log('Todo data successfully added to spreadsheet.');
      } else {
        console.error('Error adding data:', response.statusText);
      }
    }).catch((error) => {
      console.error('Unexpected error:', error);
    });
  }
  
  export default {pushTodoInSpreadsheet};
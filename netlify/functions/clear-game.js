const postgres = require('postgres');

exports.handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: 'Method Not Allowed' 
    };
  }

  try {
    const { sessionId } = JSON.parse(event.body);
    
    const sql = postgres(process.env.DATABASE_URL);
    
    await sql`
      DELETE FROM game_sessions 
      WHERE session_id = ${sessionId}
    `;
    
    await sql.end();
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Error clearing game:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};

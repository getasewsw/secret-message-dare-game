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
    const { gameState, sessionId } = JSON.parse(event.body);
    
    const sql = postgres(process.env.DATABASE_URL);
    
    // Create table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS game_sessions (
        session_id VARCHAR(100) PRIMARY KEY,
        current_card_index INTEGER DEFAULT 0,
        answers JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    
    // Upsert game data
    await sql`
      INSERT INTO game_sessions (session_id, current_card_index, answers, updated_at)
      VALUES (${sessionId}, ${gameState.currentCardIndex}, ${JSON.stringify(gameState.answers)}, NOW())
      ON CONFLICT (session_id)
      DO UPDATE SET 
        current_card_index = ${gameState.currentCardIndex},
        answers = ${JSON.stringify(gameState.answers)},
        updated_at = NOW()
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
    console.error('Error saving game:', error);
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

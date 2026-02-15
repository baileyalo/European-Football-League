/**
 * Netlify serverless function: fetch team by ID from Football Data API.
 * Returns team info including website (for "Visit website" link).
 */
exports.handler = async (event) => {
  const token =
    process.env.FOOTBALL_API_TOKEN ||
    process.env.REACT_APP_FOOTBALL_API_TOKEN;
  const apiBase =
    process.env.FOOTBALL_API_URL ||
    process.env.REACT_APP_FOOTBALL_API_URL ||
    'https://api.football-data.org/v4';

  if (!token) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error:
          'Server: Set FOOTBALL_API_TOKEN in Netlify → Site configuration → Environment variables, then redeploy.',
      }),
    };
  }

  const teamId = event.queryStringParameters?.id;

  if (!teamId) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Missing team id' }),
    };
  }

  const url = `${apiBase}/teams/${encodeURIComponent(teamId)}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Auth-Token': token,
        Accept: 'application/json',
      },
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    if (!res.ok) {
      const message =
        res.status === 403
          ? 'API access forbidden. Check your API token.'
          : res.status === 429
            ? 'API rate limit exceeded. Try again later.'
            : res.status === 404
              ? 'Team not found.'
              : data?.message || `HTTP ${res.status}`;
      return {
        statusCode: res.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: message }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: data.id,
        name: data.name,
        website: data.website || null,
      }),
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: err.message || 'Failed to fetch from Football Data API',
      }),
    };
  }
};

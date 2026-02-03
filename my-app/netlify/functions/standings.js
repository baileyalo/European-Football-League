/**
 * Netlify serverless function: proxy to Football Data API.
 * Keeps X-Auth-Token on the server (set FOOTBALL_API_TOKEN in Netlify env).
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
          'Server: Set FOOTBALL_API_TOKEN (or REACT_APP_FOOTBALL_API_TOKEN) in Netlify → Site configuration → Environment variables, then redeploy.',
      }),
    };
  }

  const leagueId = event.queryStringParameters?.leagueId;
  const season = event.queryStringParameters?.season;

  if (!leagueId || !season) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Missing leagueId or season' }),
    };
  }

  const url = `${apiBase}/competitions/${leagueId}/standings?season=${season}`;

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
              ? 'League or season not found.'
              : data?.message || `HTTP ${res.status}`;
      return {
        statusCode: res.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: message }),
      };
    }

    if (!data?.standings?.[0]?.table) {
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid data from API' }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
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

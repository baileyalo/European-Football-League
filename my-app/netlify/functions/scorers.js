/**
 * Netlify serverless function: fetch top scorers for a competition from Football Data API.
 * GET ?leagueId=PL&season=2026
 */
const { corsHeaders, preflight } = require('./cors');

exports.handler = async (event) => {
  const options = preflight(event);
  if (options) return options;

  const token = process.env.FOOTBALL_API_TOKEN || process.env.REACT_APP_FOOTBALL_API_TOKEN;
  const apiBase =
    process.env.FOOTBALL_API_URL ||
    process.env.REACT_APP_FOOTBALL_API_URL ||
    'https://api.football-data.org/v4';

  if (!token) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error:
          'Server: Set FOOTBALL_API_TOKEN in Netlify → Site configuration → Environment variables, then redeploy.',
      }),
    };
  }

  const leagueId = event.queryStringParameters?.leagueId;
  const season = event.queryStringParameters?.season;

  if (!leagueId || !season) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Missing leagueId or season' }),
    };
  }

  const url = `${apiBase}/competitions/${encodeURIComponent(leagueId)}/scorers?season=${encodeURIComponent(season)}`;

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
              ? 'Competition or season not found.'
              : data?.message || `HTTP ${res.status}`;
      return {
        statusCode: res.status,
        headers: corsHeaders,
        body: JSON.stringify({ error: message }),
      };
    }

    const scorers = Array.isArray(data?.scorers)
      ? data.scorers.map((s) => ({
          player: { name: s.player?.name || '' },
          team: { id: s.team?.id },
          goals: typeof s.goals === 'number' ? s.goals : 0,
        }))
      : [];

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ scorers }),
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: corsHeaders,
      body: JSON.stringify({
        error: err.message || 'Failed to fetch from Football Data API',
      }),
    };
  }
};

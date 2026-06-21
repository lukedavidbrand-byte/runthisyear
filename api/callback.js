export default async function handler(req, res) {
  const { code } = req.query;

  const tokenResponse = await fetch(
    "https://www.strava.com/oauth/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code,
        grant_type: "authorization_code"
      })
    }
  );

  const tokenData = await tokenResponse.json();

  const athleteResponse = await fetch(
    "https://www.strava.com/api/v3/athlete",
    {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`
      }
    }
  );

  const athlete = await athleteResponse.json();

  const statsResponse = await fetch(
    `https://www.strava.com/api/v3/athletes/${athlete.id}/stats`,
    {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`
      }
    }
  );

  const stats = await statsResponse.json();

  const yearlyKm = (
    stats.ytd_run_totals.distance / 1000
  ).toFixed(1);

  res.send(`
    <html>
      <head>
        <title>RunThisYear</title>
      </head>
      <body style="
        font-family:Arial,sans-serif;
        text-align:center;
        padding:40px;
      ">
        <h1>Your Year-To-Date Distance</h1>
        <h2>${yearlyKm} km</h2>

        <p>1000 km Challenge: ${((yearlyKm / 1000) * 100).toFixed(1)}%</p>
        <p>2026 km Challenge: ${((yearlyKm / 2026) * 100).toFixed(1)}%</p>

      </body>
    </html>
  `);
}

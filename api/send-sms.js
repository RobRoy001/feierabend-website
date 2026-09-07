export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, branche, adminHours, score } = req.body;

  const accountSid = "AC016d2f280dc4019441f2320655d8deb81";
  const authToken = "15fe5f90ff75ba80c9fe62be553150dc";
  const phoneFrom = "+4915888620339";
  const phoneTo = "+4915168417030";

  const message = `🔥 HEISS LEAD!
${name} | ${branche}
${adminHours}h/Woche | Score: ${score}

Dashboard: https://feierabend-website.vercel.app`;

  try {
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: phoneFrom,
          To: phoneTo,
          Body: message,
        }).toString(),
      }
    );

    const result = await response.json();
    
    if (response.ok) {
      return res.status(200).json({ success: true, sid: result.sid });
    } else {
      return res.status(response.status).json({ error: result.message });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

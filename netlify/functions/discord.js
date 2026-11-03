const GUILD_ID = "1563428054464995351";
const WIDGET_URL = `https://discord.com/api/guilds/${GUILD_ID}/widget.json`;
const FETCH_TIMEOUT_MS = 5000;

const JSON_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Content-Type": "application/json"
};

function jsonResponse(statusCode, body) {
  return { statusCode, headers: JSON_HEADERS, body: JSON.stringify(body) };
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: JSON_HEADERS, body: "" };
  }

  if (event.httpMethod !== "GET") {
    return jsonResponse(405, { error: "method not allowed" });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(WIDGET_URL, { signal: controller.signal });

    if (!res.ok) {
      return jsonResponse(res.status, { error: "widget unavailable" });
    }

    const data = await res.json();

    return jsonResponse(200, {
      name: data.name,
      presence_count: data.presence_count,
      instant_invite: data.instant_invite || null
    });
  } catch {
    return jsonResponse(502, { error: "fetch failed" });
  } finally {
    clearTimeout(timeout);
  }
};

const axios = require("axios");

const AMADEUS_API_KEY = process.env.AMADEUS_API_KEY;
const AMADEUS_API_SECRET = process.env.AMADEUS_API_SECRET;

let accessToken = null;

// 🔑 Get access token
async function getAccessToken() {
  const res = await axios.post(
    "https://test.api.amadeus.com/v1/security/oauth2/token",
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: AMADEUS_API_KEY,
      client_secret: AMADEUS_API_SECRET,
    })
  );

  accessToken = res.data.access_token;
}

// ✈️ Search flights
exports.searchFlights = async (from, to, date) => {
  if (!accessToken) {
    await getAccessToken();
  }

  const res = await axios.get(
    "https://test.api.amadeus.com/v2/shopping/flight-offers",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        originLocationCode: from,
        destinationLocationCode: to,
        departureDate: date,
        adults: 1,
        max: 10,
      },
    }
  );

  return res.data.data;
};
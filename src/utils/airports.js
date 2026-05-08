const cityToCode = {
  "new delhi": "DEL",
  "mumbai": "BOM",
  "bengaluru": "BLR",
  "chennai": "MAA",
  "kolkata": "CCU",
  "hyderabad": "HYD",
  "dubai": "DXB",
  "abu dhabi": "AUH",
  "doha": "DOH",
  "riyadh": "RUH",
  "london": "LHR",
  "paris": "CDG",
  "frankfurt": "FRA",
  "amsterdam": "AMS",
  "istanbul": "IST",
  "rome": "FCO",
  "new york": "JFK",
  "los angeles": "LAX",
  "chicago": "ORD",
  "toronto": "YYZ",
  "são paulo": "GRU",
  "singapore": "SIN",
  "hong kong": "HKG",
  "tokyo": "NRT",
  "sydney": "SYD"
};

// ✅ CREATE airportList (THIS FIXES YOUR CRASH)
const airportList = Object.entries(cityToCode).map(([city, code]) => ({
  code,
  label: city.toUpperCase()
}));

function resolveCode(input) {
  if (!input) return null;

  const key = input.toLowerCase().trim();
  return cityToCode[key] || input.toUpperCase();
}

module.exports = {
  resolveCode,
  cityToCode,
  airportList // 🔥 IMPORTANT
};
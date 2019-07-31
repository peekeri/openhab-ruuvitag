const ruuvi = require("Ruuvitag");

ruuvi.setEnvOn(true);

console.log(ruuvi.getEnvData());

function encodeTemperature(value) {
  const sign = (value < 0 ? 1 : 0) << 7;
  const intVal = Math.floor(Math.abs(value));
  const decimals = Math.abs(Math.round((value - Math.round(value)) * 100));
  return [sign | (intVal & 0x7F), decimals];
}

function encodePressure(hPaValue) {
  const paValue = hPaValue * 100;
  const v = Math.round(paValue - 50000);
  return [(v >> 8) & 0xFF, v & 0xFF];
}

function encodeHumidity(value) {
  const v = Math.round(value * 400);
  return [(v >> 8) & 0xFF, v & 0xFF];
}

function encodeBattery(value) {
  const mV = value * 1000;
  return [(mV >> 8) & 0xFF, mV & 0xFF];
}

setInterval(function() {
  const envData = ruuvi.getEnvData();
  const battery = NRF.getBattery();

  console.log(envData);
  console.log(battery);

  NRF.setAdvertising({
    0x1809: [encodeTemperature(envData.temp)],
    0x2A6D: [encodePressure(envData.pressure)],
    0x2A6F: [encodeHumidity(envData.humidity)],
    0xFFFE: [encodeBattery(battery)]
  });
}, 30000);

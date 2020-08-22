var noble = require('noble');
var mqtt = require('mqtt');

const addresses = [
  'f6:ab:f7:5b:ee:05',
  'da:90:88:94:4e:5b',
  'f8:5e:2d:d7:10:75'
];

function BufferReader(buf) {
  let offset = 0;

  return {
    readUInt8: function() {
      const result = buf.readUInt8(offset);
      offset += 1;
      return result;
    },
    readUInt16BE: function() {
      const result = buf.readUInt16BE(offset);
      offset += 2;
      return result;
    },
    readInt16BE: function() {
      const result = buf.readInt16BE(offset);
      offset += 2;
      return result;
    },
    advance: function(nBytes) {
      offset += nBytes;
    }
  };
}

function decodeManufacturerData(buf) {
  if (!buf) {
    return undefined;
  }
  const reader = BufferReader(buf);

  const ruuviInnovations = reader.readUInt16BE();
  if (ruuviInnovations != 0x9904) {
    return undefined;
  }

  const dataFormat = reader.readUInt8();
  if (dataFormat != 5) {
    return undefined;
  }

  const temperature = 0.005 * reader.readInt16BE();
  const humidity = 0.0025 * reader.readUInt16BE();
  const pressure = 50000 + reader.readUInt16BE();

  // skip over accelerator values
  reader.advance(6);

  const powerInfo = reader.readUInt16BE();
  const voltage = 1600 + (powerInfo >>> 5);
  const txPower = -40 + 2 * (powerInfo & 0b11111);

  return {
    'temp': temperature,                // in degrees Celcius
    'pressure': pressure / 100.0,       // in hPa
    'humidity': humidity,               // in percentage
    'battery_volts': voltage / 1000.0,  // in Volts
    'txpower': txPower                  // in dBm
  };
}

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    noble.startScanning([], true);
  } else {
    noble.stopScanning();
  }
});

let connected = false;
const client  = mqtt.connect('mqtt://localhost', { username: 'admin', password: 'admin' })
client.on('connect', function () {
  connected = true;
});

const states = {};

noble.on('discover', function(peripheral) {
  const addr = peripheral.address;
  const id = addr.split(':').join('');

  if (addresses.includes(addr)) {
    const manufacturerData = peripheral.advertisement.manufacturerData;
    const decodedData = decodeManufacturerData(manufacturerData);
    if (!decodedData) {
      return;
    }

    if (!Object.keys(states).includes(addr)) {
      states[addr] = {
      };
    }

    const now = Date.now();

    if (connected) {
      Object.keys(decodedData).forEach(key => {
        if (!states[addr][key] || now > states[addr][key]['next']) {
          console.log('Publishing to: ' + id +'/' + key + ' value: ' + decodedData[key].toString());
          client.publish(id +'/' + key, decodedData[key].toString());
          states[addr][key] = {
            data: decodedData[key],
            next: now + 60 * 1000
          };
        }
      });
    }
  }
});

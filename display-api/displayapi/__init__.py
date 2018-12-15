import dateutil
import flask
import influxdb
import json

app = flask.Flask(__name__)
client = influxdb.InfluxDBClient('localhost', 8086, '', '', 'openhab')

@app.route("/")
def hello():
    outside = client.query('select last(value) from ruuvi1_temp, ruuvi1_pressure, ruuvi1_humidity where time > now() - 10m')
    inside = client.query('select last(value) from ruuvi2_temp, ruuvi2_pressure, ruuvi2_humidity where time > now() - 10m')

    timestamp = dateutil.parser.parse(list(outside.get_points('ruuvi1_temp'))[0]['time'])
    outsideTemperature = list(outside.get_points('ruuvi1_temp'))[0]['last']
    outsideHumidity = list(outside.get_points('ruuvi1_humidity'))[0]['last']
    outsidePressure = list(outside.get_points('ruuvi1_pressure'))[0]['last']
    insideTemperature = list(inside.get_points('ruuvi2_temp'))[0]['last']
    insideHumidity = list(inside.get_points('ruuvi2_humidity'))[0]['last']
    insidePressure = list(inside.get_points('ruuvi2_pressure'))[0]['last']

    result = {
        'time': timestamp.strftime('%d.%m.%y %H:%M'),
        'outside-temperature': outsideTemperature,
        'outside-humidity': outsideHumidity,
        'outside-pressure': outsidePressure,
        'inside-temperature': insideTemperature,
        'inside-humidity': insideHumidity,
        'inside-pressure': insidePressure
    }

    return flask.Response(json.dumps(result, indent=2), mimetype='application/json')

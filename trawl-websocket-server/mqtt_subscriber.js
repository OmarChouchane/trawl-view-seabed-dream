const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://test.mosquitto.org'); // Working broker

client.on('connect', () => {
  console.log('✅ Connected to MQTT broker');
  client.subscribe('wokwi/sensor/temperature');
});

client.on('message', (topic, message) => {
  console.log(`🌡️ Received: ${message.toString()}°C`);
});
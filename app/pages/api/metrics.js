import client from 'prom-client';

const register = client.register;

// Kumpulkan default metrics Node.js (CPU, memory, event loop, dll.)
client.collectDefaultMetrics();

export default async function handler(req, res) {
  res.setHeader('Content-Type', register.contentType);
  const metrics = await register.metrics();
  res.status(200).send(metrics);
}

const express = require('express');
const fs = require('fs/promises');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data', 'submissions.json');
const PORT = process.env.PORT || 3000;

function createInitialStore() {
  return { contact: [], survey: [] };
}

async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch (error) {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(createInitialStore(), null, 2));
  }
}

async function readSubmissions() {
  await ensureDataFile();
  const content = await fs.readFile(DATA_FILE, 'utf8');
  return JSON.parse(content);
}

async function appendSubmission(type, payload) {
  const submissions = await readSubmissions();
  const record = { ...payload, submittedAt: new Date().toISOString() };
  submissions[type].push(record);
  await fs.writeFile(DATA_FILE, JSON.stringify(submissions, null, 2));
}

function createApp() {
  const app = express();
  app.use(express.json());
  app.use(express.static(__dirname));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/api/contact', async (req, res) => {
    const fullName = (req.body?.fullName || '').trim();
    const phone = (req.body?.phone || '').trim();

    if (!fullName || !phone) {
      return res.status(400).json({ error: 'Name and phone number are required.' });
    }

    await appendSubmission('contact', { fullName, phone });
    res.json({ success: true, message: 'Contact submission recorded.' });
  });

  app.post('/api/survey', async (req, res) => {
    const nameChoice = (req.body?.nameChoice || '').trim();
    const customName = (req.body?.customName || '').trim();
    const surveyName = (req.body?.surveyName || '').trim();
    const surveyPhone = (req.body?.surveyPhone || '').trim();

    if (!nameChoice && !customName) {
      return res.status(400).json({ error: 'Please choose a name or share your own idea.' });
    }

    await appendSubmission('survey', { nameChoice, customName, surveyName, surveyPhone });
    res.json({ success: true, message: 'Survey response recorded.' });
  });

  return app;
}

if (require.main === module) {
  createApp().listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

module.exports = { createApp };

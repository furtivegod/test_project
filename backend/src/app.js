require('dotenv').config();
const {downloadFileController} = require('./controllers/filesController');

const express = require('express');
const cors = require('cors');
const {syncGoogleDriveFiles} = require('./services/syncService');
const {syncSlackData} = require('./services/syncService');
const {getSlackChannels} = require('./controllers/slackController');
const {getMessagesForChannel} = require('./controllers/slackController');
const checkToken = require('./middleware/checkToken');
const app = express();
app.use(express.json());

// app.use(checkToken);

app.use(cors({
    exposedHeaders: ['Content-Disposition'] // Expose the 'Content-Disposition' header
}));

// Import routes
const authRoutes = require('./routes/auth');
const { getFiles } = require('./controllers/filesController');


syncGoogleDriveFiles();
syncSlackData();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/files', checkToken, getFiles);
app.post('/api/download', checkToken, downloadFileController);
app.get('/api/slack-channels', checkToken, getSlackChannels);
app.get('/api/slack-channels/:channelId', checkToken, getMessagesForChannel);

// Default route
app.get('/', (req, res) => res.json({ message: 'Enterprise Data Aggregator Backend 🚀' }));

app.listen(4000, () => console.log('Server running on port 4000'));

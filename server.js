const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const summarizer = require('./summarizer');
require('dotenv').config()
const app = express();

app.use(cors());
app.use(fileUpload());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const DocumentSchema = new mongoose.Schema({
    filename: String,
    content: String,
    summary: String,
});

const Document = mongoose.model('Document', DocumentSchema);

app.post('/upload', async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        let uploadedFile = req.files.document;
        let content = uploadedFile.data.toString('utf8');
        let summary = summarizer(content);

        let newDocument = new Document({
            filename: uploadedFile.name,
            content: content,
            summary: summary,
        });

        await newDocument.save();

        res.send({
            filename: uploadedFile.name,
            summary: summary,
        });
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

app.get('/documents', async (req, res) => {
    try {
        let documents = await Document.find();
        res.send(documents);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

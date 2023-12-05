const { AzureKeyCredential, DocumentAnalysisClient } = require("@azure/ai-form-recognizer");
const createQuestionsFromText = require('./AiCreateQuestionsFromText');
const azureConfig = require('../shared/azureConfig');
const Busboy = require('busboy');
const stream = require('stream');

module.exports = async function (context, req) {
    const processMultipart = new Promise((resolve, reject) => {
        const busboy = Busboy({ headers: req.headers });
        const fileChunks = [];

        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            file.on('data', (data) => {
                fileChunks.push(data);
            });
            file.on('end', () => {
                resolve({
                    fieldname,
                    file: Buffer.concat(fileChunks),
                    filename,
                    encoding,
                    mimetype
                });
            });
        });

        busboy.on('error', error => reject(error));
        busboy.on('finish', () => {
            // If no file was uploaded, resolve null
            resolve(null);
        });

        // Convert req.body to a Stream and pipe it to busboy
        const bufferStream = new stream.PassThrough();
        bufferStream.end(Buffer.from(req.body));
        bufferStream.pipe(busboy);
    });

    try {
        const fileResult = await processMultipart;

        if (!fileResult || !fileResult.file) {
            throw new Error("No file uploaded.");
        }

        const client = new DocumentAnalysisClient(azureConfig.endpoint, new AzureKeyCredential(azureConfig.key));

        // Start analysis with the content of the uploaded file
        const poller = await client.beginAnalyzeDocument("prebuilt-document", fileResult.file);
        const pages = await poller.pollUntilDone();

        if (!pages || pages.length === 0) {
            throw new Error("No pages found in the document.");
        }

        let extractedText = pages.content;
        

        if (!extractedText) {
            context.res = {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*', 
                },
                body: "No text found in the document."
            };
            return;
        }

        // Use the extracted text to create questions and answers
        const level = req.body.level || 'simple'; // Assuming the level is specified in the body
        const questionAnswerPairs = await createQuestionsFromText(extractedText, level);

        context.res = {
            body: questionAnswerPairs
        };

    } catch (error) {
        context.res = {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', 
            },
            body: `An error occurred: ${error.message}`
        };
    }
};

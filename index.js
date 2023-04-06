import express from "express";
import bodyParser from "body-parser";
import { ChatGPTAPI, ChatGPTUnofficialProxyAPI } from 'chatgpt'
const app = express();

// Cấu hình Body Parser
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/get', (req, res) => {
    res.send('Hello from GET API');
});

app.get('/', (req, res) => {
    res.send('Hello');
});

app.use((req, res) => {
    res.status(404).send('Not found');
});

app.get("/chatgpt/offical", async (req, res) => {
    let openAIToken = req.query.token;
    let text = req.query.text;
    if (!openAIToken) {
        res.status(400).send("Vui lòng nhập OpenAI Token để sử dụng chức năng này!");
        return;
    }
    if (!text) {
        res.status(400).send("Vui lòng nhập nội dung cần dịch!");
        return;
    }
    let language = req.query.lg ?? 'vi';
    let response = '';
    let question = '';
    switch (language) {
        case 'vi':
            question = `Hãy dịch "${text}" ra tiếng Việt`;
            break;
        case 'ja':
            question = `Hãy dịch "${text}" ra tiếng Nhật`;
            break;
        default:
            question = `Hãy dịch "${text}" ra tiếng Anh`;
            break;
    }
    try {
        response = await unOfficalChatGPT(openAIToken, question);
        res.send(response);
    } catch (error) {
        res.status(500).json(error);
    }
});

app.get("/chatgpt/unoffical", async (req, res) => {
    let openAIToken = req.query.token;
    let text = req.query.text;
    if (!openAIToken) {
        res.status(400).send("Vui lòng nhập OpenAI Token để sử dụng chức năng này!");
        return;
    }
    if (!text) {
        res.status(400).send("Vui lòng nhập nội dung cần dịch!");
        return;
    }
    let language = req.query.lg ?? 'vi';
    let response = '';
    let question = '';
    switch (language) {
        case 'vi':
            question = `Hãy dịch "${text}" ra tiếng Việt`;
            break;
        case 'ja':
            question = `Hãy dịch "${text}" ra tiếng Nhật`;
            break;
        default:
            question = `Hãy dịch "${text}" ra tiếng Anh`;
            break;
    }
    try {
        response = await unOfficalChatGPT(openAIToken, question);
        res.send(response);
    } catch (error) {
        res.status(500).json(error);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

async function officalChatGPT(token, question) {
    const api = new ChatGPTAPI({
        apiKey: token
    })
    const res = await api.sendMessage(question);
    return res.text;
}

async function unOfficalChatGPT(token, question) {
    const api = new ChatGPTUnofficialProxyAPI({
        accessToken: token,
        // apiReverseProxyUrl: 'https://api.pawan.krd/backend-api/conversatio'
        apiReverseProxyUrl: 'https://bypass.churchless.tech/api/conversation'
    })
    const res = await api.sendMessage(question);
    return res.text;
}
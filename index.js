import express from "express";
import bodyParser from "body-parser";
import { ChatGPTAPI, ChatGPTUnofficialProxyAPI } from 'chatgpt'
import ChatGPT from "chatgpt-io";
import { BingChat } from 'bing-chat'
const PORT = process.env.PORT || 3000;
const app = express();

// Cấu hình Body Parser
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/get', (req, res) => {
    res.send('Hello from GET API');
});

app.get('/', (req, res) => {
    res.send('Hello');
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
        res.status(400).send("Please enter the OpenAI Token to perform this function!");
        return;
    }
    if (!text) {
        res.status(400).send("Please enter the content to be translated!");
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
        console.log(error);
        res.status(500).json(error);
    }
});

app.get("/bing-ai", async (req, res) => {
    let bingCookie = req.query.token;
    let text = req.query.text;
    if (!bingCookie) {
        res.status(400).send("Please enter the bing-cookie to perform this function!");
        return;
    }
    if (!text) {
        res.status(400).send("Please enter the content to be translated!");
        return;
    }
    let language = req.query.lg ?? 'vi';
    let response = '';
    let question = '';
    switch (language) {
        case 'vi':
            question = `Dịch nội dung sau sang tiếng Việt: ${text}`;
            break;
        case 'ja':
            question = `Dịch nội dung sau sang tiếng Nhật: ${text}`;
            break;
        default:
            question = `Dịch nội dung sau sang tiếng Anh: ${text}`;
            break;
    }
    try {
        response = await unOfficalBingAI(bingCookie, question);
        res.send(response);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});


app.use((req, res) => {
    res.status(404).send('Not found');
});

app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});

async function officalChatGPT(token, question) {
    const api = new ChatGPTAPI({
        apiKey: token
    })
    const res = await api.sendMessage(question);
    return res.text;
}

async function unOfficalChatGPT(token, question) {
    let bot = new ChatGPT(token);
    return await bot.ask(question)
}

async function unOfficalBingAI(cookie, question) {
    const api = new BingChat({
        cookie: cookie,
    })
    const res = await api.sendMessage(question, {
        variant: 'Precise'
      });
    return res.text;
}
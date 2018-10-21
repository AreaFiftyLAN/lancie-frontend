import * as express from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';
import * as mustacheExpress from 'mustache-express';

const app = express();
const port = 8080;

const readFile = (util as any).promisify(fs.readFile);
const writeFile = (util as any).promisify(fs.writeFile);
const mkdir = (util as any).promisify(fs.mkdir);

app.engine('mustache', mustacheExpress(path.join(__dirname, 'partials'), '.mustache'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mustache');

app.use('/src', express.static(path.join(__dirname, '..', 'src')));
app.use('/node_modules', express.static(path.join(__dirname, '..', 'node_modules')));
app.use('/images', express.static(path.join(__dirname, '..', 'images')));
app.use('/data', express.static(path.join(__dirname, '..', 'data')));

const pages = ['homepage', 'tickets', 'my-area'];

async function generatePartials() {
    const partialsPath = path.join(__dirname, 'partials', 'pages');

    if (!fs.existsSync(partialsPath)) {
        await mkdir(partialsPath);
    }

    for (const page of pages) {
        const fileContent = await readFile(path.join(__dirname, '..', 'src', `lancie-${page}`, `lancie-${page}-template.js`), 'utf8');
        
        const trimmedContent = fileContent
                .split('\n')
                .slice(3, -1)
                .reduce((a, b) => `${a}\n${b}`);
        
        await writeFile(path.join(partialsPath, `${page}.mustache`), trimmedContent);
    }
}

generatePartials();

function render(res, selectedPage) {
    const filteredPages = pages
            .filter(page => page != selectedPage)
            .map(page => ({page}));
    
    res.render(selectedPage, {pages: filteredPages});
}

app.get('/', (_req, res) => {
    render(res, 'homepage');
});
app.get('/tickets', (_req, res) => {
    render(res, 'tickets');
});
app.get('/my-area', (_req, res) => {
    render(res, 'my-area');
})

app.listen(port, () => {
    console.log('Server started!');
});

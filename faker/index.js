

const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const portfinder = require('portfinder');

const app = new Koa();
const router = new Router();
app.use(bodyParser());
app.use(cors());

const shops = require('./shops');
const user = require('./app');

router.use('/shops', shops.routes());
router.use('/app', user.routes());

app.use(router.routes()).use(router.allowedMethods());

portfinder.getPort(
    {
        port: 4000,
        stopPort: 65535
    },
    (err, port) => {
        if (err) {
            return;
        }
        app.listen(port, 'localhost', (error, result) => {
            if (error) {
                // console.log(error);
            }
            // console.log('result', result);
            // console.log(`Listening at localhost:${port}`);
        });
    }
);

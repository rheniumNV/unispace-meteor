import fs from "fs";
import http from "http";
import path from "path";

import express from "express";
import { WebSocketServer } from "ws";

import {
  MirageXServer,
  MirageXServerConfig,
} from "@unispace-meteor/miragex/dist/server";
import { App } from "../core/main";

import { config } from "./config";

type RequestHandler = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void> | void;

const insuring =
  (handler: RequestHandler): RequestHandler =>
  async (req, res, next) =>
    handler(req, res, next)?.catch(next);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.json());

app.get(
  "/ping",
  insuring((_req, res) => {
    res.send("pong");
  }),
);

const mirageXConfig: MirageXServerConfig = {
  mirage: {
    url: config.mirage.url,
    port: config.mirage.port,
    serverId: config.mirage.serverId,
    apiPath: {
      info: "/info",
      output: "/output.brson",
      auth: "/auth/:connectionId",
      interactionEvent: "/events",
      websocket: "/ws",
    },
    eventCountSolver: (eventCount: number) =>
      ((eventCount - 500) / 100) * ((eventCount - 500) / 100) * 0.2 + 8,
  },
  main: {
    appCode: config.appCode,
    outputPath: path.resolve(__dirname, "../res/output.brson"),
    versionPath: path.resolve(__dirname, "../res/version.json"),
  },
  auth: {
    url: config.auth.url,
    defaultAuthenticationToken: config.auth.defaultAuthenticationToken,
  },
  platform: {
    api: { url: config.platform.api.url },
  },
};

const mirageX = new MirageXServer(App, mirageXConfig);
mirageX.route(app, wss);

if (process.env.NODE_ENV !== "production") {
  setInterval(() => {
    mirageX.reloadVersion();
  }, 1000);
}

// eslint-disable-next-line
// @ts-ignore
app.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

// handle server error
app.use(
  (
    err: express.ErrorRequestHandler,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err);
    res.status(500).send("error").send();
  },
);

// handle routing not found
app.use((req, res, _next) => {
  console.warn(`routing not found. method=${req.method} url=${req.path}`);
  res.status(404).send("NotFound").send();
});

// start server
server.listen(config.mirage.port, () => {
  console.info(`Server is listening on port ${mirageXConfig.mirage.port}`);
});

if (config.dev.performanceTest) {
  const events: string[] = [];
  setInterval(() => {
    console.info(
      `heapUsed ${
        Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100
      } MB / heapTotal ${
        Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100
      } MB / arrayBuffers ${
        (Math.round(process.memoryUsage().arrayBuffers / 1024 / 1024) * 100) /
        100
      } MB / rss ${
        (Math.round(process.memoryUsage().rss / 1024 / 1024) * 100) / 100
      } MB / external ${
        Math.round((process.memoryUsage().external / 1024 / 1024) * 100) / 100
      } MB / connections ${mirageX.info().connections}`,
    );
    events.push(
      `${Date.now()}, ${JSON.stringify(
        process.memoryUsage(),
      )}, ${JSON.stringify(mirageX.info())} `,
    );
    fs.writeFileSync(
      path.resolve(__dirname, "../../events.json"),
      JSON.stringify(events),
    );
  }, 2000);
  setInterval(() => {
    if (global.gc) {
      console.info("run gc");
      global.gc();
    } else {
      console.info("gc not found");
    }
  }, 60000);
}

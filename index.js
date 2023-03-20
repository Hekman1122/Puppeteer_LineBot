const express = require("express");
const app = express();
const line = require("@line/bot-sdk");
const scrap = require("./utilities/scrap");
const replyData = require("./utilities/reply_data");
const schedule = require("node-schedule");
require("dotenv").config();

const config = {
  channelAccessToken: process.env.LINE_BOT_TOKEN,
  channelSecret: process.env.LINE_BOT_SECRET,
  channelId: process.env.LINE_BOT_CHANNEL_ID,
};
const client = new line.Client(config);

app.post("/webhook", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent)).then((result) =>
    res.json(result)
  );
});

function handleEvent(event) {
  let obj_array;
  scrap()
    .then((res) => {
      obj_array = res;
    })
    .catch((e) => {
      console.error(e);
    });
  if (event.type === "message") {
    if (event.message.text.includes("暢銷")) {
      return client.replyMessage(
        event.replyToken,
        replyData(obj_array, "bestSeller", 10)
      );
    }
    if (
      event.message.text.includes("隨機") ||
      event.message.text.includes("推薦")
    ) {
      return client.replyMessage(
        event.replyToken,
        replyData(obj_array, "random", 10)
      );
    }
  }
}

function schedule_job() {
  let obj_array;
  scrap()
    .then((res) => {
      obj_array = res;
    })
    .catch((e) => {
      console.error(e);
    });
  const job = schedule.scheduleJob("00 00 18 * * *", async () => {
    try {
      const message = replyData(obj_array, "random", 10);
      await client.pushMessage(process.env.LINE_USER_ID, message);
      console.log(`${new Date().toLocaleString()} Send message successfully.`);
    } catch (error) {
      console.error(error);
    }
  });
  return job;
}

schedule_job(obj_array);

app.listen(process.env.PORT || 80, function () {
  console.log(`Server is listening on port ${process.env.PORT || 80}`);
});

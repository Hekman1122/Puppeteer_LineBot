function template(obj) {
  let tem = {
    type: "bubble",
    hero: {
      type: "image",
      url: `${obj.imgUrl}`,
      size: "lg",
      aspectRatio: "9:15",
      aspectMode: "cover",
      action: {
        type: "uri",
        uri: `${obj.imgUrl}`,
      },
    },
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: `${obj.title}`,
          weight: "bold",
          size: "md",
        },
        {
          type: "box",
          layout: "vertical",
          margin: "lg",
          spacing: "sm",
          contents: [
            {
              type: "box",
              layout: "baseline",
              margin: "sm",
              spacing: "xl",
              contents: [
                {
                  type: "text",
                  text: "售價 :",
                  color: "#999999",
                  size: "sm",
                  flex: 5,
                },
                {
                  type: "text",
                  text: `${obj.price}`,
                  color: "#111111",
                  size: "md",
                  flex: 5,
                },
              ],
            },
          ],
        },
      ],
    },
    footer: {
      type: "box",
      layout: "vertical",
      spacing: "sm",
      contents: [
        {
          type: "button",
          style: "link",
          height: "sm",
          action: {
            type: "uri",
            label: "查看完整資訊",
            uri: `${obj.productUrl}`,
          },
        },
        {
          type: "box",
          layout: "vertical",
          contents: [],
          margin: "sm",
        },
      ],
      flex: 0,
    },
  };
  return tem;
}
function randomPick() {
  let random_pick = [];
  while (random_pick.length < 10) {
    let num = Math.floor(Math.random() * 100);
    if (!random_pick.includes(num)) {
      random_pick.push(num);
    }
  }
  return random_pick;
}
function reply_data(obj_array, type, limit) {
  let reply_contents = [];
  if (type === "bestSeller") {
    obj_array.forEach((obj, index) => {
      if (index < limit) {
        reply_contents.push(template(obj));
      }
    });
  } else if (type === "random") {
    let random_pick = randomPick();
    random_pick.forEach((num) => {
      reply_contents.push(template(obj_array[num]));
    });
  }

  let reply_flex_message = {
    type: "flex",
    altText: "天瓏書局一週內的排行榜前10名推薦書!",
    contents: {
      type: "carousel",
      contents: reply_contents,
    },
  };
  return reply_flex_message;
}

module.exports = reply_data;

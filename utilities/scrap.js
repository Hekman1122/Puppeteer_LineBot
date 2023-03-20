const puppeteer = require("puppeteer");

const productCollector = async (page, arr) => {
  let result = [];
  for (p of arr) {
    try {
      let title = await page.evaluate((el) => {
        return el.querySelector("strong.title > a").textContent;
      }, p);
      let discount = await page.evaluate((el) => {
        return el.querySelector("a > span").textContent.trim().match(/\d+/g)[0]
          .length > 1
          ? el.querySelector("a > span").textContent.trim().match(/\d+/g)[0]
          : el.querySelector("a > span").textContent.trim().match(/\d+/g)[0] +
              "0";
      }, p);
      let ori_price = await page.evaluate((el) => {
        return el
          .querySelector("div.pricing >del")
          .textContent.trim()
          .replace("$", "");
      }, p);
      let imgUrl = await page.evaluate((el) => {
        return el.querySelector("a > img").getAttribute("src");
      }, p);
      let productUrl = await page.evaluate((el) => {
        return el.querySelector("a").getAttribute("href");
      }, p);
      let product = {
        title,
        price: Math.round(
          Number.parseInt(ori_price) * Number.parseInt(discount) * 0.01
        ),
        imgUrl,
        productUrl: "https://www.tenlong.com.tw/" + productUrl,
      };

      result.push(product);
    } catch (e) {
      console.log(e);
    }
  }
  return result;
};

async function scrap() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    "https://www.tenlong.com.tw/zh_tw/recent_bestselling?range=7",
    { waitUntil: "load" }
  );

  let total_result = [];
  let have_next_page = true;

  while (have_next_page) {
    await page.waitForSelector("div.list-wrapper > ul", {
      visible: true,
    });
    const productArray = await page.$$("div.list-wrapper > ul > li");
    const result = await productCollector(page, productArray);
    total_result = total_result.concat(result);

    await page.waitForSelector("div.pagination.pagination-footer", {
      visible: true,
    });
    const next_page_bun =
      (await page.$("div.pagination.pagination-footer > a.next_page")) !== null;

    if (next_page_bun && result.length > 0) {
      await page.click("div.pagination.pagination-footer > a.next_page");
    } else {
      have_next_page = next_page_bun;
    }
  }
  await browser.close();
  return total_result;
}

module.exports = scrap;

// 参考文档 https://livecodestream.dev/post/how-to-work-with-worker-threads-in-nodejs/
const express = require("express");
const fs = require("fs")
const sha1 = require("sha1");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

//微信订阅号的配置信息
let config = {
  wechat: {
    appID: "wx361b4c68549a86db",
    appsecret: "d53baa7a2e42131a99fae8fc60397392",
    //这里你得填写你自己设置的Token值
    token: "wechat",
  },
};

app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/check-signature", async function (req, res) {
  let token = config.wechat.token;
  let signature = req.query.signature;
  let timestamp = req.query.timestamp;
  let nonce = req.query.nonce;
  let echostr = req.query.echostr;
  let str = [token, timestamp, nonce].sort().join("");
  let sha1Str = sha1(str);
  fs.writeFileSync('./log.json', JSON.stringify({token, signature, timestamp, nonce, echostr}))
  console.log("params--", token, signature, timestamp, nonce, echostr);
  if (sha1Str === signature) {
    //将echostr返回给微信服务器
    res.send(echostr);
    // ctx.body = echostr;
  } else {
    res.send("wrong");
  }
});

const port = 9090;
app.listen(port, function () {
  console.log(`端口${port}监听中...`);
});

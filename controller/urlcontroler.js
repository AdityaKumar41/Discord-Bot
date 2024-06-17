const urlModel = require("../model/url");
const ShortUniqueId = require("short-unique-id");
const requestIp = require("request-ip");
async function handleUserUrl(req, res) {
  try {
    const uid = req.params.shortId;
    const clientIp = requestIp.getClientIp(req);
    const entry = await urlModel.findOneAndUpdate(
      { urlEncoded: uid },
      {
        $push: {
          visitHistory: { timestamp: Date.now(), Ipaddress: clientIp },
        },
      }
    );
    return res.redirect(entry.redirectUrl);
  } catch (e) {
    return;
  }
}

async function handleCreateUrl(req, res) {
  try {
    const body = req.body;
    console.log(body);
    if (!body.url) {
      return res.status(400).send({ status: "Url Required" });
    }
    const uid = new ShortUniqueId();
    const idgen = uid.rnd(12);
    const result = await urlModel.create({
      urlEncoded: idgen,
      redirectUrl: body.url,
      visitHistory: [],
    });
    const getUser = await urlModel.findOne({ urlEncoded: idgen });
    return res.status(200).json({ shortUrl: getUser });
  } catch (e) {
    return;
  }
}

async function handleHistory(req, res) {
  try {
    const uid = req.params.shortId;
    const result = await urlModel.findOne({ urlEncoded: uid });
    return res.json({
      totalclicks: result.visitHistory.length,
      analytics: result.visitHistory,
    });
  } catch (e) {
    return;
  }
}

module.exports = {
  handleUserUrl,
  handleCreateUrl,
  handleHistory,
};

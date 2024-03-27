const express = require("express");
const router = express.Router();
const { models } = require("../database");
const authenticateToken = require("../middlewares/authenticateToken");

router.post("/stream", authenticateToken, async (req, res) => {
  try {
    // Create new stream
    const stream = req.body;
    stream.userid = req.user.userId + "";
    const config = await models.GlobalConfig.findAll();
    const origin_address = config.find((row)=> row.get('key')==='origin_address').get('value')
    const origin_passphrase = config.find((row)=> row.get('key')==='origin_passphrase').get('value')
    const origin_keyLength = config.find((row)=> row.get('key')==='origin_keyLength').get('value')
    const edge_address = config.find((row)=> row.get('key')==='edge_address').get('value')
    const edge_passphrase = config.find((row)=> row.get('key')==='edge_passphrase').get('value')
    const edge_keyLength = config.find((row)=> row.get('key')==='edge_keyLength').get('value')
    console.log(origin_address)

    stream.streamerUrl = `srt://<ORIGIN_ADDRESS>?streamid=#!::r=${stream.streamResource},m=${stream.streamMode},t=stream&transtype=live&mode=caller&latency=1000&passphrase=<ORIGIN_PASSPHRASE>&pbkeylen=<ORIGIN_KEYLENGTH>`;
    stream.playerUrl = `srt://<EDGE_ADDRESS>?streamid=#!::u=<USERNAME_OF_PLAYER>,r=${stream.streamResource},m=request,t=stream,s=Session_ID&passphrase=<EDGE_PASSPHRASE>`;
    stream.ffplay = `ffplay -fflags nobuffer -i '${stream.playerUrl}'`;
    const newStream = await models.Stream.create(stream);
    const stream_resp = {
      streamerUrl: newStream.streamerUrl
          .replace('<ORIGIN_ADDRESS>', origin_address)
          .replace('<ORIGIN_PASSPHRASE>', origin_passphrase)
          .replace('<ORIGIN_KEYLENGTH>', origin_keyLength),
      playerUrl: newStream.playerUrl
          .replace('<EDGE_ADDRESS>', edge_address)
          .replace('<EDGE_PASSPHRASE>',edge_passphrase),
      ffplay: newStream.ffplay
          .replace('<EDGE_ADDRESS>', edge_address)
          .replace('<EDGE_PASSPHRASE>',edge_passphrase)
    };
    // Return the newly created stream object along with the SRT URL
    res.status(201).json({ data: stream_resp });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/stream", authenticateToken, async (req, res) => {
  try {
    const config = await models.GlobalConfig.findAll();
    const edge_address = config.find((row)=> row.get('key')==='edge_address').get('value')
    const edge_passphrase = config.find((row)=> row.get('key')==='edge_passphrase').get('value')
    const streams = await models.Stream.findAll();
    const streamsUpdated = streams.map((stream) => ({
      name: stream.streamTitle,
      playerUrl: stream.playerUrl
          .replace("<USERNAME_OF_PLAYER>", req.user.username)
          .replace('<EDGE_ADDRESS>', edge_address)
          .replace('<EDGE_PASSPHRASE>',edge_passphrase),
      ffplay: stream.ffplay
          .replace("<USERNAME_OF_PLAYER>", req.user.username)
          .replace('<EDGE_ADDRESS>', edge_address)
          .replace('<EDGE_PASSPHRASE>',edge_passphrase),
    }));

    res.status(200).json({ data: streamsUpdated });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/streams-of-streamer", authenticateToken, async (req, res) => {
  try {
    const config = await models.GlobalConfig.findAll();
    const origin_address = config.find((row)=> row.get('key')==='origin_address').get('value')
    const origin_passphrase = config.find((row)=> row.get('key')==='origin_passphrase').get('value')
    const origin_keyLength = config.find((row)=> row.get('key')==='origin_keyLength').get('value')
    const edge_address = config.find((row)=> row.get('key')==='edge_address').get('value')
    const edge_passphrase = config.find((row)=> row.get('key')==='edge_passphrase').get('value')
    const edge_keyLength = config.find((row)=> row.get('key')==='edge_keyLength').get('value')

    const streams = await models.Stream.findAll({
      where: {
        userId: req.user.userId
      }
    });
    const streamsUpdated = streams.map((stream) => ({
      name: stream.streamTitle,
      streamerUrl: stream.streamerUrl
          .replace('<ORIGIN_ADDRESS>', origin_address)
          .replace('<ORIGIN_PASSPHRASE>', origin_passphrase)
          .replace('<ORIGIN_KEYLENGTH>', origin_keyLength)
      ,
      playerUrl: stream.playerUrl
          .replace("<USERNAME_OF_PLAYER>", req.user.username)
          .replace('<EDGE_ADDRESS>', edge_address)
          .replace('<EDGE_PASSPHRASE>',edge_passphrase),
      ffplay: stream.ffplay
          .replace("<USERNAME_OF_PLAYER>", req.user.username)
          .replace('<EDGE_ADDRESS>', edge_address)
          .replace('<EDGE_PASSPHRASE>',edge_passphrase),
    }));

    res.status(200).json({ data: streamsUpdated });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/* usage example:
{
    "streamResource": "Stream1",
    "streamTitle": "Stream 1",
    "userId": "1",
    "streamMode": "publish",
    "streamerLocation": "SA",
}
*/

module.exports = router;

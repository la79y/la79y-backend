const express = require("express");
const router = express.Router();
const { models } = require("../database");
const authenticateToken = require("../middlewares/authenticateToken");

router.post("/stream", authenticateToken, async (req, res) => {
  try {
    // Create new stream
    const stream = req.body;
    stream.userid = req.user.userId + "";

    stream.streamerUrl = `srt://209.38.176.82:10080?streamid=#!::r=${stream.streamResource},m=${stream.streamMode},t=stream&transtype=live&mode=caller&latency=10000&passphrase=origin_pass1234&pbkeylen=16`;
    stream.playerUrl = `srt://164.90.241.38:10081?streamid=#!::u=USERNAME_OF_PLAYER,r=${stream.streamResource},m=request,t=stream,s=Session_ID&passphrase=edge_pass1234`;
    stream.ffplay = `ffplay -fflags nobuffer -i '${stream.playerUrl}'`;
    const newStream = await models.Stream.create(stream);

    // Return the newly created stream object along with the SRT URL
    res.status(201).json({ data: newStream });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/stream", authenticateToken, async (req, res) => {
  try {
    const streams = await models.Stream.findAll();
    const streamsUpdated = streams.map((stream) => ({
      name: stream.streamTitle,
      playerUrl: stream.playerUrl.replace(
        "USERNAME_OF_PLAYER",
        req.user.username
      ),
      ffplay: stream.ffplay.replace("USERNAME_OF_PLAYER", req.user.username),
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

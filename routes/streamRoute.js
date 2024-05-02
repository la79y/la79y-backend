const express = require("express");
const router = express.Router();
const { models } = require("../database");
const authenticateToken = require("../middlewares/authenticateToken");

router.post("/stream", authenticateToken, async (req, res) => {
  try {
    // Create new stream
    const stream = req.body;
    stream.userId = req.user.userId + "";
    const config = await models.GlobalConfig.findAll();
    const origin_address = config
      .find((row) => row.get("key") === "origin_address")
      .get("value");
    const origin_passphrase = config
      .find((row) => row.get("key") === "origin_passphrase")
      .get("value");
    const origin_keyLength = config
      .find((row) => row.get("key") === "origin_keyLength")
      .get("value");
    stream.streamerUrl = `srt://<ORIGIN_ADDRESS>?streamid=#!::u=<USERNAME_OF_STREAMER>,r=<STREAM_ID>,s=<SESSION_ID>,m=publish,t=stream&transtype=live&mode=caller&latency=1000&passphrase=<ORIGIN_PASSPHRASE>&pbkeylen=<ORIGIN_KEYLENGTH>`;
    stream.playerUrl = `srt://<EDGE_ADDRESS>?streamid=#!::u=<USERNAME_OF_PLAYER>,r=<STREAM_ID>,s=<SESSION_ID>,m=request,t=stream&passphrase=<EDGE_PASSPHRASE>&pbkeylen=<EDGE_KEYLENGTH>`;
    stream.ffplay = `ffplay -fflags nobuffer -err_detect ignore_err -i '${stream.playerUrl}'`;
    const newStream = await models.Stream.create(stream);
    const newSession = await models.Sessions.create({
      username: req.user.username,
      resource: `${newStream.id}`,
      used: false,
      is_streamer: true,
    });
    const stream_resp = {
      name: newStream.streamTitle,
      streamerUrl: newStream.streamerUrl
          .replace("<STREAM_ID>", newStream.id)
        .replace("<USERNAME_OF_STREAMER>", req.user.username)
        .replace("<SESSION_ID>", newSession.id)
        .replace("<ORIGIN_ADDRESS>", origin_address)
        .replace("<ORIGIN_PASSPHRASE>", origin_passphrase)
        .replace("<ORIGIN_KEYLENGTH>", origin_keyLength),
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
    const edge_address = config
      .find((row) => row.get("key") === "edge_address")
      .get("value");
    const edge_passphrase = config
      .find((row) => row.get("key") === "edge_passphrase")
      .get("value");
    const edge_keyLength = config
      .find((row) => row.get("key") === "edge_keyLength")
      .get("value");

    const streams = await models.Stream.findAll();
    const streamsUpdated = await Promise.all(
      streams.map(async (stream) => {
        const newSession = await models.Sessions.create({
          username: req.user.username,
          resource: `${stream.id}`,
          used: false,
        });
        return {
          name: stream.streamTitle,
          playerUrl: stream.playerUrl
              .replace("<STREAM_ID>", stream.id)
              .replace("<USERNAME_OF_PLAYER>", req.user.username)
            .replace("<SESSION_ID>", newSession.id)
            .replace("<EDGE_ADDRESS>", edge_address)
            .replace("<EDGE_PASSPHRASE>", edge_passphrase)
            .replace("<EDGE_KEYLENGTH>", edge_keyLength),
          ffplay: stream.ffplay
              .replace("<STREAM_ID>", stream.id)
              .replace("<USERNAME_OF_PLAYER>", req.user.username)
            .replace("<SESSION_ID>", newSession.id)
            .replace("<EDGE_ADDRESS>", edge_address)
            .replace("<EDGE_PASSPHRASE>", edge_passphrase)
            .replace("<EDGE_KEYLENGTH>", edge_keyLength),
          isStreaming: stream.isStreaming
        };
      })
    );

    res.status(200).json({ data: streamsUpdated });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/streams-of-streamer", authenticateToken, async (req, res) => {
  try {
    const config = await models.GlobalConfig.findAll();
    const origin_address = config
      .find((row) => row.get("key") === "origin_address")
      .get("value");
    const origin_passphrase = config
      .find((row) => row.get("key") === "origin_passphrase")
      .get("value");
    const origin_keyLength = config
      .find((row) => row.get("key") === "origin_keyLength")
      .get("value");

    const streams = await models.Stream.findAll({
      where: {
        userId: req.user.userId,
      },
    });
    const streamsUpdated = await Promise.all(
      streams.map(async (stream) => {
        const newSession = await models.Sessions.create({
          username: req.user.username,
          resource: `${stream.id}`,
          used: false,
          is_streamer: true,
        });
        return {
          name: stream.streamTitle,
          streamerUrl: stream.streamerUrl
              .replace("<STREAM_ID>", stream.id)
              .replace("<USERNAME_OF_STREAMER>", req.user.username)
            .replace("<SESSION_ID>", newSession.id)
            .replace("<ORIGIN_ADDRESS>", origin_address)
            .replace("<ORIGIN_PASSPHRASE>", origin_passphrase)
            .replace("<ORIGIN_KEYLENGTH>", origin_keyLength),
        };
      })
    );
    res.status(200).json({ data: streamsUpdated });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

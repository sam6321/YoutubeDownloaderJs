const ytdl = require("ytdl-core");
const sanitize = require("sanitize-filename");
const fs = require("fs");
const ffmpeg = require('fluent-ffmpeg');

// Open fs, read each line, download each line

async function download(video) {
    if(!ytdl.validateURL(video)) {
        console.log(`Invalid video: ${video}`);
        return;
    }

    const info = await ytdl.getInfo(video);

    console.log(`Downloading ${info.title}`);
    const stream = ytdl(video, {quality: 'highestaudio', filter: 'audioonly'});
    ffmpeg(stream)
        .audioBitrate(320)
        .save(`${sanitize(info.title)}.mp3`)
        .on('end', () => console.log(`Downloaded ${info.title}`));
}
const data = fs.readFileSync(fs.openSync("files.json", "r"));
for(const video of JSON.parse(data)) {
    void download(video);
}
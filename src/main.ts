const req = require("request");
const fs = require("fs-extra");
const program = require("commander");

program
  .version("1.0.5")
  .usage("[options] [sticker_id]")
  .option("-a, --animation", "With animation stickers (APNG)")
  .option("-g, --gif", "With animation stickers (GIF)")
  .option("-s, --sound", "With sound(animation) stickers sound (m4a)")
  .option(
    "-d --dir <dir>",
    "Specify the directory where you want to store the data"
  )
  .parse(process.argv);

const sticker_id = program.args;
const url = `http://dl.stickershop.line.naver.jp/products/0/0/1/${sticker_id}/iphone/productInfo.meta`;

req(url, (err: string, body) => {
  if (err !== null) {
    console.error("error:", err);
    return false;
  }

  //Extract the ID and name of the sticker
  const get_json = JSON.parse(body.body);
  const title_en: string = get_json.title["en"].replace(/ /g, "_");
  const stickers_obj: string[] = get_json.stickers;
  const stickers_id: string[] = [];
  for (let i = 0; i < stickers_obj.length; i++) {
    stickers_id[i] = stickers_obj[i]["id"];
  }

  //Creating a storage directory
  let png_dir: string;
  let _2x_png_dir: string;
  let key_png_dir: string;
  let _2x_key_png_dir: string;
  if (program.dir) {
    png_dir = `${program.dir}/${title_en}/png`;
    _2x_png_dir = `${program.dir}/${title_en}/@2x_png`;
    key_png_dir = `${program.dir}/${title_en}/key_png`;
    _2x_key_png_dir = `${program.dir}/${title_en}/@2x_key_png`;
  } else {
    png_dir = `./${title_en}/png`;
    _2x_png_dir = `./${title_en}/@2x_png`;
    key_png_dir = `./${title_en}/key_png`;
    _2x_key_png_dir = `./${title_en}/@2x_key_png`;
  }

  fs.mkdirs(png_dir, (err: string) => {
    if (err) return console.error(err);
  });
  fs.mkdirs(_2x_png_dir, (err: string) => {
    if (err) return console.error(err);
  });
  fs.mkdirs(key_png_dir, (err: string) => {
    if (err) return console.error(err);
  });
  fs.mkdirs(_2x_key_png_dir, (err: string) => {
    if (err) return console.error(err);
  });

  //Download the sticker from the extracted ID and save it
  for (let i = 0; i < stickers_id.length; i++) {
    const id: string = stickers_id[i];
    const png_url = `https://stickershop.line-scdn.net/stickershop/v1/sticker/${id}/iPhone/sticker.png`;
    const _2x_png_url = `https://stickershop.line-scdn.net/stickershop/v1/sticker/${id}/iPhone/sticker@2x.png`;
    const key_png_url = `https://stickershop.line-scdn.net/stickershop/v1/sticker/${id}/iPhone/sticker_key.png`;
    const _2x_key_png_url = `https://stickershop.line-scdn.net/stickershop/v1/sticker/${id}/iPhone/sticker_key@2x.png`;

    req(
      { method: "GET", url: png_url, encoding: null },
      (err: string, res, body) => {
        if (!err && res.statusCode === 200) {
          fs.writeFileSync(`${png_dir}/${id}.png`, body, "binary");
        }
      }
    );
    req(
      { method: "GET", url: _2x_png_url, encoding: null },
      (err: string, res, body) => {
        if (!err && res.statusCode === 200) {
          fs.writeFileSync(`${_2x_png_dir}/${id}@2x.png`, body, "binary");
        }
      }
    );
    req(
      { method: "GET", url: key_png_url, encoding: null },
      (err: string, res, body) => {
        if (!err && res.statusCode === 200) {
          fs.writeFileSync(`${key_png_dir}/${id}_key.png`, body, "binary");
        }
      }
    );
    req(
      { method: "GET", url: _2x_key_png_url, encoding: null },
      (err: string, res, body) => {
        if (!err && res.statusCode === 200) {
          fs.writeFileSync(
            `${_2x_key_png_dir}/${id}@2x_key.png`,
            body,
            "binary"
          );
        }
      }
    );
  }

  //For animation(apng)
  if (program.animation) {
    for (let i = 0; i < stickers_id.length; i++) {
      const id: string = stickers_id[i];

      let a_png_dir: string;
      let _2x_a_png_dir: string;
      if (program.dir) {
        a_png_dir = `${program.dir}/${title_en}/animation_png`;
        _2x_a_png_dir = `${program.dir}/${title_en}/@2x_animation_png`;
      } else {
        a_png_dir = `./${title_en}/animation_png`;
        _2x_a_png_dir = `./${title_en}/@2x_animation_png`;
      }

      const a_png_url = `https://stickershop.line-scdn.net/stickershop/v1/sticker/${id}/iPhone/sticker_animation.png`;
      const _2x_a_png_url = `https://stickershop.line-scdn.net/stickershop/v1/sticker/${id}/iPhone/sticker_animation@2x.png`;

      fs.mkdirs(a_png_dir, (err: string) => {
        if (err) return console.error(err);
      });
      fs.mkdirs(_2x_a_png_dir, (err: string) => {
        if (err) return console.error(err);
      });

      req(
        { method: "GET", url: a_png_url, encoding: null },
        (err: string, res, body) => {
          if (!err && res.statusCode === 200) {
            fs.writeFileSync(`${a_png_dir}/${id}.png`, body, "binary");
          }
        }
      );
      req(
        { method: "GET", url: _2x_a_png_url, encoding: null },
        (err: string, res, body) => {
          if (!err && res.statusCode === 200) {
            fs.writeFileSync(`${_2x_a_png_dir}/${id}@2x.png`, body, "binary");
          }
        }
      );
    }
  }

  //For animation(gif)
  if (program.gif) {
    for (let i = 0; i < stickers_id.length; i++) {
      const id: string = stickers_id[i];

      let gif_dir: string;
      let _2x_gif_dir: string;
      if (program.dir) {
        gif_dir = `${program.dir}/${title_en}/gif`;
        _2x_gif_dir = `${program.dir}/${title_en}/@2x_gif`;
      } else {
        gif_dir = `./${title_en}/gif`;
        _2x_gif_dir = `./${title_en}/@2x_gif`;
      }

      const gif_url = `https://stickershop.line-scdn.net/stickershop/v1/sticker/${id}/iPhone/sticker_animation.png`;
      const _2x_gif_url = `https://stickershop.line-scdn.net/stickershop/v1/sticker/${id}/iPhone/sticker_animation@2x.png`;

      fs.mkdirs(gif_dir, (err: string) => {
        if (err) return console.error(err);
      });
      fs.mkdirs(_2x_gif_dir, (err: string) => {
        if (err) return console.error(err);
      });

      req(
        { method: "GET", url: gif_url, encoding: null },
        (err: string, res, body) => {
          if (!err && res.statusCode === 200) {
            fs.writeFileSync(`${gif_dir}/${id}.gif`, body, "binary");
          }
        }
      );
      req(
        { method: "GET", url: _2x_gif_url, encoding: null },
        (err: string, res, body) => {
          if (!err && res.statusCode === 200) {
            fs.writeFileSync(`${_2x_gif_dir}/${id}@2x.gif`, body, "binary");
          }
        }
      );
    }
  }

  //For sound
  if (program.sound) {
    for (let i = 0; i < stickers_id.length; i++) {
      const id: string = stickers_id[i];

      let sound_dir: string;
      if (program.dir) {
        sound_dir = `${program.dir}/${title_en}/sound`;
      } else {
        sound_dir = `./${title_en}/sound`;
      }

      const sound_url = `https://stickershop.line-scdn.net/stickershop/v1/sticker/${id}/android/sticker_sound.m4a`;

      fs.mkdirs(sound_dir, (err: string) => {
        if (err) return console.error(err);
      });

      req(
        { method: "GET", url: sound_url, encoding: null },
        (err: string, res, body) => {
          if (!err && res.statusCode === 200) {
            fs.writeFileSync(`${sound_dir}/${id}.m4a`, body, "binary");
          }
        }
      );
    }
  }
});

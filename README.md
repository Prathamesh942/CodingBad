[![Buy Me a Coffee](https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=prathamesh94&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff)](https://www.buymeacoffee.com/prathamesh94)


# LeetLOL Meme Reactions

A lightweight Chrome extension that watches your LeetCode submissions and plays a meme video whenever a result comes back. Celebratory clip for accepted solutions, a different meme when things go sideways.

## Features

- Detects result messages in the LeetCode editor automatically.
- Shows a full-screen overlay with your chosen meme videos.
- Closes automatically when the clip ends or with a quick dismiss button.

## Installation

1. Add two MP4 files inside `assets/`:
   - `assets/success.mp4`: short meme for accepted solutions.
   - `assets/failure.mp4`: short meme for wrong answers or other errors.
2. Open `chrome://extensions` in Chrome (or Edge).
3. Toggle **Developer mode** on.
4. Click **Load unpacked** and select the `extension/` folder.
5. Submit on LeetCode and enjoy the memes.

## Customisation Tips

- Swap in any MP4 videos you like—keep clips short to avoid interruptions.
- Adjust overlay styling by editing `styles/content.css`.
- Tweak the result keyword lists in `scripts/content.js` if LeetCode changes their wording.

## Known Limitations

- Result detection relies on keywords; if LeetCode copies change, update the keyword arrays in `scripts/content.js`.
- Videos must be MP4 and small enough for instant playback.
- Only runs on the desktop website (`leetcode.com`).


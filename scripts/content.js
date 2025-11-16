(() => {

  const successKeywords = [/accepted/i, /beats \d+%/i, /success/i, /completed/i];
  const failureKeywords = [
    /wrong answer/i,
    /time limit exceeded/i,
    /runtime error/i,
    /compile error/i,
    /memory limit exceeded/i,
    /output limit exceeded/i,
    /internal error/i,
    /failed/i
  ];

  const minimumReplayDelayMs = 3000;
  let lastPlayback = {
    type: null,
    timestamp: 0
  };

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "characterData") {
        scanNode(mutation.target);
        continue;
      }
      mutation.addedNodes.forEach((node) => scanNode(node));
    }
  });

  function init() {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
    scanNode(document.body);
  }

  function scanNode(node) {
    if (!node) {
      return;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      handleText(node.textContent);
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      if (isHidden(node)) {
        return;
      }

      handleText(node.textContent);
      node.childNodes.forEach((child) => scanNode(child));
    }
  }

  function isHidden(element) {
    const style = window.getComputedStyle(element);
    return style.display === "none" || style.visibility === "hidden";
  }

  function handleText(rawText) {
    if (!rawText) {
      return;
    }

    const text = rawText.trim();
    if (!text) {
      return;
    }

    const resultType = detectResultType(text);
    if (!resultType) {
      return;
    }

    maybePlay(resultType, text);
  }

  function detectResultType(text) {
    if (matchesAny(text, successKeywords)) {
      return "success";
    }

    if (matchesAny(text, failureKeywords)) {
      return "failure";
    }

    return null;
  }

  function matchesAny(text, patterns) {
    return patterns.some((pattern) => pattern.test(text));
  }

  function maybePlay(type, sourceText) {
    const now = Date.now();
    if (lastPlayback.type === type && now - lastPlayback.timestamp < minimumReplayDelayMs) {
      return;
    }

    lastPlayback = {
      type,
      timestamp: now
    };

    playMeme(type, sourceText);
  }

  function playMeme(type) {
    if (location.pathname.includes("/description/")) {
      return;
    }
    removeOverlay();

    const overlay = document.createElement("div");
    overlay.id = "leetlol-meme-overlay";

    const video = document.createElement("video");
    video.className = "leetlol-meme-video";
    const videoNumber = Math.floor(Math.random() * 7) + 1;
    const videoPath = `assets/${type}${videoNumber}.mp4`;
    video.src = chrome.runtime.getURL(videoPath);
    video.controls = false;
    video.autoplay = true;
    video.playsInline = true;

    const controls = document.createElement("div");
    controls.className = "leetlol-meme-controls";

    const closeButton = document.createElement("button");
    closeButton.className = "leetlol-meme-close";
    closeButton.type = "button";
    closeButton.textContent = "×";

    closeButton.addEventListener("click", removeOverlay);
    video.addEventListener("ended", removeOverlay);
    video.addEventListener("error", (e) => {
      console.warn(`[LeetLOL] Unable to play meme video: ${videoPath}`, e);
      console.warn(`[LeetLOL] Make sure the file is listed in manifest.json web_accessible_resources`);
      removeOverlay();
    });

    controls.appendChild(closeButton);
    overlay.appendChild(controls);
    overlay.appendChild(video);
    document.documentElement.appendChild(overlay);
  }

  function removeOverlay() {
    const overlay = document.getElementById("leetlol-meme-overlay");
    if (overlay) {
      overlay.remove();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();


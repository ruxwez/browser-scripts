// ==UserScript==
// @name         GitHub DeepWiki Button
// @namespace    https://deepwiki.com
// @version      1.6
// @description  Añade un botón para abrir el repositorio en DeepWiki
// @author       Ruxwez
// @match        https://github.com/*
// @grant        none
// @run-at       document-idle
// @updateURL    https://github.com/ruxwez/browser-scripts/raw/refs/heads/main/github-deepwiki-button.user.js
// @downloadURL  https://github.com/ruxwez/browser-scripts/raw/refs/heads/main/github-deepwiki-button.user.js
// ==/UserScript==

(function () {
  "use strict";

  const BUTTON_ID = "deepwiki-btn-link";
  const REPO_RE = /^\/[^/]+\/[^/]+/;
  const REPO_MARKERS = [
    ".pagehead-actions",
    '[data-pjax="#repo-content-pjax-container"]',
    "#repo-content-pjax-container",
    'a[data-analytics-event*="code"]',
    "get-repo",
    ".file-navigation",
    ".UnderlineNav",
  ];

  function isRepoPage() {
    if (!REPO_RE.test(window.location.pathname)) return false;
    return REPO_MARKERS.some((s) => document.querySelector(s));
  }

  function getOwnerRepo() {
    const p = window.location.pathname.split("/").filter(Boolean);
    if (p.length < 2) return null;
    return p[0] + "/" + p[1];
  }

  function createButton() {
    if (document.getElementById(BUTTON_ID)) return;
    if (!isRepoPage()) return;
    const ownerRepo = getOwnerRepo();
    if (!ownerRepo) return;
    const container = document.querySelector(".pagehead-actions");
    if (!container) return;
    const li = document.createElement("li");
    li.className = "list-style-none";
    li.id = BUTTON_ID;
    const a = document.createElement("a");
    a.className = "btn-sm btn BtnGroup-item";
    a.href = "https://deepwiki.com/" + ownerRepo;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = "DeepWiki";
    li.appendChild(a);
    container.insertBefore(li, container.firstChild);
  }

  function init() {
    createButton();
  }

  document.addEventListener("DOMContentLoaded", init);
  document.addEventListener("pjax:end", init);
  document.addEventListener("turbo:render", init);

  new MutationObserver(() => {
    if (!document.getElementById(BUTTON_ID)) createButton();
  }).observe(document.body, { childList: true, subtree: true });

  init();
})();

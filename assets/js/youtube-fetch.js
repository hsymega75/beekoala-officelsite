/* youtube-fetch.js — microCMS YouTube連携 */

var MICROCMS_SERVICE_DOMAIN = 'beekoala2026';
var MICROCMS_API_KEY        = 'P6acQVizCraf7tzqEWMqblsswt09vvk5uVoR';
var MICROCMS_YT_ENDPOINT    = 'youtube';

async function fetchYouTubeList() {
  var url = 'https://' + MICROCMS_SERVICE_DOMAIN + '.microcms.io/api/v1/'
    + MICROCMS_YT_ENDPOINT + '?limit=100';
  var res = await fetch(url, {
    headers: { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY }
  });
  if (!res.ok) throw new Error('microCMS fetch failed: ' + res.status);
  return res.json();
}

/* 各種YouTube URL形式から動画IDを抽出 */
function extractVideoId(rawUrl) {
  if (!rawUrl) return null;
  var patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,          /* watch?v=XXXX */
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,      /* youtu.be/XXXX */
    /\/embed\/([a-zA-Z0-9_-]{11})/,        /* /embed/XXXX */
    /\/shorts\/([a-zA-Z0-9_-]{11})/        /* /shorts/XXXX */
  ];
  for (var i = 0; i < patterns.length; i++) {
    var m = String(rawUrl).match(patterns[i]);
    if (m) return m[1];
  }
  return null;
}

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderYouTubeCards(items) {
  var el = document.getElementById('youtube-list');
  if (!el) return;

  if (!items.length) {
    el.innerHTML = '<p class="live-empty">動画はまだありません。</p>';
    return;
  }

  el.innerHTML = items.map(function(item, i) {
    var vid = extractVideoId(item.url);
    var mediaHtml = vid
      ? '<div class="video-wrapper">'
          + '<iframe src="https://www.youtube.com/embed/' + esc(vid) + '"'
          + ' title="' + esc(item.title) + '"'
          + ' frameborder="0" allowfullscreen></iframe>'
          + '</div>'
      : '<div class="video-wrapper video-error">動画URLを認識できません</div>';

    return '<div class="disco-card">'
      + '<div class="disco-num">Track ' + String(i + 1).padStart(2, '0') + '</div>'
      + '<div class="disco-title">' + esc(item.title) + '</div>'
      + mediaHtml
      + '</div>';
  }).join('');
}

async function initYouTubeFetch() {
  var el = document.getElementById('youtube-list');
  if (!el) return;

  el.innerHTML = '<p class="live-loading">読み込み中...</p>';

  try {
    var data  = await fetchYouTubeList();
    var items = (data && data.contents) ? data.contents : [];
    renderYouTubeCards(items);
  } catch (err) {
    console.error('[youtube-fetch]', err);
    if (el) el.innerHTML = '<p class="live-error">YouTube情報の取得に失敗しました。</p>';
  }
}

document.addEventListener('DOMContentLoaded', initYouTubeFetch);

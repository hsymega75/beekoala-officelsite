/* live-fetch.js — microCMS ライブ情報連携 */

var MICROCMS_SERVICE_DOMAIN = 'beekoala2026';
var MICROCMS_API_KEY = 'P6acQVizCraf7tzqEWMqblsswt09vvk5uVoR';
var MICROCMS_ENDPOINT = 'live';

/* microCMS から全件取得（最大100件、日付降順） */
async function fetchLiveInfo() {
  var url = 'https://' + MICROCMS_SERVICE_DOMAIN + '.microcms.io/api/v1/'
    + MICROCMS_ENDPOINT + '?limit=100&orders=-date';
  var res = await fetch(url, {
    headers: { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY }
  });
  if (!res.ok) throw new Error('microCMS fetch failed: ' + res.status);
  return res.json();
}

/* Date値 → ローカル YYYY-MM-DD 文字列（当日判定用） */
function toLocalDateKey(dateVal) {
  var d = new Date(dateVal);
  var y = d.getFullYear();
  var m = String(d.getMonth() + 1).padStart(2, '0');
  var day = String(d.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + day;
}

/* Date値 → 表示用 YYYY.MM.DD */
function toDisplayDate(dateVal) {
  return toLocalDateKey(dateVal).replace(/-/g, '.');
}

/* 今日の YYYY-MM-DD */
function todayKey() {
  return toLocalDateKey(new Date());
}

/* ─── Upcoming: 今日以降 ─── */
function renderUpcoming(events) {
  var el = document.getElementById('upcoming-list');
  if (!el) return;

  if (!events.length) {
    el.innerHTML = '<p class="live-empty">No live scheduled.</p>';
    return;
  }

  el.innerHTML = events.map(function(ev) {
    var imgHtml = ev.image && ev.image.url
      ? '<div class="event-img"><img src="' + ev.image.url + '" alt="' + esc(ev.title) + '"></div>'
      : '';
    var castHtml = ev.cast
      ? '<div class="event-cast"><span class="event-cast-label">Cast</span>'
        + '<p>' + esc(ev.cast).replace(/\n/g, '<br>') + '</p></div>'
      : '';
    var contactHtml = ev.contact
      ? '<div class="event-contact">' + esc(ev.contact) + '</div>'
      : '';
    var priceHtml = ev.price
      ? '<div class="event-price">' + esc(ev.price) + '</div>'
      : '';
    var timeHtml = ev.time
      ? '<div class="event-time">' + esc(ev.time) + '</div>'
      : '';

    return '<div class="event-card">'
      + imgHtml
      + '<div class="event-date">' + toDisplayDate(ev.date) + '</div>'
      + '<div class="event-title">' + esc(ev.title) + '</div>'
      + '<div class="event-venue">' + esc(ev.venue) + '</div>'
      + timeHtml
      + priceHtml
      + contactHtml
      + castHtml
      + '</div>';
  }).join('');
}

/* ─── Archive: 今日より前 ─── */
function renderArchive(events) {
  var el = document.getElementById('archive-list');
  if (!el) return;

  if (!events.length) {
    el.innerHTML = '<p class="live-empty">No archive yet.</p>';
    return;
  }

  el.innerHTML = events.map(function(ev) {
    var imgHtml = ev.image && ev.image.url
      ? '<div class="archive-img"><img src="' + ev.image.url + '" alt="' + esc(ev.title) + '"></div>'
      : '';
    var castHtml = ev.cast
      ? '<p class="archive-quote">' + esc(ev.cast).replace(/\n/g, '<br>') + '</p>'
      : '';

    return '<div class="archive-card">'
      + imgHtml
      + '<div class="archive-info">'
      + '<div class="archive-date">' + toDisplayDate(ev.date) + '</div>'
      + '<div class="archive-title">' + esc(ev.title) + '</div>'
      + (ev.venue ? '<div class="archive-venue">' + esc(ev.venue) + '</div>' : '')
      + castHtml
      + '</div>'
      + '</div>';
  }).join('');
}

/* XSS 対策の簡易エスケープ */
function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ─── メイン ─── */
async function renderLiveList() {
  var upEl = document.getElementById('upcoming-list');
  var arEl = document.getElementById('archive-list');

  /* ローディング表示 */
  if (upEl) upEl.innerHTML = '<p class="live-loading">読み込み中...</p>';
  if (arEl) arEl.innerHTML = '<p class="live-loading">読み込み中...</p>';

  try {
    var data = await fetchLiveInfo();
    var all = (data && data.contents) ? data.contents : [];
    var today = todayKey();

    var upcoming = all.filter(function(ev) { return ev.date && toLocalDateKey(ev.date) >= today; });
    var archive  = all.filter(function(ev) { return ev.date && toLocalDateKey(ev.date) < today; });

    /* upcoming は日付昇順（近い順）、archive は日付降順（新しい順）に並べ直す */
    upcoming.sort(function(a, b) { return toLocalDateKey(a.date) > toLocalDateKey(b.date) ? 1 : -1; });
    archive.sort(function(a, b)  { return toLocalDateKey(a.date) < toLocalDateKey(b.date) ? 1 : -1; });

    renderUpcoming(upcoming);
    renderArchive(archive);
  } catch (err) {
    console.error('[live-fetch]', err);
    if (upEl) upEl.innerHTML = '<p class="live-error">ライブ情報の取得に失敗しました。</p>';
    if (arEl) arEl.innerHTML = '<p class="live-error">ライブ情報の取得に失敗しました。</p>';
  }
}

document.addEventListener('DOMContentLoaded', renderLiveList);

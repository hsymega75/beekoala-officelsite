/* live-fetch.js — microCMS 導入準備用スタブ */

var MICROCMS_SERVICE_DOMAIN = 'YOUR_SERVICE_DOMAIN';
var MICROCMS_API_KEY = 'YOUR_API_KEY';

/**
 * microCMS からライブ情報を取得する（将来実装）
 * 現在はダミーデータを返す
 */
async function fetchLiveInfo() {
  /* --- 本番実装時はコメントアウトを外す ---
  const res = await fetch(
    `https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/lives?limit=10`,
    { headers: { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY } }
  );
  if (!res.ok) throw new Error('microCMS fetch failed: ' + res.status);
  return await res.json();
  */

  // ダミーデータ
  return {
    contents: [
      {
        id: 'dummy-001',
        date: '2026.07.18',
        title: 'ライブタイトル入力',
        venue: 'LIVE HOUSE DRUM Be-1／福岡市中央区大名',
        openTime: 'OPEN 17:00',
        startTime: 'START 18:00',
        priceAdv: '¥2,500',
        priceDay: '¥3,000',
        ticketUrl: '#',
        type: 'upcoming'
      }
    ]
  };
}

/**
 * ライブ情報を DOM に流し込む
 * #live-list コンテナが存在する場合に実行
 */
async function renderLiveList() {
  var container = document.getElementById('live-list');
  if (!container) return;

  try {
    var data = await fetchLiveInfo();
    var upcoming = data.contents.filter(function(e) { return e.type === 'upcoming'; });
    if (upcoming.length === 0) {
      container.innerHTML = '<p class="live-empty">現在、予定されているライブはありません。</p>';
      return;
    }
    container.innerHTML = upcoming.map(function(ev) {
      return '<div class="event-item">'
        + '<div class="event-date">' + ev.date + '</div>'
        + '<div class="event-title">' + ev.title + '</div>'
        + '<div class="event-venue">' + ev.venue + '</div>'
        + '<div class="event-time">' + ev.openTime + ' / ' + ev.startTime + '</div>'
        + '<div class="event-price">前売 ' + ev.priceAdv + ' / 当日 ' + ev.priceDay + '（＋1drink）</div>'
        + '<a class="btn-ticket" href="' + ev.ticketUrl + '">チケット購入</a>'
        + '</div>';
    }).join('');
  } catch (err) {
    container.innerHTML = '<p class="live-error">ライブ情報の取得に失敗しました。</p>';
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', renderLiveList);

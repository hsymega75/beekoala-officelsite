# index.html を新モックアップベースに刷新

## 背景・目的

`beekoala_web_site_mockup.html` として新しいUIモックアップ（パンクロック/ストリート系デザイン、Tailwind CSS）を作成した。これを正式な `index.html` として採用し、旧デザイン案（V1/V2/V3の各サンプル群）は不要になるため削除する。

新モックアップは全セクションがプレースホルダー内容（架空のバンド名・メンバー・コピー）のため、旧`samples/v3/`に実装済みだった実データ（実際のバンドストーリー、実メンバー情報、microCMS動的連携）を、新モックアップのUI/デザインに移植する。

## ファイル構成の変更

### 上書き・統合
- `index.html` を `beekoala_web_site_mockup.html` の内容ベースで全面書き換え（実データ・動的連携込み）
- `beekoala_web_site_mockup.html` は内容が `index.html` に統合されるため削除

### 削除（不要になった旧デザイン一式）
- ルート: `sample1.html` 〜 `sample5.html`
- `samples/` ディレクトリ全体（`v1/`, `v2/`, `v3/`）
- `assets/css/v2-base.css`, `assets/css/v2-sample1.css` 〜 `v2-sample5.css`（v2サンプル専用、他から未参照）
- `assets/js/main.js`（v2サンプル専用のハンバーガー/スクロールリビール処理。新index.htmlは自己完結スクリプトを持つため不要）

### 保持・再利用
- `assets/js/live-fetch.js`, `assets/js/youtube-fetch.js` — そのまま再利用。`<script>` の参照パスを `./assets/js/...`（ルート基準）に変更
- `images/*`（`top-band.jpg`, `member1.jpg`〜`member5.jpg`, `logo.png` 等）

## セクション別の内容移植

### Hero
- 画像: `https://placehold.co/...` → `./images/top-band.jpg`
- バッジ文言「YOUTH PUNK NEVER DIES」→「20年ぶりの再始動」
- サブコピー「JAPANESE PUNK ROCK BAND FROM SOMEWHERE IN ASIA」→「福岡発 青春パンクバンド」+「20年の空白を越えて、あの頃の衝動が今また動き出す。」
- レイアウト・見出しタイポグラフィ（BEE KOALA の巨大文字組）は変更しない

### Philosophy → About（バンドについて）
- セクションの箱組み・見出しデザインはそのまま維持
- 本文を実話に差し替え:
  - 約20年前、学生時代に「Beep」としてバンド活動を開始。タカ、ヒガ、ゴー、ノムさん。
  - 卒業・就職を経てバンドは解散。
  - タカの「またバンドやろうや」の一言で再結成を決意。
  - 新たな仲間・タダちゃんが加わり、ビーコアラとして再始動。
  - 20年間眠り続けた名曲達が、福岡の地で復活する。

### Media → Discography（動的microCMS連携）
- 現状の静的YouTube1本カード＋TikTok静的カードの2カラム構成のうち、YouTube側を動的描画に置き換える
- `<div id="youtube-list"></div>` コンテナを設置し、`youtube-fetch.js` が `.disco-card` / `.disco-num` / `.disco-title` / `.video-wrapper` / `.video-error` / `.live-loading` / `.live-empty` / `.live-error` クラスでHTMLを生成する仕様はそのまま踏襲
- これらのクラスに対して、モックアップの世界観（ソリッドシャドウ、punk-greenアクセント、border-4 border-punk-black）に合わせた新規CSSを `<style>` 内に追加
- TikTokカードは実リンク `https://www.tiktok.com/@user3920562792656` に差し替えて静的カードのまま維持

### Members（メンバー）
- レイアウト構造（Vo.2名を大きく横並び＋Gt/Ba/Drを3カラム）はそのまま活かす
- 実メンバーに置換:

| 表示位置 | 名前 | パート | 画像 | 一言紹介 |
|---|---|---|---|---|
| 大カード1 | タカ | vo. | `member1.jpg` | 巻き肩のロングヘアー |
| 大カード2 | ヒガ | vo. | `member2.jpg` | 小さなオシャレ番長 |
| 3カラム1 | ノムさん | gt. | `member3.jpg` | ヒゲのサウンドメーカー |
| 3カラム2 | ゴー | ba. | `member4.jpg` | 野球を愛するカメラマン |
| 3カラム3 | タダちゃん | dr. | `member5.jpg` | 機材オタクのアレンジャー |

### Live（ライブ情報）
- 現行の「NEXT GIGS」単一リストを、Upcoming（今後）/ Archive（過去）の2カラム構成に再構成
- `<div id="upcoming-list"></div>` と `<div id="archive-list"></div>` を設置し、`live-fetch.js` が生成する下記クラスに対応するCSSを新規追加:
  - Upcoming側: `.event-card`, `.event-img`, `.event-date`, `.event-title`, `.event-venue`, `.event-time`, `.event-price`, `.event-contact`, `.event-cast`, `.event-cast-label`
  - Archive側: `.archive-card`, `.archive-img`, `.archive-info`, `.archive-date`, `.archive-title`, `.archive-venue`, `.archive-quote`
  - 共通: `.live-loading`, `.live-empty`, `.live-error`
- デザインはモックアップのソリッドシャドウ・パンクブラック/グリーン配色を踏襲

### Footer・ナビ
- TikTokアイコンのリンク先を実URL `https://www.tiktok.com/@user3920562792656` に更新
- Instagram / X（Twitter） / YouTube は現時点で確定URLがないため `#` のまま維持
- **バグ修正**: モバイル用ハンバーガーメニューボタンは現状クリックしても何も起こらない（JS未実装）。開閉するモバイルナビドロップダウンを実装する

## 技術メモ

- `live-fetch.js` / `youtube-fetch.js` は変更しない。両ファイルとも生成するHTMLのクラス名が固定されているため、新index.html側のCSSをそのクラス名に合わせて新規に用意する（JS側の改修は不要）
- microCMSのサービスドメイン・APIキーは既存の値をそのまま使用（`beekoala2026` / 既存キー）。この点は既存実装からの変更なし
- スクリプト参照パスをルート基準に修正: `./assets/js/live-fetch.js`, `./assets/js/youtube-fetch.js`

## スコープ外

- microCMS側のデータ登録・スキーマ変更
- ロゴ画像（`logo.png`）の採用（モックアップのタイポグラフィ主体のロゴ表現を維持）
- Instagram / X / YouTube チャンネルの実URL確定

## 検証方法

- ブラウザで `index.html` を開き、Hero/About/Discography/Members/Live/Footerの各セクションが正しく表示されることを目視確認
- Discography・Liveセクションが microCMS からのデータ取得成功時・失敗時（ローディング/エラー表示）双方で崩れないことを確認
- スマートフォン幅でハンバーガーメニューの開閉が機能することを確認
- 削除対象ファイルへの参照が残っていないことを確認（リンク切れがないか）

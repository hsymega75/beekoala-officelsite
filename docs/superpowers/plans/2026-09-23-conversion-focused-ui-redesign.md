# コンバージョン重視UI再設計 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `index.html` の Media セクションをYouTube動画専念に変更し、TikTok/YouTube/Instagramへの誘導に特化した新セクション「SNS」を追加、Liveセクションの各イベントにアクションボタンを追加し、Goods セクションを横スクロールのカテゴリカード形式に刷新する。

**Architecture:** 単一の自己完結型HTMLファイル（`index.html`）へのセクション単位の書き換え・追加。既存の `assets/js/live-fetch.js` に1箇所ロジックを追加する以外、新規JSファイルは作らない。すべてTailwind CSS（CDN）＋インライン `<style>` の既存パターンを踏襲する。

**Tech Stack:** 素のHTML/CSS/JS、Tailwind CSS（CDN）、FontAwesome 6.4.0（CDN、既存の `fa-brands`/`fa-solid` アイコンセットを使用）。

## Global Constraints

- 設計書: `docs/superpowers/specs/2026-09-23-conversion-focused-ui-design.md` に従う
- 実URL: TikTok `https://www.tiktok.com/@user3920562792656` / YouTube `https://www.youtube.com/@BEEKOALA05` / Instagram `https://www.instagram.com/beekoala05?stkn=NHI0Nzl4bXQwNjE2&utm_source=qr` / SUZURI `https://suzuri.jp/BEEKOALA`
- 外部リンクはすべて `target="_blank" rel="noopener noreferrer"` を付与する
- SNSカードのアクセントカラー: TikTok `#39FF14` / YouTube `#FF0000` / Instagram `#E1306C`（すべて単色、グラデーション不使用）
- Goodsカテゴリカードのアイコン（FontAwesome 6 Free Solid）: ステッカー=`fa-note-sticky` / Tシャツ=`fa-shirt` / キーホルダー=`fa-key` / サンダル=`fa-shoe-prints`
- このプロジェクトには自動テストフレームワークが存在しない（静的サイト）。各タスクの「テスト」は、(a) `grep` 等の自動チェックコマンド、(b) ローカルのFirebase Hostingエミュレーター（`firebase emulators:start --only hosting`、http://localhost:5000 で稼働中）を使ったブラウザでの目視確認、の組み合わせで行う
- Members / Philosophy(About) セクションは変更しない
- 本番デプロイ（`firebase deploy --only hosting`）は本計画のタスクに含まない。全タスク完了後、ユーザーの明示的な指示を待って行う

---

### Task 1: ナビゲーションにSNSリンクを追加、YouTube実URLを設定

**Files:**
- Modify: `index.html`（`<nav>` 内のデスクトップメニュー、モバイルメニュー）

**Interfaces:**
- Consumes: なし（起点タスク）
- Produces: `#sns` へのアンカーリンクをデスクトップ・モバイル両方のナビに追加した状態。後続タスク（Task 3）でこの `id="sns"` を持つセクションを実際に作成する

- [ ] **Step 1: デスクトップメニューにSNSリンクを追加し、YouTubeアイコンのリンク先を実URLに更新**

`index.html` 内の以下のブロックを:

```html
                <div class="hidden md:flex space-x-6 items-center">
                    <a href="#philosophy" class="font-street text-xl text-punk-black hover:text-punk-green transition-colors mt-1">PHILOSOPHY</a>
                    <a href="#media" class="font-street text-xl text-punk-black hover:text-punk-green transition-colors mt-1">MEDIA</a>
                    <a href="#member" class="font-street text-xl text-punk-black hover:text-punk-green transition-colors mt-1">MEMBER</a>
                    <a href="#goods" class="font-street text-xl text-punk-black hover:text-punk-green transition-colors mt-1">GOODS</a>

                    <div class="w-px h-6 bg-gray-300 mx-2"></div>
                    
                    <a href="https://www.tiktok.com/@user3920562792656" target="_blank" rel="noopener noreferrer" class="text-2xl text-punk-black hover:text-punk-green hover:-rotate-12 transition-transform duration-200">
                        <i class="fa-brands fa-tiktok"></i>
                    </a>
                    <a href="#" class="text-2xl text-punk-black hover:text-punk-green hover:-rotate-12 transition-transform duration-200">
                        <i class="fa-brands fa-youtube"></i>
                    </a>
                    <a href="https://www.instagram.com/beekoala05?stkn=NHI0Nzl4bXQwNjE2&utm_source=qr" class="text-2xl text-punk-black hover:text-punk-green hover:-rotate-12 transition-transform duration-200">
                        <i class="fa-brands fa-instagram"></i>
                    </a>
                    <a href="#live" class="ml-4 font-street text-xl bg-punk-black text-white py-1 px-6 border-2 border-punk-black solid-shadow-green tracking-widest hover:bg-punk-green hover:text-punk-black transition-colors">
                        TICKETS
                    </a>
                </div>
```

以下に置き換える:

```html
                <div class="hidden md:flex space-x-6 items-center">
                    <a href="#philosophy" class="font-street text-xl text-punk-black hover:text-punk-green transition-colors mt-1">PHILOSOPHY</a>
                    <a href="#media" class="font-street text-xl text-punk-black hover:text-punk-green transition-colors mt-1">MEDIA</a>
                    <a href="#sns" class="font-street text-xl text-punk-black hover:text-punk-green transition-colors mt-1">SNS</a>
                    <a href="#member" class="font-street text-xl text-punk-black hover:text-punk-green transition-colors mt-1">MEMBER</a>
                    <a href="#goods" class="font-street text-xl text-punk-black hover:text-punk-green transition-colors mt-1">GOODS</a>

                    <div class="w-px h-6 bg-gray-300 mx-2"></div>
                    
                    <a href="https://www.tiktok.com/@user3920562792656" target="_blank" rel="noopener noreferrer" class="text-2xl text-punk-black hover:text-punk-green hover:-rotate-12 transition-transform duration-200">
                        <i class="fa-brands fa-tiktok"></i>
                    </a>
                    <a href="https://www.youtube.com/@BEEKOALA05" target="_blank" rel="noopener noreferrer" class="text-2xl text-punk-black hover:text-punk-green hover:-rotate-12 transition-transform duration-200">
                        <i class="fa-brands fa-youtube"></i>
                    </a>
                    <a href="https://www.instagram.com/beekoala05?stkn=NHI0Nzl4bXQwNjE2&utm_source=qr" target="_blank" rel="noopener noreferrer" class="text-2xl text-punk-black hover:text-punk-green hover:-rotate-12 transition-transform duration-200">
                        <i class="fa-brands fa-instagram"></i>
                    </a>
                    <a href="#live" class="ml-4 font-street text-xl bg-punk-black text-white py-1 px-6 border-2 border-punk-black solid-shadow-green tracking-widest hover:bg-punk-green hover:text-punk-black transition-colors">
                        TICKETS
                    </a>
                </div>
```

- [ ] **Step 2: モバイルメニューにもSNSリンクを追加**

以下のブロックを:

```html
        <div id="mobile-menu" class="md:hidden">
            <a href="#philosophy">PHILOSOPHY</a>
            <a href="#media">MEDIA</a>
            <a href="#member">MEMBER</a>
            <a href="#goods">GOODS</a>
            <a href="#live">TICKETS</a>
            <a href="https://www.tiktok.com/@user3920562792656" target="_blank" rel="noopener noreferrer">TIKTOK</a>
        </div>
```

以下に置き換える:

```html
        <div id="mobile-menu" class="md:hidden">
            <a href="#philosophy">PHILOSOPHY</a>
            <a href="#media">MEDIA</a>
            <a href="#sns">SNS</a>
            <a href="#member">MEMBER</a>
            <a href="#goods">GOODS</a>
            <a href="#live">TICKETS</a>
            <a href="https://www.tiktok.com/@user3920562792656" target="_blank" rel="noopener noreferrer">TIKTOK</a>
        </div>
```

- [ ] **Step 3: 変更を確認**

Run: `grep -n '#sns\|youtube.com/@BEEKOALA05' index.html`
Expected: デスクトップメニュー・モバイルメニュー双方で `href="#sns"` がヒットし、`https://www.youtube.com/@BEEKOALA05` がヒットする

- [ ] **Step 4: コミット**

```bash
git add index.html
git commit -m "ナビにSNSリンクを追加し、YouTubeアイコンのリンク先を実URLに更新"
```

---

### Task 2: Media セクションをYouTube動画専念に変更

**Files:**
- Modify: `index.html`（`<section id="media">` 全体）

**Interfaces:**
- Consumes: Task 1完了後の `index.html`
- Produces: Mediaセクションが1カラム・YouTube動画のみになった状態。TikTokの静的CTAカードはこのタスクで削除する（Task 3で新設するSNSセクションに置き換わる）

- [ ] **Step 1: `<section id="media">` 全体を置換**

以下のブロックを（`<section id="media" class="py-20...">` から対応する `</section>` まで）:

```html
    <section id="media" class="py-20 px-4 bg-gray-50 border-b-4 border-punk-black">
        <div class="max-w-6xl mx-auto">
            <div class="text-center mb-16">
                <h2 class="font-street text-5xl md:text-7xl text-punk-black text-outline-black text-white tracking-widest">
                    WATCH THIS SHIT
                </h2>
                <div class="w-24 h-2 bg-punk-black mx-auto mt-4"></div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                <!-- YouTube Block (microCMS 動的連携) -->
                <div class="bg-white p-5 border-4 border-punk-black solid-shadow">
                    <div class="flex items-center justify-between mb-4 pb-2 border-b-2 border-gray-200">
                        <div class="flex items-center gap-2">
                            <i class="fa-brands fa-youtube text-3xl text-red-600"></i>
                            <h3 class="font-street text-3xl pt-1">MUSIC VIDEOS</h3>
                        </div>
                    </div>
                    <div id="youtube-list"></div>
                </div>

                <!-- TikTok Block -->
                <div class="bg-white p-5 border-4 border-punk-black solid-shadow">
                    <div class="flex items-center justify-between mb-4 pb-2 border-b-2 border-gray-200">
                        <div class="flex items-center gap-2">
                            <i class="fa-brands fa-tiktok text-3xl text-punk-black"></i>
                            <h3 class="font-street text-3xl pt-1">VIRAL SHORTS</h3>
                        </div>
                    </div>
                    <a href="https://www.tiktok.com/@user3920562792656" target="_blank" rel="noopener noreferrer" class="aspect-[9/16] max-h-[400px] mx-auto bg-black border-2 border-punk-black relative overflow-hidden flex items-center justify-center cursor-pointer group">
                        <!-- TikTok風のUIオーバーレイ -->
                        <div class="absolute right-4 bottom-20 flex flex-col gap-4 text-white z-10">
                            <i class="fa-solid fa-heart text-3xl group-hover:text-red-500"></i>
                            <i class="fa-solid fa-comment text-3xl"></i>
                            <i class="fa-solid fa-share text-3xl"></i>
                        </div>
                        <p class="text-white font-street text-2xl tracking-widest z-10">VIEW ON TIKTOK</p>
                        <img src="./images/top-band.jpg" class="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity">
                    </a>
                    <div class="mt-4 text-center">
                        <a href="https://www.tiktok.com/@user3920562792656" target="_blank" rel="noopener noreferrer" class="font-bold text-punk-black hover:text-punk-green underline decoration-2 underline-offset-4">TikTokをフォローする</a>
                    </div>
                </div>
            </div>
        </div>
    </section>
```

以下に置き換える:

```html
    <section id="media" class="py-20 px-4 bg-gray-50 border-b-4 border-punk-black">
        <div class="max-w-4xl mx-auto">
            <div class="text-center mb-16">
                <h2 class="font-street text-5xl md:text-7xl text-punk-black text-outline-black text-white tracking-widest">
                    WATCH THIS SHIT
                </h2>
                <div class="w-24 h-2 bg-punk-black mx-auto mt-4"></div>
                <p class="mt-6 font-bold text-gray-700 tracking-wide">新曲から過去の名曲まで、全部YouTubeでチェックできる。</p>
            </div>

            <div class="bg-white p-5 border-4 border-punk-black solid-shadow">
                <div class="flex items-center justify-between mb-4 pb-2 border-b-2 border-gray-200">
                    <div class="flex items-center gap-2">
                        <i class="fa-brands fa-youtube text-3xl text-red-600"></i>
                        <h3 class="font-street text-3xl pt-1">MUSIC VIDEOS</h3>
                    </div>
                </div>
                <div id="youtube-list"></div>
                <div class="mt-6 text-center">
                    <a href="https://www.youtube.com/@BEEKOALA05" target="_blank" rel="noopener noreferrer" class="inline-block font-street text-xl tracking-widest bg-red-600 text-white py-3 px-8 border-2 border-punk-black solid-shadow hover:bg-punk-black transition-colors">
                        SUBSCRIBE CHANNEL
                    </a>
                </div>
            </div>
        </div>
    </section>
```

- [ ] **Step 2: 変更を確認**

Run: `grep -n 'VIRAL SHORTS\|VIEW ON TIKTOK\|SUBSCRIBE CHANNEL\|新曲から過去の名曲まで' index.html`
Expected: `VIRAL SHORTS` と `VIEW ON TIKTOK` はヒットしない（削除済み）。`SUBSCRIBE CHANNEL` と `新曲から過去の名曲まで` はヒットする

Run: `grep -n 'id="youtube-list"' index.html`
Expected: 1件ヒットする（`youtube-fetch.js` が参照するコンテナは維持されている）

- [ ] **Step 3: ブラウザで目視確認**

http://localhost:5000 を開き、Mediaセクションが1カラムでYouTube動画リストのみ表示され、下部に赤い「SUBSCRIBE CHANNEL」ボタンがあることを確認する。TikTokの静的カードが無くなっていることを確認する。

- [ ] **Step 4: コミット**

```bash
git add index.html
git commit -m "MediaセクションをYouTube動画専念の1カラム構成に変更し購読導線を追加"
```

---

### Task 3: SNS セクションの新設

**Files:**
- Modify: `index.html`（`<style>` ブロックへのCSS追加、Media直後への新規 `<section id="sns">` 追加）

**Interfaces:**
- Consumes: Task 2完了後の `index.html`。Task 1で追加した `href="#sns"` ナビリンクの遷移先
- Produces: `id="sns"` を持つセクション。`.sns-card` / `.sns-tiktok` / `.sns-youtube` / `.sns-instagram` / `.sns-btn` というCSSクラスをこのタスクで定義する（後続タスクはこれらを参照しない）

- [ ] **Step 1: `.sns-*` のCSSを `<style>` ブロックに追加**

`index.html` の `<style>` ブロック内、以下の既存ルール:

```css
        .archive-quote {
            font-size: 0.85rem;
            color: #666;
            margin-top: 0.5rem;
        }

        /* モバイルメニュー */
```

を以下に置き換える（`.archive-quote` はそのまま残し、その直後に新規ルールを追加する）:

```css
        .archive-quote {
            font-size: 0.85rem;
            color: #666;
            margin-top: 0.5rem;
        }

        /* SNS セクション */
        .sns-card {
            background: #111111;
            padding: 2.5rem 1.5rem;
            text-align: center;
            border: 4px solid #111111;
            transition: transform 0.2s ease-in-out;
        }
        .sns-card:hover {
            transform: translateY(-4px);
        }
        .sns-card i {
            font-size: 3rem;
            margin-bottom: 1rem;
            display: block;
        }
        .sns-card h3 {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 1.75rem;
            letter-spacing: 0.1em;
            color: #fff;
            margin-bottom: 1.5rem;
        }
        .sns-btn {
            display: inline-block;
            font-family: 'Bebas Neue', sans-serif;
            font-size: 1rem;
            letter-spacing: 0.1em;
            padding: 0.75rem 1.5rem;
            color: #111111;
            text-decoration: none;
            transition: opacity 0.2s;
        }
        .sns-btn:hover {
            opacity: 0.85;
        }
        .sns-tiktok i { color: #39FF14; }
        .sns-tiktok .sns-btn { background: #39FF14; }
        .sns-youtube i { color: #FF0000; }
        .sns-youtube .sns-btn { background: #FF0000; }
        .sns-instagram i { color: #E1306C; }
        .sns-instagram .sns-btn { background: #E1306C; }

        /* モバイルメニュー */
```

- [ ] **Step 2: Media セクションの直後にSNSセクションを新規追加**

`index.html` 内、Task 2で書き換えたMediaセクションの `</section>` の直後、`<!-- ライブ情報 -->` コメントの直前に以下を挿入する:

```html
    <!-- SNS -->
    <section id="sns" class="py-20 px-4 bg-white">
        <div class="max-w-6xl mx-auto">
            <div class="text-center mb-16">
                <h2 class="font-street text-5xl md:text-7xl text-punk-black tracking-widest">
                    FOLLOW THE NOISE
                </h2>
                <div class="w-24 h-2 bg-punk-black mx-auto mt-4"></div>
                <p class="mt-6 font-bold text-gray-700 tracking-wide">ライブの裏側も、日常の全部も、SNSで。</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="sns-card sns-tiktok">
                    <i class="fa-brands fa-tiktok"></i>
                    <h3>TIKTOK</h3>
                    <a href="https://www.tiktok.com/@user3920562792656" target="_blank" rel="noopener noreferrer" class="sns-btn">FOLLOW ON TIKTOK</a>
                </div>
                <div class="sns-card sns-youtube">
                    <i class="fa-brands fa-youtube"></i>
                    <h3>YOUTUBE</h3>
                    <a href="https://www.youtube.com/@BEEKOALA05" target="_blank" rel="noopener noreferrer" class="sns-btn">SUBSCRIBE ON YOUTUBE</a>
                </div>
                <div class="sns-card sns-instagram">
                    <i class="fa-brands fa-instagram"></i>
                    <h3>INSTAGRAM</h3>
                    <a href="https://www.instagram.com/beekoala05?stkn=NHI0Nzl4bXQwNjE2&utm_source=qr" target="_blank" rel="noopener noreferrer" class="sns-btn">FOLLOW ON INSTAGRAM</a>
                </div>
            </div>
        </div>
    </section>
```

具体的な挿入位置の目印（この直前に挿入する）:

```html
     <!-- ライブ情報 -->  
    <section id="live" class="py-24 px-4 bg-punk-black text-white jagged-border">
```

- [ ] **Step 3: 変更を確認**

Run: `grep -n 'id="sns"\|FOLLOW THE NOISE\|sns-tiktok\|sns-youtube\|sns-instagram' index.html`
Expected: すべてヒットする

Run: `grep -c 'sns-card' index.html`
Expected: 3（TikTok/YouTube/Instagramの3カード分、HTML内での出現）

- [ ] **Step 4: ブラウザで目視確認**

http://localhost:5000 を開き、Mediaセクションの直後に「FOLLOW THE NOISE」セクションが表示され、TikTok（緑）/YouTube（赤）/Instagram（ピンク）の3枚のカードが横並び（モバイルは縦積み）で表示されることを確認する。各ボタンをクリックして正しいURLが新規タブで開くことを確認する。

- [ ] **Step 5: コミット**

```bash
git add index.html
git commit -m "SNSセクションを新設しTikTok/YouTube/Instagramへの導線を追加"
```

---

### Task 4: Live セクションの各イベントにアクションボタンを追加

**Files:**
- Modify: `index.html`（`<style>` ブロックへのCSS追加）
- Modify: `assets/js/live-fetch.js`（`renderUpcoming` 関数内の `contactHtml` 生成ロジック）

**Interfaces:**
- Consumes: Task 3完了後の `index.html`。`assets/js/live-fetch.js` の既存の `esc()` 関数（変更しない）
- Produces: `contact` フィールドがURLの場合にクリック可能なボタンとして描画される `live-fetch.js`。`.event-contact-btn` というCSSクラスをこのタスクで定義する

- [ ] **Step 1: `.event-contact-btn` のCSSを `<style>` ブロックに追加**

`index.html` の `<style>` ブロック内、以下の既存ルール:

```css
        .event-venue, .event-time, .event-price, .event-contact {
            font-size: 0.85rem;
            color: #555;
            margin-bottom: 0.25rem;
        }
```

を以下に置き換える（既存ルールはそのまま残し、直後に新規ルールを追加する）:

```css
        .event-venue, .event-time, .event-price, .event-contact {
            font-size: 0.85rem;
            color: #555;
            margin-bottom: 0.25rem;
        }
        .event-contact-btn {
            display: inline-block;
            font-family: 'Bebas Neue', sans-serif;
            font-size: 0.9rem;
            letter-spacing: 0.08em;
            background: #39FF14;
            color: #111111;
            text-decoration: none;
            padding: 0.6rem 1.5rem;
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
            transition: opacity 0.2s;
        }
        .event-contact-btn:hover {
            opacity: 0.85;
        }
```

- [ ] **Step 2: `live-fetch.js` の `contactHtml` 生成ロジックを変更**

`assets/js/live-fetch.js` 内、`renderUpcoming` 関数の以下の行:

```javascript
    var contactHtml = ev.contact
      ? '<div class="event-contact">' + esc(ev.contact) + '</div>'
      : '';
```

を以下に置き換える:

```javascript
    var contactHtml = '';
    if (ev.contact) {
      if (/^https?:\/\//.test(ev.contact)) {
        contactHtml = '<a class="event-contact-btn" href="' + esc(ev.contact) + '" target="_blank" rel="noopener noreferrer">チケット購入はこちら</a>';
      } else {
        contactHtml = '<div class="event-contact">' + esc(ev.contact) + '</div>';
      }
    }
```

- [ ] **Step 3: 変更を確認**

Run: `grep -n 'event-contact-btn' index.html assets/js/live-fetch.js`
Expected: `index.html` のCSSルールと、`live-fetch.js` の生成ロジック内の両方でヒットする

Run: `node -e "var fs=require('fs'); var src=fs.readFileSync('assets/js/live-fetch.js','utf8'); if(!/https\?/.test(src)) { console.error('regex check failed'); process.exit(1); } console.log('OK: contact URL detection present');"`
Expected: `OK: contact URL detection present` と出力される（構文エラーがあればNode実行時に例外が出る）

- [ ] **Step 4: ブラウザで目視確認**

http://localhost:5000 を開き、Liveセクションのコンソールエラーが無いことを確認する。microCMS側に `contact` が `http` で始まるデータがあれば、緑色のボタン「チケット購入はこちら」が表示されることを確認する。`contact` がURLでない、または空のデータでは従来通り（テキスト表示、または非表示）になることを確認する。

- [ ] **Step 5: コミット**

```bash
git add index.html assets/js/live-fetch.js
git commit -m "Liveセクションのcontactフィールドをチケット購入ボタン化(URLの場合のみ)"
```

---

### Task 5: Goods セクションを横スクロールのカテゴリカードに刷新

**Files:**
- Modify: `index.html`（`<style>` ブロックへのCSS追加、`<section id="goods">` 全体）

**Interfaces:**
- Consumes: Task 4完了後の `index.html`
- Produces: `.goods-scroll` / `.goods-card` というCSSクラスを定義したGoodsセクション

- [ ] **Step 1: `.goods-scroll` / `.goods-card` のCSSを `<style>` ブロックに追加**

`index.html` の `<style>` ブロック内、以下の既存ルール（Task 4で追加した `.event-contact-btn:hover`）:

```css
        .event-contact-btn:hover {
            opacity: 0.85;
        }
```

を以下に置き換える（既存ルールはそのまま残し、直後に新規ルールを追加する）:

```css
        .event-contact-btn:hover {
            opacity: 0.85;
        }

        /* Goods セクション: 横スクロールカテゴリカード */
        .goods-scroll {
            display: flex;
            gap: 1.25rem;
            overflow-x: auto;
            padding-bottom: 1rem;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
        }
        .goods-scroll::-webkit-scrollbar {
            height: 8px;
        }
        .goods-card {
            flex: 0 0 auto;
            width: 160px;
            scroll-snap-align: start;
            background: #fff;
            border: 4px solid #111111;
            padding: 2rem 1rem;
            text-align: center;
            text-decoration: none;
            color: #111111;
            transition: transform 0.2s ease-in-out;
        }
        .goods-card:hover {
            transform: translateY(-4px);
        }
        .goods-card i {
            font-size: 2.5rem;
            color: #39FF14;
            margin-bottom: 1rem;
            display: block;
        }
        .goods-card span {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 1.1rem;
            letter-spacing: 0.05em;
        }
```

- [ ] **Step 2: `<section id="goods">` 全体を置換**

以下のブロックを（`<section id="goods" class="py-20...">` から対応する `</section>` まで）:

```html
    <section id="goods" class="py-20 px-4 bg-gray-50 border-b-4 border-punk-black">
        <div class="max-w-3xl mx-auto">
            <div class="bg-white p-8 md:p-12 border-4 border-punk-black solid-shadow text-center">
                <p class="font-street text-xl text-punk-green tracking-widest mb-3">OFFICIAL GOODS</p>
                <h2 class="font-street text-4xl md:text-5xl text-punk-black tracking-wider mb-8">SUZURIでグッズ販売中</h2>
                <a href="https://suzuri.jp/BEEKOALA" target="_blank" rel="noopener noreferrer" class="inline-block font-street text-2xl tracking-widest bg-punk-black text-white py-4 px-10 border-2 border-punk-black solid-shadow-green hover:bg-punk-green hover:text-punk-black transition-colors">
                    SHOP ON SUZURI
                </a>
            </div>
        </div>
    </section>
```

以下に置き換える:

```html
    <section id="goods" class="py-20 px-4 bg-gray-50 border-b-4 border-punk-black">
        <div class="max-w-6xl mx-auto">
            <div class="text-center mb-10">
                <p class="font-street text-xl text-punk-green tracking-widest mb-3">OFFICIAL GOODS</p>
                <h2 class="font-street text-4xl md:text-5xl text-punk-black tracking-wider">グッズをチェック</h2>
            </div>

            <div class="goods-scroll">
                <a href="https://suzuri.jp/BEEKOALA" target="_blank" rel="noopener noreferrer" class="goods-card">
                    <i class="fa-solid fa-note-sticky"></i>
                    <span>ステッカー</span>
                </a>
                <a href="https://suzuri.jp/BEEKOALA" target="_blank" rel="noopener noreferrer" class="goods-card">
                    <i class="fa-solid fa-shirt"></i>
                    <span>オリジナルTシャツ</span>
                </a>
                <a href="https://suzuri.jp/BEEKOALA" target="_blank" rel="noopener noreferrer" class="goods-card">
                    <i class="fa-solid fa-key"></i>
                    <span>キーホルダー</span>
                </a>
                <a href="https://suzuri.jp/BEEKOALA" target="_blank" rel="noopener noreferrer" class="goods-card">
                    <i class="fa-solid fa-shoe-prints"></i>
                    <span>サンダル</span>
                </a>
            </div>

            <div class="mt-6 text-center">
                <a href="https://suzuri.jp/BEEKOALA" target="_blank" rel="noopener noreferrer" class="text-sm font-bold text-punk-black hover:text-punk-green underline decoration-2 underline-offset-4">
                    → SUZURIで全商品を見る
                </a>
            </div>
        </div>
    </section>
```

- [ ] **Step 3: 変更を確認**

Run: `grep -n 'SUZURIでグッズ販売中\|SHOP ON SUZURI\|goods-scroll\|グッズをチェック' index.html`
Expected: `SUZURIでグッズ販売中` と `SHOP ON SUZURI` はヒットしない（削除済み）。`goods-scroll` と `グッズをチェック` はヒットする

Run: `grep -c 'class="goods-card"' index.html`
Expected: 4（ステッカー/Tシャツ/キーホルダー/サンダルの4枚分）

- [ ] **Step 4: ブラウザで目視確認**

http://localhost:5000 を開き、Goodsセクションが4枚のアイコン付きカテゴリカードの横スクロール列になっていることを確認する。スマホ幅で横スクロールできること、各カード・下部の「→ SUZURIで全商品を見る」リンクをクリックすると新規タブでSUZURIが開くことを確認する。

- [ ] **Step 5: コミット**

```bash
git add index.html
git commit -m "Goodsセクションを横スクロールのカテゴリカード形式に刷新"
```

---

### Task 6: 最終確認（ローカルQA）

**Files:**
- なし（確認のみ、コード変更は行わない）

**Interfaces:**
- Consumes: Task 5完了後の `index.html` と `assets/js/live-fetch.js`
- Produces: なし（QA結果のみ。問題が見つかった場合は該当タスクに戻って修正する）

- [ ] **Step 1: セクション順序とナビの整合性を確認**

Run: `grep -n '<section id=' index.html`
Expected: 出現順が `media` → `sns` → `live` → `goods` → `member` → `philosophy` になっている

- [ ] **Step 2: ブラウザで全体を目視確認（http://localhost:5000）**

以下をすべて確認する:

1. Media: YouTube動画リストのみ、下に赤い「SUBSCRIBE CHANNEL」ボタン
2. SNS: TikTok(緑)/YouTube(赤)/Instagram(ピンク)の3カード、各ボタンが正しいURLに新規タブで遷移
3. Live: 各イベントに（`contact` がURLの場合）「チケット購入はこちら」ボタンが表示される
4. Goods: 4カテゴリの横スクロールカード＋「→ SUZURIで全商品を見る」リンク、すべてSUZURIへ新規タブで遷移
5. デスクトップ・モバイル両方のナビに「SNS」リンクがあり、クリックでSNSセクションにスクロールする
6. ブラウザの開発者コンソールに404やJSエラーが出ていない

- [ ] **Step 3: リポジトリ最終状態の確認**

Run: `git status && git log --oneline -6`
Expected: `git status` がクリーン、直近のコミット履歴にTask 1〜5の各コミットが並んでいる

問題が見つかった場合は、該当するTaskに戻って修正し、修正内容を新しいコミットとして追加する（このTaskではコミットは作成しない）。本番デプロイ（`firebase deploy --only hosting`）は、このQAが完了しユーザーが確認した後、ユーザーの明示的な指示を待って行う。

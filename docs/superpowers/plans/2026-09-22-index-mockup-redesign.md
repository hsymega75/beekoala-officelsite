# index.html モックアップベース刷新 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `index.html` を `beekoala_web_site_mockup.html` のUI（パンクロック/ストリート系デザイン, Tailwind CSS）をベースに全面刷新し、実際のBEEKOALAのメンバー情報・バンドストーリー・microCMS動的連携（Discography / Live情報）を組み込む。

**Architecture:** 単一の自己完結型HTMLファイル（`index.html`）。Tailwind CSS（CDN）+ インラインの `<style>` でカスタムスタイルを定義し、末尾の `<script>` タグで既存の `assets/js/live-fetch.js` と `assets/js/youtube-fetch.js`（変更なし・そのまま再利用）を読み込んでmicroCMSからデータを取得・描画する。

**Tech Stack:** 素のHTML/CSS/JS、Tailwind CSS（CDN経由 `cdn.tailwindcss.com`）、FontAwesome（CDN）、Google Fonts（Bebas Neue / Noto Sans JP）、microCMS REST API（既存の `live-fetch.js` / `youtube-fetch.js` がfetchで取得）。

## Global Constraints

- 設計書: `docs/superpowers/specs/2026-09-22-index-mockup-redesign-design.md` の内容に厳密に従う
- `assets/js/live-fetch.js` と `assets/js/youtube-fetch.js` は**変更しない**。これらが生成するHTMLのクラス名（`.disco-card`, `.disco-num`, `.disco-title`, `.video-wrapper`, `.video-error`, `.event-card`, `.event-img`, `.event-date`, `.event-title`, `.event-venue`, `.event-time`, `.event-price`, `.event-contact`, `.event-cast`, `.event-cast-label`, `.archive-card`, `.archive-img`, `.archive-info`, `.archive-date`, `.archive-title`, `.archive-venue`, `.archive-quote`, `.live-loading`, `.live-empty`, `.live-error`）に対応するCSSを新規に用意する
- スクリプト参照パスはルート基準（`./assets/js/...`）
- TikTok実リンクは `https://www.tiktok.com/@user3920562792656` に統一（`target="_blank" rel="noopener noreferrer"` を付与）
- Instagram / X（Twitter） / YouTubeチャンネルの実URLは未確定のため `href="#"` のまま維持（スコープ外）
- このプロジェクトには自動テストフレームワークが存在しない（静的サイト）。各タスクの「テスト」は、(a) 文字列/構造の自動チェック（`grep`, `diff` 等コマンドで検証可能なもの）と、(b) ブラウザで `index.html` を開いての目視確認、の組み合わせで行う
- 日本語のコピーはですます調を使わず、既存サイトのトーン（体言止め・簡潔な文体）に合わせる

---

### Task 1: ベースファイルの作成（モックアップをindex.htmlへコピー）

**Files:**
- Create/Overwrite: `index.html`（`beekoala_web_site_mockup.html` の内容で上書き）

**Interfaces:**
- Consumes: なし（起点タスク）
- Produces: `index.html` が `beekoala_web_site_mockup.html` と同一内容になった状態。以降のタスクはすべて `index.html` を編集する

- [ ] **Step 1: 現在の index.html をバックアップとして退避せず、直接上書きする準備として差分を確認**

Run: `diff index.html beekoala_web_site_mockup.html | head -20`
Expected: 大きく異なる内容が表示される（現行indexはデザインポータル、モックアップはBEEKOALA本サイト）— これは想定通り

- [ ] **Step 2: モックアップの内容で index.html を上書き**

Run: `cp beekoala_web_site_mockup.html index.html`

- [ ] **Step 3: 上書きが成功したことを確認**

Run: `diff index.html beekoala_web_site_mockup.html`
Expected: 差分なし（出力が空）

- [ ] **Step 4: コミット**

```bash
git add index.html
git commit -m "index.htmlを新モックアップの内容で置き換え"
```

---

### Task 2: Hero セクションの実データ化

**Files:**
- Modify: `index.html`（`<header class="pt-28 pb-16...">` セクション、Task 1時点で約146〜171行目）

**Interfaces:**
- Consumes: Task 1で作成した `index.html`
- Produces: Heroセクションが実画像・実コピーになった `index.html`

- [ ] **Step 1: プレースホルダー画像と架空コピーを実データに置換**

`index.html` 内の以下のブロックを:

```html
            <!-- アー写コンテナ -->
            <div class="w-full md:w-2/3 relative border-4 border-punk-black solid-shadow bg-gray-200 aspect-[16/10] overflow-hidden group">
                <img src="https://placehold.co/1200x800/111111/39FF14?text=BEEKOALA+ARTIST+PHOTO" alt="BEEKOALA Artist Photo" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700">
                <div class="absolute inset-0 bg-punk-green opacity-0 group-hover:opacity-10 mix-blend-overlay transition-opacity duration-500"></div>
            </div>
            
            <!-- タイトルエリア -->
            <div class="w-full md:w-1/3 flex flex-col justify-center relative z-10 text-center md:text-left">
                <h1 class="font-street text-7xl md:text-8xl lg:text-9xl text-punk-black tracking-tight leading-none mb-4">
                    BEE<br/>KOALA
                </h1>
                <div class="inline-block bg-punk-black text-punk-green font-street text-2xl md:text-3xl px-6 py-2 border-2 border-punk-black mb-6 transform -rotate-2 w-max mx-auto md:mx-0">
                    YOUTH PUNK NEVER DIES
                </div>
                <p class="font-bold text-gray-700 tracking-widest text-sm md:text-base">
                    JAPANESE PUNK ROCK BAND<br>
                    FROM SOMEWHERE IN ASIA.
                </p>
            </div>
```

以下に置き換える:

```html
            <!-- アー写コンテナ -->
            <div class="w-full md:w-2/3 relative border-4 border-punk-black solid-shadow bg-gray-200 aspect-[16/10] overflow-hidden group">
                <img src="./images/top-band.jpg" alt="BEEKOALA" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700">
                <div class="absolute inset-0 bg-punk-green opacity-0 group-hover:opacity-10 mix-blend-overlay transition-opacity duration-500"></div>
            </div>
            
            <!-- タイトルエリア -->
            <div class="w-full md:w-1/3 flex flex-col justify-center relative z-10 text-center md:text-left">
                <h1 class="font-street text-7xl md:text-8xl lg:text-9xl text-punk-black tracking-tight leading-none mb-4">
                    BEE<br/>KOALA
                </h1>
                <div class="inline-block bg-punk-black text-punk-green font-street text-2xl md:text-3xl px-6 py-2 border-2 border-punk-black mb-6 transform -rotate-2 w-max mx-auto md:mx-0">
                    20年ぶりの再始動
                </div>
                <p class="font-bold text-gray-700 tracking-widest text-sm md:text-base">
                    福岡発 青春パンクバンド<br>
                    20年の空白を越えて、また鳴らす。
                </p>
            </div>
```

- [ ] **Step 2: 変更を確認**

Run: `grep -n "BEEKOALA+ARTIST+PHOTO\|YOUTH PUNK NEVER DIES\|FROM SOMEWHERE IN ASIA" index.html`
Expected: 何もヒットしない（出力が空）。※Media section内の他のplacehold.co参照はTask 4で削除するため、ここではHero固有の文字列のみをチェックする

- [ ] **Step 3: ブラウザで目視確認**

`index.html` をブラウザで開き、Heroセクションに `images/top-band.jpg` の画像が表示され、バッジが「20年ぶりの再始動」、サブコピーが「福岡発 青春パンクバンド / 20年の空白を越えて、また鳴らす。」になっていることを確認する。

- [ ] **Step 4: コミット**

```bash
git add index.html
git commit -m "Heroセクションを実写真・実コピーに差し替え"
```

---

### Task 3: About（旧Philosophy）セクションの実データ化

**Files:**
- Modify: `index.html`（`<section id="philosophy"...">` 内の本文パラグラフ）

**Interfaces:**
- Consumes: Task 2完了後の `index.html`
- Produces: Aboutセクションの本文が実際のバンドストーリーになった `index.html`（見出し・箱デザイン・id="philosophy" は変更しない）

- [ ] **Step 1: 本文パラグラフを実話に置換**

以下のブロックを:

```html
                <div class="space-y-6 font-medium leading-loose text-lg text-gray-800">
                    <p>
                        大人になるにつれて置いてきたもの。<br>
                        カッコつけて言えなくなった本音、泥臭い感情、衝動。
                    </p>
                    <p>
                        「BEEKOALA」は、そんな日常に埋もれた<strong class="bg-punk-green px-1">青臭い感情を爆発させる</strong>ために結成した。<br>
                        ジャンルは青春パンク。ただひたすらに、等身大の自分たちを鳴らす。
                    </p>
                    <p>
                        綺麗な言葉はいらない。上手い演奏もいらない。<br>
                        必要なのは、ライブハウスで拳を上げて、一緒に汗を流して、明日を少しだけマシにするための熱量だけだ。
                    </p>
                </div>
```

以下に置き換える:

```html
                <div class="space-y-6 font-medium leading-loose text-lg text-gray-800">
                    <p>
                        今から20年前、学生時代に「Beep」としてバンド活動をスタートした。<br>
                        タカ、ヒガ、ゴー、ノムさん——音楽でつながった仲間たちがいた。
                    </p>
                    <p>
                        卒業、就職を経て、バンドは自然と解散。<br>
                        それぞれが、それぞれの道を歩き出した。
                    </p>
                    <p>
                        そして20年後——タカの<strong class="bg-punk-green px-1">「またバンドやろうや」</strong>の一言から、再結成が動き出した。<br>
                        新たな仲間・タダちゃんを迎え、「BEEKOALA」として福岡から再始動する。眠り続けていた名曲たちが、今、また鳴り響く。
                    </p>
                </div>
```

- [ ] **Step 2: 変更を確認**

Run: `grep -n "青臭い感情を爆発させる\|Beep" index.html`
Expected: 「Beep」を含む行はヒットするが、「青臭い感情を爆発させる」を含む行はヒットしない

- [ ] **Step 3: ブラウザで目視確認**

Aboutセクションの本文が3段落とも実話の内容に変わっていることを確認する。

- [ ] **Step 4: コミット**

```bash
git add index.html
git commit -m "Aboutセクションの本文を実際のバンドストーリーに差し替え"
```

---

### Task 4: Discography セクションの動的化（microCMS連携）

**Files:**
- Modify: `index.html`（`<style>` ブロックへのCSS追加、`<section id="media">` 内のYouTube/TikTokブロック、`</body>` 直前へのscriptタグ追加）

**Interfaces:**
- Consumes: Task 3完了後の `index.html`。`assets/js/youtube-fetch.js` が生成するHTML構造（`#youtube-list` 直下に `.disco-card > .disco-num, .disco-title, .video-wrapper|.video-error`）
- Produces: `#youtube-list` コンテナと対応CSS。後続タスクではこのCSSパターン（loading/empty/error）を `.live-*` 系でも再利用する

- [ ] **Step 1: `.disco-card` 系のCSSを `<style>` ブロック末尾（`::-webkit-scrollbar-thumb:hover` ルールの直後）に追加**

```css
        /* Discography（microCMS動的連携） */
        #youtube-list {
            display: grid;
            gap: 1.5rem;
        }
        .disco-card {
            border: 2px solid #111111;
            background: #fff;
            padding: 1rem;
        }
        .disco-num {
            display: inline-block;
            font-family: 'Bebas Neue', sans-serif;
            font-size: 0.85rem;
            letter-spacing: 0.15em;
            color: #39FF14;
            background: #111111;
            padding: 2px 10px;
            margin-bottom: 0.5rem;
        }
        .disco-title {
            font-weight: 700;
            margin-bottom: 0.75rem;
        }
        .video-wrapper {
            position: relative;
            padding-bottom: 56.25%;
            height: 0;
            overflow: hidden;
            border: 2px solid #111111;
        }
        .video-wrapper iframe {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            border: 0;
        }
        .video-error {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 200px;
            background: #eee;
            color: #888;
            font-size: 0.85rem;
            border: 2px solid #111111;
        }
        .live-loading, .live-empty {
            padding: 2rem;
            text-align: center;
            color: #888;
            font-weight: 700;
        }
        .live-error {
            padding: 2rem;
            text-align: center;
            color: #D6001C;
            font-weight: 700;
        }
```

- [ ] **Step 2: YouTubeブロックを動的コンテナに置換**

以下のブロックを:

```html
                <!-- YouTube Block -->
                <div class="bg-white p-5 border-4 border-punk-black solid-shadow">
                    <div class="flex items-center justify-between mb-4 pb-2 border-b-2 border-gray-200">
                        <div class="flex items-center gap-2">
                            <i class="fa-brands fa-youtube text-3xl text-red-600"></i>
                            <h3 class="font-street text-3xl pt-1">LATEST MUSIC VIDEO</h3>
                        </div>
                    </div>
                    <div class="aspect-video bg-punk-black border-2 border-punk-black relative overflow-hidden group cursor-pointer">
                        <img src="https://placehold.co/800x450/222222/ffffff?text=YouTube+Thumbnail" alt="MV Thumbnail" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity">
                        <div class="absolute inset-0 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                            <div class="bg-red-600 text-white w-16 h-12 flex items-center justify-center rounded-lg">
                                <i class="fa-solid fa-play text-2xl"></i>
                            </div>
                        </div>
                    </div>
                    <div class="mt-4">
                        <p class="font-bold text-lg">NEW SINGLE「青春の残骸」</p>
                        <a href="#" class="text-sm font-bold text-punk-green bg-punk-black px-3 py-1 mt-2 inline-block hover:bg-gray-800">SUBSCRIBE CHANNEL</a>
                    </div>
                </div>
```

以下に置き換える:

```html
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
```

- [ ] **Step 3: TikTokブロックのリンクを実URLに更新**

以下のブロックを:

```html
                <!-- TikTok Block -->
                <div class="bg-white p-5 border-4 border-punk-black solid-shadow">
                    <div class="flex items-center justify-between mb-4 pb-2 border-b-2 border-gray-200">
                        <div class="flex items-center gap-2">
                            <i class="fa-brands fa-tiktok text-3xl text-punk-black"></i>
                            <h3 class="font-street text-3xl pt-1">VIRAL SHORTS</h3>
                        </div>
                    </div>
                    <div class="aspect-[9/16] max-h-[400px] mx-auto bg-black border-2 border-punk-black relative overflow-hidden flex items-center justify-center cursor-pointer group">
                        <!-- TikTok風のUIオーバーレイ -->
                        <div class="absolute right-4 bottom-20 flex flex-col gap-4 text-white z-10">
                            <i class="fa-solid fa-heart text-3xl hover:text-red-500"></i>
                            <i class="fa-solid fa-comment text-3xl"></i>
                            <i class="fa-solid fa-share text-3xl"></i>
                        </div>
                        <p class="text-white font-street text-2xl tracking-widest z-10">PLAY TIKTOK</p>
                        <img src="https://placehold.co/400x700/111111/39FF14?text=TikTok+Video" class="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity">
                    </div>
                    <div class="mt-4 text-center">
                        <a href="#" class="font-bold text-punk-black hover:text-punk-green underline decoration-2 underline-offset-4">@beekoala_official をフォロー</a>
                    </div>
                </div>
```

以下に置き換える:

```html
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
```

- [ ] **Step 4: `</body>` 直前の既存 `<script>` タグの直前に、`youtube-fetch.js` の読み込みを追加**

`index.html` の末尾付近、既存の:

```html
    <script>
        // スムーススクロール
```

の直前に以下を挿入:

```html
    <script src="./assets/js/youtube-fetch.js"></script>
    <script>
        // スムーススクロール
```

- [ ] **Step 5: 変更を確認**

Run: `grep -n "youtube-list\|placehold.co\|youtube-fetch.js" index.html`
Expected: `id="youtube-list"` と `<script src="./assets/js/youtube-fetch.js">` はヒットし、`placehold.co` はヒットしない

- [ ] **Step 6: ブラウザで目視確認**

`index.html` をブラウザで開き、Discography(Media)セクションを確認する:
- ネットワーク接続がありmicroCMSからデータ取得できる場合: `#youtube-list` 内に動画カードが動的に描画される
- 取得に失敗する場合（オフライン等）: 「YouTube情報の取得に失敗しました。」のエラーメッセージが表示され、レイアウトが崩れないことを確認する
- TikTokブロックのリンクをクリックすると新しいタブで `https://www.tiktok.com/@user3920562792656` が開くことを確認する

- [ ] **Step 7: コミット**

```bash
git add index.html
git commit -m "DiscographyセクションをmicroCMS動的連携に変更、TikTokリンクを実URLに更新"
```

---

### Task 5: Members セクションの実データ化

**Files:**
- Modify: `index.html`（`<section id="member">` 全体）

**Interfaces:**
- Consumes: Task 4完了後の `index.html`
- Produces: 実メンバー5名（タカ/ヒガ/ノムさん/ゴー/タダちゃん）を表示する `index.html`

- [ ] **Step 1: `<section id="member" class="py-20 px-4 bg-white relative overflow-hidden">` から対応する `</section>` までの全体を以下に置換**

置換前を検索するコマンド: `grep -n '<section id="member"' index.html` と `grep -n "^    </section>$" index.html` で開始・終了行番号を特定してから編集する。

置換後の内容:

```html
    <section id="member" class="py-20 px-4 bg-white relative overflow-hidden">
        <!-- ZINE風の装飾テキスト -->
        <div class="absolute -left-10 top-20 transform -rotate-90 origin-left">
            <span class="font-street text-6xl text-gray-100 whitespace-nowrap">WHO THE F*CK IS BEEKOALA?</span>
        </div>

        <div class="max-w-6xl mx-auto relative z-10">
            <div class="flex flex-col items-center mb-16">
                <h2 class="font-street text-5xl md:text-7xl text-punk-black tracking-widest">
                    THE MEMBERS
                </h2>
                <div class="w-32 h-1 bg-punk-black mt-2"></div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <!-- タカ (Vo) -->
                <div class="group flex flex-col sm:flex-row gap-6 items-center sm:items-start bg-gray-50 border-4 border-punk-black p-4 solid-shadow">
                    <div class="w-full sm:w-1/2 aspect-[3/4] overflow-hidden border-2 border-punk-black bg-gray-200 shrink-0">
                        <img src="./images/member1.jpg" alt="vo.タカ" class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500">
                    </div>
                    <div class="w-full sm:w-1/2 pt-2">
                        <h3 class="font-street text-4xl text-punk-black">タカ</h3>
                        <p class="font-bold text-punk-green bg-punk-black inline-block px-2 py-0.5 text-sm mb-3">vo.</p>
                        <p class="text-sm font-medium leading-relaxed">
                            巻き肩のロングヘアー。
                        </p>
                    </div>
                </div>

                <!-- ヒガ (Vo) -->
                <div class="group flex flex-col sm:flex-row gap-6 items-center sm:items-start bg-gray-50 border-4 border-punk-black p-4 solid-shadow-green md:mt-8">
                    <div class="w-full sm:w-1/2 aspect-[3/4] overflow-hidden border-2 border-punk-black bg-gray-200 shrink-0">
                        <img src="./images/member2.jpg" alt="vo.ヒガ" class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500">
                    </div>
                    <div class="w-full sm:w-1/2 pt-2">
                        <h3 class="font-street text-4xl text-punk-black">ヒガ</h3>
                        <p class="font-bold text-white bg-punk-black inline-block px-2 py-0.5 text-sm mb-3">vo.</p>
                        <p class="text-sm font-medium leading-relaxed">
                            小さなオシャレ番長。
                        </p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- ノムさん (Gt) -->
                <div class="group">
                    <div class="border-4 border-punk-black aspect-[3/4] overflow-hidden mb-4 solid-shadow bg-gray-200">
                        <img src="./images/member3.jpg" alt="gt.ノムさん" class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500">
                    </div>
                    <div class="border-l-4 border-punk-black pl-4">
                        <h3 class="font-street text-4xl text-punk-black">ノムさん</h3>
                        <p class="font-bold text-gray-500 mb-2">gt.</p>
                        <p class="text-sm font-medium leading-relaxed">
                            ヒゲのサウンドメーカー。
                        </p>
                    </div>
                </div>

                <!-- ゴー (Ba) -->
                <div class="group md:mt-12">
                    <div class="border-4 border-punk-black aspect-[3/4] overflow-hidden mb-4 solid-shadow-green bg-gray-200">
                        <img src="./images/member4.jpg" alt="ba.ゴー" class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500">
                    </div>
                    <div class="border-l-4 border-punk-green pl-4">
                        <h3 class="font-street text-4xl text-punk-black">ゴー</h3>
                        <p class="font-bold text-gray-500 mb-2">ba.</p>
                        <p class="text-sm font-medium leading-relaxed">
                            野球を愛するカメラマン。
                        </p>
                    </div>
                </div>

                <!-- タダちゃん (Dr) -->
                <div class="group">
                    <div class="border-4 border-punk-black aspect-[3/4] overflow-hidden mb-4 solid-shadow bg-gray-200">
                        <img src="./images/member5.jpg" alt="dr.タダちゃん" class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500">
                    </div>
                    <div class="border-l-4 border-punk-black pl-4">
                        <h3 class="font-street text-4xl text-punk-black">タダちゃん</h3>
                        <p class="font-bold text-gray-500 mb-2">dr.</p>
                        <p class="text-sm font-medium leading-relaxed">
                            機材オタクのアレンジャー。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
```

- [ ] **Step 2: 変更を確認**

Run: `grep -n "KENTA\|TAKERU\|HIROKI\|SHO\|RYU\|member1.jpg\|member5.jpg" index.html`
Expected: 架空メンバー名（KENTA, TAKERU, HIROKI, SHO, RYU）はヒットせず、`member1.jpg`〜`member5.jpg` の実画像パスはヒットする

- [ ] **Step 3: ブラウザで目視確認**

Membersセクションが「タカ(vo.)」「ヒガ(vo.)」「ノムさん(gt.)」「ゴー(ba.)」「タダちゃん(dr.)」の5名、それぞれ対応する `images/member1.jpg`〜`member5.jpg` の実写真で表示されることを確認する。

- [ ] **Step 4: コミット**

```bash
git add index.html
git commit -m "Membersセクションを実メンバー5名の情報に差し替え"
```

---

### Task 6: Live セクションの再構成（Upcoming / Archive）

**Files:**
- Modify: `index.html`（`<style>` ブロックへのCSS追加、`<section id="live">` 全体、`</body>` 直前へのscriptタグ追加）

**Interfaces:**
- Consumes: Task 5完了後の `index.html`。`assets/js/live-fetch.js` が生成するHTML構造（`#upcoming-list` 直下に `.event-card`、`#archive-list` 直下に `.archive-card`）
- Produces: `#upcoming-list` / `#archive-list` コンテナと対応CSS

- [ ] **Step 1: `.event-card` / `.archive-card` 系のCSSを `<style>` ブロック末尾（Task 4で追加した `.live-error` ルールの直後）に追加**

```css
        /* Live: Upcoming */
        .event-card {
            background: #fff;
            border: 4px solid #111111;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            box-shadow: 8px 8px 0 #39FF14;
        }
        .event-img {
            width: 100%;
            aspect-ratio: 16 / 9;
            overflow: hidden;
            margin-bottom: 1rem;
            border: 2px solid #111111;
        }
        .event-img img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .event-date {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 2rem;
            color: #111111;
        }
        .event-title {
            font-weight: 700;
            font-size: 1.1rem;
            margin: 0.5rem 0;
        }
        .event-venue, .event-time, .event-price, .event-contact {
            font-size: 0.85rem;
            color: #555;
            margin-bottom: 0.25rem;
        }
        .event-cast {
            margin-top: 0.75rem;
            padding-top: 0.75rem;
            border-top: 2px dashed #111111;
        }
        .event-cast-label {
            font-weight: 700;
            font-size: 0.75rem;
            letter-spacing: 0.1em;
            color: #111111;
            display: block;
            margin-bottom: 0.25rem;
        }

        /* Live: Archive */
        .archive-card {
            background: #f5f5f5;
            border: 2px solid #111111;
            margin-bottom: 1.25rem;
            overflow: hidden;
            opacity: 0.85;
        }
        .archive-img {
            width: 100%;
            aspect-ratio: 16 / 9;
            overflow: hidden;
        }
        .archive-img img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: grayscale(60%);
        }
        .archive-info {
            padding: 1rem;
        }
        .archive-date {
            font-family: 'Bebas Neue', sans-serif;
            color: #888;
        }
        .archive-title {
            font-weight: 700;
            margin: 0.25rem 0;
        }
        .archive-venue {
            font-size: 0.85rem;
            color: #888;
        }
        .archive-quote {
            font-size: 0.85rem;
            color: #666;
            margin-top: 0.5rem;
        }
```

- [ ] **Step 2: `<section id="live">` 全体を、Upcoming/Archiveの2カラム構成に置換**

置換前を検索するコマンド: `grep -n '<section id="live"' index.html`

以下のブロックを（`<section id="live"...>` から対応する `</section>` まで）:

```html
    <section id="live" class="py-24 px-4 bg-punk-black text-white jagged-border">
        <div class="max-w-5xl mx-auto">
            <div class="flex flex-col items-center mb-16">
                <h2 class="font-street text-6xl md:text-8xl text-punk-green tracking-widest text-center">
                    NEXT GIGS
                </h2>
                <p class="font-bold text-gray-400 mt-2 tracking-widest">LIVE SCHEDULE (Managed by microCMS)</p>
            </div>

            <!-- microCMSからのフェッチデータを展開するコンテナ想定 -->
            <div id="microcms-live-list" class="space-y-6">
                ...(中略、静的なサンプル3件)...
            </div>
            
            <div class="text-center mt-12">
                <a href="#" class="inline-block font-bold text-punk-green hover:text-white underline decoration-2 underline-offset-8 transition-colors">
                    PAST LIVE ARCHIVE <i class="fa-solid fa-angle-right ml-1"></i>
                </a>
            </div>
        </div>
    </section>
```

以下に置き換える:

```html
    <section id="live" class="py-24 px-4 bg-punk-black text-white jagged-border">
        <div class="max-w-6xl mx-auto">
            <div class="flex flex-col items-center mb-16">
                <h2 class="font-street text-6xl md:text-8xl text-punk-green tracking-widest text-center">
                    NEXT GIGS
                </h2>
                <p class="font-bold text-gray-400 mt-2 tracking-widest">LIVE SCHEDULE (Managed by microCMS)</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <h3 class="font-street text-3xl text-punk-green tracking-widest mb-6">UPCOMING LIVE</h3>
                    <div id="upcoming-list"></div>
                </div>
                <div>
                    <h3 class="font-street text-3xl text-gray-400 tracking-widest mb-6">LIVE ARCHIVE</h3>
                    <div id="archive-list"></div>
                </div>
            </div>
        </div>
    </section>
```

- [ ] **Step 3: `</body>` 直前の `<script src="./assets/js/youtube-fetch.js"></script>` の直後に、`live-fetch.js` の読み込みを追加**

```html
    <script src="./assets/js/youtube-fetch.js"></script>
    <script src="./assets/js/live-fetch.js"></script>
    <script>
```

- [ ] **Step 4: 変更を確認**

Run: `grep -n "microcms-live-list\|GET TICKETS\|SOLD OUT\|upcoming-list\|archive-list\|live-fetch.js" index.html`
Expected: `microcms-live-list` / `GET TICKETS` / `SOLD OUT`（静的サンプルの文言）はヒットせず、`upcoming-list` / `archive-list` / `live-fetch.js` はヒットする

- [ ] **Step 5: ブラウザで目視確認**

Liveセクションが左右2カラム（UPCOMING LIVE / LIVE ARCHIVE）で表示され、microCMSからのデータ取得成功時はイベントカードが、失敗時はエラーメッセージが崩れず表示されることを確認する。

- [ ] **Step 6: コミット**

```bash
git add index.html
git commit -m "LiveセクションをUpcoming/Archiveの2カラム構成に再構成しmicroCMS連携"
```

---

### Task 7: Footer・ナビのTikTokリンク更新とモバイルメニューの実装

**Files:**
- Modify: `index.html`（ヘッダーnav内TikTokアイコン、フッターTikTokアイコン、モバイルメニューボタン、`<style>` へのCSS追加、末尾`<script>`へのJS追加）

**Interfaces:**
- Consumes: Task 6完了後の `index.html`
- Produces: TikTokリンクがすべて実URLになり、モバイルハンバーガーメニューが開閉可能になった `index.html`

- [ ] **Step 1: ヘッダーnav内のTikTokアイコンのリンク先を実URLに更新**

以下を:

```html
                    <a href="#" class="text-2xl text-punk-black hover:text-punk-green hover:-rotate-12 transition-transform duration-200">
                        <i class="fa-brands fa-tiktok"></i>
                    </a>
                    <a href="#" class="text-2xl text-punk-black hover:text-punk-green hover:-rotate-12 transition-transform duration-200">
                        <i class="fa-brands fa-youtube"></i>
                    </a>
```

以下に置き換える（YouTubeは変更しない）:

```html
                    <a href="https://www.tiktok.com/@user3920562792656" target="_blank" rel="noopener noreferrer" class="text-2xl text-punk-black hover:text-punk-green hover:-rotate-12 transition-transform duration-200">
                        <i class="fa-brands fa-tiktok"></i>
                    </a>
                    <a href="#" class="text-2xl text-punk-black hover:text-punk-green hover:-rotate-12 transition-transform duration-200">
                        <i class="fa-brands fa-youtube"></i>
                    </a>
```

- [ ] **Step 2: フッターのTikTokアイコンのリンク先を実URLに更新**

以下を:

```html
                <a href="#" class="text-4xl text-punk-black hover:text-punk-green hover:-translate-y-2 transition-all"><i class="fa-brands fa-tiktok"></i></a>
```

以下に置き換える:

```html
                <a href="https://www.tiktok.com/@user3920562792656" target="_blank" rel="noopener noreferrer" class="text-4xl text-punk-black hover:text-punk-green hover:-translate-y-2 transition-all"><i class="fa-brands fa-tiktok"></i></a>
```

- [ ] **Step 3: モバイルメニュー用のCSSを `<style>` ブロック末尾（Task 6で追加した `.archive-quote` ルールの直後）に追加**

```css
        /* モバイルメニュー */
        #mobile-menu {
            display: none;
            flex-direction: column;
            background: #fff;
            border-top: 4px solid #111111;
        }
        #mobile-menu.open {
            display: flex;
        }
        #mobile-menu a {
            padding: 1rem 1.5rem;
            border-bottom: 2px solid #eee;
            font-family: 'Bebas Neue', sans-serif;
            font-size: 1.25rem;
            color: #111111;
            text-decoration: none;
        }
        #mobile-menu a:hover {
            background: #39FF14;
        }
```

- [ ] **Step 4: モバイルメニューボタンにidとaria属性を追加し、ドロップダウンパネルを追加**

以下を:

```html
                <!-- Mobile menu button -->
                <div class="md:hidden flex items-center">
                    <button class="text-punk-black focus:outline-none p-2 border-2 border-punk-black bg-punk-green">
                        <i class="fa-solid fa-bars text-xl"></i>
                    </button>
                </div>
            </div>
        </div>
    </nav>
```

以下に置き換える:

```html
                <!-- Mobile menu button -->
                <div class="md:hidden flex items-center">
                    <button id="mobile-menu-btn" class="text-punk-black focus:outline-none p-2 border-2 border-punk-black bg-punk-green" aria-expanded="false" aria-controls="mobile-menu" aria-label="メニューを開く">
                        <i class="fa-solid fa-bars text-xl"></i>
                    </button>
                </div>
            </div>
        </div>
        <div id="mobile-menu" class="md:hidden">
            <a href="#philosophy">PHILOSOPHY</a>
            <a href="#media">MEDIA</a>
            <a href="#member">MEMBER</a>
            <a href="#live">TICKETS</a>
            <a href="https://www.tiktok.com/@user3920562792656" target="_blank" rel="noopener noreferrer">TIKTOK</a>
        </div>
    </nav>
```

- [ ] **Step 5: 末尾の `<script>` 内、既存の「スクロール時のヘッダー影追加」ロジックの直後にモバイルメニューの開閉処理を追加**

以下を:

```html
        // スクロール時のヘッダー影追加
        window.addEventListener('scroll', () => {
            const nav = document.getElementById('navbar');
            if (window.scrollY > 50) {
                nav.classList.add('shadow-md');
            } else {
                nav.classList.remove('shadow-md');
            }
        });
    </script>
```

以下に置き換える:

```html
        // スクロール時のヘッダー影追加
        window.addEventListener('scroll', () => {
            const nav = document.getElementById('navbar');
            if (window.scrollY > 50) {
                nav.classList.add('shadow-md');
            } else {
                nav.classList.remove('shadow-md');
            }
        });

        // モバイルメニューの開閉
        const menuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        menuBtn.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('open');
            menuBtn.setAttribute('aria-expanded', isOpen);
        });
        mobileMenu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                menuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    </script>
```

- [ ] **Step 6: 変更を確認**

Run: `grep -n "mobile-menu-btn\|mobile-menu\"\|www.tiktok.com" index.html`
Expected: `mobile-menu-btn`、`id="mobile-menu"`、TikTok実URLの3箇所すべてがヒットする

- [ ] **Step 7: ブラウザで目視確認（スマートフォン幅）**

ブラウザの開発者ツールでモバイル幅（375px程度）に切り替え、ハンバーガーボタンをクリックしてメニューが開閉すること、メニュー内リンクをクリックするとメニューが閉じることを確認する。また、ヘッダー/フッターのTikTokアイコンをクリックすると新しいタブで実際のTikTokアカウントが開くことを確認する。

- [ ] **Step 8: コミット**

```bash
git add index.html
git commit -m "TikTokリンクを実URLに更新し、モバイルメニューの開閉機能を実装"
```

---

### Task 8: 不要になった旧デザインファイルの削除

**Files:**
- Delete: `sample1.html`, `sample2.html`, `sample3.html`, `sample4.html`, `sample5.html`
- Delete: `samples/`（`v1/`, `v2/`, `v3/` を含むディレクトリ全体）
- Delete: `assets/css/v2-base.css`, `assets/css/v2-sample1.css`, `assets/css/v2-sample2.css`, `assets/css/v2-sample3.css`, `assets/css/v2-sample4.css`, `assets/css/v2-sample5.css`
- Delete: `assets/js/main.js`
- Delete: `beekoala_web_site_mockup.html`

**Interfaces:**
- Consumes: Task 7完了後の `index.html`（削除対象ファイルへの参照が残っていないこと）
- Produces: リポジトリから旧デザイン一式が除去された状態

- [ ] **Step 1: index.html が削除対象ファイルを参照していないことを事前確認**

Run: `grep -n "sample1.html\|sample2.html\|sample3.html\|sample4.html\|sample5.html\|samples/\|v2-base.css\|v2-sample\|assets/js/main.js" index.html`
Expected: 何もヒットしない（出力が空）。もしヒットした場合は、削除前に該当箇所を修正する

- [ ] **Step 2: 旧サンプルファイル・ディレクトリを削除**

```bash
rm sample1.html sample2.html sample3.html sample4.html sample5.html
rm -rf samples
rm assets/css/v2-base.css assets/css/v2-sample1.css assets/css/v2-sample2.css assets/css/v2-sample3.css assets/css/v2-sample4.css assets/css/v2-sample5.css
rm assets/js/main.js
rm beekoala_web_site_mockup.html
```

- [ ] **Step 3: 削除後の状態を確認**

Run: `git status`
Expected: 上記ファイル・ディレクトリがすべて deleted として表示され、それ以外の意図しない変更がないこと

- [ ] **Step 4: リポジトリ全体に削除対象への参照が残っていないことを確認**

Run: `grep -rn "samples/v1\|samples/v2\|samples/v3\|v2-base.css\|assets/js/main.js" --include="*.html" --include="*.js" --include="*.css" .`
Expected: 何もヒットしない（出力が空）

- [ ] **Step 5: コミット**

```bash
git add -A
git commit -m "不要になった旧デザイン一式（sample1-5.html, samples/, v2 CSS, main.js, モックアップ）を削除"
```

---

### Task 9: 最終確認（フルページQA）

**Files:**
- なし（確認のみ、コード変更は行わない）

**Interfaces:**
- Consumes: Task 8完了後のリポジトリ全体
- Produces: なし（QAレポートのみ。問題が見つかった場合は当該タスクに戻って修正する）

- [ ] **Step 1: index.html をブラウザで開き、以下のチェックリストをすべて確認する**

1. Hero: `images/top-band.jpg` が表示され、コピーが「20年ぶりの再始動」「福岡発 青春パンクバンド」になっている
2. About: 本文が実話（Beep結成〜解散〜再結成〜福岡）になっている
3. Discography: `#youtube-list` に動画カードが表示される（またはエラー/ローディング表示が崩れていない）
4. TikTokブロック: クリックで実際のTikTokアカウントが新規タブで開く
5. Members: タカ/ヒガ/ノムさん/ゴー/タダちゃんの5名が正しい画像・パートで表示される
6. Live: UPCOMING LIVE / LIVE ARCHIVE の2カラムが表示される（またはエラー/ローディング表示が崩れていない）
7. Footer: TikTokアイコンが実URLにリンクしている
8. モバイル幅（375px程度）でハンバーガーメニューが開閉する
9. ブラウザの開発者コンソールに `404`（画像・スクリプト読み込み失敗）が出ていない

- [ ] **Step 2: コンソールエラーの確認**

ブラウザの開発者ツールのConsoleタブを開き、`images/*.jpg` や `assets/js/*.js` の404エラーが出ていないことを確認する（microCMSへのfetchがネットワーク不通で失敗するのは許容、ただしその場合もエラーメッセージがUI上に正しく表示されていること）。

- [ ] **Step 3: リポジトリ最終状態の確認**

Run: `git status && git log --oneline -10`
Expected: `git status` がクリーン、直近のコミット履歴にTask 1〜8の各コミットが並んでいる

問題が見つかった場合は、該当するTaskに戻って修正し、修正内容を新しいコミットとして追加する（このTaskではコミットは作成しない）。

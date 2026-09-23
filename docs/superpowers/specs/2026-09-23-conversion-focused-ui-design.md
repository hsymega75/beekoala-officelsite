# コンバージョン重視のセクション再設計（Media分割・SNS新設・Goods刷新）

## 背景・目的

サイトの主要な行動目標を3つに整理し、それぞれの導線を強化する：

1. TikTok / YouTube / Instagram への誘導（SNSフォロー増加）
2. ライブ情報を見て集客を増やす（来場・チケット購入への誘導）
3. グッズ購入（SUZURI経由）

ユーザーが既にセクション順を `Hero → Media → Live → Goods → Member → Philosophy(About) → Footer` に変更済み。今回はこの並びを前提に、Media セクションの分割と新セクション追加、Goods セクションの刷新を行う。

## 変更後のセクション順序

`Hero → Media(YouTube専念) → SNS(新設) → Live → Goods(刷新) → Member → Philosophy(About) → Footer`

ナビゲーション（デスクトップ・モバイルメニュー双方）に `SNS` リンクを追加し、`#sns` へアンカーする。

## 1. Media セクション: YouTube動画に特化

- 現在の2カラム（YouTube／TikTok）構成をやめ、YouTube動画のみの単独セクションに変更
- レイアウトは1カラム・幅いっぱい（`grid-cols-1`）
- 見出し「WATCH THIS SHIT」の下に誘導コピーを追加: 「新曲から過去の名曲まで、全部YouTubeでチェックできる。」
- 既存の `#youtube-list`（`youtube-fetch.js` による動的MV埋め込み）はそのまま維持
- カード下部に新規CTAボタン「SUBSCRIBE CHANNEL」を追加。リンク先 `https://www.youtube.com/@BEEKOALA05`（新規タブ、`rel="noopener noreferrer"`）

## 2. SNS セクション（新設）

- Media セクションの直後に `<section id="sns">` を新設
- 見出し例:「FOLLOW THE NOISE」＋ 誘導コピー「ライブの裏側も、日常の全部も、SNSで。」
- TikTok / YouTube / Instagram を3枚の均等なCTAカードに（`grid-cols-1 md:grid-cols-3`）
- 各カードは写真を使わず、パンク世界観のタイポグラフィックデザインで統一:
  - 背景: `punk-black`
  - 大きいFontAwesomeアイコン（`fa-tiktok` / `fa-youtube` / `fa-instagram`）
  - プラットフォームごとのアクセントカラー（TikTok: `punk-green` (`#39FF14`) / YouTube: 赤 (`#FF0000`) / Instagram: ピンク (`#E1306C`、Instagramブランドカラー）。いずれもフラットな単色でグラデーションは使わない
  - フォロー・登録を促すボタン（例:「FOLLOW ON TIKTOK」「SUBSCRIBE ON YOUTUBE」「FOLLOW ON INSTAGRAM」）
  - リンク先:
    - TikTok: `https://www.tiktok.com/@user3920562792656`
    - YouTube: `https://www.youtube.com/@BEEKOALA05`
    - Instagram: `https://www.instagram.com/beekoala05?stkn=NHI0Nzl4bXQwNjE2&utm_source=qr`
  - すべて `target="_blank" rel="noopener noreferrer"`
- 旧Mediaセクション内にあったTikTokの静的CTAカード（写真背景＋フォローリンク）はこのセクションに統合・置き換え、旧デザイン（`top-band.jpg`を縦長クロップした背景写真）は廃止

## 3. Live セクション: 各イベントにアクションボタンを追加

- `assets/js/live-fetch.js` の `renderUpcoming` 内、`contact` フィールドの描画ロジックを変更
- `ev.contact` が `http` で始まる場合: クリック可能なボタンとして描画（例:「チケット購入はこちら」、新規タブ・`rel="noopener noreferrer"`）
- `http` で始まらない場合（電話番号や「当日精算」等のテキスト）: 現状通りプレーンテキストで表示
- ボタンは新規CSSクラス（例: `.event-contact-btn`）を追加し、他のCTA（SHOP ON SUZURI等）と統一感のあるパンクスタイルにする
- Archive（過去のライブ）側は対象外（過去公演にチケットCTAは不要なため）

## 4. Goods セクション刷新

- 見出しコピー「SUZURIでグッズ販売中」は削除
- ステッカー／オリジナルTシャツ／キーホルダー／サンダルの4カテゴリを横スクロールカードで表示
  - 各カードはアイコン（FontAwesome: ステッカー=`fa-note-sticky`、Tシャツ=`fa-shirt`、キーホルダー=`fa-key`、サンダル=`fa-shoe-prints`）＋カテゴリ名（日本語）
  - 実商品写真・個別商品URLが無いため、すべて `https://suzuri.jp/BEEKOALA` へリンク（新規タブ）
  - 横スクロールは `overflow-x-auto` + `flex` + `scroll-snap` を用いたシンプルな実装。各カード固定幅・flex-shrink-0
- スクロール列の下に小さく「→ SUZURIで全商品を見る」リンクを配置（メインの巨大CTAボタンとしては扱わない）

## スコープ外

- SUZURI APIによる実商品情報の動的取得（今回はカテゴリ別プレースホルダーカードで対応）
- 個別商品ページへの直接リンク（実URLが無いため、すべてSUZURIストアトップへ）
- Members / Philosophy(About) セクションの変更（今回の3つの行動目標と直接関係しないため対象外）
- ヘッダーの `px-4` 余白問題（別件として保留、ユーザーの意向で現状維持）

## 検証方法

- Media セクションがYouTube動画のみの単独セクションになり、SUBSCRIBEボタンが正しいURLに新規タブで遷移することを確認
- SNSセクションが新設され、3カードそれぞれが正しいURLに新規タブで遷移することを確認
- ナビ（デスクトップ・モバイル）に「SNS」リンクが追加され、クリックで該当セクションにスクロールすることを確認
- Live セクションで、`contact` がURLのイベントはボタン表示・URLでないイベントはテキスト表示のままであることを確認（microCMS側のデータで両パターンを確認できない場合は、コード上のロジックの妥当性を確認）
- Goods セクションで4つのカテゴリカードが横スクロールでき、各カードとフッターリンクがSUZURIへ正しく遷移することを確認
- ブラウザのコンソールに404等のエラーが出ていないことを確認

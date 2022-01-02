
github APIを用いて、コミット数を取得する

# 使用方法

- githubのコミット数の取得のためgithubのユーザー名、githubのアクセストークンを環境変数として指定する必要があります。
- twitter APIによる投稿のため、twitter APIのAPP_KEY, APP_SECRET, ACCESS_TOKEN, ACCESS_SECRETを取得し、環境変数として指定する必要があります。

# .envファイルの設定

- sample.envを.envにコピーし、githubのsettings, twitter developerそれぞれの画面から必要なデータを取得して、
.envファイルに記述します。
(AWS lambdaなどを使う場合は環境変数に設定する)

```
$ cp sample.env .env
```

- =以降を埋めます。
```
GITHUB_USERNAME=
GITHUB_ACCESS_TOKEN=
TWITTER_APP_KEY=
TWITTER_APP_SECRET=
TWITTER_ACCESS_TOKEN=
TWITTER_ACCESS_SECRET=
```

以下のコマンドを毎晩12時ぐらいに実行するようにしておきます。(AWS lambdaなどで定期実行)
```
$ node ./tweet-github-commit-count.js
```

# 使用ライブラリ

- @octokit/core ... github API用
- twitter-api-v2 ... twitter APIを用いたツイート用
- dotenv ... .envファイル読み込み用


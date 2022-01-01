
github APIを用いて、コミット数を取得する

#使用方法

githubのユーザー名、githubのアクセストークンを環境変数として指定する必要があります。

```
$ GITHUB_USERNAME=xxx GITHUB_ACCESS_TOKEN=yyy node ./tweet-github-commit-count.js
```


#作業ログ

- mkdir tweet_github_commit_count

- github APIを使うためにoctokit/coreをインストール
  - npm init
  - npm install @octokit/core

## 作業ログ:コミット

- git init
- git add -A
- git commit -m "initial commit"
- github側でリポジトリ作成しておく
- git remote add origin https://github.com/yashyoshida/tweet-github-commit-count.git
- git push -u origin master


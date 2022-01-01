// for using github API
const { Octokit } = require("@octokit/core");
// for using twitter API
const { TwitterApi } = require('twitter-api-v2')
// load .env
require('dotenv').config()

let githubUsername = null
let githubAccessToken = null
let octokit = null
let twitterClient = null

function printUsage() {
    console.log('GITHUB_USERNAME=xxx GITHUB_ACCESS_TOKEN=xxx TWITTER_APP_KEY=xxx TWITTER_APP_SECRET=xxx TWITTER_ACCESS_TOKEN=xxx TWITTER_ACCESS_SECRET=xxx node ./tweet-github-commit-count.js')
    console.log('  you can specify environment variables by .env')
}

function loadEnv() {
    if (!process.env['GITHUB_USERNAME'] || !process.env['GITHUB_ACCESS_TOKEN'] ||
        !process.env['TWITTER_APP_KEY'] || !process.env['TWITTER_APP_SECRET'] ||
        !process.env['TWITTER_ACCESS_TOKEN'] || !process.env['TWITTER_ACCESS_SECRET']) {
        console.log('please specify environment variables')
        printUsage()
        process.exit(1)
    }
    githubUsername = process.env['GITHUB_USERNAME']
    githubAccessToken = process.env['GITHUB_ACCESS_TOKEN']
}

function initTwitterClient() {
    twitterClient = new TwitterApi({
        appKey: process.env['TWITTER_APP_KEY'],
        appSecret: process.env['TWITTER_APP_SECRET'],
        accessToken: process.env['TWITTER_ACCESS_TOKEN'],
        accessSecret: process.env['TWITTER_ACCESS_SECRET'],
      });
}

async function tweet(msg) {
    await twitterClient.v1.tweet(msg)
}

// github APIコールに用いるoctokitの初期化
function initOctokit(accessToken) {
    octokit = new Octokit({ auth: accessToken });
}

// github APIを使って、指定ユーザーのイベント一覧を得る(PushEvent等)
async function getGithubEvents(octokit, username) {
    const response = await octokit.request(`GET /users/${username}/events`, {per_page: 100})
    let events = response.data
    return events
}

function filterEventsIn24Hours(events) {
    let now = Date.now()
    return events.filter((event) => {
        let date = new Date(event.created_at)
        if (now - date.getTime() < 24 * 60 * 60 * 1000) {
            return true
        }
        return false
    })
}

// githubから取得したeventの配列から、コミット数を求める
function calcCommitsOfEvents(events) {
    let commits = 0
    events.forEach((event) => {
        if (event.type === 'PushEvent') {
            commits += event.payload.commits.length
        }
    })
    return commits
}

async function main() {
    loadEnv()
    initOctokit(githubAccessToken)
    let events = await getGithubEvents(octokit, githubUsername)
    events = filterEventsIn24Hours(events)
    let commits = calcCommitsOfEvents(events)

    initTwitterClient()
    let msg = `【自動投稿】今日のgithubへの私のコミット数は ${commits} でした。`
    tweet(msg)
}

main()

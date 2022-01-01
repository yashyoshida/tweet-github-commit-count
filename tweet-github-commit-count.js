// for using github API
const { Octokit } = require("@octokit/core");

let githubUsername = null
let githubAccessToken = null
let octokit = null

function printUsage() {
    console.log('GITHUB_USERNAME=xxx GITHUB_ACCESS_TOKEN=yyy node ./tweet-github-commit-count.js')
}

function loadEnv() {
    if (!process.env['GITHUB_USERNAME']) {
        console.log('please specify environment variable:GITHUB_USERNAME')
        printUsage()
        process.exit(1)
    }
    if (!process.env['GITHUB_ACCESS_TOKEN']) {
        console.log('please specify environment variable:GITHUB_ACCESS_TOKEN')
        printUsage()
        process.exit(1)
    }
    githubUsername = process.env['GITHUB_USERNAME']
    githubAccessToken = process.env['GITHUB_ACCESS_TOKEN']
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
    console.log(commits)
}

main()

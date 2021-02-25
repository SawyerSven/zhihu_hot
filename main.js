const fetch = require('node-fetch');
const dayjs = require('dayjs');
const path = require('path');
const fs = require('fs');
const { mergeTopic, createMarkdown, createArchive } = require('./utils');

const url = 'https://www.zhihu.com/api/v4/search/top_search';

const start = async () => {
  const response = await fetch(url);

  if (response.status !== 200) {
    console.error(response.statusText);
    process.exit(1);
  }

  const result = await response.json();
  const topic = result.top_search.words;
  const date = dayjs(new Date()).format('YYYY-MM-DD');

  const fullPath = path.join(__dirname, 'original', `${date}.json`);

  let existedTopic = [];
  if (fs.existsSync(fullPath)) {
    existedTopic = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
  }

  // 保存原始数据
  const allTopic = mergeTopic(topic, existedTopic);
  fs.writeFileSync(fullPath, JSON.stringify(topic));

  // 更新README
  const markdown = createMarkdown(allTopic);
  fs.writeFileSync(path.resolve(__dirname, 'README.md'), markdown);

  // 更新归档
  const archive = createArchive(allTopic,date)
  fs.writeFileSync(path.resolve(__dirname, 'archive', `${date}.md`), archive);
};

start();

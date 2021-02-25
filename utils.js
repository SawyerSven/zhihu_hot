const fs = require('fs');
const path = require('path');

exports.mergeTopic = (topics, existedTopic) => {
  const obj = {};

  for (const w of topics.concat(existedTopic)) {
    obj[w.query] = w.display_query;
  }
  return Object.entries(obj).map(([key, value]) => ({
    query: key,
    display_query: value,
  }));
};

exports.createMarkdown = (topics) => {
  const readme = fs.readFileSync(path.resolve(__dirname, 'README.md'), 'utf-8');
  return readme.replace(
    /<!-- BEGIN -->[\W\w]*<!-- END -->/,
    this.generateMarkdown(topics)
  );
};

exports.generateMarkdown = (topics) => {
  return `<!-- BEGIN -->
  <!-- 最后更新时间:${new Date()} -->
  ${topics
    .map(
      (item) =>
        `1. [${item.display_query}](https://www.zhihu.com/search?q=${item.query})`
    )
    .join('\n')}
  <!-- END -->`;
};

exports.createArchive = (topic,date)=>{
  return `# ${date}
  共 ${topic.length}条\n
  ${this.generateMarkdown(topic)}
  `
}
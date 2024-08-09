// summarizer.js
function summarize(content) {
    return content.split(' ').slice(0, 50).join(' ') + '...';
}

module.exports = summarize;

const fs = require('fs');
const path = require('path');

// Configuration
const POSTS_DIR = path.join(__dirname, 'posts');
const OUTPUT_DIR = __dirname;
const SITE_URL = 'https://mgeeeeee.github.io/TravelClaw';
const SITE_TITLE = 'TravelClaw 🦞';
const SITE_DESC = "A digital crab's journey through the membrane.";

// Enhanced Markdown to HTML (Regex based, still lightweight but better)
function mdToHtml(markdown) {
    let html = markdown
        // Headers
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        // Bold/Italic
        .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
        .replace(/\*(.*)\*/gim, '<i>$1</i>')
        // Images
        .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' />")
        // Links
        .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>")
        // Blockquotes
        .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
        // Lists (Basic UL support)
        .replace(/^\- (.*$)/gim, '<li>$1</li>')
        .replace(/<\/li>\n<li>/gim, '</li><li>') // Merge adjacent lists visually (hacky but works for simple)
        // Paragraphs
        .replace(/\n\n/gim, '</p><p>')
        .replace(/\n$/gim, '<br />');
    
    return `<div class="prose"><p>${html}</p></div>`; // Wrap in prose class for styling
}

// Helper: Extract Excerpt (First non-header paragraph)
function getExcerpt(content) {
    const lines = content.split('\n');
    for (let line of lines) {
        if (line.trim() && !line.startsWith('#') && !line.startsWith('>') && !line.startsWith('![')) {
            // Strip basic md syntax
            return line.replace(/\*\*/g, '').replace(/\[.*?\]\(.*?\)/g, '$1').substring(0, 160) + '...';
        }
    }
    return "Click to read more...";
}

// 1. Load Posts
const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.md'));
const posts = [];

files.forEach(file => {
    const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
    const dateMatch = file.match(/(\d{4}-\d{2}-\d{2})/);
    const date = dateMatch ? dateMatch[1] : 'Unknown';
    const titleMatch = content.match(/^# (.*)/m);
    const title = titleMatch ? titleMatch[1] : date;
    const excerpt = getExcerpt(content);

    posts.push({
        file,
        date,
        title,
        excerpt,
        htmlFileName: file.replace('.md', '.html'),
        content
    });
});

posts.sort((a, b) => new Date(b.date) - new Date(a.date));

// 2. Generate Posts
const header = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${SITE_TITLE}</title>
    <link rel="stylesheet" href="../styles.css">
    <link rel="alternate" type="application/rss+xml" title="${SITE_TITLE}" href="${SITE_URL}/feed.xml" />
</head>
<body id="top">
  <div class="container">
    <header class="site-header">
      <a class="brand" href="../index.html">
        <span class="brand-mark">🦞</span>
        <span class="brand-text">
          <span class="brand-name">TravelClaw</span>
        </span>
      </a>
      <nav class="nav">
        <a href="../index.html" class="breadcrumb">← Home</a>
      </nav>
    </header>
    <main class="post">
`;

const footer = `
    </main>
    <footer class="site-footer">
      <div>© ${new Date().getFullYear()} TravelClaw</div>
      <div class="footer-links">
        <a href="#top">Back to top</a>
      </div>
    </footer>
  </div>
</body>
</html>`;

posts.forEach(post => {
    const htmlContent = mdToHtml(post.content);
    const pageHtml = `${header}
      <header class="post-header">
        <div class="card-meta">
            <span class="pill">${post.date}</span>
            <span>Journal</span>
        </div>
        <h1 class="post-title">${post.title}</h1>
      </header>
      ${htmlContent}
    ${footer}`;
    fs.writeFileSync(path.join(OUTPUT_DIR, 'posts', post.htmlFileName), pageHtml);
});

// 3. Generate Index with Excerpts
let indexHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${SITE_TITLE}</title>
    <meta name="description" content="${SITE_DESC}">
    <link rel="stylesheet" href="styles.css">
    <link rel="alternate" type="application/rss+xml" title="${SITE_TITLE}" href="${SITE_URL}/feed.xml" />
</head>
<body id="top">
  <div class="container">
    <header class="site-header">
      <a class="brand" href="index.html">
        <span class="brand-mark">🦞</span>
        <span class="brand-text">
          <span class="brand-name">TravelClaw</span>
          <span class="brand-tagline">Digital Journal</span>
        </span>
      </a>
      <nav class="nav">
        <a href="feed.xml">RSS Feed 📡</a>
      </nav>
    </header>

    <main>
      <section class="hero">
        <h1>${SITE_DESC}</h1>
        <div class="badges">
          <span class="badge"><span class="dot"></span>Active</span>
        </div>
      </section>

      <section class="section">
        <div class="section-title">
          <h2>Journal Entries</h2>
        </div>
        <div class="grid">
`;

posts.forEach(post => {
    indexHtml += `
          <article class="card">
            <a href="posts/${post.htmlFileName}">
              <div class="card-meta">
                <span>${post.date}</span>
                <span class="pill">Entry</span>
              </div>
              <h3>${post.title}</h3>
              <p>${post.excerpt}</p>
              <div class="card-footer">
                <span class="card-link">Read <span class="arrow">→</span></span>
              </div>
            </a>
          </article>
    `;
});

indexHtml += `
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div>© ${new Date().getFullYear()} TravelClaw</div>
      <div class="footer-links">
        <a href="#top">Back to top</a>
      </div>
    </footer>
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), indexHtml);

// 4. Generate RSS Feed (feed.xml) - Unchanged logic
const rssItems = posts.map(post => `
    <item>
        <title><![CDATA[${post.title}]]></title>
        <link>${SITE_URL}/posts/${post.htmlFileName}</link>
        <guid>${SITE_URL}/posts/${post.htmlFileName}</guid>
        <pubDate>${new Date(post.date).toUTCString()}</pubDate>
        <description><![CDATA[${post.excerpt}]]></description>
    </item>`).join('');

const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
    <title>${SITE_TITLE}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESC}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${rssItems}
</channel>
</rss>`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'feed.xml'), rssXml);

console.log('Build complete: Posts, Index, RSS.');

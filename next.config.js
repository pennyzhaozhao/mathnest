/** @type {import('next').NextConfig} */
const fs = require('fs');
const path = require('path');

// 构建前把 content/courses/**/*.md 复制到 public/content/
// 这样浏览器可以直接 fetch /content/courses/igcse/algebra/quadratics.zh.md
function copyContentToPublic() {
  const src = path.join(__dirname, 'content', 'courses');
  const dest = path.join(__dirname, 'public', 'content', 'courses');
  if (!fs.existsSync(src)) return;

  function copyDir(from, to) {
    fs.mkdirSync(to, { recursive: true });
    for (const entry of fs.readdirSync(from)) {
      const fromPath = path.join(from, entry);
      const toPath = path.join(to, entry);
      if (fs.statSync(fromPath).isDirectory()) {
        copyDir(fromPath, toPath);
      } else if (entry.endsWith('.md')) {
        fs.copyFileSync(fromPath, toPath);
      }
    }
  }
  copyDir(src, dest);
  console.log('✓ Copied markdown files to public/content/');
}

copyContentToPublic();

const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
};

module.exports = nextConfig;

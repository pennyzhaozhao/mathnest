// last updated: 2026-05-04
/** @type {import('next').NextConfig} */
const fs = require('fs');
const path = require('path');

// 构建前把 content/courses/**/*.md 复制到 public/content/
// 这样浏览器可以直接 fetch /content/courses/igcse/algebra/quadratics.zh.md
function copyContentToPublic() {
  const contentDir = path.join(__dirname, 'content');
  const publicContent = path.join(__dirname, 'public', 'content');

  function copyDir(from, to, filter) {
    if (!fs.existsSync(from)) return;
    fs.mkdirSync(to, { recursive: true });
    for (const entry of fs.readdirSync(from)) {
      const fromPath = path.join(from, entry);
      const toPath = path.join(to, entry);
      if (fs.statSync(fromPath).isDirectory()) {
        copyDir(fromPath, toPath, filter);
      } else if (!filter || filter(entry)) {
        fs.copyFileSync(fromPath, toPath);
      }
    }
  }

  // 复制 markdown 笔记
  copyDir(
    path.join(contentDir, 'courses'),
    path.join(publicContent, 'courses'),
    f => f.endsWith('.md')
  );

  // 复制图片（paste 上传的图片存在这里）
  copyDir(
    path.join(contentDir, 'images'),
    path.join(publicContent, 'images'),
    f => /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(f)
  );

  console.log('✓ Copied markdown files to public/content/');
}

copyContentToPublic();

const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
};

module.exports = nextConfig;

const fs = require('fs');
const path = require('path');

// Target files
const indexFile = path.join(__dirname, 'index.html');
const cssFile = path.join(__dirname, 'styles.css');
const jsFile = path.join(__dirname, 'script.js');
const outputDir = path.join(__dirname, 'dist');
const outputFile = path.join(outputDir, 'wix-embed.html');

console.log('--- Patina Wix Bundler ---');

try {
    // 1. Read files
    console.log('Reading source files...');
    let html = fs.readFileSync(indexFile, 'utf8');
    const css = fs.readFileSync(cssFile, 'utf8');
    const js = fs.readFileSync(jsFile, 'utf8');

    // 2. Remove relative asset tags
    console.log('Removing local stylesheets and script links...');
    
    // Remove styles.css link
    html = html.replace(/<link rel="stylesheet" href="styles.css"[^>]*>/i, '');
    
    // Remove script.js script link
    html = html.replace(/<script src="script.js"><\/script>/i, '');

    // Remove preloads (since they will fail to resolve in sandboxed iframe)
    console.log('Stripping local JSON preload links...');
    const preloadRegex = /<!-- Preload data files -->[\s\S]*?(?=<header|<body|<\/head)/i;
    html = html.replace(preloadRegex, '');
    
    // Alternatively, just clean out any remaining _data preloads individually in case the comment is different
    html = html.replace(/<link rel="preload" href="_data\/[^"]+" as="fetch"[^>]*>/gi, '');

    // 3. Inject CSS before </head>
    console.log('Inlining styles...');
    const styleBlock = `\n    <style>\n${css}\n    </style>\n`;
    html = html.replace('</head>', `${styleBlock}</head>`);

    // 4. Inject JS before </body>
    console.log('Inlining scripts...');
    const scriptBlock = `\n    <script>\n${js}\n    </script>\n`;
    html = html.replace('</body>', `${scriptBlock}</body>`);

    // 5. Write to output
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.writeFileSync(outputFile, html, 'utf8');
    
    console.log(`\nSUCCESS! Generated single-file Wix bundle at:`);
    console.log(`-> ${outputFile}`);
    console.log(`File Size: ${(fs.statSync(outputFile).size / 1024).toFixed(2)} KB\n`);

} catch (error) {
    console.error('Error during bundling:', error.message);
    process.exit(1);
}

import fs from 'node:fs';
import * as glob from 'glob';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const ts = require('typescript');

console.log('Analyzing project metrics using TypeScript compiler...');

let totalTokens = 0;
let totalLLOC = 0;
let processedFiles = 0;

// Ignore patterns
const files = glob.sync('**/*.{js,ts,jsx,tsx}', {
    ignore: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/coverage/**',
        '**/.git/**',
        'report/**',
        'metrics.js' // Exclude self
    ]
});

console.log(`Found ${files.length} files to analyze.`);

files.forEach(file => {
    try {
        const code = fs.readFileSync(file, 'utf8');

        // 1. Count Tokens using TS Scanner
        const scanner = ts.createScanner(ts.ScriptTarget.Latest, false, ts.LanguageVariant.Standard, code);
        let tokenCount = 0;
        let token = scanner.scan();

        while (token !== ts.SyntaxKind.EndOfFileToken) {
            // Exclude whitespace and comments from token count
            if (token !== ts.SyntaxKind.WhitespaceTrivia &&
                token !== ts.SyntaxKind.NewLineTrivia &&
                token !== ts.SyntaxKind.SingleLineCommentTrivia &&
                token !== ts.SyntaxKind.MultiLineCommentTrivia) {
                tokenCount++;
            }
            token = scanner.scan();
        }

        // 2. Count LLOC (Logical Lines of Code)
        // Strategy: Remove comments, then count non-empty lines
        const codeWithoutComments = code.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');
        const lloc = codeWithoutComments.split('\n').filter(line => line.trim().length > 0).length;

        totalTokens += tokenCount;
        totalLLOC += lloc;
        processedFiles++;

    } catch (error) {
        console.error(`Error analyzing ${file}: ${error.message}`);
    }
});

console.log('\n--- Metrics Report ---');
console.log(`Files Analyzed: ${processedFiles}`);
console.log(`Total Lexical Tokens: ${totalTokens.toLocaleString()}`);
console.log(`Total LLOC: ${totalLLOC.toLocaleString()}`);
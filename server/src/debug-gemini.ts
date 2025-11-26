
import dotenv from 'dotenv';
import path from 'path';

// Load env from root .env and .env.local
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') }); // Overrides .env

const apiKey = process.env.GEMINI_API_KEY;

console.log('--- Gemini Debugger (Fetch) ---');
console.log('API Key present:', !!apiKey);
if (apiKey) console.log('API Key length:', apiKey.length);

async function testModel(modelName: string) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    console.log(`\nTesting model: ${modelName}...`);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: 'Hi' }] }] })
        });

        console.log(`Status: ${response.status} ${response.statusText}`);

        if (!response.ok) {
            const data = await response.json() as any;
            console.error('❌ Error:', data.error?.message || JSON.stringify(data));
        } else {
            console.log('✅ Success!');
        }
    } catch (error: any) {
        console.error('❌ Network Error:', error.message);
    }
}

async function runTests() {
    if (!apiKey) {
        console.error('❌ No API Key found');
        return;
    }
    // await testModel('gemini-1.5-flash');
    await testModel('gemini-2.5-flash');
}

runTests();

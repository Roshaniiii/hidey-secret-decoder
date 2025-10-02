// Simple test to verify encoding/decoding preserves original message
const { encodeMessage, decodeMessage } = require('./src/lib/encoding.ts');

// Test cases with various characters including spaces, punctuation, etc.
const testMessages = [
  'Hello World',
  'Meet me at the old oak tree',
  'Test with spaces   and multiple   spaces',
  'Special chars: Hello, World! How are you?',
  'Numbers 123 and letters ABC',
  'Mixed Case TeXt WiTh SpAcEs',
];

const patterns = ['alnum', 'symbol', 'caps', 'hex', 'emoji'];

console.log('Testing encoding/decoding...\n');

let allPassed = true;

for (const message of testMessages) {
  for (const pattern of patterns) {
    const encoded = encodeMessage(message, pattern);
    const decoded = decodeMessage(encoded, pattern);
    
    const passed = message === decoded;
    if (!passed) {
      console.log(`❌ FAILED for pattern "${pattern}"`);
      console.log(`  Original: "${message}"`);
      console.log(`  Encoded:  "${encoded}"`);
      console.log(`  Decoded:  "${decoded}"`);
      console.log(`  Match: ${passed}\n`);
      allPassed = false;
    }
  }
}

if (allPassed) {
  console.log('✅ All tests passed! Original messages are decoded correctly.');
} else {
  console.log('\n⚠️  Some tests failed.');
  process.exit(1);
}


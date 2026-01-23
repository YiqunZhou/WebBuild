// Quick test for getIndexPage API
import fetch from 'node-fetch';

async function testIndexAPI() {
  try {
    console.log('Testing Index API...');
    const response = await fetch('http://localhost:8888/api/getIndexPage');
    const data = await response.json();

    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('\n✅ Success! Index page found:');
      console.log('  - Name:', data.name);
      console.log('  - Slug:', data.slug);
      console.log('  - Description:', data.description);
      console.log('  - Title Image:', data.titleImage);
      console.log('  - Content blocks:', data.content?.length || 0);
    } else {
      console.log('\n❌ Error:', data.error);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure to run "npm run dev" first in another terminal');
  }
}

testIndexAPI();

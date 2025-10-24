// Test script để kiểm tra logic authentication
console.log('Testing authentication logic...');

// Test 1: Kiểm tra localStorage
console.log('1. Checking localStorage:');
const token = localStorage.getItem('access_token');
console.log('Token exists:', !!token);
console.log('Token value:', token ? 'Present' : 'None');

// Test 2: Kiểm tra trạng thái auth
console.log('\n2. Testing auth state:');
if (!token) {
  console.log('✅ No token - should show login/register buttons');
} else {
  console.log('⚠️ Token exists - should verify with backend');
}

// Test 3: Clear localStorage để test
console.log('\n3. Clearing localStorage for testing...');
localStorage.removeItem('access_token');
console.log('✅ localStorage cleared');

// Test 4: Kiểm tra lại
console.log('\n4. Re-checking after clear:');
const newToken = localStorage.getItem('access_token');
console.log('Token after clear:', newToken ? 'Still exists' : 'Cleared successfully');

console.log('\n✅ Auth logic test completed');

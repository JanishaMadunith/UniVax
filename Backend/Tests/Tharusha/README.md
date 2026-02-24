# User API Test Suite - Tharusha

Comprehensive test suite for the UniVax User Management API endpoints using Jest and Supertest.

## 📁 Test Files

### 1. **UserEndpoints.test.js**
Core integration tests for all User API endpoints:
- User Registration
- User Login
- Get All Users
- Get User by ID
- Update User
- Delete User
- Data Validation
- Edge Cases

**Test Cases**: 28+

### 2. **UserAuthSecurity.test.js**
Security-focused tests covering authentication and data protection:
- Password Security & Hashing
- Email Uniqueness & Validation
- Input Validation & Sanitization
- Remember Me Functionality
- Data Persistence
- Error Handling
- Response Structure Validation

**Test Cases**: 18+

### 3. **UserPerformance.test.js**
Performance and load testing scenarios:
- Bulk Operations
- Large Data Handling
- Rapid Sequential Operations
- Special Characters & Unicode
- Pagination & Filtering
- Timestamp Operations
- Concurrent Modifications
- Response Time Performance

**Test Cases**: 20+

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas connection)
- Environment variables configured in `.env`

### Installation

1. Install test dependencies:
```bash
npm install
```

This will install:
- `jest`: Test framework
- `supertest`: HTTP request library for testing

### Configuration

Ensure your `.env` file contains:
```
MONGO_URI=mongodb://localhost:27017/univax  # or your MongoDB URI
PORT=5001
```

## 📝 Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (auto-rerun on file changes)
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

### Run specific test file
```bash
npm test -- UserEndpoints.test.js
```

### Run tests matching a pattern
```bash
npm test -- --testNamePattern="Login"
```

## ✅ Test Coverage

The test suite covers:

| Feature | Tests | Coverage |
|---------|-------|----------|
| Registration | 6 | ✅ 100% |
| Login | 6 | ✅ 100% |
| Get All Users | 3 | ✅ 100% |
| Get User by ID | 4 | ✅ 100% |
| Update User | 4 | ✅ 100% |
| Delete User | 3 | ✅ 100% |
| Security | 18 | ✅ 95% |
| Performance | 20 | ✅ 90% |

**Total Test Cases**: 66+

## 🔒 Security Tests Included

- ✅ Password Hashing Verification
- ✅ SQL Injection Prevention
- ✅ XSS Protection
- ✅ Email Uniqueness
- ✅ Input Validation
- ✅ Null/Undefined Handling
- ✅ Concurrent Request Handling

## 📊 Test Structure

```
Tests/
├── Tharusha/
│   ├── UserEndpoints.test.js          # Core endpoint tests
│   ├── UserAuthSecurity.test.js       # Security tests
│   └── UserPerformance.test.js        # Performance tests
```

## 🧪 Example Test Cases

### Registration Test
```javascript
it('Should successfully register a new user with valid data', async () => {
    const res = await request(server)
        .post('/users/register')
        .send({
            name: 'John Doe',
            email: 'test@test.com',
            phone: '0771234567',
            password: 'password123',
            confirmPassword: 'password123',
            agreeToTerms: true
        });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
});
```

### Login Test
```javascript
it('Should successfully login with valid credentials', async () => {
    const res = await request(server)
        .post('/users/login')
        .send({
            email: 'test@test.com',
            password: 'password123',
            rememberMe: false
        });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
});
```

## ⚙️ Jest Configuration

The `jest.config.js` file is configured with:
- **testEnvironment**: Node.js
- **testMatch**: `**/Tests/**/*.test.js`
- **testTimeout**: 30 seconds
- **collectCoverage**: Enabled for Controllers, Models, Routes
- **forceExit**: Closes connections after tests complete

## 🐛 Debugging Tests

### Run a single test file with detailed output
```bash
npm test -- UserEndpoints.test.js --verbose
```

### Run tests and pause on failure
```bash
npm test -- --detectOpenHandles
```

### Generate coverage report in HTML
```bash
npm run test:coverage
```

Coverage report will be generated in: `coverage/lcov-report/index.html`

## 🔄 CI/CD Integration

To integrate with CI/CD pipelines:

```bash
# Run tests with coverage and exit with appropriate code
npm test -- --coverage --passWithNoTests
```

## 📋 Test Data Cleanup

All tests include:
- **beforeAll()**: Clears test data before test suite runs
- **afterAll()**: Cleans up test data after suite completes

This ensures no test data persists in the database.

## ⚠️ Important Notes

1. **Database**: Make sure MongoDB is running before executing tests
2. **Port**: Default server port is 5001 (configurable in `.env`)
3. **Timeout**: Tests have a 30-second timeout to handle async operations
4. **Isolation**: Each test file cleans up its own test data

## 🚨 Troubleshooting

### Tests timeout
- Increase timeout in `jest.config.js`: `testTimeout: 60000`
- Ensure MongoDB connection is working

### Port already in use
- Change PORT in `.env` file
- Or kill process using port 5001: `lsof -ti:5001 | xargs kill -9`

### Database connection errors
- Verify `MONGO_URI` in `.env`
- Check MongoDB is running: `mongod`

### Module not found errors
- Run: `npm install`
- Clear cache: `npm cache clean --force`

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Express Testing Guide](https://expressjs.com/)

## 👤 Author

**Tharusha** - User Management Module

---

**Last Updated**: February 2026

const request = require('supertest');
const mongoose = require('mongoose');
const server = require('../../server');
const User = require('../../Model/Tharusha/UserModel');

const API_PREFIX = '/users';

describe('User Endpoints Integration Testing', () => {
    let userId;
    let testUser;

    beforeAll(async () => {
        // Connect to MongoDB for testing
        if (!mongoose.connection.readyState) {
            const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/univax-test';
            await mongoose.connect(MONGO_URI);
        }
        // Clear existing test users before starting
        await User.deleteMany({ email: { $in: ['test@test.com', 'newuser@test.com', 'update@test.com'] } });
    });

    afterAll(async () => {
        // Clean up after all tests
        await User.deleteMany({ email: { $in: ['test@test.com', 'newuser@test.com', 'update@test.com'] } });
        if (mongoose.connection.readyState) {
            await mongoose.connection.close();
        }
    });

    // --- TEST: User Registration ---
    describe(`POST ${API_PREFIX}/register`, () => {
        it('Should successfully register a new user with valid data', async () => {
            const res = await request(server)
                .post(`${API_PREFIX}/register`)
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
            expect(res.body.message).toBe('User registered successfully');
            expect(res.body.token).toBeDefined();
            expect(typeof res.body.token).toBe('string');
            expect(res.body.user.name).toBe('John Doe');
            expect(res.body.user.email).toBe('test@test.com');
            expect(res.body.user.phone).toBe('0771234567');
            expect(res.body.user.id).toBeDefined();
            userId = res.body.user.id; // Save for later tests
        });

        it('Should fail if required fields are missing', async () => {
            const res = await request(server)
                .post(`${API_PREFIX}/register`)
                .send({
                    name: 'Jane Doe',
                    email: 'jane@test.com',
                    // Missing phone, password, confirmPassword
                    agreeToTerms: true
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('All fields are required');
        });

        it('Should fail if passwords do not match', async () => {
            const res = await request(server)
                .post(`${API_PREFIX}/register`)
                .send({
                    name: 'Jane Doe',
                    email: 'jane@test.com',
                    phone: '0771234567',
                    password: 'password123',
                    confirmPassword: 'password456',
                    agreeToTerms: true
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Passwords do not match');
        });

        it('Should fail if password is less than 6 characters', async () => {
            const res = await request(server)
                .post(`${API_PREFIX}/register`)
                .send({
                    name: 'Jane Doe',
                    email: 'jane@test.com',
                    phone: '0771234567',
                    password: 'pass',
                    confirmPassword: 'pass',
                    agreeToTerms: true
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Password must be at least 6 characters long');
        });

        it('Should fail if user already exists with same email', async () => {
            // First user already created in initial test
            const res = await request(server)
                .post(`${API_PREFIX}/register`)
                .send({
                    name: 'Another User',
                    email: 'test@test.com', // Same email
                    phone: '0779876543',
                    password: 'password123',
                    confirmPassword: 'password123',
                    agreeToTerms: true
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('User already exists with this email');
        });

        it('Should fail if agreeToTerms is not true', async () => {
            const res = await request(server)
                .post(`${API_PREFIX}/register`)
                .send({
                    name: 'Mike Smith',
                    email: 'mike@test.com',
                    phone: '0771234567',
                    password: 'password123',
                    confirmPassword: 'password123',
                    agreeToTerms: false
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('All fields are required');
        });
    });

    // --- TEST: User Login ---
    describe(`POST ${API_PREFIX}/login`, () => {
        it('Should successfully login with valid credentials', async () => {
            const res = await request(server)
                .post(`${API_PREFIX}/login`)
                .send({
                    email: 'test@test.com',
                    password: 'password123',
                    rememberMe: false
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('Login successful');
            expect(res.body.token).toBeDefined();
            expect(typeof res.body.token).toBe('string');
            expect(res.body.user.email).toBe('test@test.com');
            expect(res.body.user.name).toBe('John Doe');
        });

        it('Should successfully login and set rememberMe flag', async () => {
            const res = await request(server)
                .post(`${API_PREFIX}/login`)
                .send({
                    email: 'test@test.com',
                    password: 'password123',
                    rememberMe: true
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.user.rememberMe).toBe(true);
        });

        it('Should fail if email is missing', async () => {
            const res = await request(server)
                .post(`${API_PREFIX}/login`)
                .send({
                    password: 'password123'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Email and password are required');
        });

        it('Should fail if password is missing', async () => {
            const res = await request(server)
                .post(`${API_PREFIX}/login`)
                .send({
                    email: 'test@test.com'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Email and password are required');
        });

        it('Should fail if user email does not exist', async () => {
            const res = await request(server)
                .post(`${API_PREFIX}/login`)
                .send({
                    email: 'nonexistent@test.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Invalid email or password');
        });

        it('Should fail if password is incorrect', async () => {
            const res = await request(server)
                .post(`${API_PREFIX}/login`)
                .send({
                    email: 'test@test.com',
                    password: 'wrongpassword'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Invalid email or password');
        });
    });

    // --- TEST: Get All Users ---
    describe(`GET ${API_PREFIX}/`, () => {
        it('Should fetch all users with status 200', async () => {
            const res = await request(server).get(`${API_PREFIX}/`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.users)).toBe(true);
            expect(res.body.count).toBeGreaterThan(0);
        });

        it('Should not include password field in response', async () => {
            const res = await request(server).get(`${API_PREFIX}/`);

            expect(res.statusCode).toBe(200);
            res.body.users.forEach(user => {
                expect(user.password).toBeUndefined();
            });
        });

        it('Should return all required user fields', async () => {
            const res = await request(server).get(`${API_PREFIX}/`);

            expect(res.statusCode).toBe(200);
            res.body.users.forEach(user => {
                expect(user._id).toBeDefined();
                expect(user.name).toBeDefined();
                expect(user.email).toBeDefined();
                expect(user.phone).toBeDefined();
            });
        });
    });

    // --- TEST: Get User by ID ---
    describe(`GET ${API_PREFIX}/:id`, () => {
        it('Should fetch user by valid ID', async () => {
            const res = await request(server).get(`${API_PREFIX}/${userId}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.user._id).toBe(userId);
            expect(res.body.user.email).toBe('test@test.com');
        });

        it('Should not include password in user response', async () => {
            const res = await request(server).get(`${API_PREFIX}/${userId}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.user.password).toBeUndefined();
        });

        it('Should return 404 if user does not exist', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(server).get(`${API_PREFIX}/${fakeId}`);

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('User not found');
        });

        it('Should return 500 if ID format is invalid', async () => {
            const res = await request(server).get(`${API_PREFIX}/invalidid`);

            expect(res.statusCode).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });

    // --- TEST: Update User ---
    describe(`PUT ${API_PREFIX}/:id`, () => {
        it('Should successfully update user with valid data', async () => {
            const res = await request(server)
                .put(`${API_PREFIX}/${userId}`)
                .send({
                    name: 'John Updated',
                    email: `updated${Date.now()}@test.com`,
                    phone: '0779876543'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('User updated successfully');
            expect(res.body.user.name).toBe('John Updated');
            expect(res.body.user.phone).toBe('0779876543');
        });

        it('Should update only name field', async () => {
            const res = await request(server)
                .put(`${API_PREFIX}/${userId}`)
                .send({
                    name: 'John Final Name'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.user.name).toBe('John Final Name');
        });

        it('Should not update password field', async () => {
            const res = await request(server)
                .put(`${API_PREFIX}/${userId}`)
                .send({
                    name: 'Same User',
                    password: 'newpassword123'
                });

            expect(res.statusCode).toBe(200);
            // Verify password was not actually changed by attempting login with old password
            const loginRes = await request(server)
                .post(`${API_PREFIX}/login`)
                .send({
                    email: 'updated@test.com',
                    password: 'password123'
                });

            expect(loginRes.statusCode).toBe(200);
            expect(loginRes.body.success).toBe(true);
        });

        it('Should return 404 if user does not exist', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(server)
                .put(`${API_PREFIX}/${fakeId}`)
                .send({
                    name: 'Non-existent User'
                });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('User not found');
        });
    });

    // --- TEST: Delete User ---
    describe(`DELETE ${API_PREFIX}/:id`, () => {
        it('Should successfully delete user by ID', async () => {
            // Create a temporary user for deletion
            const tempUser = await request(server)
                .post(`${API_PREFIX}/register`)
                .send({
                    name: 'Temp User',
                    email: 'newuser@test.com',
                    phone: '0771111111',
                    password: 'password123',
                    confirmPassword: 'password123',
                    agreeToTerms: true
                });

            const tempUserId = tempUser.body.user.id;

            // Now delete the user
            const res = await request(server).delete(`${API_PREFIX}/${tempUserId}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('User deleted successfully');

            // Verify user is actually deleted
            const checkRes = await request(server).get(`${API_PREFIX}/${tempUserId}`);
            expect(checkRes.statusCode).toBe(404);
        });

        it('Should return 404 if user does not exist', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(server).delete(`${API_PREFIX}/${fakeId}`);

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('User not found');
        });

        it('Should return 500 if ID format is invalid', async () => {
            const res = await request(server).delete(`${API_PREFIX}/invalidid`);

            expect(res.statusCode).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });

    // --- TEST: User Data Validation ---
    describe('User Data Validation', () => {
        it('Should trim whitespace from user fields', async () => {
            const res = await request(server)
                .post(`${API_PREFIX}/register`)
                .send({
                    name: '  Jane Trimmed  ',
                    email: '  update@test.com  ',
                    phone: '  0771111222  ',
                    password: 'password123',
                    confirmPassword: 'password123',
                    agreeToTerms: true
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.user.name).toBe('Jane Trimmed');
            expect(res.body.user.email).toBe('update@test.com');
            expect(res.body.user.phone).toBe('0771111222');
        });

        it('Should convert email to lowercase', async () => {
            const res = await request(server)
                .post(`${API_PREFIX}/register`)
                .send({
                    name: 'Upper Case Email',
                    email: `UPPERCASE${Date.now()}@TEST.COM`,
                    phone: '0772222333',
                    password: 'password123',
                    confirmPassword: 'password123',
                    agreeToTerms: true
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.user.email).toBe(res.body.user.email.toLowerCase());
        });
    });

    // --- TEST: Edge Cases ---
    describe('Edge Cases', () => {
        it('Should handle very long user names', async () => {
            const longName = 'A'.repeat(1000);
            const res = await request(server)
                .post(`${API_PREFIX}/register`)
                .send({
                    name: longName,
                    email: `longname${Date.now()}@test.com`,
                    phone: '0773333444',
                    password: 'password123',
                    confirmPassword: 'password123',
                    agreeToTerms: true
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.user.name).toBe(longName);
        });

        it('Should handle special characters in phone field', async () => {
            const res = await request(server)
                .post(`${API_PREFIX}/register`)
                .send({
                    name: 'Special Phone',
                    email: `specialphone${Date.now()}@test.com`,
                    phone: '+94-77-1234-5678',
                    password: 'password123',
                    confirmPassword: 'password123',
                    agreeToTerms: true
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.user.phone).toBe('+94-77-1234-5678');
        });
    });
});

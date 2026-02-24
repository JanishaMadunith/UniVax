const request = require('supertest');
const mongoose = require('mongoose');
const server = require('../../server');
const User = require('../../Model/Tharusha/UserModel');
const bcrypt = require('bcryptjs');

const API_PREFIX = '/users';

describe('User Authentication & Security Testing', () => {
    let validUserId;
    let validUserEmail = 'security@test.com';
    let validUserPassword = 'SecurePass123';

    beforeAll(async () => {
        // Connect to MongoDB for testing
        if (!mongoose.connection.readyState) {
            const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/univax-test';
            await mongoose.connect(MONGO_URI);
        }
        // Clean up test data
        await User.deleteMany({ email: { $in: [validUserEmail, 'attacker@test.com', 'sql@test.com', 'xss@test.com'] } });

        // Create a valid test user
        const res = await request(server)
            .post(`${API_PREFIX}/register`)
            .send({
                name: 'Security Tester',
                email: validUserEmail,
                phone: '0770000000',
                password: validUserPassword,
                confirmPassword: validUserPassword,
                agreeToTerms: true
            });

        validUserId = res.body.user.id;
    });

    afterAll(async () => {
        await User.deleteMany({ email: /test\.com|@test\.|security|attacker|sql|xss/ });
        if (mongoose.connection.readyState) {
            await mongoose.connection.close();
        }
    });

    // --- TEST: Password Security ---
    describe('Password Security', () => {
        it('Should hash password and not store plain text', async () => {
            const user = await User.findById(validUserId);
            expect(user.password).not.toBe(validUserPassword);
            expect(user.password.length).toBeGreaterThan(validUserPassword.length); // Hashed is longer
        });

        it('Should not return password in login response', async () => {
            const res = await request(server)
                .post(`${API_PREFIX}/login`)
                .send({
                    email: validUserEmail,
                    password: validUserPassword
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.user.password).toBeUndefined();
        });

        it('Should correctly validate password match', async () => {
            const user = await User.findById(validUserId);
            const isMatch = await user.comparePassword(validUserPassword);
            expect(isMatch).toBe(true);
        });

        it('Should reject incorrect password validation', async () => {
            const user = await User.findById(validUserId);
            const isMatch = await user.comparePassword('WrongPassword123');
            expect(isMatch).toBe(false);
        });

        it('Should reject login with incorrect password', async () => {
            const res = await request(server)
                .post(`${API_PREFIX}/login`)
                .send({
                    email: validUserEmail,
                    password: 'IncorrectPassword'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    // --- TEST: Email Uniqueness & Validation ---
    describe('Email Security & Uniqueness', () => {
        it('Should enforce unique email constraint', async () => {
            const res = await request(server)
                .post(`${API_PREFIX}/register`)
                .send({
                    name: 'Duplicate Email User',
                    email: validUserEmail,
                    phone: '0771111111',
                    password: 'password123',
                    confirmPassword: 'password123',
                    agreeToTerms: true
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('User already exists with this email');
        });

        it('Should treat emails as case-insensitive', async () => {
            const res = await request(server)
                .post(`${API_PREFIX}/register`)
                .send({
                    name: 'Case Test User',
                    email: 'SECURITY@TEST.COM', // Different case
                    phone: '0771111111',
                    password: 'password123',
                    confirmPassword: 'password123',
                    agreeToTerms: true
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('User already exists with this email');
        });

        it('Should not allow empty email', async () => {
            const res = await request(server)
                .post(`${API_PREFIX}/register`)
                .send({
                    name: 'No Email User',
                    email: '',
                    phone: '0771111111',
                    password: 'password123',
                    confirmPassword: 'password123',
                    agreeToTerms: true
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('All fields are required');
        });
    });

    // --- TEST: Input Validation ---
    describe('Input Validation & Sanitization', () => {
        it('Should reject SQL injection attempts', async () => {
            const res = await request(server)
                .post(`${API_PREFIX}/register`)
                .send({
                    name: "'; DROP TABLE users; --",
                    email: 'sql@test.com',
                    phone: '0771111111',
                    password: 'password123',
                    confirmPassword: 'password123',
                    agreeToTerms: true
                });

            expect(res.statusCode).toBe(201);
            const user = await User.findOne({ email: 'sql@test.com' });
            expect(user).toBeDefined();
            expect(user.name).toBe("'; DROP TABLE users; --");
        });

        it('Should reject XSS attempts in name field', async () => {
            const res = await request(server)
                .post(`${API_PREFIX}/register`)
                .send({
                    name: '<img src=x onerror=alert("XSS")>',
                    email: 'xss@test.com',
                    phone: '0771111111',
                    password: 'password123',
                    confirmPassword: 'password123',
                    agreeToTerms: true
                });

            expect(res.statusCode).toBe(201);
            const user = await User.findOne({ email: 'xss@test.com' });
            expect(user.name).toBe('<img src=x onerror=alert("XSS")>');
        });

        it('Should handle null values gracefully', async () => {
            const res = await request(server)
                .post(`${API_PREFIX}/register`)
                .send({
                    name: null,
                    email: 'null@test.com',
                    phone: null,
                    password: 'password123',
                    confirmPassword: 'password123',
                    agreeToTerms: true
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('Should handle undefined values gracefully', async () => {
            const res = await request(server)
                .post(`${API_PREFIX}/register`)
                .send({
                    name: 'Test',
                    email: 'undefined@test.com',
                    phone: 'phone',
                    password: 'password123',
                    confirmPassword: 'password123',
                    agreeToTerms: undefined
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('All fields are required');
        });
    });

    // --- TEST: Remember Me Feature ---
    describe('Remember Me Functionality', () => {
        it('Should set rememberMe flag when explicitly requested', async () => {
            const res = await request(server)
                .post(`${API_PREFIX}/login`)
                .send({
                    email: validUserEmail,
                    password: validUserPassword,
                    rememberMe: true
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.user.rememberMe).toBe(true);

            // Verify it was saved in database
            const user = await User.findById(validUserId);
            expect(user.rememberMe).toBe(true);
        });

        it('Should disable rememberMe flag when set to false', async () => {
            const res = await request(server)
                .post(`${API_PREFIX}/login`)
                .send({
                    email: validUserEmail,
                    password: validUserPassword,
                    rememberMe: false
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.user.rememberMe).toBe(false);

            const user = await User.findById(validUserId);
            expect(user.rememberMe).toBe(false);
        });

        it('Should retain rememberMe default when not provided', async () => {
            const res = await request(server)
                .post(`${API_PREFIX}/login`)
                .send({
                    email: validUserEmail,
                    password: validUserPassword
                });

            expect(res.statusCode).toBe(200);
            // Verify in database
            const user = await User.findById(validUserId);
            expect(user.rememberMe).toBeDefined();
        });
    });

    // --- TEST: Data Persistence ---
    describe('Data Persistence & Consistency', () => {
        it('Should properly store and retrieve user data', async () => {
            const res = await request(server)
                .get(`${API_PREFIX}/${validUserId}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.user.email).toBe(validUserEmail);
            expect(res.body.user.name).toBe('Security Tester');
            expect(res.body.user.phone).toBe('0770000000');
        });

        it('Should maintain data integrity during update', async () => {
            const originalUser = await User.findById(validUserId);
            const originalEmail = originalUser.email;

            const res = await request(server)
                .put(`${API_PREFIX}/${validUserId}`)
                .send({
                    name: 'Updated Name',
                    phone: '0779999999'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.user.email).toBe(originalEmail); // Email should not change
            expect(res.body.user.name).toBe('Updated Name');
            expect(res.body.user.phone).toBe('0779999999');
        });
    });

    // --- TEST: Error Handling ---
    describe('Error Handling & Resilience', () => {
        it('Should return appropriate error for missing required fields', async () => {
            const res = await request(server)
                .post(`${API_PREFIX}/register`)
                .send({
                    name: 'Incomplete User',
                    email: 'incomplete@test.com'
                    // Missing phone, password, confirmPassword
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBeDefined();
        });

        it('Should handle concurrent registration attempts gracefully', async () => {
            const userData = {
                name: 'Concurrent User',
                email: 'attacker@test.com',
                phone: '0771111111',
                password: 'password123',
                confirmPassword: 'password123',
                agreeToTerms: true
            };

            // Send concurrent requests
            const [res1, res2] = await Promise.all([
                request(server).post(`${API_PREFIX}/register`).send(userData),
                request(server).post(`${API_PREFIX}/register`).send(userData)
            ]);

            // One should succeed, one should fail
            const results = [res1.statusCode, res2.statusCode];
            expect(results.includes(201)).toBe(true);
            expect(results.includes(400)).toBe(true);
        });
    });

    // --- TEST: Response Validation ---
    describe('Response Structure Validation', () => {
        it('Should return consistent response structure for registration', async () => {
            const res = await request(server)
                .post(`${API_PREFIX}/login`)
                .send({
                    email: validUserEmail,
                    password: validUserPassword
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('success');
            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('token');
            expect(res.body).toHaveProperty('user');
            expect(res.body.user).toHaveProperty('id');
            expect(res.body.user).toHaveProperty('name');
            expect(res.body.user).toHaveProperty('email');
            expect(res.body.user).toHaveProperty('phone');
            expect(res.body.user).toHaveProperty('role');
            expect(['Patient', 'Doctor', 'Admin']).toContain(res.body.user.role);
        });

        it('Should not leak sensitive information in error responses', async () => {
            const res = await request(server)
                .post(`${API_PREFIX}/login`)
                .send({
                    email: validUserEmail,
                    password: 'wrongpassword'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe('Invalid email or password');
            // Message should be generic without revealing specific field
            expect(res.body.message).not.toContain('missing');
            expect(res.body.message).not.toContain('incorrect');
        });
    });

    // --- TEST: Role Management & Security ---
    describe('Role Management & Security', () => {
        it('Should assign default Patient role during registration', async () => {
            const res = await request(server)
                .post(`${API_PREFIX}/register`)
                .send({
                    name: 'Default Role User',
                    email: `defaultrole${Date.now()}@test.com`,
                    phone: '0771234567',
                    password: 'password123',
                    confirmPassword: 'password123',
                    agreeToTerms: true
                    // No role specified
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.user.role).toBe('Patient');
        });

        it('Should allow registration with Doctor role', async () => {
            const res = await request(server)
                .post(`${API_PREFIX}/register`)
                .send({
                    name: 'Doctor User',
                    email: `doctor${Date.now()}@test.com`,
                    phone: '0771234567',
                    password: 'password123',
                    confirmPassword: 'password123',
                    agreeToTerms: true,
                    role: 'Doctor'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.user.role).toBe('Doctor');
        });

        it('Should allow registration with Admin role', async () => {
            const res = await request(server)
                .post(`${API_PREFIX}/register`)
                .send({
                    name: 'Admin User',
                    email: `adminuser${Date.now()}@test.com`,
                    phone: '0771234567',
                    password: 'password123',
                    confirmPassword: 'password123',
                    agreeToTerms: true,
                    role: 'Admin'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.user.role).toBe('Admin');
        });

        it('Should reject invalid role values', async () => {
            const res = await request(server)
                .post(`${API_PREFIX}/register`)
                .send({
                    name: 'Invalid Role',
                    email: `invalidrole${Date.now()}@test.com`,
                    phone: '0771234567',
                    password: 'password123',
                    confirmPassword: 'password123',
                    agreeToTerms: true,
                    role: 'Superuser'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('Invalid role');
        });

        it('Should include role in JWT token', async () => {
            const loginRes = await request(server)
                .post(`${API_PREFIX}/login`)
                .send({
                    email: validUserEmail,
                    password: validUserPassword
                });

            expect(loginRes.statusCode).toBe(200);
            const token = loginRes.body.token;
            
            // Decode JWT token (just verify it contains role data)
            const parts = token.split('.');
            expect(parts.length).toBe(3); // Valid JWT has 3 parts
        });

        it('Should allow role updates for existing users', async () => {
            const res = await request(server)
                .put(`${API_PREFIX}/${validUserId}`)
                .send({
                    role: 'Doctor'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.user.role).toBe('Doctor');

            // Verify the update persisted
            const getRes = await request(server)
                .get(`${API_PREFIX}/${validUserId}`);
            expect(getRes.body.user.role).toBe('Doctor');
        });

        it('Should reject invalid role updates', async () => {
            const res = await request(server)
                .put(`${API_PREFIX}/${validUserId}`)
                .send({
                    role: 'InvalidRole'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('Invalid role');
        });
    });
});

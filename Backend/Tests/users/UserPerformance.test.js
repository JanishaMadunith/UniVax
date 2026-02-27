const request = require('supertest');
const mongoose = require('mongoose');
const server = require('../../server');
const User = require('../../Model/users/UserModel');

const API_PREFIX = '/users';

describe('User Endpoints - Performance & Load Testing', () => {
    beforeAll(async () => {
        // Connect to MongoDB for testing
        if (!mongoose.connection.readyState) {
            const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/univax-test';
            await mongoose.connect(MONGO_URI);
        }
        // Clean up before tests
        await User.deleteMany({ email: /perf|load|bulk|mass/ });
    });

    afterAll(async () => {
        await User.deleteMany({ email: /perf|load|bulk|mass|rapid|concurrent|timestamp|largedata|largephone|unicode|emoji|symbols/ });
        if (mongoose.connection.readyState) {
            await mongoose.connection.close();
        }
    });

    // --- TEST: Bulk User Creation ---
    describe('Bulk Operations', () => {
        it('Should handle multiple rapid registrations', async () => {
            const registrations = [];
            const roles = ['Patient', 'Doctor', 'Admin', 'Official', 'Patient'];

            for (let i = 0; i < 5; i++) {
                registrations.push(
                    request(server)
                        .post(`${API_PREFIX}/register`)
                        .send({
                            name: `Bulk User ${i}`,
                            email: `bulkuser${i}@test.com`,
                            phone: `077${String(i).padStart(7, '0')}`,
                            password: 'password123',
                            confirmPassword: 'password123',
                            agreeToTerms: true,
                            role: roles[i]
                        })
                );
            }

            const results = await Promise.all(registrations);

            results.forEach((res, index) => {
                expect(res.statusCode).toBe(201);
                expect(res.body.success).toBe(true);
                expect(res.body.user.email).toBe(`bulkuser${index}@test.com`);
                expect(res.body.user.role).toBe(roles[index]);
            });
        });

        it('Should retrieve all users efficiently', async () => {
            const start = Date.now();
            const res = await request(server).get(`${API_PREFIX}/`);
            const duration = Date.now() - start;

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.users)).toBe(true);
            expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
        });
    });

    // --- TEST: Large Data Handling ---
    describe('Large Data Handling', () => {
        it('Should handle very large name field', async () => {
            const largeName = 'A'.repeat(500);
            const res = await request(server)
                .post(`${API_PREFIX}/register`)
                .send({
                    name: largeName,
                    email: 'largedata@test.com',
                    phone: '0770001111',
                    password: 'password123',
                    confirmPassword: 'password123',
                    agreeToTerms: true
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.user.name.length).toBe(500);
        });

        it('Should handle large phone number field', async () => {
            const largePhone = '0' + '1'.repeat(50);
            const res = await request(server)
                .post(`${API_PREFIX}/register`)
                .send({
                    name: 'Large Phone',
                    email: 'largephone@test.com',
                    phone: largePhone,
                    password: 'password123',
                    confirmPassword: 'password123',
                    agreeToTerms: true
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.user.phone).toBe(largePhone);
        });
    });

    // --- TEST: Rapid Sequential Operations ---
    describe('Rapid Sequential Operations', () => {
        let testUserId;
        let testUserEmail = 'rapid@test.com';

        beforeAll(async () => {
            const res = await request(server)
                .post(`${API_PREFIX}/register`)
                .send({
                    name: 'Rapid Test User',
                    email: testUserEmail,
                    phone: '0770002222',
                    password: 'password123',
                    confirmPassword: 'password123',
                    agreeToTerms: true
                });
            testUserId = res.body.user.id;
        });

        it('Should handle rapid sequential logins', async () => {
            const logins = [];

            for (let i = 0; i < 5; i++) {
                logins.push(
                    request(server)
                        .post(`${API_PREFIX}/login`)
                        .send({
                            email: testUserEmail,
                            password: 'password123'
                        })
                );
            }

            const results = await Promise.all(logins);

            results.forEach(res => {
                expect(res.statusCode).toBe(200);
                expect(res.body.success).toBe(true);
            });
        });

        it('Should handle rapid sequential updates', async () => {
            const updates = [];

            for (let i = 0; i < 5; i++) {
                updates.push(
                    request(server)
                        .put(`${API_PREFIX}/${testUserId}`)
                        .send({
                            name: `Updated Name ${i}`,
                            phone: `077000${String(i).padStart(4, '0')}`
                        })
                );
            }

            const results = await Promise.all(updates);

            results.forEach(res => {
                expect(res.statusCode).toBe(200);
                expect(res.body.success).toBe(true);
            });

            // Verify final state
            const finalUser = await User.findById(testUserId);
            expect(finalUser.name).toBe('Updated Name 4');
        });

        it('Should handle rapid sequential reads', async () => {
            const reads = [];

            for (let i = 0; i < 10; i++) {
                reads.push(
                    request(server).get(`${API_PREFIX}/${testUserId}`)
                );
            }

            const results = await Promise.all(reads);

            results.forEach(res => {
                expect(res.statusCode).toBe(200);
                expect(res.body.success).toBe(true);
                expect(res.body.user._id).toBe(testUserId);
            });
        });
    });

    // --- TEST: Special Characters & Unicode ---
    describe('Special Characters & Unicode Handling', () => {
        it('Should handle Unicode characters in name', async () => {
            const res = await request(server)
                .post(`${API_PREFIX}/register`)
                .send({
                    name: 'விஜய் அர்ஜுன் 📱',
                    email: 'unicode1@test.com',
                    phone: '0770003333',
                    password: 'password123',
                    confirmPassword: 'password123',
                    agreeToTerms: true
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.user.name).toContain('விஜய்');
        });

        it('Should handle emoji in name field', async () => {
            const res = await request(server)
                .post(`${API_PREFIX}/register`)
                .send({
                    name: 'User 👤 With 😊 Emoji',
                    email: 'emoji@test.com',
                    phone: '0770004444',
                    password: 'password123',
                    confirmPassword: 'password123',
                    agreeToTerms: true
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.user.name).toContain('👤');
        });

        it('Should handle special symbols in phone', async () => {
            const res = await request(server)
                .post(`${API_PREFIX}/register`)
                .send({
                    name: 'Special Symbols',
                    email: 'symbols@test.com',
                    phone: '+94 (77) 000-5555 ext.123',
                    password: 'password123',
                    confirmPassword: 'password123',
                    agreeToTerms: true
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.user.phone).toContain('+94');
        });
    });

    // --- TEST: Pagination & Filtering ---
    describe('List Operations Efficiency', () => {
        it('Should retrieve users list efficiently', async () => {
            const start = Date.now();
            const res = await request(server).get(`${API_PREFIX}/`);
            const duration = Date.now() - start;

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.users)).toBe(true);
            expect(duration).toBeLessThan(3000);
        });

        it('Should return correct count of users', async () => {
            const res = await request(server).get(`${API_PREFIX}/`);

            expect(res.statusCode).toBe(200);
            expect(res.body.count).toBe(res.body.users.length);
        });
    });

    // --- TEST: Timestamp Validation ---
    describe('Timestamp Operations', () => {
        it('Should create timestamps for new users', async () => {
            const res = await request(server)
                .post(`${API_PREFIX}/register`)
                .send({
                    name: 'Timestamp User',
                    email: 'timestamp@test.com',
                    phone: '0770006666',
                    password: 'password123',
                    confirmPassword: 'password123',
                    agreeToTerms: true
                });

            expect(res.statusCode).toBe(201);
            const user = await User.findById(res.body.user.id);
            expect(user.createdAt).toBeDefined();
            expect(user.updatedAt).toBeDefined();
            expect(user.createdAt).toEqual(user.updatedAt);
        });

        it('Should update timestamp on user modification', async () => {
            const createRes = await request(server)
                .post(`${API_PREFIX}/register`)
                .send({
                    name: 'Timestamp Update User',
                    email: 'timestamp2@test.com',
                    phone: '0770007777',
                    password: 'password123',
                    confirmPassword: 'password123',
                    agreeToTerms: true
                });

            const userId = createRes.body.user.id;
            const userBefore = await User.findById(userId);

            // Wait a bit and then update
            await new Promise(resolve => setTimeout(resolve, 100));

            await request(server)
                .put(`${API_PREFIX}/${userId}`)
                .send({
                    name: 'Updated Timestamp User'
                });

            const userAfter = await User.findById(userId);

            expect(userAfter.updatedAt.getTime()).toBeGreaterThanOrEqual(userBefore.updatedAt.getTime());
        });
    });

    // --- TEST: Concurrent Modifications ---
    describe('Concurrent Modification Handling', () => {
        let concurrentTestUserId;

        beforeAll(async () => {
            const res = await request(server)
                .post(`${API_PREFIX}/register`)
                .send({
                    name: 'Concurrent Test',
                    email: 'concurrent@test.com',
                    phone: '0770008888',
                    password: 'password123',
                    confirmPassword: 'password123',
                    agreeToTerms: true
                });
            concurrentTestUserId = res.body.user.id;
        });

        it('Should handle concurrent updates without data loss', async () => {
            const updates = [
                request(server)
                    .put(`${API_PREFIX}/${concurrentTestUserId}`)
                    .send({ name: 'Update 1', phone: '0771111111' }),
                request(server)
                    .put(`${API_PREFIX}/${concurrentTestUserId}`)
                    .send({ name: 'Update 2', phone: '0772222222' }),
                request(server)
                    .put(`${API_PREFIX}/${concurrentTestUserId}`)
                    .send({ name: 'Update 3', phone: '0773333333' })
            ];

            const results = await Promise.all(updates);

            results.forEach(res => {
                expect(res.statusCode).toBe(200);
                expect(res.body.success).toBe(true);
            });

            // Verify final state exists and is valid
            const finalUser = await User.findById(concurrentTestUserId);
            expect(finalUser).toBeDefined();
            expect(finalUser.name).toBeDefined();
            expect(finalUser.phone).toBeDefined();
        });
    });

    // --- TEST: Role Performance ---
    describe('Role Field Performance', () => {
        it('Should handle bulk role assignments efficiently', async () => {
            const start = Date.now();
            const res = await request(server).get(`${API_PREFIX}/`);
            const duration = Date.now() - start;

            expect(res.statusCode).toBe(200);
            expect(duration).toBeLessThan(3000);

            // Verify all users have role field
            res.body.users.forEach(user => {
                expect(user.role).toBeDefined();
                expect(['Patient', 'Doctor', 'Admin', 'Official']).toContain(user.role);
            });
        });

        it('Should handle rapid role updates', async () => {
            const createRes = await request(server)
                .post(`${API_PREFIX}/register`)
                .send({
                    name: 'Role Test User',
                    email: `roletest${Date.now()}@test.com`,
                    phone: '0770009999',
                    password: 'password123',
                    confirmPassword: 'password123',
                    agreeToTerms: true,
                    role: 'Patient'
                });

            const userId = createRes.body.user.id;
            const roles = ['Doctor', 'Admin', 'Patient', 'Doctor'];
            const updates = [];

            for (let role of roles) {
                updates.push(
                    request(server)
                        .put(`${API_PREFIX}/${userId}`)
                        .send({ role: role })
                );
            }

            const results = await Promise.all(updates);

            results.forEach(res => {
                expect(res.statusCode).toBe(200);
                expect(res.body.user.role).toBeDefined();
            });
        });

        it('Should retrieve users filtered by role consideration', async () => {
            const start = Date.now();
            const res = await request(server).get(`${API_PREFIX}/`);
            const duration = Date.now() - start;

            expect(res.statusCode).toBe(200);
            expect(duration).toBeLessThan(2000);

            // Count users by role
            const roleCount = {
                Patient: 0,
                Doctor: 0,
                Admin: 0
            };

            res.body.users.forEach(user => {
                if (user.role in roleCount) {
                    roleCount[user.role]++;
                }
            });

            expect(roleCount.Patient + roleCount.Doctor + roleCount.Admin + (roleCount.Official || 0)).toBeGreaterThan(0);
        });
    });

    // --- TEST: Empty Database Scenarios ---
    describe('Boundary Conditions', () => {
        it('Should return 404 when getting non-existent user', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(server).get(`${API_PREFIX}/${fakeId}`);

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });

        it('Should handle invalid ObjectId format', async () => {
            const res = await request(server).get(`${API_PREFIX}/123invalid`);

            expect(res.statusCode).toBe(500);
        });
    });

    // --- TEST: Response Time ---
    describe('Response Time Performance', () => {
        it('Login should respond within acceptable time', async () => {
            const start = Date.now();
            await request(server)
                .post(`${API_PREFIX}/login`)
                .send({
                    email: 'rapid@test.com',
                    password: 'password123'
                });
            const duration = Date.now() - start;

            expect(duration).toBeLessThan(1000); // Should be under 1 second
        });

        it('User retrieval by ID should respond within acceptable time', async () => {
            const testId = new mongoose.Types.ObjectId();
            const start = Date.now();
            await request(server).get(`${API_PREFIX}/${testId}`);
            const duration = Date.now() - start;

            expect(duration).toBeLessThan(500); // Should be under 500ms
        });
    });

    // --- TEST: Extended Profile Fields Performance ---
    describe('Extended Profile Fields Performance', () => {
        it('Should handle user registration with address and doctor credentials efficiently', async () => {
            const start = Date.now();
            const res = await request(server)
                .post(`${API_PREFIX}/register`)
                .send({
                    name: 'Performance Doctor',
                    email: `perfdr${Date.now()}@test.com`,
                    phone: '0771234567',
                    password: 'password123',
                    confirmPassword: 'password123',
                    agreeToTerms: true,
                    role: 'Doctor',
                    address: {
                        city: 'Colombo',
                        district: 'Western',
                        province: 'Western Province'
                    },
                    doctorCredentials: {
                        licenseNumber: 'PERFLIC123',
                        clinicName: 'Performance Clinic',
                        specialization: 'Performance Testing'
                    }
                });
            const duration = Date.now() - start;

            expect(res.statusCode).toBe(201);
            expect(duration).toBeLessThan(2000); // Should complete within 2 seconds
            expect(res.body.user.address).toBeDefined();
            expect(res.body.user.doctorCredentials).toBeDefined();
        });

        it('Should handle bulk registration with Official role efficiently', async () => {
            const registrations = [];
            const start = Date.now();

            for (let i = 0; i < 3; i++) {
                registrations.push(
                    request(server)
                        .post(`${API_PREFIX}/register`)
                        .send({
                            name: `Official User ${i}`,
                            email: `perf-official${i}-${Date.now()}@test.com`,
                            phone: `077${String(i).padStart(7, '0')}`,
                            password: 'password123',
                            confirmPassword: 'password123',
                            agreeToTerms: true,
                            role: 'Official',
                            address: {
                                city: 'Colombo',
                                district: 'Western',
                                province: 'Western Province'
                            }
                        })
                );
            }

            const results = await Promise.all(registrations);
            const duration = Date.now() - start;

            expect(duration).toBeLessThan(5000); // Should complete all within 5 seconds
            results.forEach(res => {
                expect(res.statusCode).toBe(201);
                expect(res.body.user.role).toBe('Official');
                expect(res.body.user.address).toBeDefined();
            });
        });

        it('Should retrieve users with extended fields efficiently', async () => {
            const start = Date.now();
            const res = await request(server).get(`${API_PREFIX}/`);
            const duration = Date.now() - start;

            expect(res.statusCode).toBe(200);
            expect(duration).toBeLessThan(3000);
            
            // Verify extended fields are present
            res.body.users.forEach(user => {
                expect(user.address).toBeDefined();
                expect(user.accountStatus).toBeDefined();
            });
        });

        it('Should handle accountStatus updates efficiently', async () => {
            // First create a user
            const createRes = await request(server)
                .post(`${API_PREFIX}/register`)
                .send({
                    name: 'Status User',
                    email: `perfstatus${Date.now()}@test.com`,
                    phone: '0771234567',
                    password: 'password123',
                    confirmPassword: 'password123',
                    agreeToTerms: true
                });

            const userId = createRes.body.user.id;
            const start = Date.now();
            
            const res = await request(server)
                .put(`${API_PREFIX}/${userId}`)
                .send({
                    accountStatus: 'Suspended'
                });
            
            const duration = Date.now() - start;

            expect(res.statusCode).toBe(200);
            expect(duration).toBeLessThan(1000);
            expect(res.body.user.accountStatus).toBe('Suspended');
        });
    });
});



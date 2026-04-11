const request = require('supertest');
const mongoose = require('mongoose');
const server = require('../../server');
const Appointment = require('../../Model/Appointment/AppointmentModel');
const Clinic = require('../../Model/Appointment/ClinicModel');
const User = require('../../Model/users/UserModel');
const jwt = require('jsonwebtoken');

const API_PREFIX = '/api/V1/appointments';

describe('Appointment Performance Tests', () => {
    let clinicId;
    let authToken;

    beforeAll(async () => {
        if (!mongoose.connection.readyState) {
            const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/univax-test';
            await mongoose.connect(MONGO_URI);
        }

        const clinic = await Clinic.create({
            clinicName: 'Performance Test Clinic',
            address: '456 Test St',
            city: 'Test City',
            district: 'Test District',
            phone: '0719999999',
            email: 'perfclinic@test.com',
            clinicType: 'Public',
            openDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            openTime: '08:00',
            closeTime: '18:00'
        });

        clinicId = clinic._id;

        const user = await User.create({
            name: 'Performance Test User',
            email: 'perftest@perf.test',
            phone: '0719999998',
            password: 'hashedPassword123',
            role: 'Patient',
            address: {
                city: 'Test City',
                district: 'Test District'
            },
            agreeToTerms: true
        });

        authToken = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'testsecret',
            { expiresIn: '24h' }
        );
    });

    afterAll(async () => {
        await Appointment.deleteMany({ email: /perftest/ });
        await Clinic.deleteOne({ _id: clinicId });
        await User.deleteOne({ email: 'perftest@perf.test' });

        if (mongoose.connection.readyState) {
            await mongoose.connection.close();
        }
    });

    describe('Response Time', () => {
        it('GET all appointments should respond quickly', async () => {
            const startTime = Date.now();

            const res = await request(server)
                .get(`${API_PREFIX}/test/all`)
                .set('Authorization', `Bearer ${authToken}`);

            const responseTime = Date.now() - startTime;

            expect(res.statusCode).toBe(200);
            expect(responseTime).toBeLessThan(3000); // 3 seconds
        });

        it('POST create appointment should respond reasonably', async () => {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 30);
            const dateString = futureDate.toISOString().split('T')[0];

            const startTime = Date.now();

            const res = await request(server)
                .post(`${API_PREFIX}/create`)
                .send({
                    clinicId: clinicId.toString(),
                    fullName: 'Performance Test',
                    email: 'perftest@time.test',
                    phone: '0719999999',
                    vaccineType: 'COVID-19',
                    ageGroup: 'Adult (18-60)',
                    appointmentDate: dateString,
                    appointmentTime: '10:00'
                })
                .set('Authorization', `Bearer ${authToken}`);

            const responseTime = Date.now() - startTime;

            expect(res.statusCode).toBe(201);
            expect(responseTime).toBeLessThan(3000); // 3 seconds
        });
    });

    describe('Concurrent Requests', () => {
        it('should handle 5 concurrent GET requests', async () => {
            const startTime = Date.now();

            const promises = Array.from({ length: 5 }, () =>
                request(server)
                    .get(`${API_PREFIX}/test/all`)
            );

            const results = await Promise.all(promises);
            const totalTime = Date.now() - startTime;

            expect(results.filter(r => r.statusCode === 200).length).toBeGreaterThanOrEqual(4);
            expect(totalTime).toBeLessThan(15000); // 15 seconds for 5 requests
        });
    });
});

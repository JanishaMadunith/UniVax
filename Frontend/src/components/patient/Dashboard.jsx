import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Syringe, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ArrowRight,
  Star,
  FileText,
  ChevronRight,
  Bell,
  Activity,
  Shield,
  Award,
  TrendingUp,
  Heart
} from 'lucide-react';
import TopNavbar from './TopNavbar';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState({
    name: 'John',
    fullName: 'John Doe'
  });

  // Sample vaccination data
  const vaccinationStatus = {
    completed: 1,
    upcoming: 1,
    missed: 0,
    total: 2,
    vaccines: [
      { name: 'COVID-19', doses: [
        { dose: 1, status: 'completed', date: '2026-01-10' },
        { dose: 2, status: 'upcoming', dueDate: '2026-04-15' }
      ]}
    ]
  };

  // Sample upcoming appointments
  const upcomingAppointments = [
    {
      id: 1,
      vaccine: 'COVID-19 Dose 2',
      date: '2026-04-15',
      time: '10:30 AM',
      clinic: 'City Health Clinic',
      location: '123 Main St, Downtown',
      status: 'confirmed'
    }
  ];

  // Sample alerts
  const alerts = [
    {
      id: 1,
      type: 'warning',
      message: 'HPV Dose 2 due in 3 days',
      icon: AlertCircle
    },
    {
      id: 2,
      type: 'info',
      message: 'New vaccination campaign available: Flu Shot 2026',
      icon: Bell
    }
  ];

  // Sample nearby clinics
  const nearbyClinics = [
    {
      id: 1,
      name: 'City Health Clinic',
      distance: '0.5 km',
      rating: 4.8,
      address: '123 Main St',
      openUntil: '8:00 PM'
    },
    {
      id: 2,
      name: 'Community Vaccination Center',
      distance: '1.2 km',
      rating: 4.5,
      address: '456 Oak Ave',
      openUntil: '6:00 PM'
    }
  ];

  // Sample vaccination history
  const vaccinationHistory = [
    { vaccine: 'COVID-19', dose: 'Dose 1', date: '2026-01-10', status: 'completed', location: 'City Health Clinic', certificate: true }
  ];

  // Calculate progress percentage
  const progressPercentage = (vaccinationStatus.completed / vaccinationStatus.total) * 100;

  // Health streak
  const healthStreak = 15;

  return (
    <>
      <TopNavbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Welcome Section with Enhanced Design */}
          <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 rounded-2xl p-8 mb-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                  Welcome back, {user.name}! 👋
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    🌟 Health Streak: {healthStreak} days
                  </span>
                </h1>
                <p className="text-teal-100 text-lg">
                  Stay on track with your vaccination schedule
                </p>
                <div className="mt-4 flex gap-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <p className="text-xs opacity-80">Next Appointment</p>
                    <p className="text-sm font-semibold">April 15, 2026</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <p className="text-xs opacity-80">Vaccines Completed</p>
                    <p className="text-sm font-semibold">{vaccinationStatus.completed}/2</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/20 rounded-full p-3 backdrop-blur-sm">
                <Heart className="w-8 h-8" />
              </div>
            </div>
          </div>

          {/* Enhanced Stats Cards with Icons */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-b-4 border-teal-500 hover:shadow-xl transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Completed Doses</p>
                  <p className="text-4xl font-bold text-gray-800">{vaccinationStatus.completed}</p>
                  <p className="text-xs text-green-600 mt-2">↑ 100% from last month</p>
                </div>
                <div className="bg-teal-100 rounded-full p-3 group-hover:scale-110 transition">
                  <CheckCircle className="w-8 h-8 text-teal-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 border-b-4 border-amber-500 hover:shadow-xl transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Upcoming Doses</p>
                  <p className="text-4xl font-bold text-gray-800">{vaccinationStatus.upcoming}</p>
                  <p className="text-xs text-amber-600 mt-2">Due in 15 days</p>
                </div>
                <div className="bg-amber-100 rounded-full p-3 group-hover:scale-110 transition">
                  <Clock className="w-8 h-8 text-amber-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 border-b-4 border-rose-500 hover:shadow-xl transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Missed Doses</p>
                  <p className="text-4xl font-bold text-gray-800">{vaccinationStatus.missed}</p>
                  <p className="text-xs text-green-600 mt-2">✓ On track</p>
                </div>
                <div className="bg-rose-100 rounded-full p-3 group-hover:scale-110 transition">
                  <AlertCircle className="w-8 h-8 text-rose-600" />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl shadow-lg p-6 text-white hover:shadow-xl transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm mb-1">Protection Level</p>
                  <p className="text-4xl font-bold">{Math.round(progressPercentage)}%</p>
                  <p className="text-xs text-white/70 mt-2">↑ Good progress</p>
                </div>
                <div className="bg-white/20 rounded-full p-3 group-hover:scale-110 transition">
                  <Shield className="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>

          {/* Vaccination Status Progress - Enhanced */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Syringe className="w-6 h-6 text-teal-600" />
                  💉 Vaccination Progress
                </h2>
                <p className="text-sm text-gray-500 mt-1">Your journey to full protection</p>
              </div>
              <Activity className="w-5 h-5 text-teal-600" />
            </div>
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Overall Progress</span>
                <span className="font-semibold text-teal-600">{Math.round(progressPercentage)}% Complete</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 h-4 rounded-full transition-all duration-500 relative"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {vaccinationStatus.vaccines.map((vaccine, idx) => (
                <div key={idx} className="border border-gray-100 rounded-xl p-4 hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-800">{vaccine.name}</span>
                    <span className="text-sm text-teal-600 font-medium">
                      {vaccine.doses.filter(d => d.status === 'completed').length}/{vaccine.doses.length} Doses
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm">
                    {vaccine.doses.map((dose, doseIdx) => (
                      <div key={doseIdx} className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                        {dose.status === 'completed' ? (
                          <CheckCircle className="w-4 h-4 text-teal-500" />
                        ) : dose.status === 'upcoming' ? (
                          <Clock className="w-4 h-4 text-amber-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-500" />
                        )}
                        <span className="font-medium">Dose {dose.dose}</span>
                        {dose.status === 'upcoming' && (
                          <span className="text-xs text-gray-500">
                            Due in {Math.ceil((new Date(dose.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} days
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Upcoming Appointments - Enhanced */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-teal-600" />
                    📅 Upcoming Appointments
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Your next scheduled visits</p>
                </div>
                <Link to="/patient/appointments" className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1 group">
                  View All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </Link>
              </div>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-4 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 text-lg">{appointment.vaccine}</h3>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-teal-600" />
                              {new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <Clock className="w-4 h-4 text-teal-600" />
                              {appointment.time}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-teal-600" />
                              {appointment.clinic} - {appointment.location}
                            </p>
                          </div>
                        </div>
                        <div className="bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                          {appointment.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No upcoming appointments</p>
              )}
            </div>

            {/* Alerts & Notifications - Enhanced */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Bell className="w-6 h-6 text-teal-600" />
                    ⚠️ Alerts & Notifications
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Important updates for you</p>
                </div>
                <TrendingUp className="w-5 h-5 text-teal-600" />
              </div>
              <div className="space-y-3">
                {alerts.map((alert) => {
                  const Icon = alert.icon;
                  return (
                    <div key={alert.id} className={`p-4 rounded-xl ${
                      alert.type === 'warning' ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500' : 'bg-gradient-to-r from-teal-50 to-cyan-50 border-l-4 border-teal-500'
                    } hover:shadow-md transition-all`}>
                      <div className="flex items-start gap-3">
                        <Icon className={`w-5 h-5 ${alert.type === 'warning' ? 'text-amber-600' : 'text-teal-600'} mt-0.5`} />
                        <div>
                          <p className={`text-sm font-medium ${alert.type === 'warning' ? 'text-amber-800' : 'text-teal-800'}`}>
                            {alert.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {alert.type === 'warning' ? 'Action required soon' : 'Stay informed'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Nearby Clinics - Enhanced */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-teal-600" />
                    🏥 Nearby Clinics
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Vaccination centers near you</p>
                </div>
                <Link to="/patient/clinics" className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1 group">
                  Find Clinics <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </Link>
              </div>
              <div className="space-y-3">
                {nearbyClinics.map((clinic) => (
                  <div key={clinic.id} className="flex items-center justify-between p-4 hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 rounded-xl transition-all cursor-pointer">
                    <div>
                      <h3 className="font-semibold text-gray-800">{clinic.name}</h3>
                      <p className="text-sm text-gray-500">{clinic.address}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-gray-600">{clinic.rating}</span>
                        </div>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{clinic.distance} away</span>
                        <span className="text-xs text-teal-600">• Open until {clinic.openUntil}</span>
                      </div>
                    </div>
                    <div className="bg-teal-100 rounded-full p-2">
                      <MapPin className="w-5 h-5 text-teal-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions - Enhanced with Immunization Logs */}
            <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                ⚡ Quick Actions
                <span className="text-xs bg-white px-2 py-1 rounded-full text-teal-600">Fast access</span>
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Link to="/patient/appointments" className="bg-white hover:shadow-xl transition-all rounded-xl p-4 text-center group border border-gray-100">
                  <Calendar className="w-10 h-10 text-teal-600 mx-auto mb-2 group-hover:scale-110 transition" />
                  <p className="text-sm font-semibold text-gray-700">Book Appointment</p>
                  <p className="text-xs text-gray-400 mt-1">Schedule your next dose</p>
                </Link>

                <Link to="/patient/immunization-logs" className="bg-white hover:shadow-xl transition-all rounded-xl p-4 text-center group border border-gray-100">
                  <FileText className="w-10 h-10 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition" />
                  <p className="text-sm font-semibold text-gray-700">Immunization Logs</p>
                  <p className="text-xs text-gray-400 mt-1">View full vaccination history</p>
                </Link>

                <Link to="/patient/feedback" className="bg-white hover:shadow-xl transition-all rounded-xl p-4 text-center group border border-gray-100">
                  <Star className="w-10 h-10 text-amber-500 mx-auto mb-2 group-hover:scale-110 transition" />
                  <p className="text-sm font-semibold text-gray-700">Give Feedback</p>
                  <p className="text-xs text-gray-400 mt-1">Share your experience</p>
                </Link>

                <Link to="/patient/clinics" className="bg-white hover:shadow-xl transition-all rounded-xl p-4 text-center group border border-gray-100">
                  <MapPin className="w-10 h-10 text-cyan-600 mx-auto mb-2 group-hover:scale-110 transition" />
                  <p className="text-sm font-semibold text-gray-700">View Clinics</p>
                  <p className="text-xs text-gray-400 mt-1">Find nearby centers</p>
                </Link>
              </div>
            </div>
          </div>

          {/* Vaccination History - Enhanced */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-teal-600" />
                  📊 Vaccination History
                </h2>
                <p className="text-sm text-gray-500 mt-1">Complete record of your vaccinations</p>
              </div>
              <Award className="w-5 h-5 text-teal-600" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Vaccine</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Dose</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Location</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Certificate</th>
                  </tr>
                </thead>
                <tbody>
                  {vaccinationHistory.map((record, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 transition-all">
                      <td className="py-3 px-4 text-gray-800 font-medium">{record.vaccine}</td>
                      <td className="py-3 px-4 text-gray-600">{record.dose}</td>
                      <td className="py-3 px-4 text-gray-600">{new Date(record.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                          <CheckCircle className="w-3 h-3" />
                          {record.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{record.location}</td>
                      <td className="py-3 px-4">
                        <button className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1">
                          Download <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {vaccinationHistory.length === 0 && (
              <p className="text-center text-gray-500 py-8">No vaccination history available</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
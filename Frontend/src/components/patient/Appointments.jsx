import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, Clock, Syringe, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import TopNavbar from './TopNavbar';

const Appointments = () => {

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    vaccineType: '',
    doseNumber: '',
    ageGroup: '',
    appointmentDate: '',
    appointmentTime: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // VALIDATION
  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (errors.submit) {
      setErrors(prev => ({ ...prev, submit: '' }));
    }
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.warning('Please fill all fields!');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5001/api/V1/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          doseNumber: Number(formData.doseNumber)
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Appointment booked successfully!');

        // RESET FORM
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          vaccineType: '',
          doseNumber: '',
          ageGroup: '',
          appointmentDate: '',
          appointmentTime: ''
        });

      } else {
        const message = data.message || 'Failed to book appointment';
        toast.error(message);
        setErrors({ submit: message });
      }

    } catch (error) {
      console.error(error);
      const message = 'Network error. Please try again.';
      toast.error(message);
      setErrors({ submit: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <TopNavbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 border border-gray-100">

          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center items-center space-x-2 mb-2">
              <Syringe className="w-7 h-7 text-green-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Book Appointment
              </span>
            </div>
            <p className="text-sm text-gray-500">Schedule your vaccination</p>
          </div>

          {/* INLINE ERROR */}
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {errors.submit}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Full Name */}
            <div>
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full pl-10 py-2.5 border rounded-xl ${errors.fullName ? 'border-red-300' : 'border-gray-200'}`}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 py-2.5 border rounded-xl ${errors.email ? 'border-red-300' : 'border-gray-200'}`}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full pl-10 py-2.5 border rounded-xl ${errors.phone ? 'border-red-300' : 'border-gray-200'}`}
                />
              </div>
            </div>

            {/* Vaccine */}
            <div>
              <label className="text-sm font-medium text-gray-700">Vaccine Type</label>
              <input
                type="text"
                name="vaccineType"
                value={formData.vaccineType}
                onChange={handleChange}
                className={`w-full py-2.5 px-3 border rounded-xl ${errors.vaccineType ? 'border-red-300' : 'border-gray-200'}`}
              />
            </div>

            {/* Dose */}
            <div>
              <label className="text-sm font-medium text-gray-700">Dose Number</label>
              <input
                type="number"
                name="doseNumber"
                value={formData.doseNumber}
                onChange={handleChange}
                className={`w-full py-2.5 px-3 border rounded-xl ${errors.doseNumber ? 'border-red-300' : 'border-gray-200'}`}
              />
            </div>

            {/* Age Group */}
            <div>
              <label className="text-sm font-medium text-gray-700">Age Group</label>
              <select
                name="ageGroup"
                value={formData.ageGroup}
                onChange={handleChange}
                className={`w-full py-2.5 px-3 border rounded-xl ${errors.ageGroup ? 'border-red-300' : 'border-gray-200'}`}
              >
                <option value="">Select</option>
                <option value="child">Child</option>
                <option value="adult">Adult</option>
                <option value="elder">Elder</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="text-sm font-medium text-gray-700">Date</label>
              <div className="relative mt-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  className={`w-full pl-10 py-2.5 border rounded-xl ${errors.appointmentDate ? 'border-red-300' : 'border-gray-200'}`}
                />
              </div>
            </div>

            {/* Time */}
            <div>
              <label className="text-sm font-medium text-gray-700">Time</label>
              <div className="relative mt-1">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="time"
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleChange}
                  className={`w-full pl-10 py-2.5 border rounded-xl ${errors.appointmentTime ? 'border-red-300' : 'border-gray-200'}`}
                />
              </div>
            </div>

            {/* BUTTON */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-xl text-white font-semibold transition-all duration-200 ${
                  isSubmitting
                    ? 'bg-green-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-green-600 hover:scale-[1.02] hover:shadow-lg'
                }`}
              >
                {isSubmitting ? 'Booking...' : 'Book Appointment'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
};

export default Appointments;
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { doseAPI } from '../../services/api';

const DoseForm = ({ dose = null, vaccineId, vaccineName, onClose }) => {
  const [formData, setFormData] = useState({
    doseNumber: 1,
    doseName: '',
    minAge: { value: 0, unit: 'months' },
    maxAge: { value: null, unit: 'months' },
    intervalFromPrevious: {
      minDays: 0,
      maxDays: null,
      exactDays: null,
    },
    allowableDelay: 0,
    priority: 'routine',
    status: 'active',
    notes: '',
    guidelines: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [newGuideline, setNewGuideline] = useState({
    authority: '',
    reference: '',
    url: '',
  });

  useEffect(() => {
    if (dose) {
      setFormData(dose);
    }
  }, [dose]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.doseNumber || formData.doseNumber < 1) {
      newErrors.doseNumber = 'Dose number must be at least 1';
    }
    if (!formData.minAge?.value || formData.minAge.value < 0) {
      newErrors.minAge = 'Min age must be a positive number';
    }
    if (formData.maxAge?.value && formData.maxAge.value < formData.minAge.value) {
      newErrors.maxAge = 'Max age must be greater than min age';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setLoading(true);

      const submitData = { ...formData };
      if (!submitData.doseName) {
        submitData.doseName = `Dose ${submitData.doseNumber}`;
      }

      if (dose?._id) {
        await doseAPI.updateDose(dose._id, submitData);
        toast.success('Dose updated successfully');
      } else {
        await doseAPI.createDose(vaccineId, submitData);
        toast.success('Dose created successfully');
      }

      onClose();
    } catch (error) {
      toast.error('Failed to save dose: ' + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value,
    });
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData({
      ...formData,
      [parent]: {
        ...formData[parent],
        [field]: value,
      },
    });
  };

  const addGuideline = () => {
    if (newGuideline.authority.trim()) {
      setFormData({
        ...formData,
        guidelines: [...formData.guidelines, { ...newGuideline }],
      });
      setNewGuideline({ authority: '', reference: '', url: '' });
    }
  };

  const removeGuideline = (index) => {
    setFormData({
      ...formData,
      guidelines: formData.guidelines.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 transition"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800">
              {dose ? 'Edit Dose' : 'Create New Dose'}
            </h1>
            <p className="text-gray-600">{vaccineName}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Dose Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dose Number *
                </label>
                <input
                  type="number"
                  name="doseNumber"
                  min="1"
                  value={formData.doseNumber}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.doseNumber
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {errors.doseNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.doseNumber}</p>
                )}
              </div>

              {/* Dose Name (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dose Name (Optional)
                </label>
                <input
                  type="text"
                  name="doseName"
                  value={formData.doseName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Dose ${formData.doseNumber}`}
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>routine</option>
                  <option>catchup</option>
                  <option>special</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>active</option>
                  <option>superseded</option>
                  <option>pending</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add additional notes for this dose..."
              />
            </div>
          </div>

          {/* Age Requirements */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
              Age Requirements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Min Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Age *
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    value={formData.minAge.value}
                    onChange={(e) =>
                      handleNestedChange('minAge', 'value', parseFloat(e.target.value))
                    }
                    className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.minAge
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="0"
                  />
                  <select
                    value={formData.minAge.unit}
                    onChange={(e) =>
                      handleNestedChange('minAge', 'unit', e.target.value)
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>days</option>
                    <option>weeks</option>
                    <option>months</option>
                    <option>years</option>
                  </select>
                </div>
                {errors.minAge && (
                  <p className="text-red-500 text-sm mt-1">{errors.minAge}</p>
                )}
              </div>

              {/* Max Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Age (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    value={formData.maxAge?.value || ''}
                    onChange={(e) =>
                      handleNestedChange('maxAge', 'value', e.target.value ? parseFloat(e.target.value) : null)
                    }
                    className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.maxAge
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Leave empty for no limit"
                  />
                  <select
                    value={formData.maxAge?.unit || 'months'}
                    onChange={(e) =>
                      handleNestedChange('maxAge', 'unit', e.target.value)
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>days</option>
                    <option>weeks</option>
                    <option>months</option>
                    <option>years</option>
                  </select>
                </div>
                {errors.maxAge && (
                  <p className="text-red-500 text-sm mt-1">{errors.maxAge}</p>
                )}
              </div>
            </div>
          </div>

          {/* Interval Requirements */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
              Interval from Previous Dose
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Min Days */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Days
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.intervalFromPrevious.minDays}
                  onChange={(e) =>
                    handleNestedChange(
                      'intervalFromPrevious',
                      'minDays',
                      parseFloat(e.target.value)
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              {/* Max Days */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Days (Optional)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.intervalFromPrevious.maxDays || ''}
                  onChange={(e) =>
                    handleNestedChange(
                      'intervalFromPrevious',
                      'maxDays',
                      e.target.value ? parseFloat(e.target.value) : null
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Leave empty for no limit"
                />
              </div>

              {/* Exact Days */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exact Days (Optional)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.intervalFromPrevious.exactDays || ''}
                  onChange={(e) =>
                    handleNestedChange(
                      'intervalFromPrevious',
                      'exactDays',
                      e.target.value ? parseFloat(e.target.value) : null
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Specific interval"
                />
              </div>

              {/* Allowable Delay */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Allowable Delay (days)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.allowableDelay}
                  onChange={(e) =>
                    handleInputChange({
                      target: {
                        name: 'allowableDelay',
                        value: e.target.value,
                        type: 'number',
                      },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
              Guidelines
            </h2>

            {/* Existing Guidelines */}
            {formData.guidelines.length > 0 && (
              <div className="mb-4 space-y-2">
                {formData.guidelines.map((guideline, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg flex justify-between items-start"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{guideline.authority}</p>
                      {guideline.reference && (
                        <p className="text-sm text-gray-600">{guideline.reference}</p>
                      )}
                      {guideline.url && (
                        <a
                          href={guideline.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-500 hover:underline"
                        >
                          {guideline.url}
                        </a>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeGuideline(index)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Guideline Form */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Authority (e.g., WHO, CDC)"
                  value={newGuideline.authority}
                  onChange={(e) =>
                    setNewGuideline({ ...newGuideline, authority: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <input
                  type="text"
                  placeholder="Reference"
                  value={newGuideline.reference}
                  onChange={(e) =>
                    setNewGuideline({ ...newGuideline, reference: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <input
                  type="url"
                  placeholder="URL"
                  value={newGuideline.url}
                  onChange={(e) =>
                    setNewGuideline({ ...newGuideline, url: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <button
                type="button"
                onClick={addGuideline}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
              >
                <Plus size={16} />
                Add Guideline
              </button>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium rounded-lg flex items-center gap-2 transition"
            >
              <Save size={18} />
              {loading ? 'Saving...' : dose ? 'Update Dose' : 'Create Dose'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoseForm;

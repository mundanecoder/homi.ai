"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

interface UserPreferenceFormProps {
  token: string;
}

const UserPreferenceForm: React.FC<UserPreferenceFormProps> = ({ token }) => {
  const [preference, setPreference] = useState({
    flatType: "",
    minBudget: 0,
    maxBudget: 0,
    preferredAreas: "",
    minSize: 0,
    maxSize: 0,
    description: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPreferences();
  }, [token, preference]);

  const fetchPreferences = async () => {
    try {
      const response = await axios.get("/api/user/preference/getPreference", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched Preferences:", response.data.preferences);
      setPreference({
        flatType: response.data.preferences.flatType || "",
        minBudget: response.data.preferences.minBudget || 0,
        maxBudget: response.data.preferences.maxBudget || 0,
        preferredAreas: response.data.preferences.preferredAreas || "",
        minSize: response.data.preferences.minSize || 0,
        maxSize: response.data.preferences.maxSize || 0,
        description: response.data.preferences.description || "",
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching preferences:", error);
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Convert string values to numbers where appropriate
    setPreference((prev) => ({
      ...prev,
      [name]:
        name.includes("Budget") || name.includes("Size")
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/user/preference/insert", preference, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Preferences saved successfully!");
      setIsEditing(false);
      fetchPreferences(); // Refresh the data after saving
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("Failed to save preferences. Please try again.");
    }
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form Fields */}
          <div>
            <label
              htmlFor="flatType"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Flat Type
            </label>
            <select
              id="flatType"
              name="flatType"
              value={preference.flatType}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
              required
            >
              <option value="">Select Flat Type</option>
              <option value="1BHK">1BHK</option>
              <option value="2BHK">2BHK</option>
              <option value="3BHK">3BHK</option>
              <option value="4BHK">4BHK</option>
              <option value="PentHouse">PentHouse</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="minBudget"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Minimum Budget
            </label>
            <input
              id="minBudget"
              type="number"
              name="minBudget"
              placeholder="Minimum Budget"
              value={preference.minBudget}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
              required
            />
          </div>

          <div>
            <label
              htmlFor="maxBudget"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Maximum Budget
            </label>
            <input
              id="maxBudget"
              type="number"
              name="maxBudget"
              placeholder="Maximum Budget"
              value={preference.maxBudget}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
              required
            />
          </div>

          <div>
            <label
              htmlFor="preferredAreas"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Preferred Areas
            </label>
            <input
              id="preferredAreas"
              type="text"
              name="preferredAreas"
              placeholder="Preferred Areas (comma-separated)"
              value={preference.preferredAreas}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
              required
            />
          </div>

          <div>
            <label
              htmlFor="minSize"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Minimum Size (sq ft)
            </label>
            <input
              id="minSize"
              type="number"
              name="minSize"
              placeholder="Minimum Size (sq ft)"
              value={preference.minSize}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
              required
            />
          </div>

          <div>
            <label
              htmlFor="maxSize"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Maximum Size (sq ft)
            </label>
            <input
              id="maxSize"
              type="number"
              name="maxSize"
              placeholder="Maximum Size (sq ft)"
              value={preference.maxSize}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Description of your preferences
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Description of your preferences"
              value={preference.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
              rows={3}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition duration-300"
          >
            Save Preferences
          </button>

          <button
            type="button"
            onClick={handleEditToggle}
            className="w-full p-2 text-white bg-gray-600 hover:bg-gray-700 rounded-md transition duration-300"
          >
            Cancel
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              <strong>Flat Type:</strong> {preference.flatType || "N/A"}
            </p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              <strong>Minimum Budget:</strong> {preference.minBudget || "N/A"}
            </p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              <strong>Maximum Budget:</strong> {preference.maxBudget || "N/A"}
            </p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              <strong>Preferred Areas:</strong>{" "}
              {preference.preferredAreas || "N/A"}
            </p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              <strong>Minimum Size:</strong> {preference.minSize || "N/A"} sq ft
            </p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              <strong>Maximum Size:</strong> {preference.maxSize || "N/A"} sq ft
            </p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              <strong>Description:</strong> {preference.description || "N/A"}
            </p>
          </div>

          <button
            type="button"
            onClick={handleEditToggle}
            className="w-full p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition duration-300"
          >
            Edit Preferences
          </button>
        </div>
      )}
    </div>
  );
};

export default UserPreferenceForm;

// AddProjectForm.tsx
import React, { useState } from "react";
import axios from "axios";
import { Project } from "@/types";

interface AddProjectFormProps {
  token: string;
  onProjectAdded: (project: Project) => void;
  userId: string;
}

const AddProjectForm: React.FC<AddProjectFormProps> = ({
  token,
  onProjectAdded,
  userId,
}) => {
  const [newProject, setNewProject] = useState<Partial<Project>>({
    name: "",
    location: "",
    description: "",
    status: "",
    priceRange: "",
    projectType: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setNewProject({
      ...newProject,
      builderId: userId,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post<{ project: Project }>(
        "/api/projects/register",
        newProject,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onProjectAdded(response.data.project);
      setNewProject({
        name: "",
        location: "",
        description: "",
        status: "",
        priceRange: "",
        projectType: "",
      });
    } catch (error) {
      console.error("Error adding project:", "project1", error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-2">
        Add New Project
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Project Name"
          value={newProject.name}
          onChange={handleInputChange}
          className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 transition duration-300"
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={newProject.location}
          onChange={handleInputChange}
          className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 transition duration-300"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={newProject.description}
          onChange={handleInputChange}
          className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 transition duration-300"
          rows={3}
        ></textarea>
        <select
          name="status"
          value={newProject.status}
          onChange={handleInputChange}
          className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 transition duration-300"
          required
        >
          <option value="">Select Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="delayed">Delayed</option>
        </select>
        <input
          type="text"
          name="priceRange"
          placeholder="Price Range (e.g., ₹50 Lakhs - ₹1 Crore)"
          value={newProject.priceRange}
          onChange={handleInputChange}
          className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 transition duration-300"
          required
        />
        <select
          name="projectType"
          value={newProject.projectType}
          onChange={handleInputChange}
          className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 transition duration-300"
          required
        >
          <option value="">Select Project Type</option>
          <option value="Residential">Residential</option>
          <option value="Commercial">Commercial</option>
          <option value="Industrial">Industrial</option>
        </select>
        <button
          type="submit"
          className="w-full p-3 text-white bg-gray-900 hover:bg-gray-600 rounded-lg transition duration-300"
        >
          Add Project
        </button>
      </form>
    </div>
  );
};

export default AddProjectForm;

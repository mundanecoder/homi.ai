// AddContactForm.tsx
import React, { useState } from "react";
import axios from "axios";
import { Project } from "@/types";

interface AddContactFormProps {
  token: string;
  projects: Project[];
  onContactAdded: (updatedProject: Project) => void;
}

const AddContactForm: React.FC<AddContactFormProps> = ({
  token,
  projects,
  onContactAdded,
}) => {
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [contactInfo, setContactInfo] = useState({
    phone: "",
    email: "",
    address: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo({ ...contactInfo, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) {
      alert("Please select a project");
      return;
    }

    // Create the payload structure
    const payload = {
      projectId: selectedProject,
      ...contactInfo,
    };

    try {
      const response = await axios.post<Project>(
        `/api/projects/register/contact`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onContactAdded(response.data);
      setContactInfo({
        phone: "",
        email: "",
        address: "",
      });
      setSelectedProject("");
    } catch (error) {
      console.error("Error adding contact information:", error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-2">
        Add Contact Information to Project
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 transition duration-300"
          required
        >
          <option value="">Select a project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={contactInfo.phone}
          onChange={handleInputChange}
          className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 transition duration-300"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={contactInfo.email}
          onChange={handleInputChange}
          className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 transition duration-300"
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={contactInfo.address}
          onChange={handleInputChange}
          className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 transition duration-300"
          required
        />
        <button
          type="submit"
          className="w-full p-3 text-white bg-gray-900 hover:bg-gray-600 rounded-lg transition duration-300"
        >
          Add Contact Information
        </button>
      </form>
    </div>
  );
};

export default AddContactForm;

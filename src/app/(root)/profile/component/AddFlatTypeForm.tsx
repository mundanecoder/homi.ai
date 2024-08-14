// AddFlatTypeForm.tsx
import React, { useState } from "react";
import axios from "axios";
import { Project, FlatType } from "@/types";

interface AddFlatTypeFormProps {
  token: string;
  projects: Project[];
  onFlatTypeAdded: (updatedProject: Project) => void;
}

const AddFlatTypeForm: React.FC<AddFlatTypeFormProps> = ({
  token,
  projects,
  onFlatTypeAdded,
}) => {
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [newFlatType, setNewFlatType] = useState<Partial<FlatType>>({
    type: "",
    bedrooms: 0,
    bathrooms: 0,
    size: 0,
    price: 0,
    status: "available",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value =
      e.target.type === "number" ? parseFloat(e.target.value) : e.target.value;
    setNewFlatType({ ...newFlatType, [e.target.name]: value });
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
      flatTypes: [newFlatType], // Wrapping the newFlatType in an array
    };

    try {
      const response = await axios.post<{
        flatType: FlatType;
        project: Project;
      }>(
        `/api/projects/register/flatype`,
        payload, // Use the structured payload
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onFlatTypeAdded(response.data.project);
      setNewFlatType({
        type: "",
        bedrooms: 0,
        bathrooms: 0,
        size: 0,
        price: 0,
        status: "available",
      });
      setSelectedProject("");
    } catch (error) {
      console.error("Error adding flat type:", error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-2">
        Add Flat Type to Project
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
          name="type"
          placeholder="Flat Type (e.g., 2BHK, 3BHK)"
          value={newFlatType.type}
          onChange={handleInputChange}
          className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 transition duration-300"
          required
        />
        <input
          type="number"
          name="bedrooms"
          placeholder="Bedrooms"
          value={newFlatType.bedrooms}
          onChange={handleInputChange}
          className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 transition duration-300"
          required
        />
        <input
          type="number"
          name="bathrooms"
          placeholder="Bathrooms"
          value={newFlatType.bathrooms}
          onChange={handleInputChange}
          className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 transition duration-300"
          required
        />
        <input
          type="number"
          name="size"
          placeholder="Size (sq ft)"
          value={newFlatType.size}
          onChange={handleInputChange}
          className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 transition duration-300"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newFlatType.price}
          onChange={handleInputChange}
          className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 transition duration-300"
          required
        />
        <select
          name="status"
          value={newFlatType.status}
          onChange={handleInputChange}
          className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 transition duration-300"
          required
        >
          <option value="available">Available</option>
          <option value="booked">Booked</option>
          <option value="sold">Sold</option>
        </select>
        <button
          type="submit"
          className="w-full p-3 text-white bg-gray-900 hover:bg-gray-600 rounded-lg transition duration-300"
        >
          Add Flat Type
        </button>
      </form>
    </div>
  );
};

export default AddFlatTypeForm;

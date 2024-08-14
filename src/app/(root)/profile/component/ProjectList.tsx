// ProjectList.tsx
import React from "react";
import { Project } from "@/types";

interface ProjectListProps {
  projects: Project[];
}

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border-2 border-gray-200 dark:border-gray-700">
      <h2 className="text-xl text-center font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-2">
        Projects
      </h2>
      <div
        className="space-y-4 overflow-y-auto h-[50vh]"
        style={{
          scrollbarWidth: "thin",
        }}
      >
        {projects.length > 0
          ? projects.map((project) => (
              <div
                key={project.id}
                className="p-4 border rounded-md bg-gray-50 dark:bg-gray-700 transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {project.name}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {project.location}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Status: {project.status}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Type: {project.projectType}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Price Range: {project.priceRange}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Flat Types: {project.flatTypes?.length || 0}
                </p>
              </div>
            ))
          : "No projects available"}
      </div>
    </div>
  );
};

export default ProjectList;

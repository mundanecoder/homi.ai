// BuilderDashboard.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Project } from "@/types";
import ProjectList from "./ProjectList";
import AddProjectForm from "./AddProjectForm";
import AddFlatTypeForm from "./AddFlatTypeForm";
import AddContactForm from "./AddContactForm ";

interface BuilderDashboardProps {
  token: string;
  userId: string;
}

const BuilderDashboard: React.FC<BuilderDashboardProps> = ({
  token,
  userId,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    async function getProjects() {
      try {
        const response = await axios.get<{ projects: Project[] }>(
          "/api/projects/getprojects",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProjects(response.data.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    }

    getProjects();
  }, [token]);

  const addProject = (newProject: Project) => {
    setProjects([...projects, newProject]);
  };

  const updateProject = (updatedProject: Project) => {
    setProjects(
      projects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      )
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <ProjectList projects={projects} />
      <AddProjectForm
        token={token}
        onProjectAdded={addProject}
        userId={userId}
      />
      <AddFlatTypeForm
        token={token}
        projects={projects}
        onFlatTypeAdded={updateProject}
      />
      <AddContactForm
        token={token}
        projects={projects}
        onContactAdded={updateProject}
      />
    </div>
  );
};

export default BuilderDashboard;

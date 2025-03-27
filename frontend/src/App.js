import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Task from "./components/Task";
import AddProjectModal from "./components/AddProjectModal";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";

function App() {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setModalState] = useState(false);
  const navigate = useNavigate();

  // Fetch projects from the backend
  const fetchProjects = useCallback(() => {
    axios
      .get("http://localhost:9000/projects/")
      .then((res) => setProjects(res.data))
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  useEffect(() => {
    fetchProjects();
    // Listen for project updates
    const updateListener = ({ detail }) => fetchProjects();
    document.addEventListener("projectUpdate", updateListener);

    return () => {
      document.removeEventListener("projectUpdate", updateListener);
    };
  }, [fetchProjects]);

  const openModal = () => setModalState(true);
  const closeModal = () => setModalState(false);

  return (
    <AppLayout>
      <Toaster position="top-right" gutter={8} />
      <Routes>
        <Route path="/:projectId" element={<Task />} />
        <Route
          path="/"
          element={
            <div className="flex flex-col items-center w-full pt-10">
              <div className="flex justify-between w-8/12 mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                  Your Projects
                </h1>
                <button
                  onClick={openModal}
                  className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
                >
                  + New Project
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-8/12">
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <div
                      key={project._id}
                      className="p-5 bg-white shadow-lg rounded-lg cursor-pointer hover:shadow-xl transition"
                      onClick={() => navigate(`/${project._id}`)}
                    >
                      <h2 className="text-lg font-semibold text-gray-800">
                        {project.title}
                      </h2>
                      <p className="text-gray-600 mt-1">
                        {project.tasks?.length || 0} tasks
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">
                    No projects found. Create a new one!
                  </p>
                )}
              </div>

              <AddProjectModal
                isModalOpen={isModalOpen}
                closeModal={closeModal}
              />
            </div>
          }
        />
      </Routes>
    </AppLayout>
  );
}

export default App;

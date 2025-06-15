// components/HomePage.js
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AddProjectModal from "./AddProjectModal";
import axios from "axios";

const HomePage = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setModalState] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchProjects = useCallback(() => {
    axios
      .get("http://localhost:9000/projects/")
      .then((res) => setProjects(res.data))
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects, location.pathname]);

  const openModal = () => setModalState(true);
  const closeModal = () => setModalState(false);

  const getTaskDetails = (tasks) => {
    const completedTasks = tasks.filter((t) => t.stage === "Done").length;
    const highPriorityTasks = tasks.filter((t) => t.priority === "High").length;
    return { completedTasks, highPriorityTasks };
  };

  return (
    <div className="container mx-auto relative z-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Your Projects</h1>
        <button
          onClick={openModal}
          className="bg-emerald-500 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-emerald-600 transition"
        >
          + New Project
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {projects.length > 0 ? (
          projects.map((project) => {
            const { completedTasks, highPriorityTasks } = getTaskDetails(project.task);
            return (
              <div
                key={project._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all cursor-pointer"
                onClick={() => navigate(`/${project._id}`)}
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2 truncate">
                    {project.title}
                  </h2>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {project.task?.length || 0} Tasks
                    </span>
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-600 font-bold">
                        {project.task?.length || 0}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">✅Completed:</span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                        {completedTasks}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">⚠️High Priority:</span>
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">
                        {highPriorityTasks}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center">
            <p className="text-gray-500 text-lg">No projects found. Create a new one!</p>
          </div>
        )}
      </div>
      <AddProjectModal isModalOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );
};

export default HomePage;

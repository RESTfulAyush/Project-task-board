import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import BtnPrimary from "./BtnPrimary";
import BtnSecondary from "./BtnSecondary";
import axios from "axios";
import toast from "react-hot-toast";

const AddTaskModal = ({
  isAddTaskModalOpen,
  setAddTaskModal,
  projectId = null,
  taskId = null,
  edit = false,
  refreshData,
}) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("Medium");

  useEffect(() => {
    if (edit && isAddTaskModalOpen && taskId && projectId) {
      axios
        .get(`http://localhost:9000/project/${projectId}/task/${taskId}`)
        .then((res) => {
          const task = res.data[0]?.task[0];
          if (task) {
            setTitle(task.title);
            setDesc(task.description);
            setPriority(task.priority || "Medium");
          }
        })
        .catch(() => {
          toast.error("Something went wrong");
        });
    }
  }, [isAddTaskModalOpen, projectId, taskId, edit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskData = {
      title,
      description: desc,
      priority,
    };

    try {
      const response = edit
        ? await axios.put(
            `http://localhost:9000/project/${projectId}/task/${taskId}`,
            taskData
          )
        : await axios.post(
            `http://localhost:9000/project/${projectId}/task`,
            taskData
          );

      if (response.status >= 200 && response.status < 300) {
        toast.success(`Task ${edit ? "updated" : "created"} successfully`);
        setTitle("");
        setDesc("");
        setPriority("Medium");
        setAddTaskModal(false);
        refreshData();
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          error.response.data?.details?.[0]?.message || "Something went wrong"
        );
      } else {
        console.error(error); // Log unexpected errors
      }
    }
  };

  return (
    <Transition appear show={isAddTaskModalOpen} as={Fragment}>
      <Dialog
        as="div"
        open={isAddTaskModalOpen}
        onClose={() => setAddTaskModal(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 overflow-y-auto">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>
          <div className="fixed inset-0 flex items-center justify-center p-4 w-screen h-screen">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="rounded-md bg-white w-6/12">
                <Dialog.Title
                  as="div"
                  className="bg-white shadow px-6 py-4 rounded-t-md sticky top-0 flex justify-between"
                >
                  <h1>{edit ? "Edit Task" : "Add Task"}</h1>
                  <button
                    onClick={() => setAddTaskModal(false)}
                    className="text-gray-500 hover:bg-gray-100 rounded"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="gap-4 px-8 py-4">
                  <div className="mb-3">
                    <label className="block text-gray-600">Title</label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      type="text"
                      className="border border-gray-300 rounded-md w-full text-sm py-2 px-2.5 focus:border-indigo-500"
                      placeholder="Task title"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-gray-600">Description</label>
                    <textarea
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      className="border border-gray-300 rounded-md w-full text-sm py-2 px-2.5 focus:border-indigo-500"
                      rows="6"
                      placeholder="Task description"
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="block text-gray-600">Priority</label>
                    <div className="flex space-x-2">
                      {["Low", "Medium", "High"].map((level) => (
                        <button
                          key={level}
                          type="button"
                          className={`px-4 py-2 rounded-md ${
                            priority === level
                              ? level === "Low"
                                ? "bg-green-500 text-white"
                                : level === "Medium"
                                ? "bg-yellow-500 text-white"
                                : "bg-red-500 text-white"
                              : "bg-gray-200"
                          }`}
                          onClick={() => setPriority(level)}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end items-center space-x-2">
                    <BtnSecondary onClick={() => setAddTaskModal(false)}>
                      Cancel
                    </BtnSecondary>
                    <BtnPrimary type="submit">Save</BtnPrimary>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddTaskModal;

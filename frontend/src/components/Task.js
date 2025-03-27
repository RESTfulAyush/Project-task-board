import React, { useEffect, useState, useRef } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import AddTaskModal from "./AddTaskModal";
import BtnPrimary from "./BtnPrimary";
import DropdownMenu from "./DropdownMenu";
import ProjectDropdown from "./ProjectDropdown";
import TaskModal from "./TaskModal";

function Task() {
  const [isAddTaskModalOpen, setAddTaskModal] = useState(false);
  const [columns, setColumns] = useState({});
  const [isRenderChange, setRenderChange] = useState(false);
  const [isTaskOpen, setTaskOpen] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [title, setTitle] = useState("");
  const { projectId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:9000/project/${projectId}`).then((res) => {
      setTitle(res.data[0].title);
      setColumns({
        todo: {
          name: "To do",
          items: res.data[0].task
            .filter((task) => task.stage === "To do")
            .sort((a, b) => a.order - b.order),
        },
        inProgress: {
          name: "In Progress",
          items: res.data[0].task
            .filter((task) => task.stage === "In Progress")
            .sort((a, b) => a.order - b.order),
        },
        done: {
          name: "Done",
          items: res.data[0].task
            .filter((task) => task.stage === "Done")
            .sort((a, b) => a.order - b.order),
        },
      });
      setRenderChange(false);
    });
  }, [projectId, isAddTaskModalOpen, isRenderChange]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    const newColumns = { ...columns };
    const sourceColumn = newColumns[source.droppableId];
    const destColumn = newColumns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];

    const [movedTask] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, movedTask);

    newColumns[source.droppableId].items = sourceItems;
    newColumns[destination.droppableId].items = destItems;

    setColumns(newColumns);
    updateTodo(newColumns);
  };

  const updateTodo = (data) => {
    axios
      .put(`http://localhost:9000/project/${projectId}/todo`, data)
      .catch(() => toast.error("Something went wrong"));
  };

  const handleDelete = (e, taskId) => {
    e.stopPropagation();
    axios
      .delete(`http://localhost:9000/project/${projectId}/task/${taskId}`)
      .then(() => {
        toast.success("Task deleted");
        setRenderChange(true);
      })
      .catch(() => toast.error("Something went wrong"));
  };

  const handleTaskDetails = (id) => {
    setTaskId({ projectId, id });
    setTaskOpen(true);
  };

  // Priority-based styles
  const priorityStyles = {
    High: "border-red-00 bg-red-50 text-red-800",
    Medium: "border-yellow-500 bg-yellow-50 text-yellow-800",
    Low: "border-green-500 bg-green-50 text-green-800",
  };

  return (
    <div className="px-8 py-6 w-full bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8 border-b pb-4 border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center space-x-3">
          <span className="truncate max-w-[300px]">
            {title.length > 25 ? `${title.slice(0, 25)}...` : title}
          </span>
          <ProjectDropdown id={projectId} navigate={navigate} />
        </h1>
        <BtnPrimary
          onClick={() => {
            console.log("Opening modal:", true);
            setAddTaskModal(true);
          }}
        >
          Add Task
        </BtnPrimary>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-3 gap-6">
          {Object.entries(columns).map(([columnId, column]) => (
            <div
              key={columnId}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div
                className={`p-4 border-b-4 ${
                  {
                    todo: "border-blue-400 bg-blue-50",
                    inProgress: "border-yellow-400 bg-yellow-50",
                    done: "border-green-400 bg-green-50",
                  }[columnId]
                }`}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-700 uppercase tracking-wider">
                    {column.name}
                  </h2>
                  {column.items.length > 0 && (
                    <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                      {column.items.length}
                    </span>
                  )}
                </div>
              </div>

              <Droppable droppableId={columnId} key={columnId}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`p-4 transition-all duration-200 min-h-[500px] ${
                      snapshot.isDraggingOver ? "bg-gray-100" : ""
                    }`}
                  >
                    {column.items.map((item, index) => (
                      <Draggable
                        key={item._id}
                        draggableId={item._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`border-l-4 p-4 mb-4 rounded-lg shadow-md transition-all hover:shadow-lg transform ${
                              snapshot.isDragging ? "scale-105" : ""
                            } ${
                              priorityStyles[item.priority] ||
                              "border-gray-300 bg-gray-100"
                            }`}
                            onClick={() => handleTaskDetails(item._id)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-base font-semibold text-gray-800 truncate pr-2">
                                {item.title.length > 22
                                  ? `${item.title.slice(0, 22)}...`
                                  : item.title}
                              </h3>
                              <DropdownMenu
                                taskId={item._id}
                                handleDelete={handleDelete}
                                projectId={projectId}
                                setRenderChange={setRenderChange}
                              />
                            </div>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {item.description.length > 60
                                ? `${item.description.slice(0, 60)}...`
                                : item.description}
                            </p>
                            <div className="flex justify-between items-center">
                              <span
                                className={`px-2 py-1 rounded-md text-xs font-medium ${
                                  priorityStyles[item.priority] ||
                                  "bg-gray-200 text-gray-700"
                                }`}
                              >
                                {item.priority} Priority
                              </span>
                              <span className="text-xs text-gray-500">
                                Task-{index + 1}
                              </span>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <AddTaskModal
        isAddTaskModalOpen={isAddTaskModalOpen}
        setAddTaskModal={setAddTaskModal}
        projectId={projectId}
      />
      <TaskModal isOpen={isTaskOpen} setIsOpen={setTaskOpen} id={taskId} />
    </div>
  );
}

export default Task;

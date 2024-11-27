import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import Loader from './utils/Loader';
import Tooltip from './utils/Tooltip';
import { format } from 'date-fns'; // Import date-fns for formatting (optional)

const Tasks = ({ Dark, setDark }) => {
  const authState = useSelector(state => state.authReducer);
  const [tasks, setTasks] = useState([]);
  const [fetchData, { loading }] = useFetch();

  const fetchTasks = useCallback(() => {
    const config = { url: "/tasks", method: "get", headers: { Authorization: authState.token } };
    fetchData(config, { showSuccessToast: false }).then(data => setTasks(data.tasks));
  }, [authState.token, fetchData]);

  useEffect(() => {
    if (!authState.isLoggedIn) return;
    fetchTasks();
  }, [authState.isLoggedIn, fetchTasks]);

  const handleDelete = (id) => {
    const config = { url: `/tasks/${id}`, method: "delete", headers: { Authorization: authState.token } };
    fetchData(config).then(() => fetchTasks());
  };

  const handleComplete = (id) => {
    const config = { 
      url: `/tasks/${id}/complete`, 
      method: "patch", 
      headers: { Authorization: authState.token } 
    };
    fetchData(config).then(() => fetchTasks());
  };

  return (
    <div className={`min-h-screen py-12 ${Dark ? 'bg-gray-900 text-gray-200' : 'bg-blue-50 text-gray-900'}`}>
      <div className="my-2 mx-auto max-w-4xl px-4">
        {tasks.length !== 0 && (
          <h2 className={`my-4 text-2xl font-semibold ${Dark ? 'text-blue-400' : 'text-blue-600'}`}>
            Your Tasks ({tasks.length})
          </h2>
        )}

        {loading ? (
          <Loader />
        ) : (
          <div>
            {tasks.length === 0 ? (
              <div
                className={`w-full h-[300px] flex items-center justify-center gap-4 rounded-lg shadow-lg p-6 ${
                  Dark ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'
                }`}
              >
                <span>No tasks found</span>
                <Link
                  to="/tasks/add"
                  className={`font-medium rounded-md px-6 py-3 transition-all shadow-md ${
                    Dark
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  + Add new task
                </Link>
              </div>
            ) : (
              tasks.map((task, index) => (
                <div
                  key={task._id}
                  className={`my-6 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all ${
                    Dark ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`font-semibold text-lg ${
                        Dark ? 'text-blue-400' : 'text-blue-600'
                      }`}
                    >
                      Task #{index + 1}
                    </span>

                    <div className="flex gap-4">
                      <Tooltip text="Edit this task" position="top">
                        <Link
                          to={`/tasks/${task._id}`}
                          className={`transition-colors ${
                            Dark
                              ? 'text-green-400 hover:text-green-500'
                              : 'text-green-600 hover:text-green-800'
                          }`}
                        >
                          <i className="fa-solid fa-pen text-xl"></i>
                        </Link>
                      </Tooltip>

                      <Tooltip text="Delete this task" position="top">
                        <span
                          className={`cursor-pointer transition-colors ${
                            Dark
                              ? 'text-red-400 hover:text-red-500'
                              : 'text-red-500 hover:text-red-700'
                          }`}
                          onClick={() => handleDelete(task._id)}
                        >
                          <i className="fa-solid fa-trash text-xl"></i>
                        </span>
                      </Tooltip>

                      <Tooltip text="Mark as complete" position="top">
                        <span
                          className={`cursor-pointer transition-colors ${
                            Dark
                              ? 'text-yellow-400 hover:text-yellow-500'
                              : 'text-yellow-500 hover:text-yellow-600'
                          }`}
                          onClick={() => handleComplete(task._id)}
                        >
                          <i className="fa-solid fa-check text-xl"></i>
                        </span>
                      </Tooltip>
                    </div>
                  </div>

                  <div className="whitespace-pre-line">{task.description}</div>

                  <div className="mt-4 text-sm">
                    <p>
                      <strong>Assigned to:</strong> {task.user?.name || 'Not assigned yet'}
                    </p>
                    <p>
                      <strong>Due Date:</strong>{' '}
                      {task.tillDate ? task.tillDate.slice(0, 10) : 'No due date'}
                    </p>
                    <p>
                      <strong>Due Time:</strong>{' '}
                      {task.atWhatTime || 'No due time'}
                    </p>
                    <p>
                      <strong>Created On:</strong>{' '}
                      {task.createdAt
                        ? format(new Date(task.createdAt), 'PPPppp')
                        : 'No date available'}
                    </p>
                  </div>

                  <div className="mt-2 text-sm">
                    {task.status === 'completed' ? (
                      <span className="text-green-500">Completed</span>
                    ) : (
                      <span className="text-gray-400">Not Completed</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;

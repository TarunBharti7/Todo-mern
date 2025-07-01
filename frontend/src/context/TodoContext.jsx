import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [userId, setUserId] = useState();
  const [todos, setTodos] = useState([]);
  const [update, setUpdate] = useState(true);

  useEffect(() => {
    // run only if userId is available
    if (!userId) {
      console.log("userId is undefined, skipping fetch");
      return;
    }

    const fetchTodo = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) throw new Error("No token provided");

        console.log("Fetching todos for userId:", userId);

        const response = await axios.get(
          `https://todo-mern-ia3f.onrender.com/api/todos/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTodos(response.data.todos);
      } catch (error) {
        console.error("Error fetching todo data:", error.response?.data || error.message);
        setTodos([]); // fallback to empty array
      }
    };

    fetchTodo();
  }, [userId, update]); // 🔁 only run when userId changes

  return (
    <TodoContext.Provider value={{ todos, setTodos, userId, setUserId, update, setUpdate }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => useContext(TodoContext);

import React, { useEffect, useState } from "react";
import Nav from "../components/navbar/Nav";
import axios from "axios";
import DisplayTask from "../components/DisplayTask";
import CreateTask from "../components/CreateTask";
import { useNavigate } from "react-router-dom";
import { useTodo } from "../context/TodoContext";

const Home = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const { setUserId } = useTodo();

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) throw new Error("No token provided");

      const response = await axios.get("https://todo-mern-ia3f.onrender.com//user/info", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserId(response.data.id); // set userId in context
      return response.data;
    } catch (error) {
      console.error("Error fetching user data:", error.response?.data || error.message);
      navigate("/login");
    }
  };

  useEffect(() => {
    const getUserData = async () => {
      const data = await fetchUserData();
      setUserData(data);
    };
    getUserData();
  }, []);

  if (!userData) return <div>Loading...</div>;

  return (
    <div>
      <Nav />
      <div className="bg-[#292c31] min-h-[90vh] w-full">
        <p className="text-white text-3xl flex justify-center align-middle pt-7">
          Hello {userData.name}
        </p>
        <CreateTask id={userData.id} />
        <p className="text-white text-xl pl-20 pt-10">List of Your Task</p>
        <DisplayTask />
      </div>
    </div>
  );
};

export default Home;

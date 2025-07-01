import React from "react";
import Card from "./card/Card";
import { useTodo } from "../context/TodoContext";

const DisplayTask = () => {
  const { todos, userId } = useTodo();

  // console.log("DisplayTask todos:", todos);
  // console.log("DisplayTask userId:", userId);

  return (
    <div className="flex justify-around gap-y-1 flex-wrap bg-[#292c31] mt-[-70px]">
      {todos && todos.length > 0 ? (
        todos.map((todo) => (
          <Card key={todo._id} data={todo} userId={userId} />
        ))
      ) : (
        <p className="text-2xl mt-2 text-amber-400">
          Loading or No tasks available
        </p>
      )}
    </div>
  );
};

export default DisplayTask;

import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { auth, db } from "../firebase/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  deleteDoc,
  getDocs,
  updateDoc,
  doc,
  orderBy,
} from "firebase/firestore";

const Home = () => {
  const [todo, setTodo] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const todoInput = useRef();

  useEffect(() => {
    const getDataFromFirestore = async () => {
      let fireStoreTodo = [];
      const loggedUserUid = JSON.parse(localStorage.getItem("loggedUser")).uid;
      const q = query(
        collection(db, "todo"),
        where("uid", "==", loggedUserUid),
        orderBy("time", "desc")
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        fireStoreTodo.push({
          ...doc.data(),
          docid: doc.id,
        });
      });
      setTodo([...fireStoreTodo]);
    };

    getDataFromFirestore();
  }, []);

  const addTodo = async () => {
    if (!todoInput.current.value.trim()) {
      return;
    }
    if (editId?.docid) {
      const find = todo.find((item) => item.docid === editId.docid);
      find.title = todoInput.current.value;
      setTodo([...todo]);
      const todoRef = doc(db, "todo", find.docid);
      await updateDoc(todoRef, {
        title: todoInput.current.value,
      });
      setEditId(null);
    } else {
      try {
        const docRef = await addDoc(collection(db, "todo"), {
          title: todoInput.current.value,
          uid: auth.currentUser.uid,
          time: Date.now(),
        });
        const todoItem = {
          title: todoInput.current.value,
          uid: auth.currentUser.uid,
          docid: docRef.id,
          time: Date.now(),
        };
        todo.unshift(todoItem);
        setTodo([...todo]);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }

    todoInput.current.value = "";
  };

  const editTodo = async (item) => {
    const find = todo.find((todo) => todo.docid === item.docid);
    console.log(find);
    todoInput.current.value = find.title;
    setEditId(find);
    setIsEdit(true);
    todoInput.current.focus();
    todoInput.current.select();
    setEditId(true);
  };
  const deleteTodo = async (id) => {
    console.log(id);
    const filterTodo = todo.filter((item) => item.docid != id);
    setTodo(filterTodo);
    await deleteDoc(doc(db, "todo", id));
  };

  return (
    <>
      <Navbar />
      <div className="pt-10 mx-3 flex flex-col items-center ">
        <form
          className="w-[620px] max-w-full"
          onSubmit={(e) => {
            e.preventDefault();
            addTodo();
          }}
        >
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M6 2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2zM8 2v4h8V2M8 10h8M8 14h8M8 18h8"
                />
              </svg>
            </div>
            <input
              type="search"
              className="block w-full p-4 ps-10 text-md text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add Todos..."
              required
              ref={todoInput}
            />
            <button
              type="submit"
              className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
            >
              {isEdit ? "Edit" : "Add"}
            </button>
          </div>
        </form>

        <div className="mt-5 w-[620px] max-w-full">
          {todo.length > 0 &&
            todo.map((item) => (
              <div
                key={item.docid}
                className="flex items-center my-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 justify-between"
              >
                <p className="text-lg">{item.title}</p>
                <div>
                  <button
                    onClick={() => editTodo(item)}
                    className="px-4 py-2 mr-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTodo(item.docid)}
                    className="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-red-600 rounded-lg hover:bg-red-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Home;

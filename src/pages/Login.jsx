import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useRef, useState } from "react";
import { auth } from "../firebase/firebase";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const email = useRef();
  const password = useRef();
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
    }
  }, [error]);
  const loginUser = () => {
    if (password.current.value.length < 6) {
      setError("Password should have atleast 6 characters");
      return;
    }
    signInWithEmailAndPassword(
      auth,
      email.current.value,
      password.current.value
    )
      .then((userCredential) => {
        const user = userCredential.user;
        localStorage.setItem("loggedUser", JSON.stringify(user));
        navigate("/");
        setError(false);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorCode);
      });
  };

  return (
    <>
      <div className="flex items-center flex-col h-screen justify-center">
        <h1 className="text-center text-3xl text-gray-600 font-semibold pb-3">
          Login
        </h1>
        <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md ">
          <div className="px-6 py-4">
            <h3 className="mt-3 text-xl font-medium text-center text-gray-600 ">
              Welcome to Todo App
            </h3>
            <p className="mt-1 text-center text-gray-500 ">
              Login or create account
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                loginUser();
              }}
            >
              <div className="w-full mt-4">
                <input
                  className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg    focus:border-blue-400 -300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                  type="email"
                  required
                  ref={email}
                  placeholder="Email Address"
                  aria-label="Email Address"
                />
              </div>
              <div className="w-full mt-4">
                <input
                  className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg    focus:border-blue-400 -300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                  type="password"
                  required
                  ref={password}
                  placeholder="Password"
                  aria-label="Password"
                />
              </div>
              <p className="mt-2 text-center text-red-500">{error && error}</p>
              <div className="flex items-center justify-end mt-4">
                <button className="px-6 py-2 flex-1 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                  Sign In
                </button>
              </div>
            </form>
          </div>
          <div className="flex items-center justify-center py-4 text-center bg-gray-50 ">
            <span className="text-sm text-gray-600 ">
              Don't have an account?{" "}
            </span>
            <Link
              to="/register"
              className="mx-2 text-sm font-bold text-blue-500  hover:underline"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

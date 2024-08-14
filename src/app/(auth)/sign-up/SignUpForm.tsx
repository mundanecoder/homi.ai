"use client";

import { useRouter } from "next/navigation";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";

interface FormData {
  name: string;
  email: string;
  password: string;
  gender: string;
  avatar: string;
}

export function getLocalToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

const SignUpForm: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const token = getLocalToken();
    if (token) {
      router.push("/");
    }
  }, [router]);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    gender: "",
    avatar: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data);

      
      // You might want to handle navigation or display a success message here
      router.push("/");
    } catch (error) {
      console.error("Error:", error);
      // You might want to display an error message here
    }
  };

  return (
    <form
      className="bg-white dark:text-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md"
      onSubmit={handleSubmit}
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Create an Account
      </h2>

      <div className="mb-4">
        <label
          className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2"
          htmlFor="name"
        >
          Name
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline dark:focus:ring-2 dark:focus:ring-blue-500"
          id="name"
          type="text"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2"
          htmlFor="email"
        >
          Email
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline dark:focus:ring-2 dark:focus:ring-blue-500"
          id="email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2"
          htmlFor="password"
        >
          Password
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline dark:focus:ring-2 dark:focus:ring-blue-500"
          id="password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2"
          htmlFor="gender"
        >
          Gender
        </label>
        <select
          className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 dark:text-gray-400 leading-tight focus:outline-none focus:shadow-outline dark:focus:ring-2 dark:focus:ring-blue-500"
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select your gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2"
          htmlFor="avatar"
        >
          Avatar URL
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline dark:focus:ring-2 dark:focus:ring-blue-500"
          id="avatar"
          type="text"
          name="avatar"
          placeholder="Enter the URL of your avatar"
          value={formData.avatar}
          onChange={handleChange}
        />
      </div>

      <div className="flex items-center justify-center">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline dark:focus:ring-2 dark:focus:ring-blue-500"
          type="submit"
        >
          Sign Up
        </button>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:text-blue-500 font-semibold"
          >
            Log In
          </a>
        </p>
      </div>
    </form>
  );
};

export default SignUpForm;

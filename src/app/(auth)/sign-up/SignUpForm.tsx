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
    } catch (error) {
      console.error("Error:", error);
      // You might want to display an error message here
    }
  };

  return (
    <form
      className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md"
      onSubmit={handleSubmit}
    >
      {/* Form fields go here (same as in your original code) */}
    </form>
  );
};

export default SignUpForm;

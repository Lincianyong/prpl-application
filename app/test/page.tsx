"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

// Define the types
interface Question {
  id: string; // UUID from the `questions` table
  question: string;
  type: string;
}

interface AnswerPayload {
  question_id: string; // Linked question ID
  answer: string | number; // The user's answer
}

export default function Test() {
  const supabase = createClient(); // Initialize Supabase client
  const router = useRouter(); // Initialize router
  const [questions, setQuestions] = useState<Question[]>([]); // Questions from the database
  const [answers, setAnswers] = useState<Record<string, string | number>>({}); // To store answers
  const [userId, setUserId] = useState<string | null>(null); // Authenticated user ID
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user ID on component mount
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(); // Fetch the authenticated user

      if (error) {
        console.error("Error fetching user:", error.message);
        setError("Failed to load user data.");
        return;
      }

      if (user) {
        setUserId(user.id); // Set the user ID
      } else {
        setError("No authenticated user found.");
      }
    };

    fetchUser();
  }, [supabase]);

  // Fetch questions from the database
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data, error } = await supabase.from("questions").select("*");
        if (error) {
          console.error("Error fetching questions:", error.message);
          setError("Failed to load questions. Please try again later.");
          return;
        }
        setQuestions(data || []); // Fallback to empty array if data is null
      } catch (error) {
        console.error("Unexpected error fetching questions:", error);
        setError("An unexpected error occurred. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [supabase]);

  const handleAnswerChange = (id: string, value: string | number) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    if (!userId) {
      alert("You must be logged in to submit answers.");
      return;
    }

    const answerPayloads: AnswerPayload[] = Object.entries(answers).map(
      ([questionId, answer]) => ({
        question_id: questionId,
        answer,
      })
    );

    try {
      const { error } = await supabase.from("answers").insert(
        answerPayloads.map((payload) => ({
          user_id: userId, // Use the current user's ID
          question_id: payload.question_id,
          answer: String(payload.answer), // Convert all answers to strings for storage
        }))
      );

      if (error) {
        console.error("Error submitting answers:", error.message);
        alert("Failed to submit answers. Please try again.");
        return;
      }

      alert("Your answers have been successfully submitted!");

      // Redirect to the /result page
      router.push("/result");
    } catch (error) {
      console.error("Unexpected error submitting answers:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading questions...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  return (
    <div className="auth-container w-full h-full px-5">
      {/* Logo */}
      <div className="w-[150px] pt-10 h-auto">
        <Image src="/Diatect.png" height={500} width={500} alt="Logo" />
      </div>

      {/* Questions */}
      <p className="text-[24px] font-semibold mt-10">Questions</p>
      <div className="mt-4 space-y-6">
        {questions.map((question) => (
          <div
            key={question.id}
            className="border border-gray-300 p-4 rounded-md shadow-sm"
          >
            <p className="text-[16px] font-medium">{question.question}</p>
            <div className="mt-4">
              {question.type === "integer" && (
                <input
                  type="number"
                  className="border border-gray-300 p-2 rounded-md w-full"
                  placeholder="Enter your answer"
                  value={answers[question.id] || ""}
                  onChange={(e) =>
                    handleAnswerChange(
                      question.id,
                      parseInt(e.target.value, 10)
                    )
                  }
                />
              )}
              {question.type === "text" && (
                <div className="flex space-x-4">
                  <button
                    className={`px-4 py-2 rounded-md ${
                      answers[question.id] === "Male"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => handleAnswerChange(question.id, "Male")}
                  >
                    Male
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md ${
                      answers[question.id] === "Female"
                        ? "bg-pink-500 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => handleAnswerChange(question.id, "Female")}
                  >
                    Female
                  </button>
                </div>
              )}
              {question.type === "yes/no" && (
                <div className="flex space-x-4">
                  <button
                    className={`px-4 py-2 rounded-md ${
                      answers[question.id] === "Yes"
                        ? "bg-green-500 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => handleAnswerChange(question.id, "Yes")}
                  >
                    Yes
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md ${
                      answers[question.id] === "No"
                        ? "bg-red-500 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => handleAnswerChange(question.id, "No")}
                  >
                    No
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="mt-10">
        <button
          className="w-full bg-blue-500 text-white font-semibold py-3 rounded-md"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

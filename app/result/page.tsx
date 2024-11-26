"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

// Define types
interface Answer {
  question_id: string;
  answer: string;
}

export default function ResultPage() {
  const supabase = createClient(); // Initialize Supabase client
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({}); // User answers
  const [result, setResult] = useState<string>(""); // Diabetes result
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch authenticated user ID
  const fetchUserId = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user:", error.message);
      return null;
    }
    return user?.id || null;
  };

  useEffect(() => {
    const fetchAnswers = async () => {
      setLoading(true);

      const userId = await fetchUserId();
      if (!userId) {
        setError("User not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      setUserId(userId); // Save userId for later use

      try {
        // Fetch answers for the current user
        const { data, error } = await supabase
          .from("answers")
          .select("question_id, answer")
          .eq("user_id", userId);

        if (error) {
          console.error("Error fetching answers:", error.message);
          setError("Failed to fetch answers. Please try again later.");
          setLoading(false);
          return;
        }

        if (data) {
          // Map answers by question_id
          const mappedAnswers: Record<string, string> = {};
          data.forEach((item: Answer) => {
            mappedAnswers[item.question_id] = item.answer;
          });
          setAnswers(mappedAnswers);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [supabase]);

  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      const hasDiabetes = runDecisionTree(answers);
      setResult(hasDiabetes ? "DIABETES" : "NO DIABETES");
    }
  }, [answers]);

  const runDecisionTree = (answers: Record<string, string>): boolean => {
    const polyuria = answers["polyuria"] === "1";
    const gender = answers["gender"];
    const polydipsia = answers["polydipsia"] === "1";
    const irritability = answers["irritability"] === "1";
    const genital_thrush = answers["genital_thrush"] === "1";
    const muscle_stiffness = answers["muscle_stiffness"] === "1";
    const delayed_healing = answers["delayed_healing"] === "1";
    const alopecia = answers["alopecia"] === "1";
    const age = parseInt(answers["age"], 10);
    const visual_blurring = answers["visual_blurring"] === "1";
    const sudden_weight_loss = answers["sudden_weight_loss"] === "1";
    const obesity = answers["obesity"] === "1";

    if (!polyuria) {
      if (gender === "Male") {
        if (!polydipsia) {
          if (!irritability) {
            return false; // NO DIABETES
          } else {
            if (!genital_thrush) {
              return false; // NO DIABETES
            } else {
              return true; // DIABETES
            }
          }
        } else {
          if (muscle_stiffness) {
            if (!delayed_healing) {
              return false; // NO DIABETES
            } else {
              return true; // DIABETES
            }
          } else {
            return true; // DIABETES
          }
        }
      } else {
        if (alopecia) {
          if (delayed_healing) {
            return false; // NO DIABETES
          } else {
            return true; // DIABETES
          }
        } else {
          if (age < 35) {
            if (!visual_blurring) {
              return false; // NO DIABETES
            } else {
              return true; // DIABETES
            }
          } else {
            return true; // DIABETES
          }
        }
      }
    } else {
      if (age >= 70) {
        if (!sudden_weight_loss) {
          return false; // NO DIABETES
        } else {
          return true; // DIABETES
        }
      } else {
        if (!polydipsia) {
          if (obesity) {
            if (delayed_healing) {
              return true; // DIABETES
            } else {
              return false; // NO DIABETES
            }
          } else {
            return true; // DIABETES
          }
        } else {
          return true; // DIABETES
        }
      }
    }
  };

  const handleFinish = async () => {
    if (!userId) {
      alert("User not authenticated. Please log in.");
      return;
    }

    try {
      // Update is_diabetes column in the users table
      const { error } = await supabase
        .from("user")
        .update({ is_diabetes: result === "DIABETES" })
        .eq("id", userId);

      if (error) {
        console.error("Error updating is_diabetes:", error.message);
        alert("Failed to save your result. Please try again.");
        return;
      }

      // Redirect to the home page
      router.push("/");
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred.");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading results...</p>;
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

      <h1 className="text-[32px] font-bold">Results</h1>
      <p className="text-[24px] mt-4">
        Based on your answers, you are diagnosed with:
      </p>
      <p
        className={`text-[36px] mt-6 font-bold ${
          result === "DIABETES" ? "text-red-500" : "text-green-500"
        }`}
      >
        {result}
      </p>

      {/* Finish Button */}
      <div className="mt-10">
        <button
          className="w-full bg-blue-500 text-white font-semibold py-3 rounded-md"
          onClick={handleFinish}
        >
          Finish and Go Home
        </button>
      </div>
    </div>
  );
}

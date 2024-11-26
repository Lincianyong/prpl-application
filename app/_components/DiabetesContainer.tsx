import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DiabetesContainer() {
  const supabase = createClient();
  const [isDiabetes, setIsDiabetes] = useState<boolean | null>(null); // Tracks diabetes status

  // Fetch the `is_diabetes` value from the database
  useEffect(() => {
    const fetchDiabetesStatus = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error("Failed to fetch user:", userError?.message);
          return;
        }

        const { data, error } = await supabase
          .from("user")
          .select("is_diabetes")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Failed to fetch diabetes status:", error.message);
          return;
        }

        setIsDiabetes(data?.is_diabetes ?? null); // Null if not set
      } catch (err) {
        console.error("Error fetching diabetes status:", err);
      }
    };

    fetchDiabetesStatus();
  }, [supabase]);

  // Render based on `is_diabetes` value
  if (isDiabetes === null) {
    return (
      <div className="bg-yellow-500 rounded-[10px] p-2 border-1 bg-main_blue/10">
        <p className="font-bold text-main_blue text-[14px]">Test Diabetes</p>
        <p className="font-semibold text-light_grey text-[12px]">
          Click below to test for diabetes now.
        </p>
        <button
          className=" text-yellow-500 font-bold py-2 rounded-lg mt-2"
          onClick={() => {
            window.location.href = "/test"; // Navigate to test page
          }}
        >
          Test Now
        </button>
      </div>
    );
  }

  if (isDiabetes === false) {
    return (
      <div className="bg-main_blue rounded-[10px] p-2">
        <p className="font-bold text-white text-[14px]">Good News!</p>
        <p className="font-semibold text-light_grey text-[12px]">
          You are not diagnosed with diabetes.
        </p>
        <p className="font-bold text-white text-[24px] mt-2">No Diabetes</p>
      </div>
    );
  }

  if (isDiabetes === true) {
    return (
      <div className="bg-alt_red rounded-[10px] p-2">
        <p className="font-bold text-white text-[14px]">Oh no!</p>
        <p className="font-semibold text-light_grey text-[12px]">
          You are diagnosed with diabetes.
        </p>
        <p className="font-bold text-white text-[24px] mt-2">Diabetes</p>
      </div>
    );
  }

  return null;
}

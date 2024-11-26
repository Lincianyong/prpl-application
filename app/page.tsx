"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"; // Adjust the path for your shadcn dialog
import { CirclePlus } from "lucide-react"; // Icon for edit
import { Chart } from "./_components/Chart";
import Carousel from "./_components/Carousel";
import DiabetesContainer from "./_components/DiabetesContainer";

export default function HomePage() {
  const supabase = createClient();
  const [gulaDarah, setGulaDarah] = useState<number>(0); // Default value of 0
  const [newGulaDarah, setNewGulaDarah] = useState("");
  const [hba1c, setHba1c] = useState<number>(0); // Default value of 0
  const [newHba1c, setNewHba1c] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHba1cDialogOpen, setIsHba1cDialogOpen] = useState(false);
  const [beratBadan, setBeratBadan] = useState<number>(0); // Default value of 0
  const [newBeratBadan, setNewBeratBadan] = useState("");
  const [cholesterol, setCholesterol] = useState<number>(0); // Default value of 0
  const [newCholesterol, setNewCholesterol] = useState("");
  const [isBeratDialogOpen, setIsBeratDialogOpen] = useState(false);
  const [isCholesterolDialogOpen, setIsCholesterolDialogOpen] = useState(false);

  // Fetch the authenticated user's ID and values
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error("Failed to fetch user:", userError?.message);
          return;
        }

        setUserId(user.id);

        // Fetch all relevant values for this user
        const { data, error } = await supabase
          .from("user")
          .select("gula_darah, hba1c, weight, col_lev")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Failed to fetch user data:", error.message);
          return;
        }

        setGulaDarah(data?.gula_darah || 0); // Default to 0 if null
        setHba1c(data?.hba1c || 0); // Default to 0 if null
        setBeratBadan(data?.weight || 0); // Default to 0 if null
        setCholesterol(data?.col_lev || 0); // Default to 0 if null
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [supabase]);

  const handleSaveGulaDarah = async () => {
    if (!userId) {
      console.error("User not authenticated");
      return;
    }

    try {
      const parsedValue = parseInt(newGulaDarah, 10);

      const { error } = await supabase
        .from("user")
        .upsert({ id: userId, gula_darah: parsedValue }, { onConflict: "id" });

      if (error) {
        console.error("Failed to update gula_darah:", error.message);
        return;
      }

      setGulaDarah(parsedValue);
      setNewGulaDarah("");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving gula_darah:", error);
    }
  };

  const handleSaveHba1c = async () => {
    if (!userId) {
      console.error("User not authenticated");
      return;
    }

    try {
      const parsedValue = parseFloat(newHba1c);

      const { error } = await supabase
        .from("user")
        .upsert({ id: userId, hba1c: parsedValue }, { onConflict: "id" });

      if (error) {
        console.error("Failed to update hba1c:", error.message);
        return;
      }

      setHba1c(parsedValue);
      setNewHba1c("");
      setIsHba1cDialogOpen(false);
    } catch (error) {
      console.error("Error saving hba1c:", error);
    }
  };

  const handleSaveBeratBadan = async () => {
    if (!userId) {
      console.error("User not authenticated");
      return;
    }

    try {
      const parsedValue = parseInt(newBeratBadan, 10);

      const { error } = await supabase
        .from("user")
        .upsert({ id: userId, weight: parsedValue }, { onConflict: "id" });

      if (error) {
        console.error("Failed to update weight:", error.message);
        return;
      }

      setBeratBadan(parsedValue);
      setNewBeratBadan("");
      setIsBeratDialogOpen(false);
    } catch (error) {
      console.error("Error saving weight:", error);
    }
  };

  const handleSaveCholesterol = async () => {
    if (!userId) {
      console.error("User not authenticated");
      return;
    }

    try {
      const parsedValue = parseInt(newCholesterol, 10);

      const { error } = await supabase
        .from("user")
        .upsert({ id: userId, col_lev: parsedValue }, { onConflict: "id" });

      if (error) {
        console.error("Failed to update col_lev:", error.message);
        return;
      }

      setCholesterol(parsedValue);
      setNewCholesterol("");
      setIsCholesterolDialogOpen(false);
    } catch (error) {
      console.error("Error saving cholesterol:", error);
    }
  };

  return (
    <div className="w-full h-full px-5">
      <div className="w-[150px] pt-10 h-auto">
        <Image src="/diatect.png" height={500} width={500} alt="Logo" />
      </div>

      <div className="grid grid-cols-6 gap-[8px] mt-10">
        {/* Other Sections */}
        <div className="col-span-3">
          <DiabetesContainer />
        </div>

        {/* Gula Darah Section */}
        <div className="col-span-3 bg-sec_blue rounded-[10px] p-2">
          <p className="font-bold text-main_blue text-[14px]">Gula Darah</p>
          <p className="font-bold text-light_grey text-[14px]">Oct 10</p>
          <div className="flex items-end justify-between">
            <div className="flex items-end">
              <p className="font-bold text-black text-[24px] mt-2">
                {gulaDarah}
              </p>
              <p className="font-bold text-black text-[14px] mb-1 ml-1">
                mg/dL
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger>
                <button>
                  <CirclePlus className="text-main_blue h-[24px] w-[24px] mr-2 items-end flex" />
                </button>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle>Edit Gula Darah</DialogTitle>
                  <DialogDescription>
                    Masukkan nilai baru untuk gula darah Anda.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <input
                    type="number"
                    value={newGulaDarah}
                    onChange={(e) => setNewGulaDarah(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 w-full"
                    placeholder="Masukkan nilai gula darah"
                  />
                  <button
                    onClick={handleSaveGulaDarah}
                    className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg"
                  >
                    Simpan
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* HBA1c Section */}
        <div className="col-span-2 bg-sec_blue rounded-[10px] p-2">
          <p className="font-bold text-main_blue text-[14px]">HBA1c</p>
          <p className="font-bold text-yellow text-[12px]">
            {hba1c < 5.7 ? "Normal" : hba1c < 6.5 ? "Prediabetes" : "Diabetes"}
          </p>
          <div className="flex items-end justify-between">
            <div className="flex items-end">
              <p className="font-bold text-black text-[24px] mt-2">{hba1c}</p>
              <p className="font-bold text-black text-[14px] mb-1 ml-1">%</p>
            </div>
            <Dialog
              open={isHba1cDialogOpen}
              onOpenChange={setIsHba1cDialogOpen}
            >
              <DialogTrigger>
                <button>
                  <CirclePlus className="text-main_blue h-[24px] w-[24px] mr-2 items-end flex" />
                </button>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle>Edit HBA1c</DialogTitle>
                  <DialogDescription>
                    Masukkan nilai baru untuk HBA1c Anda.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <input
                    type="number"
                    value={newHba1c}
                    onChange={(e) => setNewHba1c(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 w-full"
                    placeholder="Masukkan nilai HBA1c"
                  />
                  <button
                    onClick={handleSaveHba1c}
                    className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg"
                  >
                    Simpan
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Berat Badan Section */}
        <div className="col-span-2 bg-sec_blue rounded-[10px] p-2">
          <p className="font-bold text-main_blue text-[14px]">Berat Badan</p>
          <p className="font-bold text-light_grey text-[12px]">Oct 10</p>
          <div className="flex items-end justify-between">
            <div className="flex items-end">
              <p className="font-bold text-black text-[24px] mt-2">
                {beratBadan}
              </p>
              <p className="font-bold text-black text-[14px] mb-1 ml-1">kg</p>
            </div>
            <Dialog
              open={isBeratDialogOpen}
              onOpenChange={setIsBeratDialogOpen}
            >
              <DialogTrigger>
                <button>
                  <CirclePlus className="text-main_blue h-[24px] w-[24px] mr-2 items-end flex" />
                </button>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle>Edit Berat Badan</DialogTitle>
                  <DialogDescription>
                    Masukkan nilai baru untuk berat badan Anda.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <input
                    type="number"
                    value={newBeratBadan}
                    onChange={(e) => setNewBeratBadan(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 w-full"
                    placeholder="Masukkan nilai berat badan"
                  />
                  <button
                    onClick={handleSaveBeratBadan}
                    className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg"
                  >
                    Simpan
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Cholesterol Level Section */}
        <div className="col-span-2 bg-sec_blue rounded-[10px] p-2">
          <p className="font-bold text-main_blue text-[14px]">
            Cholesterol lv.
          </p>
          <p className="font-bold text-light_grey text-[12px]">Oct 10</p>
          <div className="flex items-end justify-between">
            <div className="flex items-end">
              <p className="font-bold text-black text-[24px] mt-2">
                {cholesterol}
              </p>
              <p className="font-bold text-black text-[14px] mb-1 ml-1">
                mg/dL
              </p>
            </div>
            <Dialog
              open={isCholesterolDialogOpen}
              onOpenChange={setIsCholesterolDialogOpen}
            >
              <DialogTrigger>
                <button>
                  <CirclePlus className="text-main_blue h-[24px] w-[24px] mr-2 items-end flex" />
                </button>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle>Edit Cholesterol Level</DialogTitle>
                  <DialogDescription>
                    Masukkan nilai baru untuk level kolesterol Anda.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <input
                    type="number"
                    value={newCholesterol}
                    onChange={(e) => setNewCholesterol(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 w-full"
                    placeholder="Masukkan nilai kolesterol"
                  />
                  <button
                    onClick={handleSaveCholesterol}
                    className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg"
                  >
                    Simpan
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      <div>
        <Chart />
        <Carousel />
      </div>
    </div>
  );
}

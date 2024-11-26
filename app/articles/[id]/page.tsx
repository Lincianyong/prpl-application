"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Correct hook for app directory
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

// Define the type for an article
interface Article {
  id: number;
  title: string;
  content: string;
  writer: string;
}

export default function ArticlePage() {
  const supabase = createClient(); // Initialize Supabase client
  const { id } = useParams(); // Access the dynamic route parameter
  const [article, setArticle] = useState<Article | null>(null); // Define state type
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return; // Don't fetch if ID is undefined

      try {
        const { data, error } = await supabase
          .from("article")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching article:", error.message);
          return;
        }

        setArticle(data);
        setLoading(false);
      } catch (error) {
        console.error("Unexpected error fetching article:", error);
      }
    };

    fetchArticle();
  }, [id, supabase]);

  if (loading) {
    return <p className="text-center mt-10">Loading article...</p>;
  }

  if (!article) {
    return <p className="text-center mt-10">Article not found.</p>;
  }

  return (
    <div className="auth-container w-full h-full px-5">
      {/* Logo */}
      <div className="w-[150px] pt-10 h-auto">
        <Image src="/Diatect.png" height={500} width={500} alt="Logo" />
      </div>

      <div className="mt-[40px]">
        <h1 className="text-[24px] font-bold text-main_blue mb-4">
          {article.title}
        </h1>
        <p className="text-[12px] text-dark_grey mb-6">By {article.writer}</p>
        <Image
          src="/thumbnail.png" // Replace with dynamic image if available
          height={500}
          width={500}
          alt="Article Thumbnail"
          className="w-full h-auto rounded-[10px] mb-6"
        />
        <p className="text-[14px] leading-6 text-dark_grey">
          {article.content}
        </p>
      </div>
    </div>
  );
}

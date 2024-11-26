"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";

// Define the type for an article
interface Article {
  id: number;
  title: string;
  content: string;
  writer: string;
}

export default function ArticleGrid() {
  const supabase = createClient(); // Initialize Supabase client
  const [articles, setArticles] = useState<Article[]>([]); // Define state type

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data, error } = await supabase
          .from("article") // Type the table query
          .select("*");
        if (error) {
          console.error("Error fetching articles:", error.message);
          return;
        }
        setArticles(data || []); // Set articles data or fallback to empty array
      } catch (error) {
        console.error("Unexpected error fetching articles:", error);
      }
    };

    fetchArticles();
  }, [supabase]);

  return (
    <div className="auth-container w-full h-full px-5">
      {/* Logo */}
      <div className="w-[150px] pt-10 h-auto">
        <Image src="/Diatect.png" height={500} width={500} alt="Logo" />
      </div>

      <p className="text-[24px] font-semibold mt-10">Articles</p>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 gap-4 mt-4 mb-20">
        {articles.map((article) => (
          <Link href={`/articles/${article.id}`} key={article.id}>
            <div className="border border-main_blue rounded-[10px] shadow-md p-4 h-[270px] flex flex-col">
              <Image
                src="/thumbnail.png"
                height={500}
                width={500}
                alt=""
                className="h-[110px] w-full object-cover rounded-[5px]"
              />
              <h3 className="text-[14px] text-main_blue font-bold mt-4">
                {article.title}
              </h3>
              <p className="text-[10px] mt-2 text-dark_grey">
                By {article.writer}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

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

export default function Carousel() {
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
    <div>
      <Link href={'/articles'}>
        <p className="text-[24px] font-semibold px-2 mt-10">Articles</p>
      </Link>

      {/* Carousel */}
      <div className="flex overflow-x-scroll space-x-4 mt-4 px-2 mb-20">
        {articles.map((article) => (
          <Link href={`/articles/${article.id}`} key={article.id}>
            <div
              key={article.id} // TypeScript knows `id` exists on `Article`
              className="min-w-[250px] h-[270px] p-4 border border-main_blue border-1 rounded-[10px] shadow-md"
            >
              <Image
                src="/thumbnail.png"
                height={500}
                width={500}
                alt=""
                className="h-[130px] rounded-[5px]"
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

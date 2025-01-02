"use server";
import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";

interface BookmarkCreateData {
  collection_id: string;
  content: string;
  created_at: string;
}
export async function bookmarkCreate(bookmarkCreateData: BookmarkCreateData) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }
  const { data: bookmarkData, error: bookmarkError } = await supabase
    .from("bookmarks")
    .upsert([
      {
        collection_id: bookmarkCreateData.collection_id,
        name: bookmarkCreateData.content,
        content: bookmarkCreateData.content,
        created_at: bookmarkCreateData.created_at,
      },
    ]);
  if (bookmarkError) {
    console.error(bookmarkError);
  }
  return bookmarkData
}

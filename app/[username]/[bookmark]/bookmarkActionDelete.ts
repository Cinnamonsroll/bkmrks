"use server";
import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";

interface BookmarkDeleteData {
  id: string;
}

export async function bookmarkDelete(bookmarkDeleteData: BookmarkDeleteData) {
  const supabase = await createClient();

  const { data, error: userError } = await supabase.auth.getUser();
  if (userError || !data?.user) {
    console.error("Authentication error:", userError);
    redirect("/login");
    return null;
  }

  const { data: deletedData, error: deleteError } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", bookmarkDeleteData.id)
    .eq("user_id", data.user.id);

  if (deleteError) {
    console.error("Failed to delete bookmark:", deleteError);
    throw new Error("Failed to delete bookmark");
  }

  return deletedData;
}

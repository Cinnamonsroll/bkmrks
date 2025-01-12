"use server";
import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";

interface BookmarkUpdateData {
  id: string;
  name: string;
}

export async function bookmarkUpdate(bookmarkUpdateData: BookmarkUpdateData) {
  const supabase = await createClient();

  const { data, error: userError } = await supabase.auth.getUser();
  if (userError || !data?.user) {
    console.error("Authentication error:", userError);
    redirect("/login");
    return null;
  }

  const { data: updatedData, error: updateError } = await supabase
    .from("bookmarks")
    .update({ name: bookmarkUpdateData.name })
    .eq("id", bookmarkUpdateData.id)
    .eq("user_id", data.user.id);

  if (updateError) {
    console.error("Failed to update bookmark:", updateError);
    throw new Error("Failed to update bookmark");
  }

  return updatedData;
}

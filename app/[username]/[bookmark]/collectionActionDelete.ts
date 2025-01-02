"use server";

import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";

export async function deleteCollection(collectionId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  const { error: deleteError } = await supabase
    .from("collections")
    .delete()
    .eq("id", collectionId)
    .eq("user_id", data.user.id);

    const { data: collectionData,  } = await supabase
    .from("collections")
    .select("*")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: true });

  if (deleteError) {
    console.error(deleteError);
    throw new Error("Failed to delete collection");
  }

  if(collectionData) redirect(`/${data.user.user_metadata.username}/${collectionData[0].slug}`);
}

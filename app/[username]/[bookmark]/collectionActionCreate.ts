"use server";
import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";

export async function collectionCreate(formData: FormData) {
  const supabase = await createClient();
  const form_data = {
    groupName: formData.get("groupName") as string,
    groupSlug: formData.get("groupSlug") as string,
  };

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }
  
  const { data: existingCollection } = await supabase
    .from("collections")
    .select("*")
    .eq("user_id", data.user.id)
    .eq("slug", form_data.groupSlug)
    .single();

  if (existingCollection) {
    throw new Error(`A collection with the slug "${form_data.groupSlug}" already exists`);
  }

  const { error: collectionError } = await supabase.from("collections").insert([
    {
      user_id: data.user.id,
      name: form_data.groupName,
      slug: form_data.groupSlug,
      created_at: new Date().toISOString(),
    },
  ]);

  if (collectionError) {
    console.error(collectionError);
    throw new Error("Failed to create collection");
  }

  redirect(`/${data.user.user_metadata.username}/${form_data.groupSlug}`);
}
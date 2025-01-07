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

  const { data: collectionData } = await supabase
    .from("collections")
    .select("*")
    .eq("user_id", data.user.id)
    .eq("slug", form_data.groupSlug);
    
    if(collectionData){
      return
    }

  const { error: collectionError } = await supabase.from("collections").upsert([
    {
      user_id: data.user.id,
      name: form_data.groupName,
      slug: form_data.groupSlug,
      created_at: new Date().toISOString(),
    },
  ]);

  if (collectionError) {
    console.error(collectionError);
  }

  redirect(`/${data.user.user_metadata.username}/${form_data.groupSlug}`);
}

"use server";
import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";
export async function login(formData: FormData) {
  const supabase = await createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const {
    error,
    data: { user },
  } = await supabase.auth.signInWithPassword(data);
  if (error) {
    redirect(`/login?error=${error}`);
  }
  const { data: collectionData, error: collectionError } = await supabase
    .from("collections")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: true })
    

  if (collectionError) {
    redirect(`/login?error=${collectionError}`);
  }
  redirect(`/${user?.user_metadata.username}/${collectionData[0].slug}`);
}

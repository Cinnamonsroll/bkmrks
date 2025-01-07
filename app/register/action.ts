"use server";
import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";
export async function register(formData: FormData) {
  const supabase = await createClient();
  const { email, username, password } = {
    email: formData.get("email") as string,
    username: formData.get("username") as string,
    password: formData.get("password") as string,
  };

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
    },
  });
  if (error) {
    redirect(`/register?error=${error}`);
  }
  const userId = data.user?.id;
  const { error: collectionError } = await supabase.from("collections").insert([
    {
      user_id: userId,
      name: "bookmarks",
      slug: "bookmarks",
    },
  ]);

  if (collectionError) {
    console.log(collectionError)
    redirect(`/register?error=${collectionError.message}`);
  }

  redirect(`/${username}/bookmarks`)
}

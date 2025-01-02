import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";
import { BookmarkPage } from "./components/BookmarkPage";
import { Collection } from "@/app/[username]/[bookmark]/types";

export default async function BookmarkApp({
  params,
}: {
  params: Promise<{
    username: string;
    bookmark: string;
  }>;
}) {
  const { username, bookmark } = await params;

  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  const { data: collectionData } = await supabase
    .from("collections")
    .select("*")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: true });
  const currentCollection = collectionData?.find(
    (cb: Collection) => cb.slug === bookmark
  );
  if (collectionData && !currentCollection)
    return redirect(`/${username}/${collectionData[0].slug}`);

 const { data: bookmarkData } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("collection_id", currentCollection.id)
    .order("created_at", { ascending: true });


  return (
    <BookmarkPage
      user={{
        username: data.user.user_metadata.username,
        id: data.user.id,
      }}
      collection={currentCollection}
      collections={collectionData as Collection[]}
      bookmarks={bookmarkData || []}
    />
  );
}

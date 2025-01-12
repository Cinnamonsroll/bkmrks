"use client";
import { Header } from "@/app/[username]/[bookmark]/components/Header";
import { useState, useEffect, useMemo } from "react";
import { Collection, User } from "@/app/[username]/[bookmark]/types";
import { detectContentType, ContentType } from "@/app/utils/lib";
import { generateIcon } from "@/app/[username]/[bookmark]/components/utils";
import {
  Bookmark,
  BookmarkList,
} from "@/app/[username]/[bookmark]/components/Bookmark";
import { bookmarkCreate } from "@/app/[username]/[bookmark]/bookmarkActionCreate";
import { createClient } from "@/app/utils/supabase/client";

export function BookmarkPage({
  user,
  collections,
  collection,
  bookmarks,
}: {
  user: User;
  collections: Collection[];
  collection: Collection;
  bookmarks: Bookmark[];
}) {
  const [currentCollection, setCurrentCollection] = useState(collection);
  const [bookmark, setBookmark] = useState("");
  const [contentType, setContentType] = useState<{
    type: ContentType;
    subtype?: string;
  }>({ type: "text" });
  const [isAnimating, setIsAnimating] = useState(false);
  const [ubookmarks, setUbookmarks] = useState(bookmarks);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const newContentType = detectContentType(bookmark);
    if (newContentType.type !== contentType.type) {
      setIsAnimating(true);
      setTimeout(() => {
        setContentType(newContentType);
        setIsAnimating(false);
      }, 300);
    }
  }, [bookmark, contentType.type]);

  useEffect(() => {
    const channel = supabase
      .channel(`realtime-bookmarks-${currentCollection.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `collection_id=eq.${currentCollection.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setUbookmarks((prev) => [...prev, payload.new as Bookmark]);
          } else if (payload.eventType === "UPDATE") {
            setUbookmarks((prev) =>
              prev.map((bookmark) =>
                bookmark.id === payload.new.id
                  ? (payload.new as Bookmark)
                  : bookmark
              )
            );
          } else if (payload.eventType === "DELETE") {
            setUbookmarks((prev) =>
              prev.filter((bookmark) => bookmark.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, currentCollection]);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString();

      await bookmarkCreate({
        collection_id: currentCollection.id,
        content: bookmark,
        created_at: formattedDate,
        user_id: user.id,
      });

      setBookmark("");
    }
  };

  const filteredBookmarks = useMemo(
    () =>
      ubookmarks.filter(
        (b) =>
          b.name?.toLowerCase().includes(bookmark.toLowerCase()) ||
          b.content?.toLowerCase().includes(bookmark.toLowerCase())
      ),
    [ubookmarks, bookmark]
  );

  return (
    <>
      <Header
        user={user}
        collections={collections}
        currentCollection={currentCollection}
        selectCollection={setCurrentCollection}
      />
      <main className="w-full h-screen flex flex-col items-center px-5 py-20">
        <label className="inline-block w-full max-w-lg mb-8">
          <div className="relative">
            <span
              className={`absolute -translate-y-2/4 size-5 flex justify-center items-center pointer-events-none left-2 top-2/4 text-woodsmoke-100 transition-transform duration-300 ${
                isAnimating
                  ? "-translate-x-4 opacity-0"
                  : "translate-x-0 opacity-100"
              }`}
            >
              {generateIcon(contentType, bookmark)}
            </span>
            <input
              placeholder="Insert a link, text, anything!"
              name="bookmark"
              type="text"
              className="h-10 text-sm rounded-md pl-9 w-full bg-woodsmoke-900 transition-all block border border-woodsmoke-400 text-white placeholder:text-woodsmoke-100 shadow-[0_1px_2px_0_rgba(0,0,0,0.06)] focus:shadow-[0_0_0_2px_#707070,0_0_0_4px_#505050] disabled:cursor-not-allowed"
              style={{ outline: 0 }}
              value={bookmark}
              onChange={(e) => setBookmark(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </label>
        <BookmarkList bookmarks={filteredBookmarks} />
      </main>
    </>
  );
}

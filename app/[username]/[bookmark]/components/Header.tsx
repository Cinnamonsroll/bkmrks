import { generateGradient } from "@/app/utils/lib";
import Dropdown from "./Dropdown";
import { createClient } from "@/app/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Collection, User } from "@/app/[username]/[bookmark]/types";
import { useEffect, useState, useCallback } from "react";
import NewGroupModal from "./NewGroupModal";
import { deleteCollection } from "../collectionActionDelete";

export function Header({
  user,
  currentCollection,
  selectCollection,
  collections,
}: {
  user: User;
  currentCollection: Collection;
  selectCollection: (collection: Collection) => void;
  collections: Collection[];
}) {
  const supabase = createClient();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);

  const holdDuration = 3000;
  const animationDuration = 300;

  const handleLogout = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error logging out:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }    
  }, [supabase, router]);

  const deleteGroup = useCallback(async () => {
    if (isDeleting || !currentCollection.id) return;
  
    try {
      setIsDeleting(true);
      await deleteCollection(currentCollection.id);
    } catch (error) {
      console.error("Error deleting collection:", error);
    } finally {
      setIsHolding(false);
      setProgress(0);
      setIsDeleting(false);
    }
  }, [isDeleting, currentCollection.id]);
  

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const updateProgress = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsedTime = timestamp - startTime;
      const newProgress = Math.min((elapsedTime / holdDuration) * 100, 100);

      setProgress(newProgress);

      if (isHolding && newProgress < 100) {
        animationFrame = requestAnimationFrame(updateProgress);
      } else if (newProgress >= 100) {
        deleteGroup();
      }
    };

    if (isHolding) {
      animationFrame = requestAnimationFrame(updateProgress);
    } else {
      setProgress(0);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isHolding, deleteGroup]);

  const handleMouseDown = () => {
    if (!isDeleting) {
      setIsHolding(true);
    }
  };

  const handleMouseUp = () => {
    setIsHolding(false);
  };


  const renderDropdownItems = useCallback(
    () =>
      collections.map((collection, index) => (
        <Dropdown.Item
          key={collection.id}
          onSelect={() => {
            selectCollection(collection);
            router.push(`/${user.username}/${collection.slug}`);
          }}
          selected={currentCollection?.name === collection.name}
          selectedClassName="bg-woodsmoke-400 transition-all text-woodsmoke-50"
          className={`${index === 0 ? "!mt-0" : ""}`}
        >
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2">
              <span
                className="inline-flex w-4 h-4 rounded-full"
                style={{ background: generateGradient(collection.name) }}
              ></span>
              <span className="text-ellipsis overflow-hidden whitespace-nowrap max-w-[100px]">
                {collection.name}
              </span>
            </div>
            {currentCollection?.name === collection.name && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="size-4 mt-1"
              >
                <path
                  fillRule="evenodd"
                  d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        </Dropdown.Item>
      )),
    [collections, currentCollection, selectCollection, router, user.username]
  );

  return (
    <header className="flex w-full h-16 sticky z-10 -top-px transition-all justify-between items-center px-6">
      <Dropdown>
        <Dropdown.Trigger>
          <div className="flex items-center space-x-2 p-2 transition-all cursor-pointer border-none rounded-full text-woodsmoke-100 font-normal hover:bg-woodsmoke-600">
            <span
              className="inline-flex w-4 h-4 rounded-full"
              style={{ background: generateGradient(currentCollection.name) }}
            ></span>
            <span className="overflow-hidden text-ellipsis max-w-sm leading-none whitespace-nowrap">
              {currentCollection?.name}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 mt-1"
            >
              <path
                fillRule="evenodd"
                d="M10.53 3.47a.75.75 0 0 0-1.06 0L6.22 6.72a.75.75 0 0 0 1.06 1.06L10 5.06l2.72 2.72a.75.75 0 1 0 1.06-1.06l-3.25-3.25Zm-4.31 9.81 3.25 3.25a.75.75 0 0 0 1.06 0l3.25-3.25a.75.75 0 1 0-1.06-1.06L10 14.94l-2.72-2.72a.75.75 0 0 0-1.06 1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </Dropdown.Trigger>
        <Dropdown.Content align="left">
          {renderDropdownItems()}
          <Dropdown.Separator />
          <Dropdown.Item>
            <NewGroupModal />
          </Dropdown.Item>
          {collections.length > 1 && (
            <Dropdown.Item
              className="group relative overflow-hidden rounded-full"
              style={{
                background: `linear-gradient(to right, #F9696B ${progress}%, transparent ${progress}%)`,
                transition: isHolding
                  ? "none"
                  : `background ${animationDuration}ms ease-out`,
              }}
            >
              <div
                className={`flex items-center cursor-pointer after:content-['Delete_Group'] group-hover:after:content-['Hold_To_Delete'] transition-all ${
                  isHolding ? "text-white" : ""
                } ${isDeleting ? "opacity-50 cursor-not-allowed" : ""}`}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchEnd={handleMouseUp}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </div>
            </Dropdown.Item>
          )}
        </Dropdown.Content>
      </Dropdown>
      <Dropdown>
        <Dropdown.Trigger>
          <div className="flex items-center space-x-2 p-2 transition-all cursor-pointer border-none rounded-full text-woodsmoke-100 font-normal hover:bg-woodsmoke-600">
            <span
              className="inline-flex w-4 h-4 rounded-full"
              style={{ background: generateGradient(user?.username) }}
            ></span>
            <span className="overflow-hidden text-ellipsis max-w-sm leading-none whitespace-nowrap">
              {user?.username}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-4 mt-1"
            >
              <path
                fillRule="evenodd"
                d="M10.53 3.47a.75.75 0 0 0-1.06 0L6.22 6.72a.75.75 0 0 0 1.06 1.06L10 5.06l2.72 2.72a.75.75 0 1 0 1.06-1.06l-3.25-3.25Zm-4.31 9.81 3.25 3.25a.75.75 0 0 0 1.06 0l3.25-3.25a.75.75 0 1 0-1.06-1.06L10 14.94l-2.72-2.72a.75.75 0 0 0-1.06 1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item onSelect={handleLogout} className="!mt-0">
            <svg
              width="16px"
              height="16px"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              color="currentColor"
            >
              <path
                d="M12 12h7m0 0l-3 3m3-3l-3-3M19 6V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2v-1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
            Log out
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    </header>
  );
}
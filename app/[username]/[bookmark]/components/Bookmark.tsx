"use client";
import { detectContentType } from "@/app/utils/lib";
import { generateIcon } from "@/app/[username]/[bookmark]/components/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "./Modal";

export interface Bookmark {
  collection_id: string;
  id: string;
  name: string;
  content: string;
  created_at: string;
}

export function BookmarkList({ bookmarks }: { bookmarks: Bookmark[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [touchTimeout, setTouchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  };

  const handleTouchStart = (bookmark: Bookmark) => {
    const timeout = setTimeout(() => {
      setSelectedBookmark(bookmark);
      setShowModal(true);
    }, 500);
    setTouchTimeout(timeout);
  };

  const handleTouchEnd = () => {
    if (touchTimeout) {
      clearTimeout(touchTimeout);
      setTouchTimeout(null);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedBookmark(null);
  };

  bookmarks = bookmarks.map((bm) => ({
    ...bm,
    created_at: new Date(bm.created_at).toLocaleDateString("en-US"),
  }));

  return (
    <>
      <div className="flex max-w-lg w-full flex-col">
        <div className="border-b border-b-woodsmoke-400 flex justify-between pb-2">
          <span className="overflow-hidden text-ellipsis max-w-sm leading-none whitespace-nowrap text-woodsmoke-100">
            Title
          </span>
          <span className="overflow-hidden text-ellipsis max-w-sm leading-none whitespace-nowrap text-woodsmoke-100">
            Created At
          </span>
        </div>
        <motion.ul
          className="flex relative flex-col gap-2 w-full py-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence>
            {bookmarks.map((bm) => {
              const contentType = detectContentType(bm.content);
              const isCopied = copiedId === bm.id;

              return (
                <motion.li
                  key={bm.id}
                  onClick={() => handleCopy(bm.content, bm.id)}
                  onTouchStart={() => handleTouchStart(bm)}
                  onTouchEnd={handleTouchEnd}
                  onTouchCancel={handleTouchEnd}
                  className="flex justify-between items-center gap-3 p-2 border border-woodsmoke-400 rounded-md hover:bg-woodsmoke-500 transition cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {isCopied ? (
                    <div className="flex items-center gap-2 transition-all">
                      <span className="size-5 flex justify-center items-center text-woodsmoke-50">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          className="size-5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      <div className="flex flex-row gap-1 items-end">
                        <span className="text-woodsmoke-50 text-sm font-medium">
                          Copied
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="size-5 flex justify-center items-center text-woodsmoke-50">
                          {contentType.type === "color" ? (
                            <span
                              className="w-5 h-5 rounded-full shadow-md"
                              style={{
                                backgroundColor: bm.content,
                              }}
                            />
                          ) : (
                            generateIcon(contentType, bm.content)
                          )}
                        </span>
                        <div className="flex flex-row gap-1 items-end">
                          <span className="text-white text-sm font-medium">
                            {bm.name}
                          </span>
                          {contentType.type === "link" && (
                            <a
                              href={bm.content}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 text-xs hover:underline"
                            >
                              {bm.content}
                            </a>
                          )}
                        </div>
                      </div>
                      <span className="text-woodsmoke-100 text-xs">
                        {bm.created_at}
                      </span>
                    </>
                  )}
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
      </div>

      {selectedBookmark && (
        <Modal isControlled isOpen={showModal} onOpenChange={handleModalClose}>
          <Modal.Content onClose={handleModalClose}>
            <Modal.Header>
              <h2 className="text-white font-semibold">
                {selectedBookmark.name}
              </h2>
            </Modal.Header>
            <div className="p-4 flex items-center justify-center flex-col w-full gap-3">
              <p className="text-woodsmoke-50">{selectedBookmark.content}</p>
              <p className="text-woodsmoke-100 text-sm">
                Created: {selectedBookmark.created_at}
              </p>
            </div>
            <Modal.Footer>
              <div className="w-full flex items-center justify-end gap-4">
                <Modal.CloseButton className="rounded-md bg-woodsmoke-700 hover:bg-woodsmoke-800 w-full h-10 text-white transition-all font-semibold disabled:cursor-not-allowed">
                  Close
                </Modal.CloseButton>
              </div>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      )}
    </>
  );
}

export default BookmarkList;

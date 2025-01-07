"use client";
import { useState, useEffect } from "react";
import Modal from "./Modal";
import { collectionCreate } from "../collectionActionCreate";

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

export default function NewGroupModal() {
  const [data, setData] = useState({
    name: "",
    slug: "",
  });

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      slug: generateSlug(prev.name),
    }));
  }, [data.name]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({
      ...prev,
      name: e.target.value,
    }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({
      ...prev,
      slug: e.target.value,
    }));
  };


  return (
    <Modal onOpenChange={() => setData({
      name: "",
      slug: ""
  })}>
      <Modal.Trigger>
        <div className="flex items-center cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5"
          >
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
          New Group
        </div>
      </Modal.Trigger>
      <form action={collectionCreate}>
        <Modal.Content onClose={() => setData({
            name: "",
            slug: ""
        })}>
          <Modal.Header>
            <h2 className="text-white font-semibold">Create New Group</h2>
          </Modal.Header>
          <div className="p-4 flex items-center justify-center flex-col w-full gap-3">
            <label className="inline-block w-full">
              <span className="text-woodsmoke-50 mb-2 block text-sm">Name</span>
              <div className="relative">
                <input
                  placeholder="design"
                  type="text"
                  className="h-10 text-sm rounded-md p-2 w-full bg-woodsmoke-900 transition-all block border border-woodsmoke-400 text-white placeholder:text-woodsmoke-100 shadow-[0_1px_2px_0_rgba(0,0,0,0.06)] focus:shadow-[0_0_0_2px_#707070,0_0_0_4px_#505050] disabled:cursor-not-allowed"
                  required
                  name="groupName"
                  value={data.name}
                  onChange={handleNameChange}
                />
              </div>
            </label>
            <label className="inline-block w-full">
              <span className="text-woodsmoke-50 mb-2 block text-sm">Slug</span>
              <div className="relative">
                <input
                  placeholder="design"
                  type="text"
                  className="h-10 text-sm rounded-md p-2 w-full bg-woodsmoke-900 transition-all block border border-woodsmoke-400 text-white placeholder:text-woodsmoke-100 shadow-[0_1px_2px_0_rgba(0,0,0,0.06)] focus:shadow-[0_0_0_2px_#707070,0_0_0_4px_#505050] disabled:cursor-not-allowed"
                  required
                  name="groupSlug"
                  value={data.slug}
                  onChange={handleSlugChange}
                />
              </div>
            </label>
          </div>
          <Modal.Footer>
            <div className="w-full flex items-center justify-end gap-4">
              <Modal.CloseButton className="rounded-md bg-woodsmoke-700 hover:bg-woodsmoke-800 w-full h-10 text-white transition-all font-semibold disabled:cursor-not-allowed">
                Cancel
              </Modal.CloseButton>
              <button
                type="submit"
                onSubmit={() => Modal.Close()}
                disabled={!data.name || !data.slug}
                className="rounded-md bg-woodsmoke-800 w-full h-10 text-white hover:bg-woodsmoke-900 transition-all font-semibold disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </Modal.Footer>
        </Modal.Content>
      </form>
    </Modal>
  );
}

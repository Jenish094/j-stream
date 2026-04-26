import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Listbox } from "@headlessui/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { EditButton } from "@/components/buttons/EditButton";
import { Dropdown, OptionItem } from "@/components/form/Dropdown";
import { Icon, Icons } from "@/components/Icon";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { FolderCard } from "@/components/media/FolderCard";
import { MediaGrid } from "@/components/media/MediaGrid";
import { WatchedMediaCard } from "@/components/media/WatchedMediaCard";
import { EditBookmarkModal } from "@/components/overlays/EditBookmarkModal";
import { EditGroupModal } from "@/components/overlays/EditGroupModal";
import { FolderModal } from "@/components/overlays/FolderModal";
import { useModal } from "@/components/overlays/Modal";
import { useBookmarkStore } from "@/stores/bookmarks";
import { useGroupOrderStore } from "@/stores/groupOrder";
import { useProgressStore } from "@/stores/progress";
import { parseGroupString } from "@/utils/bookmarkModifications";
import { SortOption } from "@/utils/mediaSorting";
import { MediaItem } from "@/utils/mediaTypes";

import { getList, sortMedia } from "./utils";

export function BookmarksPart({
  onItemsChange,
  onShowDetails,
}: {
  onItemsChange: (hasItems: boolean) => void;
  onShowDetails?: (media: MediaItem) => void;
}) {
  const { t } = useTranslation();
  const progressItems = useProgressStore((s) => s.items);
  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const groupOrder = useGroupOrderStore((s) => s.groupOrder);
  const removeBookmark = useBookmarkStore((s) => s.removeBookmark);
  const [editing, setEditing] = useState(false);
  const [gridRef] = useAutoAnimate<HTMLDivElement>();
  const editBookmarkModal = useModal("bookmark-edit");
  const editGroupModal = useModal("bookmark-edit-group");
  const [editingBookmarkId, setEditingBookmarkId] = useState<string | null>(
    null,
  );
  const [editingGroupName, setEditingGroupName] = useState<string | null>(null);
  const modifyBookmarks = useBookmarkStore((s) => s.modifyBookmarks);
  const modifyBookmarksByGroup = useBookmarkStore(
    (s) => s.modifyBookmarksByGroup,
  );
  const [sortBy, setSortBy] = useState<SortOption>(() => {
    const saved = localStorage.getItem("__MW::bookmarksSort");
    return (saved as SortOption) || "date";
  });
  const [activeFolderModal, setActiveFolderModal] = useState<string | null>(
    null,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // require 8px movement before drag starts
      },
    }),
  );

  useEffect(() => {
    localStorage.setItem("__MW::bookmarksSort", sortBy);
  }, [sortBy]);

  const { allGroups, rootMediaItems } = useMemo(() => {
    const list = getList(bookmarks);

    const groupSet = new Set<string>();
    const rootItems: MediaItem[] = [];

    list.forEach((b) => {
      const bookmark = bookmarks[b.id];
      if (bookmark?.group && bookmark.group.length > 0) {
        // Bookmark is in at least one folder — add all its groups to the set
        bookmark.group.forEach((g: string) => groupSet.add(g));
      } else {
        // No group → show in root
        rootItems.push(b);
      }
    });

    const unsortedGroups = Array.from(groupSet);
    const sortedGroups = [...unsortedGroups].sort((a, b) => {
      const idxA = groupOrder.indexOf(a);
      const idxB = groupOrder.indexOf(b);
      if (idxA === -1 && idxB === -1) return a.localeCompare(b);
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
    });

    return {
      allGroups: sortedGroups,
      rootMediaItems: sortMedia(rootItems, sortBy, bookmarks, progressItems),
    };
  }, [bookmarks, groupOrder, sortBy, progressItems]);

  useEffect(() => {
    onItemsChange(Object.keys(bookmarks).length > 0);
  }, [bookmarks, onItemsChange]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const bookmarkId = active.id as string;
    const targetGroupName = over.id as string;

    // Only act if the target is a known folder
    if (!allGroups.includes(targetGroupName)) return;
    // Don't add to a folder that bookmark is already in
    const existingGroups = bookmarks[bookmarkId]?.group || [];
    if (existingGroups.includes(targetGroupName)) return;

    // Add the bookmark to that folder (addGroups merges without duplication)
    modifyBookmarks([bookmarkId], { addGroups: [targetGroupName] });
  };

  const handleEditBookmark = (bookmarkId: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setEditingBookmarkId(bookmarkId);
    editBookmarkModal.show();
  };

  const handleSaveBookmark = (bookmarkId: string, changes: any) => {
    modifyBookmarks([bookmarkId], changes);
    editBookmarkModal.hide();
    setEditingBookmarkId(null);
  };

  const handleSaveGroup = (oldGroupName: string, newGroupName: string) => {
    modifyBookmarksByGroup({ oldGroupName, newGroupName });
    editGroupModal.hide();
    setEditingGroupName(null);
  };

  const handleCancelEditBookmark = () => {
    editBookmarkModal.hide();
    setEditingBookmarkId(null);
  };

  const handleCancelEditGroup = () => {
    editGroupModal.hide();
    setEditingGroupName(null);
  };

  const sortOptions: OptionItem[] = [
    { id: "date", name: t("home.bookmarks.sorting.options.date") },
    { id: "title-asc", name: t("home.bookmarks.sorting.options.titleAsc") },
    { id: "title-desc", name: t("home.bookmarks.sorting.options.titleDesc") },
    { id: "year-asc", name: t("home.bookmarks.sorting.options.yearAsc") },
    { id: "year-desc", name: t("home.bookmarks.sorting.options.yearDesc") },
  ];

  const selectedSortOption =
    sortOptions.find((opt) => opt.id === sortBy) || sortOptions[0];

  if (Object.keys(bookmarks).length === 0) return null;

  return (
    <div className="relative">
      <SectionHeading
        title={t("home.bookmarks.sectionTitle")}
        icon={Icons.BOOKMARK}
      >
        <div className="flex items-center gap-2">
          <EditButton
            editing={editing}
            onEdit={setEditing}
            id="edit-button-bookmark"
          />
        </div>
      </SectionHeading>
      {editing && (
        <div className="mb-6 -mt-4">
          <Dropdown
            selectedItem={selectedSortOption}
            setSelectedItem={(item) => {
              const newSort = item.id as SortOption;
              setSortBy(newSort);
              localStorage.setItem("__MW::bookmarksSort", newSort);
            }}
            options={sortOptions}
            customButton={
              <button
                type="button"
                className="px-2 py-1 text-sm bg-mediaCard-hoverBackground rounded-full hover:bg-mediaCard-background transition-colors flex items-center gap-1"
              >
                <span>{selectedSortOption.name}</span>
                <Icon
                  icon={Icons.UP_DOWN_ARROW}
                  className="text-xs text-dropdown-secondary"
                />
              </button>
            }
            side="left"
            customMenu={
              <Listbox.Options static className="py-1">
                {sortOptions.map((opt) => (
                  <Listbox.Option
                    className={({ active }) =>
                      `cursor-pointer min-w-60 flex gap-4 items-center relative select-none py-2 px-4 mx-1 rounded-lg ${
                        active
                          ? "bg-background-secondaryHover text-type-link"
                          : "text-type-secondary"
                      }`
                    }
                    key={opt.id}
                    value={opt}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block ${selected ? "font-medium" : "font-normal"}`}
                        >
                          {opt.name}
                        </span>
                        {selected && (
                          <Icon
                            icon={Icons.CHECKMARK}
                            className="text-xs text-type-link"
                          />
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            }
          />
        </div>
      )}

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <MediaGrid ref={gridRef}>
          {/* Folder cards */}
          {allGroups.map((group) => {
            const { name, icon } = parseGroupString(group);
            return (
              <div key={`folder-${group}`}>
                <FolderCard
                  groupName={group}
                  displayName={name}
                  folderIcon={icon}
                  editable={editing}
                  onClick={() => {
                    if (!editing) {
                      setActiveFolderModal(group);
                    }
                  }}
                  onEdit={() => {
                    setEditingGroupName(group);
                    editGroupModal.show();
                  }}
                />
              </div>
            );
          })}

          {/* Root (un-grouped) bookmarks */}
          {rootMediaItems.map((media) => (
            <div key={`media-${media.id}`}>
              <WatchedMediaCard
                key={media.id}
                media={media}
                onShowDetails={onShowDetails}
                closable={editing}
                onClose={() => removeBookmark(media.id)}
                editable={editing}
                onEdit={(e) => handleEditBookmark(media.id, e)}
              />
            </div>
          ))}
        </MediaGrid>
      </DndContext>

      {/* Folder modal – always rendered, visibility controlled via isShown */}
      <FolderModal
        isShown={!!activeFolderModal}
        groupName={activeFolderModal ?? ""}
        onClose={() => setActiveFolderModal(null)}
        onShowDetails={onShowDetails}
      />

      <EditBookmarkModal
        id="edit-bookmark"
        isShown={editBookmarkModal.isShown}
        bookmarkId={editingBookmarkId}
        onCancel={handleCancelEditBookmark}
        onSave={handleSaveBookmark}
      />

      <EditGroupModal
        id={editGroupModal.id}
        isShown={editGroupModal.isShown}
        groupName={editingGroupName}
        onCancel={handleCancelEditGroup}
        onSave={handleSaveGroup}
      />
    </div>
  );
}

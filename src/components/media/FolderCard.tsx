import { useDroppable } from "@dnd-kit/core";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

import { Icon, Icons } from "@/components/Icon";
import { UserIcon, UserIcons } from "@/components/UserIcon";
import { Flare } from "@/components/utils/Flare";

export interface FolderCardProps {
  groupName: string; // The raw group syntax like "[BOOKMARK]My Folder"
  displayName: string; // The parsed display name like "My Folder"
  folderIcon?: string;
  onClick?: () => void;
  onEdit?: (e?: React.MouseEvent) => void;
  editable?: boolean;
}

export function FolderCard({
  groupName,
  displayName,
  folderIcon,
  onClick,
  onEdit,
  editable,
}: FolderCardProps) {
  const { t } = useTranslation();

  const { isOver, setNodeRef } = useDroppable({
    id: groupName,
    disabled: !editable,
  });

  return (
    <button
      ref={setNodeRef}
      type="button"
      className="block w-full text-left"
      onClick={onClick}
    >
      <Flare.Base
        className={classNames(
          "group -m-[0.705em] rounded-xl bg-background-main transition-colors duration-300 hover:bg-mediaCard-hoverBackground tabbable",
          editable ? "ring-2 ring-type-link/50" : "",
          isOver ? "!ring-4 !ring-type-success" : "",
        )}
      >
        <Flare.Light
          flareSize={300}
          cssColorVar="--colors-mediaCard-hoverAccent"
          backgroundClass="bg-mediaCard-hoverBackground duration-100"
          className="rounded-xl bg-background-main group-hover:opacity-100"
        />
        <Flare.Child className="pointer-events-auto relative mb-2 p-[0.4em] transition-transform duration-300 group-hover:scale-95">
          {/* Poster-sized area matching media card aspect ratio */}
          <div className="relative pb-[150%] w-full overflow-hidden rounded-xl bg-mediaCard-hoverBackground mb-4">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/60 group-hover:text-white transition-colors">
              <UserIcon
                icon={
                  folderIcon ? (folderIcon as UserIcons) : UserIcons.USER_GROUP
                }
                className="text-5xl mb-3 opacity-60"
              />
              <span className="text-xs text-white/40 uppercase tracking-widest font-semibold">
                {t("bookmarks.folders.title")}
              </span>
            </div>
          </div>

          {/* Title row */}
          <h1 className="mb-1 line-clamp-3 max-h-[4.5rem] text-ellipsis break-words font-bold text-white">
            {displayName}
          </h1>

          {/* Edit button overlay */}
          {editable && (
            <div className="absolute top-[0.4em] right-[0.4em] pointer-events-auto z-10">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-background-main/70 backdrop-blur-sm text-white transition-all hover:bg-type-link hover:scale-110 active:scale-95"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit?.(e);
                }}
              >
                <Icon icon={Icons.EDIT} className="text-sm" />
              </button>
            </div>
          )}
        </Flare.Child>
      </Flare.Base>
    </button>
  );
}

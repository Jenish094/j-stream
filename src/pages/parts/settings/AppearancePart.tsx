import classNames from "classnames";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/buttons/Button";
import { Toggle } from "@/components/buttons/Toggle";
import { SortableList } from "@/components/form/SortableList";
import { Icon, Icons } from "@/components/Icon";
import { CustomThemeModal } from "@/components/overlays/CustomThemeModal";
import { EditGroupOrderModal } from "@/components/overlays/EditGroupOrderModal";
import { useModal } from "@/components/overlays/Modal";
import { Heading1 } from "@/components/utils/Text";
import { useBackendUrl } from "@/hooks/auth/useBackendUrl";
import { useAuthStore } from "@/stores/auth";
import { useBookmarkStore } from "@/stores/bookmarks";
import { useGroupOrderStore } from "@/stores/groupOrder";
import { SavedCustomTheme } from "@/stores/theme";

const availableThemes = [
  {
    id: "default",
    selector: "theme-default",
    key: "settings.appearance.themes.default",
  },
  {
    id: "classic",
    selector: "theme-classic",
    key: "settings.appearance.themes.classic",
  },
  {
    id: "dark",
    selector: "theme-dark-theme",
    key: "settings.appearance.themes.dark",
  },
  {
    id: "teal",
    selector: "theme-teal",
    key: "settings.appearance.themes.teal",
  },
  {
    id: "red",
    selector: "theme-red",
    key: "settings.appearance.themes.red",
  },
  {
    id: "gray",
    selector: "theme-gray",
    key: "settings.appearance.themes.gray",
  },
  {
    id: "green",
    selector: "theme-green",
    key: "settings.appearance.themes.green",
  },
  {
    id: "forest",
    selector: "theme-forest",
    key: "settings.appearance.themes.forest",
  },
  {
    id: "autumn",
    selector: "theme-autumn",
    key: "settings.appearance.themes.autumn",
  },
  {
    id: "frost",
    selector: "theme-frost",
    key: "settings.appearance.themes.frost",
  },
  {
    id: "mocha",
    selector: "theme-mocha",
    key: "settings.appearance.themes.mocha",
  },
  {
    id: "pink",
    selector: "theme-pink",
    key: "settings.appearance.themes.pink",
  },
  {
    id: "noir",
    selector: "theme-noir",
    key: "settings.appearance.themes.noir",
  },
  {
    id: "ember",
    selector: "theme-ember",
    key: "settings.appearance.themes.ember",
  },
  {
    id: "acid",
    selector: "theme-acid",
    key: "settings.appearance.themes.acid",
  },
  {
    id: "spark",
    selector: "theme-spark",
    key: "settings.appearance.themes.spark",
  },
  {
    id: "cobalt",
    selector: "theme-cobalt",
    key: "settings.appearance.themes.cobalt",
  },
  {
    id: "grape",
    selector: "theme-grape",
    key: "settings.appearance.themes.grape",
  },
  {
    id: "spiderman",
    selector: "theme-spiderman",
    key: "settings.appearance.themes.spiderman",
  },
  {
    id: "wolverine",
    selector: "theme-wolverine",
    key: "settings.appearance.themes.wolverine",
  },
  {
    id: "hulk",
    selector: "theme-hulk",
    key: "settings.appearance.themes.hulk",
  },
  {
    id: "popsicle",
    selector: "theme-popsicle",
    key: "settings.appearance.themes.popsicle",
  },
  {
    id: "christmas",
    selector: "theme-christmas",
    key: "settings.appearance.themes.christmas",
  },
];

function ThemePreview(props: {
  selector?: string;
  active?: boolean;
  inUse?: boolean;
  name: string;
  onClick?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div
      className={classNames(props.selector, "cursor-pointer group tabbable")}
      onClick={props.onClick}
    >
      {/* Little card thing */}
      <div
        tabIndex={0}
        onKeyUp={(e) => e.key === "Enter" && e.currentTarget.click()}
        className={classNames(
          "tabbable scroll-mt-32 w-full h-32 relative rounded-lg border bg-gradient-to-br from-themePreview-primary/20 to-themePreview-secondary/10 bg-clip-content transition-colors duration-150",
          props.active
            ? "border-themePreview-primary"
            : "border-transparent group-hover:border-white/20",
        )}
      >
        {/* Dots */}
        <div className="absolute top-2 left-2">
          <div className="h-5 w-5 bg-themePreview-primary rounded-full" />
          <div className="h-5 w-5 bg-themePreview-secondary rounded-full -mt-2" />
        </div>
        {/* Active check */}
        <Icon
          icon={Icons.CHECKMARK}
          className={classNames(
            "absolute top-3 right-3 text-xs text-white transition-opacity duration-150",
            props.active ? "opacity-100" : "opacity-0",
          )}
        />
        {/* Mini movie-web. So Kawaiiiii! */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/5 h-4/5 rounded-t-lg -mb-px bg-background-main overflow-hidden">
          <div className="relative w-full h-full">
            {/* Background color */}
            <div className="bg-themePreview-primary/50 w-[130%] h-10 absolute left-1/2 -top-5 blur-xl transform -translate-x-1/2 rounded-[100%]" />
            {/* Navbar */}
            <div className="p-2 flex justify-between items-center">
              <div className="flex space-x-1">
                <div className="bg-themePreview-ghost bg-opacity-10 w-4 h-2 rounded-full" />
                <div className="bg-themePreview-ghost bg-opacity-10 w-2 h-2 rounded-full" />
                <div className="bg-themePreview-ghost bg-opacity-10 w-2 h-2 rounded-full" />
              </div>
              <div className="bg-themePreview-ghost bg-opacity-10 w-2 h-2 rounded-full" />
            </div>
            {/* Hero */}
            <div className="mt-1 flex items-center flex-col gap-1">
              {/* Title and subtitle */}
              <div className="bg-themePreview-ghost bg-opacity-20 w-8 h-0.5 rounded-full" />
              <div className="bg-themePreview-ghost bg-opacity-20 w-6 h-0.5 rounded-full" />
              {/* Search bar */}
              <div className="bg-themePreview-ghost bg-opacity-10 w-16 h-2 mt-1 rounded-full" />
            </div>
            {/* Media grid */}
            <div className="mt-5 px-3">
              {/* Title */}
              <div className="flex gap-1 items-center">
                <div className="bg-themePreview-ghost bg-opacity-20 w-2 h-2 rounded-full" />
                <div className="bg-themePreview-ghost bg-opacity-20 w-8 h-0.5 rounded-full" />
              </div>
              {/* Blocks */}
              <div className="flex w-full gap-1 mt-1">
                <div className="bg-themePreview-ghost bg-opacity-10 w-full h-20 rounded" />
                <div className="bg-themePreview-ghost bg-opacity-10 w-full h-20 rounded" />
                <div className="bg-themePreview-ghost bg-opacity-10 w-full h-20 rounded" />
                <div className="bg-themePreview-ghost bg-opacity-10 w-full h-20 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 flex justify-between items-center">
        <span className="font-medium text-white">{props.name}</span>
        <div className="flex gap-2">
          {props.onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                props.onEdit?.();
              }}
              className="text-white/50 hover:text-white/90 transition-colors"
            >
              <Icon icon={Icons.EDIT} />
            </button>
          )}
          {props.onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                props.onDelete?.();
              }}
              className="text-white/50 hover:text-white/90 transition-colors"
            >
              <Icon icon={Icons.X} />
            </button>
          )}
        </div>
        <span
          className={classNames(
            "inline-block px-3 py-1 leading-tight text-sm transition-opacity duration-150 rounded-full bg-pill-activeBackground text-white/85",
            props.inUse ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
        >
          {t("settings.appearance.activeTheme")}
        </span>
      </div>
    </div>
  );
}

export function AppearancePart(props: {
  active: string;
  inUse: string;
  setTheme: (theme: string) => void;

  enableDiscover: boolean;
  setEnableDiscover: (v: boolean) => void;

  enableFeatured: boolean;
  setEnableFeatured: (v: boolean) => void;

  enableDetailsModal: boolean;
  setEnableDetailsModal: (v: boolean) => void;

  enableImageLogos: boolean;
  setEnableImageLogos: (v: boolean) => void;

  enablePauseOverlay: boolean;
  setEnablePauseOverlay: (v: boolean) => void;

  enableCarouselView: boolean;
  setEnableCarouselView: (v: boolean) => void;

  enableMinimalCards: boolean;
  setEnableMinimalCards: (v: boolean) => void;

  forceCompactEpisodeView: boolean;
  setForceCompactEpisodeView: (v: boolean) => void;

  homeSectionOrder: string[];
  setHomeSectionOrder: (v: string[]) => void;

  enableLowPerformanceMode: boolean;

  savedCustomThemes: SavedCustomTheme[];
  setSavedCustomThemes: (v: SavedCustomTheme[]) => void;
  hiddenDefaultThemes: string[];
  setHiddenDefaultThemes: (v: string[]) => void;
}) {
  const { t } = useTranslation();

  const customThemeModal = useModal("create-custom-theme");
  const [editingTheme, setEditingTheme] = useState<any>(null);

  const carouselRef = useRef<HTMLDivElement>(null);
  const activeThemeRef = useRef<HTMLDivElement>(null);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);

  // Group order modal
  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const setGroupOrder = useGroupOrderStore((s) => s.setGroupOrder);
  const editGroupOrderModal = useModal("bookmark-edit-order-settings");
  const backendUrl = useBackendUrl();
  const account = useAuthStore((s) => s.account);

  // Check if there are groups
  const hasGroups = useMemo(() => {
    const groups = new Set<string>();

    Object.values(bookmarks).forEach((bookmark) => {
      if (Array.isArray(bookmark.group)) {
        bookmark.group.forEach((group) => groups.add(group));
      }
    });

    groups.add("bookmarks");

    return groups.size > 1;
  }, [bookmarks]);

  const {
    enableLowPerformanceMode,
    setEnableDiscover,
    setEnableFeatured,
    setEnableDetailsModal,
    setEnableImageLogos,
    setEnablePauseOverlay,
    setForceCompactEpisodeView,
  } = props;

  // Apply low performance mode restrictions
  useEffect(() => {
    if (enableLowPerformanceMode) {
      setEnableDiscover(false);
      setEnableFeatured(false);
      setEnableDetailsModal(false);
      setEnableImageLogos(false);
      setEnablePauseOverlay(false);
      setForceCompactEpisodeView(true);
    }
  }, [
    enableLowPerformanceMode,
    setEnableDiscover,
    setEnableFeatured,
    setEnableDetailsModal,
    setEnableImageLogos,
    setEnablePauseOverlay,
    setForceCompactEpisodeView,
  ]);

  const checkScrollPosition = () => {
    const container = carouselRef.current;
    if (!container) return;

    setIsAtTop(container.scrollTop <= 0);
    setIsAtBottom(
      Math.abs(
        container.scrollHeight - container.scrollTop - container.clientHeight,
      ) < 2,
    );
  };

  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    container.addEventListener("scroll", checkScrollPosition);
    checkScrollPosition(); // Check initial position

    return () => container.removeEventListener("scroll", checkScrollPosition);
  }, []);

  useEffect(() => {
    if (activeThemeRef.current && carouselRef.current) {
      const element = activeThemeRef.current;
      const container = carouselRef.current;

      const elementRect = element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      // Center the element in the container
      container.scrollTop =
        elementRect.top +
        container.scrollTop -
        containerRect.top -
        (containerRect.height - elementRect.height) / 2;

      checkScrollPosition(); // Update masks after scrolling
    }
  }, [props.active]);

  const handleEditGroupOrder = () => {
    editGroupOrderModal.show();
  };

  const handleCancelGroupOrder = () => {
    editGroupOrderModal.hide();
  };

  const handleSaveGroupOrder = (newOrder: string[]) => {
    setGroupOrder(newOrder);
    editGroupOrderModal.hide();

    // Save to backend
    if (backendUrl && account) {
      useGroupOrderStore
        .getState()
        .saveGroupOrderToBackend(backendUrl, account);
    }
  };

  return (
    <div className="space-y-12">
      <Heading1 border>{t("settings.appearance.title")}</Heading1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* First Column - Preferences */}
        <div className="space-y-8">
          {/* Discover */}
          <div>
            <p className="text-white font-bold mb-3">
              {t("settings.appearance.options.discover")}
            </p>
            <p className="max-w-[25rem] font-medium">
              {t("settings.appearance.options.discoverDescription")}
            </p>
            <div
              onClick={() => {
                if (!props.enableLowPerformanceMode) {
                  const newDiscoverValue = !props.enableDiscover;
                  props.setEnableDiscover(newDiscoverValue);
                  if (!newDiscoverValue) {
                    props.setEnableFeatured(false);
                  }
                }
              }}
              className={classNames(
                "bg-dropdown-background hover:bg-dropdown-hoverBackground select-none my-4 cursor-pointer space-x-3 flex items-center max-w-[25rem] py-3 px-4 rounded-lg",
                props.enableLowPerformanceMode
                  ? "cursor-not-allowed opacity-50 pointer-events-none"
                  : "cursor-pointer opacity-100 pointer-events-auto",
              )}
            >
              <Toggle enabled={props.enableDiscover} />
              <p className="flex-1 text-white font-bold">
                {t("settings.appearance.options.discoverLabel")}
              </p>
            </div>
          </div>
          {/* Featured Carousel */}
          {props.enableDiscover && !props.enableLowPerformanceMode && (
            <div className="pt-4 pl-4 border-l-8 border-dropdown-background">
              <p className="text-white font-bold mb-3">
                {t("settings.appearance.options.featured")}
              </p>
              <p className="max-w-[25rem] font-medium">
                {t("settings.appearance.options.featuredDescription")}
              </p>
              <div
                onClick={() => props.setEnableFeatured(!props.enableFeatured)}
                className="bg-dropdown-background hover:bg-dropdown-hoverBackground select-none my-4 cursor-pointer space-x-3 flex items-center max-w-[25rem] py-3 px-4 rounded-lg"
              >
                <Toggle enabled={props.enableFeatured} />
                <p className="flex-1 text-white font-bold">
                  {t("settings.appearance.options.featuredLabel")}
                </p>
              </div>
            </div>
          )}
          {/* Detials Modal */}
          <div>
            <p className="text-white font-bold mb-3">
              {t("settings.appearance.options.modal")}
            </p>
            <p className="max-w-[25rem] font-medium">
              {t("settings.appearance.options.modalDescription")}
            </p>
            <div
              onClick={() =>
                !props.enableLowPerformanceMode &&
                props.setEnableDetailsModal(!props.enableDetailsModal)
              }
              className={classNames(
                "bg-dropdown-background hover:bg-dropdown-hoverBackground select-none my-4 cursor-pointer space-x-3 flex items-center max-w-[25rem] py-3 px-4 rounded-lg",
                props.enableLowPerformanceMode
                  ? "cursor-not-allowed opacity-50 pointer-events-none"
                  : "cursor-pointer opacity-100 pointer-events-auto",
              )}
            >
              <Toggle enabled={props.enableDetailsModal} />
              <p className="flex-1 text-white font-bold">
                {t("settings.appearance.options.modalLabel")}
              </p>
            </div>
          </div>
          {/* Image Logos */}
          <div>
            <p className="text-white font-bold mb-3">
              {t("settings.appearance.options.logos")}
            </p>
            <p className="max-w-[25rem] font-medium">
              {t("settings.appearance.options.logosDescription")}
            </p>
            <p className="max-w-[25rem] font-medium pt-2 items-center flex gap-4">
              <Icon icon={Icons.CIRCLE_EXCLAMATION} className="" />

              {t("settings.appearance.options.logosNotice")}
            </p>
            <div
              onClick={() =>
                !props.enableLowPerformanceMode &&
                props.setEnableImageLogos(!props.enableImageLogos)
              }
              className={classNames(
                "bg-dropdown-background hover:bg-dropdown-hoverBackground select-none my-4 cursor-pointer space-x-3 flex items-center max-w-[25rem] py-3 px-4 rounded-lg",
                props.enableLowPerformanceMode
                  ? "cursor-not-allowed opacity-50 pointer-events-none"
                  : "cursor-pointer opacity-100 pointer-events-auto",
              )}
            >
              <Toggle enabled={props.enableImageLogos} />
              <p className="flex-1 text-white font-bold">
                {t("settings.appearance.options.logosLabel")}
              </p>
            </div>
          </div>

          {/* Pause Overlay */}
          <div>
            <p className="text-white font-bold mb-3">
              {t("settings.appearance.options.pauseOverlay")}
            </p>
            <div
              onClick={() =>
                !props.enableLowPerformanceMode &&
                props.setEnablePauseOverlay(!props.enablePauseOverlay)
              }
              className={classNames(
                "bg-dropdown-background hover:bg-dropdown-hoverBackground select-none my-4 cursor-pointer space-x-3 flex items-center max-w-[25rem] py-3 px-4 rounded-lg",
                props.enableLowPerformanceMode
                  ? "cursor-not-allowed opacity-50 pointer-events-none"
                  : "cursor-pointer opacity-100 pointer-events-auto",
              )}
            >
              <Toggle enabled={props.enablePauseOverlay} />
              <p className="flex-1 text-white font-bold">
                {t("settings.appearance.options.pauseOverlayLabel")}
              </p>
            </div>
          </div>

          {/* Carousel View */}
          <div>
            <p className="text-white font-bold mb-3">
              {t("settings.appearance.options.carouselView")}
            </p>
            <p className="max-w-[25rem] font-medium">
              {t("settings.appearance.options.carouselViewDescription")}
            </p>
            <div
              onClick={() =>
                props.setEnableCarouselView(!props.enableCarouselView)
              }
              className={classNames(
                "bg-dropdown-background hover:bg-dropdown-hoverBackground select-none my-4 cursor-pointer space-x-3 flex items-center max-w-[25rem] py-3 px-4 rounded-lg",
                "cursor-pointer opacity-100 pointer-events-auto",
              )}
            >
              <Toggle enabled={props.enableCarouselView} />
              <p className="flex-1 text-white font-bold">
                {t("settings.appearance.options.carouselViewLabel")}
              </p>
            </div>
          </div>

          {/* Minimal Cards */}
          <div>
            <p className="text-white font-bold mb-3">
              {t("settings.appearance.options.minimalCards")}
            </p>
            <p className="max-w-[25rem] font-medium">
              {t("settings.appearance.options.minimalCardsDescription")}
            </p>
            <div
              onClick={() =>
                props.setEnableMinimalCards(!props.enableMinimalCards)
              }
              className={classNames(
                "bg-dropdown-background hover:bg-dropdown-hoverBackground select-none my-4 cursor-pointer space-x-3 flex items-center max-w-[25rem] py-3 px-4 rounded-lg",
                "cursor-pointer opacity-100 pointer-events-auto",
              )}
            >
              <Toggle enabled={props.enableMinimalCards} />
              <p className="flex-1 text-white font-bold">
                {t("settings.appearance.options.minimalCardsLabel")}
              </p>
            </div>
          </div>

          {/* Force Compact Episode View */}
          <div>
            <p className="text-white font-bold mb-3">
              {t("settings.appearance.options.forceCompactEpisodeView")}
            </p>
            <p className="max-w-[25rem] font-medium">
              {t(
                "settings.appearance.options.forceCompactEpisodeViewDescription",
              )}
            </p>
            <div
              onClick={() =>
                !props.enableLowPerformanceMode &&
                props.setForceCompactEpisodeView(!props.forceCompactEpisodeView)
              }
              className={classNames(
                "bg-dropdown-background hover:bg-dropdown-hoverBackground select-none my-4 cursor-pointer space-x-3 flex items-center max-w-[25rem] py-3 px-4 rounded-lg",
                props.enableLowPerformanceMode
                  ? "cursor-not-allowed opacity-50 pointer-events-none"
                  : "cursor-pointer opacity-100 pointer-events-auto",
              )}
            >
              <Toggle enabled={props.forceCompactEpisodeView} />
              <p className="flex-1 text-white font-bold">
                {t("settings.appearance.options.forceCompactEpisodeViewLabel")}
              </p>
            </div>
          </div>

          {/* Home Section Order */}
          <div>
            <p className="text-white font-bold mb-3">
              {t("settings.appearance.options.homeSectionOrder")}
            </p>
            <p className="max-w-[25rem] font-medium">
              {t("settings.appearance.options.homeSectionOrderDescription")}
            </p>
            <div className="my-4 max-w-[25rem]">
              <SortableList
                items={props.homeSectionOrder.map((section) => ({
                  id: section,
                  name: t(`settings.appearance.sections.${section}`),
                }))}
                setItems={(items) => {
                  const newOrder = items.map((item) => item.id);
                  props.setHomeSectionOrder(newOrder);
                }}
              />
            </div>
            {hasGroups && (
              <div className="mt-4 max-w-[25rem]">
                <Button
                  theme="secondary"
                  onClick={handleEditGroupOrder}
                  className="w-full"
                >
                  {t("settings.appearance.options.homeSectionOrderGroups")}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Second Column - Themes */}
        <div className="space-y-8">
          <div
            ref={carouselRef}
            className={classNames(
              "grid grid-cols-2 gap-4 max-w-[600px] max-h-[36rem] md:max-h-[64rem] overflow-y-auto",
              "vertical-carousel-container",
              {
                "hide-top-gradient": isAtTop,
                "hide-bottom-gradient": isAtBottom,
              },
            )}
          >
            {availableThemes
              .filter((v) => !props.hiddenDefaultThemes.includes(v.id))
              .map((v) => (
                <div
                  key={v.id}
                  ref={props.active === v.id ? activeThemeRef : null}
                >
                  <ThemePreview
                    selector={v.selector}
                    active={props.active === v.id}
                    inUse={props.inUse === v.id}
                    name={t(v.key)}
                    onClick={() => props.setTheme(v.id)}
                    onDelete={
                      v.id !== "default"
                        ? () => {
                            props.setHiddenDefaultThemes([
                              ...props.hiddenDefaultThemes,
                              v.id,
                            ]);
                            if (props.active === v.id) {
                              props.setTheme("default");
                            }
                          }
                        : undefined
                    }
                  />
                </div>
              ))}
            {props.savedCustomThemes.map((v) => (
              <div
                key={v.id}
                ref={props.active === v.id ? activeThemeRef : null}
              >
                <div className={`theme-${v.id}`}>
                  {/* Need to ensure dynamic class injected from ThemeStore works here too */}
                  <ThemePreview
                    selector={`theme-${v.id}`}
                    active={props.active === v.id}
                    inUse={props.inUse === v.id}
                    name={v.name}
                    onClick={() => props.setTheme(v.id)}
                    onEdit={() => {
                      setEditingTheme(v);
                      customThemeModal.show();
                    }}
                    onDelete={() => {
                      props.setSavedCustomThemes(
                        props.savedCustomThemes.filter(
                          (themeItem) => themeItem.id !== v.id,
                        ),
                      );
                      if (props.active === v.id) {
                        props.setTheme("default");
                      }
                    }}
                  />
                </div>
              </div>
            ))}

            <div
              className={classNames(
                "group flex flex-col justify-center items-center h-32 relative rounded-lg border border-dashed transition-colors duration-150 p-4 text-center",
                props.savedCustomThemes.length >= 30
                  ? "border-opacity-10 border-white/20 opacity-50 cursor-not-allowed"
                  : "cursor-pointer border-white/20 hover:border-white/50",
              )}
              onClick={() => {
                if (props.savedCustomThemes.length >= 30) return;
                setEditingTheme(null);
                customThemeModal.show();
              }}
            >
              <Icon
                icon={Icons.PLUS}
                className={classNames(
                  "text-4xl transition-colors",
                  props.savedCustomThemes.length >= 30
                    ? "text-white/20"
                    : "text-white/50 group-hover:text-white",
                )}
              />
              <div className="flex flex-col items-center mt-2">
                <span
                  className={classNames(
                    "font-medium transition-colors text-sm sm:text-base leading-tight",
                    props.savedCustomThemes.length >= 30
                      ? "text-white/50"
                      : "text-white/70 group-hover:text-white",
                  )}
                >
                  {t(
                    "settings.appearance.themeOptions.createCustom",
                    "Create Custom Theme",
                  )}
                </span>
                {props.savedCustomThemes.length >= 30 && (
                  <span className="text-xs text-semantic-rose-c100 font-bold mt-1">
                    {t(
                      "settings.appearance.themeOptions.themeLimitReached",
                      "Theme limit reached (30 max)",
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button
              theme="secondary"
              onClick={() => {
                props.setHiddenDefaultThemes([]);
                props.setSavedCustomThemes([]);
                props.setTheme("default");
              }}
              className="flex items-center gap-2"
            >
              <Icon icon={Icons.ARROW_LEFT} />
              {t(
                "settings.appearance.themeOptions.resetToDefault",
                "Reset to Default",
              )}
            </Button>
          </div>
        </div>
      </div>

      <EditGroupOrderModal
        id={editGroupOrderModal.id}
        isShown={editGroupOrderModal.isShown}
        onCancel={handleCancelGroupOrder}
        onSave={handleSaveGroupOrder}
      />

      <CustomThemeModal
        id={customThemeModal.id}
        isShown={customThemeModal.isShown}
        onHide={customThemeModal.hide}
        themeToEdit={editingTheme}
        onSave={(newTheme) => {
          const existing = props.savedCustomThemes.findIndex(
            (themeItem) => themeItem.id === newTheme.id,
          );
          const copy = [...props.savedCustomThemes];
          if (existing !== -1) copy[existing] = newTheme;
          else copy.push(newTheme);
          props.setSavedCustomThemes(copy);
          props.setTheme(newTheme.id);
        }}
      />
    </div>
  );
}

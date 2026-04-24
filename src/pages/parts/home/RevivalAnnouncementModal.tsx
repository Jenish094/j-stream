import { useCallback, useEffect } from "react";

import { IconPatch } from "@/components/buttons/IconPatch";
import { Icons } from "@/components/Icon";
import { useModal } from "@/components/overlays/Modal";
import { OverlayPortal } from "@/components/overlays/OverlayDisplay";
import { Flare } from "@/components/utils/Flare";

const MODAL_ID = "revival-announcement";
const DISMISSED_KEY = `modal-${MODAL_ID}-dismissed`;

export function RevivalAnnouncementModal() {
  const modal = useModal(MODAL_ID);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!localStorage.getItem(DISMISSED_KEY)) {
      modal.show();
    }
  }, [modal]);

  const handleClose = useCallback(() => {
    localStorage.setItem(DISMISSED_KEY, "true");
    modal.hide();
  }, [modal]);

  return (
    <OverlayPortal darken close={handleClose} show={modal.isShown}>
      <div className="flex absolute inset-0 items-center justify-center p-4 overflow-hidden">
        <div className="overflow-y-auto max-h-[85vh] pointer-events-auto">
          <Flare.Base className="group rounded-3xl bg-background-main transition-colors duration-300 focus:relative focus:z-10 w-full max-w-lg p-6 bg-mediaCard-hoverBackground bg-opacity-60 backdrop-filter backdrop-blur-lg shadow-lg">
            <div className="overflow-y-auto overflow-x-hidden max-h-[85vh]">
              <Flare.Light
                flareSize={300}
                cssColorVar="--colors-mediaCard-hoverAccent"
                backgroundClass="bg-modal-background duration-100"
                className="rounded-3xl bg-background-main group-hover:opacity-100"
              />
              <Flare.Child className="pointer-events-auto relative">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">
                    P-Stream is Back
                  </h2>
                  <button
                    type="button"
                    className="text-type-secondary hover:text-white transition-transform hover:scale-95"
                    onClick={handleClose}
                  >
                    <IconPatch icon={Icons.X} />
                  </button>
                </div>
                <div className="space-y-4 text-base text-type-secondary">
                  <p className="text-white font-bold border-l-2 border-white pl-3">
                    This is a fork of the original P-Stream. I (Jenish094) hold
                    no ownership over the original project and make no claim to
                    it.
                  </p>
                  <p>
                    The original main contributor has stepped down and will no
                    longer be responsible for any public hosting. We respect
                    their decision and wish to keep their identity private.
                  </p>
                  <p>
                    I have taken on the responsibility of continuing their
                    legacy. We are committed to keeping P-Stream{" "}
                    <strong className="text-white">open source</strong> and{" "}
                    <strong className="text-white">completely ad-free</strong>.
                  </p>
                  <p>
                    <a
                      href="https://github.com/jenish094/p-stream"
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline transition-colors"
                    >
                      View the project on GitHub &rarr;
                    </a>
                  </p>
                </div>
              </Flare.Child>
            </div>
          </Flare.Base>
        </div>
      </div>
    </OverlayPortal>
  );
}

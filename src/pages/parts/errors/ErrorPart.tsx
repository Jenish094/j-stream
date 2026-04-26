import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ButtonPlain } from "@/components/buttons/Button";
import { Icons } from "@/components/Icon";
import { IconPill } from "@/components/layout/IconPill";
import { Title } from "@/components/text/Title";
import { Paragraph } from "@/components/utils/Text";
import { ErrorContainer, ErrorLayout } from "@/pages/layouts/ErrorLayout";
import { ErrorCardInPlainModal } from "@/pages/parts/errors/ErrorCard";

// Detects if an error was likely caused by an adblocker injecting broken code.
// Adblockers replace native APIs with functions that reference uninitialized
// minified variables (e.g. "fvf8yy"), producing messages like "fvf8yy is not defined".
function isAdBlockerError(error: any): boolean {
  if (!error) return false;
  const msg: string = error.message ?? error.toString();
  // Browser ReferenceError format: "<varname> is not defined"
  if (
    error instanceof ReferenceError &&
    /^[a-z0-9]{4,8} is not defined$/i.test(msg.trim())
  )
    return true;
  // React Router wraps the original error into this message when URL decode fails
  if (error instanceof URIError && msg.includes("malformed URL segment"))
    return true;
  return false;
}

export function ErrorPart(props: { error: any; errorInfo: any }) {
  const { t } = useTranslation();
  const [showErrorCard, setShowErrorCard] = useState(false);

  const maxLineCount = 5;
  const errorLines = (props.errorInfo.componentStack || "")
    .split("\n")
    .slice(0, maxLineCount);

  const error = `${props.error.toString()}\n${errorLines.join("\n")}`;
  const likelyAdBlocker = isAdBlockerError(props.error);

  return (
    <div className="relative flex min-h-screen flex-1 flex-col">
      <div className="flex h-full flex-1 flex-col items-center justify-center p-5 text-center">
        <ErrorLayout>
          <ErrorContainer maxWidth="max-w-2xl w-9/10">
            <IconPill icon={Icons.EYE_SLASH}>{t("errors.badge")}</IconPill>
            <Title>{t("errors.title")}</Title>

            {likelyAdBlocker ? (
              <Paragraph>
                {t("errors.adBlocker")}{" "}
                <a
                  href="https://solutionbay.com/solutions/how-to-whitelist-websites-in-ad-blockers"
                  target="_blank"
                  rel="noreferrer"
                  className="text-purple-400 underline hover:text-purple-300"
                >
                  {t("errors.adBlockerLink")}
                </a>
              </Paragraph>
            ) : (
              <Paragraph>{props.error.toString()}</Paragraph>
            )}

            <ErrorCardInPlainModal
              show={showErrorCard}
              onClose={() => setShowErrorCard(false)}
              error={error}
            />

            <div className="flex gap-3">
              <ButtonPlain
                theme="secondary"
                className="mt-6 p-2.5 md:px-12"
                onClick={() => {
                  window.location.replace(window.location.origin);
                }}
              >
                {t("errors.goHome")}
              </ButtonPlain>
              <ButtonPlain
                theme="secondary"
                className="mt-6 p-2.5 md:px-12"
                onClick={() => window.location.reload()}
              >
                {t("errors.reloadPage")}
              </ButtonPlain>
              <ButtonPlain
                theme="purple"
                className="mt-6 p-2.5 md:px-12"
                onClick={() => setShowErrorCard(true)}
              >
                {t("errors.showError")}
              </ButtonPlain>
            </div>
          </ErrorContainer>
        </ErrorLayout>
      </div>
    </div>
  );
}

import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Icon, Icons } from "@/components/Icon";
import { Stepper } from "@/components/layout/Stepper";
import { BiggerCenterContainer } from "@/components/layout/ThinContainer";
import { VerticalLine } from "@/components/layout/VerticalLine";
import { Heading2, Paragraph } from "@/components/utils/Text";
import { MinimalPageLayout } from "@/pages/layouts/MinimalPageLayout";
import { Card, CardContent, Link } from "@/pages/migration/utils";
import { PageTitle } from "@/pages/parts/util/PageTitle";

export function MigrationPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <MinimalPageLayout>
      <PageTitle subpage k="global.pages.migration" />
      <BiggerCenterContainer>
        <Stepper steps={2} current={1} className="mb-12" />
        <Heading2 className="!mt-0 !text-3xl">
          {t("migration.start.title")}
        </Heading2>
        <Paragraph className="max-w-[360px]">
          {t("migration.start.explainer")}
        </Paragraph>

        <div className="w-full bg-pill-background bg-opacity-50 border border-white border-opacity-10 rounded-xl px-5 py-4 mb-6 flex gap-3 items-start">
          <Icon
            icon={Icons.CIRCLE_QUESTION}
            className="text-type-dimmed text-lg mt-0.5 shrink-0"
          />
          <p className="text-sm text-type-dimmed">
            Need to export your data from the original J-Stream first?{" "}
            <a
              href="https://jstream-export-visualizer.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="text-type-link underline hover:opacity-80 transition-opacity"
            >
              Use this tool to export your account data
            </a>{" "}
            before migrating.
          </p>
        </div>

        <div className="w-full flex flex-col md:flex-row gap-3">
          <Card
            onClick={() => navigate("/migration/direct")}
            className="flex-1"
          >
            <CardContent
              colorClass="!text-onboarding-best"
              title={t("migration.start.options.direct.title")}
              subtitle={t("migration.start.options.direct.quality")}
              description={
                <Trans i18nKey="migration.start.options.direct.description" />
              }
              icon={Icons.CLOUD_ARROW_UP}
            >
              <Link>{t("migration.start.options.direct.action")}</Link>
            </CardContent>
          </Card>
          <div className="hidden md:grid grid-rows-[1fr,auto,1fr] justify-center gap-4">
            <VerticalLine className="items-end" />
            <span className="text-xs uppercase font-bold">
              {t("migration.start.options.or")}
            </span>
            <VerticalLine />
          </div>
          <Card
            onClick={() => navigate("/migration/download")}
            className="flex-1"
          >
            <CardContent
              colorClass="!text-migration-good"
              title={t("migration.start.options.download.title")}
              subtitle={t("migration.start.options.download.quality")}
              description={t("migration.start.options.download.description")}
              icon={Icons.FILE_ARROW_DOWN}
            >
              <Link>{t("migration.start.options.download.action")}</Link>
            </CardContent>
          </Card>
          <div className="hidden md:grid grid-rows-[1fr,auto,1fr] justify-center gap-4">
            <VerticalLine className="items-end" />
            <span className="text-xs uppercase font-bold">
              {t("migration.start.options.or")}
            </span>
            <VerticalLine />
          </div>
          <Card
            onClick={() => navigate("/migration/upload")}
            className="flex-1"
          >
            <CardContent
              colorClass="!text-migration-good"
              title={t("migration.start.options.upload.title")}
              subtitle={t("migration.start.options.upload.quality")}
              description={t("migration.start.options.upload.description")}
              icon={Icons.CLOUD_ARROW_UP}
            >
              <Link>{t("migration.start.options.upload.action")}</Link>
            </CardContent>
          </Card>
        </div>
      </BiggerCenterContainer>
    </MinimalPageLayout>
  );
}

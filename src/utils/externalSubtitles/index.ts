/* eslint-disable no-console */
import { PlayerMeta } from "@/stores/player/slices/source";

import { scrapeFebboxCaptions as _scrapeFebboxCaptions } from "./febbox";
import { scrapeOpenSubtitlesCaptions } from "./opensubtitles";
import { scrapeVdrkCaptions } from "./vdrk";
import { scrapeWyzieCaptions } from "./wyzie";

export async function scrapeExternalSubtitles(
  meta: PlayerMeta,
): Promise<import("@/stores/player/slices/source").CaptionListItem[]> {
  try {
    const imdbId = meta.imdbId;
    const tmdbId = meta.tmdbId;

    if (!imdbId && !tmdbId) {
      console.log(
        "No IMDb or TMDB ID available for external subtitle scraping",
      );
      return [];
    }

    const season = meta.season?.number;
    const episode = meta.episode?.number;

    // Wyzie aggregates multiple upstream sources so needs a longer timeout
    const wyzieTimeout = 30000;
    const timeout = 10000;

    // Create promises for each source with individual timeouts
    const wyziePromise = scrapeWyzieCaptions(
      tmdbId,
      imdbId ?? "",
      season,
      episode,
    );
    const openSubsPromise = imdbId
      ? scrapeOpenSubtitlesCaptions(imdbId, season, episode)
      : Promise.resolve([]);
    // const febboxPromise = scrapeFebboxCaptions(imdbId, season, episode);
    const vdrkPromise = scrapeVdrkCaptions(tmdbId, season, episode);

    // Create timeout promises
    const wyzieTimeoutPromise = new Promise<
      import("@/stores/player/slices/source").CaptionListItem[]
    >((resolve) => {
      setTimeout(() => resolve([]), wyzieTimeout);
    });
    const timeoutPromise = new Promise<
      import("@/stores/player/slices/source").CaptionListItem[]
    >((resolve) => {
      setTimeout(() => resolve([]), timeout);
    });

    // Start all promises and collect results as they complete
    const allCaptions: import("@/stores/player/slices/source").CaptionListItem[] =
      [];
    let completedSources = 0;
    const totalSources = 3;

    // Helper function to handle individual source completion
    const handleSourceCompletion = (
      sourceName: string,
      captions: import("@/stores/player/slices/source").CaptionListItem[],
    ) => {
      allCaptions.push(...captions);
      completedSources += 1;
      console.log(
        `${sourceName} completed with ${captions.length} captions (${completedSources}/${totalSources} sources done)`,
      );
    };

    // Start all sources concurrently and handle them as they complete
    const promises = [
      Promise.race([wyziePromise, wyzieTimeoutPromise]).then((captions) => {
        handleSourceCompletion("Wyzie", captions);
        return captions;
      }),
      Promise.race([openSubsPromise, timeoutPromise]).then((captions) => {
        handleSourceCompletion("OpenSubtitles", captions);
        return captions;
      }),
      // Promise.race([febboxPromise, timeoutPromise]).then((captions) => {
      //   handleSourceCompletion("Febbox", captions);
      //   return captions;
      // }),
      Promise.race([vdrkPromise, timeoutPromise]).then((captions) => {
        handleSourceCompletion("Granite", captions);
        return captions;
      }),
    ];

    // Wait for all sources to complete (with timeouts)
    await Promise.allSettled(promises);

    console.log(
      `Found ${allCaptions.length} total external captions from all sources`,
    );

    return allCaptions;
  } catch (error) {
    console.error("Error in scrapeExternalSubtitles:", error);
    return [];
  }
}

// Re-export individual functions for direct access if needed
export { scrapeWyzieCaptions } from "./wyzie";
export { scrapeOpenSubtitlesCaptions } from "./opensubtitles";
export { scrapeFebboxCaptions } from "./febbox";
export { scrapeVdrkCaptions } from "./vdrk";

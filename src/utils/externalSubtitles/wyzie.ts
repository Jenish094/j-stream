/* eslint-disable no-console */
import { type SubtitleData, configure, searchSubtitles } from "wyzie-lib";

import { CaptionListItem } from "@/stores/player/slices/source";

configure({ key: "wyzie-eeba2b82f8668e42da7534acaa088c99" });

export async function scrapeWyzieCaptions(
  tmdbId: string | number,
  imdbId: string,
  season?: number,
  episode?: number,
): Promise<CaptionListItem[]> {
  try {
    const searchParams: any = {
      encoding: "utf-8",
      source: "all",
    };

    if (imdbId) {
      searchParams.imdb_id = imdbId;
    } else if (tmdbId) {
      searchParams.tmdb_id =
        typeof tmdbId === "string" ? parseInt(tmdbId, 10) : tmdbId;
    } else {
      return [];
    }

    if (season && episode) {
      searchParams.season = season;
      searchParams.episode = episode;
    }

    console.log("Searching Wyzie subtitles with params:", searchParams);
    const wyzieSubtitles: SubtitleData[] = await searchSubtitles(searchParams);

    const wyzieCaptions: CaptionListItem[] = wyzieSubtitles.map((subtitle) => ({
      id: subtitle.id,
      language: subtitle.language || "unknown",
      url: subtitle.url,
      type:
        subtitle.format === "srt" || subtitle.format === "vtt"
          ? subtitle.format
          : "srt",
      needsProxy: false,
      opensubtitles: true,
      display: subtitle.display,
      media: subtitle.media,
      isHearingImpaired: subtitle.isHearingImpaired,
      source: `wyzie ${subtitle.source?.toString() === "opensubtitles" ? "opensubs" : subtitle.source}`,
      encoding: subtitle.encoding,
      flagUrl: subtitle.flagUrl,
      release: subtitle.release,
      releases: subtitle.releases,
      origin: subtitle.origin,
    }));

    return wyzieCaptions;
  } catch (error) {
    console.error("Error fetching Wyzie subtitles:", error);
    return [];
  }
}

interface Env {
    YOUTUBE_API_KEY: string;
}

type ChannelResponse = {
    items?: Array<{
        contentDetails?: {
            relatedPlaylists?: {
                uploads?: string;
            };
        };
    }>;
};

type PlaylistResponse = {
    items?: Array<{
        snippet?: {
            title?: string;
            publishedAt?: string;
            thumbnails?: {
                medium?: { url?: string };
                high?: { url?: string };
                default?: { url?: string };
            };
            resourceId?: {
                videoId?: string;
            };
        };
        contentDetails?: {
            videoId?: string;
            videoPublishedAt?: string;
        };
    }>;
};

export const onRequestGet: PagesFunction<Env> = async (
    context
) => {
    const apiKey = context.env.YOUTUBE_API_KEY;

    if (!apiKey) {
        return Response.json(
            {
                error: "YOUTUBE_API_KEY no está configurada.",
            },
            { status: 500 }
        );
    }

    const handle = "@in-dagando";

    const channelUrl = new URL(
        "https://www.googleapis.com/youtube/v3/channels"
    );

    channelUrl.searchParams.set(
        "part",
        "contentDetails"
    );

    channelUrl.searchParams.set(
        "forHandle",
        handle
    );

    channelUrl.searchParams.set(
        "key",
        apiKey
    );

    const channelResponse = await fetch(
        channelUrl.toString()
    );

    if (!channelResponse.ok) {
        return Response.json(
            {
                error:
                    "No se pudo consultar el canal de YouTube.",
            },
            { status: 502 }
        );
    }

    const channelData =
        (await channelResponse.json()) as ChannelResponse;

    const uploadsPlaylistId =
        channelData.items?.[0]
            ?.contentDetails
            ?.relatedPlaylists
            ?.uploads;

    if (!uploadsPlaylistId) {
        return Response.json(
            {
                error:
                    "No se encontró la lista de videos del canal.",
            },
            { status: 404 }
        );
    }


    const playlistUrl = new URL(
        "https://www.googleapis.com/youtube/v3/playlistItems"
    );

    playlistUrl.searchParams.set(
        "part",
        "snippet,contentDetails"
    );

    playlistUrl.searchParams.set(
        "playlistId",
        uploadsPlaylistId
    );

    playlistUrl.searchParams.set(
        "maxResults",
        "3"
    );

    playlistUrl.searchParams.set(
        "key",
        apiKey
    );


    const playlistResponse = await fetch(
        playlistUrl.toString()
    );

    if (!playlistResponse.ok) {
        return Response.json(
            {
                error:
                    "No se pudieron consultar los videos del canal.",
            },
            { status: 502 }
        );
    }

    const playlistData =
        (await playlistResponse.json()) as PlaylistResponse;


    const videos = (playlistData.items ?? [])
        .map((item) => {
            const snippet = item.snippet;

            const videoId =
                item.contentDetails?.videoId ??
                snippet?.resourceId?.videoId;

            if (!videoId || !snippet?.title) {
                return null;
            }

            const publishedAt =
                item.contentDetails?.videoPublishedAt ??
                snippet.publishedAt ??
                null;

            const thumbnail =
                snippet.thumbnails?.high?.url ??
                snippet.thumbnails?.medium?.url ??
                snippet.thumbnails?.default?.url ??
                null;

            return {
                id: videoId,
                title: snippet.title,
                publishedAt,
                thumbnail,
                url:
                    `https://www.youtube.com/watch?v=${videoId}`,
            };
        })
        .filter(Boolean);


    return Response.json(
        {
            channel: {
                handle,
                url:
                    "https://www.youtube.com/@in-dagando",
            },
            videos,
        },
        {
            headers: {
                "Cache-Control":
                    "public, max-age=300, s-maxage=1800",
            },
        }
    );
};

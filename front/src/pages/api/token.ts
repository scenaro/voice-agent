import { genAlphanum } from ":app/utils/string";
import type { APIContext } from "astro";
import {LIVEKIT_API_KEY, LIVEKIT_API_SECRET} from "astro:env/server";

import type { AccessTokenOptions, VideoGrant } from "livekit-server-sdk";
import { AccessToken } from "livekit-server-sdk";
import { type TokenResult } from ":types/liveSession";

export const prerender = false;

const createToken = (userInfo: AccessTokenOptions, grant: VideoGrant) => {
  const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, userInfo);
  at.addGrant(grant);
  return at.toJwt();
};

export async function POST(context: APIContext): Promise<Response> {
  try {
    if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
      return new Response("Environment variables aren't set up correctly", {
        status: 500,
      });
    }

    const roomName = `cartesia-${genAlphanum(
      4
    )}-${genAlphanum(4)}`;
    const identity = `user-${genAlphanum(4)}`;

    const grant: VideoGrant = {
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canPublishData: true,
      canSubscribe: true,
      canUpdateOwnMetadata: true,
    };

    const token = await createToken({ identity }, grant);
    const result: TokenResult = {
      identity,
      accessToken: token,
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (e) {
    return new Response((e as Error).message, {
      status: 500,
    });
  }
}

import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

type WebhookPayload = {
  _type: string;
  slug?: { current: string };
};

/**
 * Sanity webhook target: Studio project settings -> API -> Webhooks,
 * POST to /api/revalidate on publish, with this route's
 * SANITY_REVALIDATE_SECRET as the webhook's signing secret. See CLAUDE.md.
 */
export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET
    );

    if (!isValidSignature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }

    if (!body?._type) {
      return NextResponse.json({ message: "Bad request" }, { status: 400 });
    }

    revalidatePath("/");
    if (body.slug?.current) {
      revalidatePath(`/catalog/${body.slug.current}`);
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}

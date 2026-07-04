import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { trackEventSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = trackEventSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid event payload",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { apiKey, playerId, sessionId, eventName, properties, timestamp } =
      parsed.data;

    const project = await prisma.project.findUnique({
      where: { apiKey },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      );
    }

    const player = await prisma.player.upsert({
      where: {
        projectId_externalPlayerId: {
          projectId: project.id,
          externalPlayerId: playerId,
        },
      },
      update: {
        lastSeenAt: new Date(),
      },
      create: {
        projectId: project.id,
        externalPlayerId: playerId,
      },
    });

    let sessionRecord = null;

    if (sessionId) {
      sessionRecord = await prisma.session.upsert({
        where: {
          projectId_externalSessionId: {
            projectId: project.id,
            externalSessionId: sessionId,
          },
        },
        update: {},
        create: {
          projectId: project.id,
          playerId: player.id,
          externalSessionId: sessionId,
        },
      });
    }

    const event = await prisma.event.create({
      data: {
        projectId: project.id,
        playerId: player.id,
        sessionId: sessionRecord?.id,
        eventName,
        properties,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      eventId: event.id,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
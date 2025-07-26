import asyncio
from datetime import datetime

from cognition.chat_session.chat_session_livekit import ChatSessionLiveKitAgent
from livekit import agents
from livekit.agents import (
    AgentSession,
    ConversationItemAddedEvent,
    UserStateChangedEvent,
    metrics,
    MetricsCollectedEvent,
    # RoomInputOptions,
)
from livekit.plugins import (
    cartesia,
    deepgram,
    # noise_cancellation,
    openai,
    silero,
)


def prewarm(proc):
    # Preload models when process starts to speed up first interaction
    proc.userdata["vad"] = silero.VAD.load()


async def entrypoint(ctx: agents.JobContext):
    # Créer l'agent avec les instructions et les composants
    agent = ChatSessionLiveKitAgent(
        ctx,
        llm=openai.LLM(model="gpt-4o", temperature=0.7),
        tts=cartesia.TTS(
            model="sonic-2",
            voice="0418348a-0ca2-4e90-9986-800fb8b3bbc0",  # "dde2731e-94b8-4c34-92e3-55bf167846f4",
            language="fr",
            sample_rate=16000,
        ),
        vad=ctx.proc.userdata["vad"],
        stt=deepgram.STT(model="nova-2", language="fr"),
    )

    # Créer la session
    session = AgentSession(
        max_tool_steps=3,
        user_away_timeout=30,
    )

    await ctx.connect()

    # --------------------------------------------------------------------------
    @session.on("conversation_item_added")
    def on_conversation_item(ev: ConversationItemAddedEvent):
        """Called when a conversation item is added."""
        # another solution: https://github.com/livekit/agents/blob/main/examples/voice_agents/timed_agent_transcript.py

        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(
            f"[{ctx.room.name} / {timestamp}] {ev.item.role} (interrupted: {ev.item.interrupted}): {ev.item.text_content}"
        )

    # ---------------------------------------------------------------------------

    inactivity_task: asyncio.Task | None = None

    async def user_presence_task():
        # try to ping the user 3 times, if we get no answer, close the session after `user_away_timeout`
        for _ in range(3):
            await session.generate_reply(
                instructions=(
                    "L'utilisateur est inactif. Vérifiez poliment si l'utilisateur est toujours présent."
                )
            )
            await asyncio.sleep(20)

        await asyncio.shield(session.aclose())
        ctx.delete_room()

    @session.on("user_state_changed")
    def _user_state_changed(ev: UserStateChangedEvent):
        nonlocal inactivity_task
        if ev.new_state == "away":
            inactivity_task = asyncio.create_task(user_presence_task())
            return

        # ev.new_state: listening, speaking, ..
        if inactivity_task is not None:
            inactivity_task.cancel()

    # --------------------------------------------------------------------------

    usage_collector = metrics.UsageCollector()

    # https://docs.livekit.io/agents/build/metrics/
    # https://docs.livekit.io/reference/python/v1/livekit/agents/#livekit.agents.MetricsCollectedEvent
    @session.on("metrics_collected")
    def _on_metrics_collected(ev: MetricsCollectedEvent):
        usage_collector.collect(ev.metrics)
        # print(f"Metrics: {ev.metrics}")

    async def log_usage():
        summary = usage_collector.get_summary()
        print(f"Usage: {summary}")

    # At shutdown, generate and log the summary from the usage collector
    ctx.add_shutdown_callback(log_usage)

    # --------------------------------------------------------------------------

    await session.start(agent, room=ctx.room)

    await session.say(
        "Bonjour, je suis votre assistant caviste. Comment puis-je vous aider aujourd'hui ?",
        allow_interruptions=True,
    )

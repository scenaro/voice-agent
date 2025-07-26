from pathlib import Path

from livekit import agents
from livekit.agents import (
    Agent,
    # RoomInputOptions,
)

from cognition.utils import load_function_tools


# Classe de l'agent principal
class ChatSessionLiveKitAgent(Agent):
    def __init__(
        self,
        ctx: agents.JobContext,
        llm,
        tts=None,
        vad=None,
        stt=None,
    ) -> None:
        # Charger le system prompt
        session_dir = Path(__file__).parent.parent
        try:
            with open(session_dir / "system_prompt.md", "r", encoding="utf-8") as f:
                system_prompt = f.read().strip()
        except Exception as _e:
            system_prompt = """Tu es un assistant vocal intelligent.
Réponds de manière CONCISE et DIRECTE. Évite les explications longues et va droit au but.
Tes réponses doivent être courtes, claires et utiles. Maximum 2-3 phrases par réponse sauf si une explication détaillée est explicitement demandée. Ne réponds pas de caractères spéciaux, réponds que de l'alphanumérique et de la ponctuation."""

        super().__init__(
            instructions=system_prompt,
            # TODO: use also fallbackAdapter https://docs.livekit.io/agents/build/events/#fallbackadapter
            llm=llm,
            vad=vad,
            stt=stt,
            tts=tts,
            tools=load_function_tools(ctx),
        )

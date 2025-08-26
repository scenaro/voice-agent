import asyncio
import json
from pathlib import Path

from cognition.utils import format_tool_result
from livekit import agents
from livekit.agents import (
    RunContext,
    ToolError,
)


async def feature_ask_knowledge_base_question(
    ctx: agents.JobContext, context: RunContext, question: str
) -> str:
    """Interroger la base de connaissances pour répondre à une question."""
    print("🔧 Exécution du tool: feature_ask_knowledge_base_question")
    print(json.dumps({"question": question}, indent=2, ensure_ascii=False))

    session_dir = Path(__file__).parent.parent

    context.session.say("Je cherche cette information pour vous.")

    # Send a verbal status update to the user after a short delay
    # async def _speak_status_update(delay: float = 0.5):
    #     await asyncio.sleep(delay)
    #     context.session.say("Merci de patienter, je consulte ma base de connaissances.")

    # status_update_task = asyncio.create_task(_speak_status_update(5))

    try:
        with open(session_dir / "responses.json", "r", encoding="utf-8") as f:
            responses = json.load(f)
    except Exception as e:
        print(f"Erreur lors du chargement des réponses: {e}")
        raise ToolError(
            "Désolé, je n'ai pas pu accéder à la base de connaissances pour répondre à votre question."
        )

    tool_result = responses.get(
        "feature_ask_knowledge_base_question",
        {
            "state": "success",
            "instruction": "J'ai bien reçu votre question mais je n'ai pas d'informations spécifiques à ce sujet pour le moment.",
            "data": {},
        },
    )

    print("📤 Réponse du tool feature_ask_knowledge_base_question:")
    print(f"   {json.dumps(tool_result, indent=2, ensure_ascii=False)}")

    # Cancel status update if loading completed before timeout
    # status_update_task.cancel()

    # Utiliser la nouvelle fonction utilitaire pour formater la réponse
    return format_tool_result(tool_result, "feature_ask_knowledge_base_question")

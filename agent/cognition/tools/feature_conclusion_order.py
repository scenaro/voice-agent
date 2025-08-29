import asyncio
import json
from pathlib import Path

from cognition.utils import format_tool_result
from livekit import agents
from livekit.agents import (
    RunContext,
    ToolError,
)


async def feature_conclusion_order(ctx: agents.JobContext, context: RunContext) -> str:
    """Lancer la commande et le paiement pour les produits du panier."""
    print("🔧 Exécution du tool: feature_conclusion_order")

    session_dir = Path(__file__).parent.parent

    context.session.say("Parfait ! Je lance la commande pour vous.")

    # Send a verbal status update to the user after a short delay
    # async def _speak_status_update(delay: float = 0.5):
    #     await asyncio.sleep(delay)
    #     context.session.say("Merci de patienter, je traite votre commande.")

    # status_update_task = asyncio.create_task(_speak_status_update(5))

    try:
        with open(session_dir / "responses.json", "r", encoding="utf-8") as f:
            responses = json.load(f)
    except Exception as e:
        print(f"Erreur lors du chargement des réponses: {e}")
        raise ToolError("Désolé, je n'ai pas pu traiter votre commande.")

    tool_result = responses.get("feature_conclusion_order", {})
    print("📤 Réponse du tool feature_conclusion_order:")
    print(f"   {json.dumps(tool_result, indent=2, ensure_ascii=False)}")

    # Cancel status update if loading completed before timeout
    # status_update_task.cancel()

    return format_tool_result(tool_result, "feature_conclusion_order")

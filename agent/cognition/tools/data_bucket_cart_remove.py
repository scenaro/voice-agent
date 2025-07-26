import asyncio
import json
from pathlib import Path

from cognition.utils import format_tool_result
from livekit import agents
from livekit.agents import (
    RunContext,
    ToolError,
)


async def data_bucket_cart_remove(
    ctx: agents.JobContext, context: RunContext, id: str
) -> str:
    """Supprimer un vin du panier."""
    print("🔧 Exécution du tool: data_bucket_cart_remove")
    print(json.dumps({"id": id}, indent=2, ensure_ascii=False))

    session_dir = Path(__file__).parent.parent

    context.session.say("D'accord, je retire ce vin de votre panier.")

    # Send a verbal status update to the user after a short delay
    async def _speak_status_update(delay: float = 0.5):
        await asyncio.sleep(delay)
        context.session.say("Merci de patienter, je mets à jour votre panier.")

    status_update_task = asyncio.create_task(_speak_status_update(5))

    # try:
    #     with open(session_dir / "responses.json", "r", encoding="utf-8") as f:
    #         responses = json.load(f)
    # except Exception as e:
    #     print(f"Erreur lors du chargement des réponses: {e}")
    #     raise ToolError("Désolé, je n'ai pas pu retirer le vin de votre panier.")

    tool_result = {"data": {"id": id}}
    print("📤 Réponse du tool data_bucket_cart_remove:")
    print(f"   {json.dumps(tool_result, indent=2, ensure_ascii=False)}")

    # Cancel status update if loading completed before timeout
    status_update_task.cancel()

    # Utiliser la nouvelle fonction utilitaire pour formater la réponse
    return format_tool_result(tool_result, "data_bucket_cart_remove")

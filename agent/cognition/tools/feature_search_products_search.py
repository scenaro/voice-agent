import asyncio
import json
from pathlib import Path

from cognition.utils import format_tool_result
from livekit import agents
from livekit.agents import (
    RunContext,
    ToolError,
)


async def feature_search_products_search(
    ctx: agents.JobContext, context: RunContext, label: str
) -> str:
    """Rechercher des produits en fonction de critères spécifiques."""
    print("🔧 Exécution du tool: feature_search_products_search")
    print(json.dumps({"label": label}, indent=2, ensure_ascii=False))

    session_dir = Path(__file__).parent.parent

    context.session.say("D'accord, je cherche.")

    # # Send a verbal status update to the user after a short delay
    async def _speak_status_update(delay: float = 0.5):
        await asyncio.sleep(delay)
        context.session.say("Merci de patienter, je suis en train de chercher.")

    status_update_task = asyncio.create_task(_speak_status_update(5))

    # await asyncio.sleep(10)  # wait for testing only
    try:
        with open(session_dir / "responses.json", "r", encoding="utf-8") as f:
            responses = json.load(f)
    except Exception as e:
        print(f"Erreur lors du chargement des réponses: {e}")
        raise ToolError("Désolé, je n'ai pas pu effectuer la recherche de produits.")

    tool_result = responses.get("feature_search_products_search", {})
    print("📤 Réponse du tool feature_search_products_search:")
    print(f"   {json.dumps(tool_result, indent=2, ensure_ascii=False)}")

    # Cancel status update if search completed before timeout
    status_update_task.cancel()

    # Utiliser la fonction utilitaire pour formater la réponse
    return format_tool_result(tool_result, "feature_search_products_search")

import asyncio
import json
from pathlib import Path
from typing import List

from cognition.utils import format_tool_result
from livekit import agents
from livekit.agents import (
    RunContext,
    ToolError,
)


async def feature_benchmark_products_compare(
    ctx: agents.JobContext, context: RunContext, criterias: List[str]
) -> str:
    """Récupérer et préparer les données des produits sélectionnés pour la comparaison."""
    print("🔧 Exécution du tool: feature_benchmark_products_compare")
    print(json.dumps({"criterias": criterias}, indent=2, ensure_ascii=False))

    session_dir = Path(__file__).parent.parent

    context.session.say("D'accord, je récupère les données pour la comparaison.")

    # Send a verbal status update to the user after a short delay
    # async def _speak_status_update(delay: float = 0.5):
    #     await asyncio.sleep(delay)
    #     context.session.say(
    #         "Merci de patienter, je prépare les données de comparaison."
    #     )

    # status_update_task = asyncio.create_task(_speak_status_update(5))

    try:
        with open(session_dir / "responses.json", "r", encoding="utf-8") as f:
            responses = json.load(f)
    except Exception as e:
        print(f"Erreur lors du chargement des réponses: {e}")
        raise ToolError("Désolé, je n'ai pas pu préparer les données de comparaison.")

    tool_result = responses.get("feature_benchmark_products_compare", {})
    print("📤 Réponse du tool feature_benchmark_products_compare:")
    print(f"   {json.dumps(tool_result, indent=2, ensure_ascii=False)}")

    # Cancel status update if loading completed before timeout
    # status_update_task.cancel()

    # Utiliser la nouvelle fonction utilitaire pour formater la réponse
    return format_tool_result(tool_result, "feature_benchmark_products_compare")

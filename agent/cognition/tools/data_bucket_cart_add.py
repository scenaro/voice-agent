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


async def data_bucket_cart_add(
    ctx: agents.JobContext, context: RunContext, product_ids: List[str]
) -> str:
    """Ajouter un ou plusieurs vins au panier."""
    print("🔧 Exécution du tool: data_bucket_cart_add")
    print(json.dumps({"product_ids": product_ids}, indent=2, ensure_ascii=False))

    session_dir = Path(__file__).parent.parent

    # Adapt the message according to the number of products
    if len(product_ids) == 1:
        context.session.say("Parfait, j'ajoute ce vin à votre panier.")
    else:
        context.session.say(
            f"Parfait, j'ajoute ces {len(product_ids)} vins à votre panier."
        )

    # Send a verbal status update to the user after a short delay
    # async def _speak_status_update(delay: float = 0.5):
    #     await asyncio.sleep(delay)
    #     context.session.say("Merci de patienter, je mets à jour votre panier.")

    # status_update_task = asyncio.create_task(_speak_status_update(5))

    # try:
    #     with open(session_dir / "responses.json", "r", encoding="utf-8") as f:
    #         responses = json.load(f)
    # except Exception as e:
    #     print(f"Erreur lors du chargement des réponses: {e}")
    #     raise ToolError("Désolé, je n'ai pas pu ajouter le vin à votre panier.")

    tool_result = {"data": product_ids}
    print("📤 Réponse du tool data_bucket_cart_add:")
    print(f"   {json.dumps(tool_result, indent=2, ensure_ascii=False)}")

    # Cancel status update if loading completed before timeout
    # status_update_task.cancel()

    # Use the new utility function to format the response
    return format_tool_result(tool_result, "data_bucket_cart_add")

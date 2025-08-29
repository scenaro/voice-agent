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


async def feature_search_products_highlight(
    ctx: agents.JobContext, context: RunContext, product_ids: List[str]
) -> str:
    """Mettre en valeur certains produits parmi les produits trouvés."""
    print("🔧 Exécution du tool: feature_search_products_highlight")
    print(json.dumps({"product_ids": product_ids}, indent=2, ensure_ascii=False))

    session_dir = Path(__file__).parent.parent

    context.session.say("D'accord, je mets en valeur les meilleures options.")

    try:
        with open(session_dir / "responses.json", "r", encoding="utf-8") as f:
            responses = json.load(f)
    except Exception as e:
        print(f"Erreur lors du chargement des réponses: {e}")
        raise ToolError("Désolé, je n'ai pas pu mettre en valeur les produits.")

    tool_result = responses.get("feature_search_products_highlight", {})
    print("📤 Réponse du tool feature_search_products_highlight:")
    print(f"   {json.dumps(tool_result, indent=2, ensure_ascii=False)}")

    return format_tool_result(tool_result, "feature_search_products_highlight")

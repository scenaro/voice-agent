import asyncio
import json
from pathlib import Path

from cognition.utils import format_tool_result
from livekit import agents
from livekit.agents import (
    RunContext,
    ToolError,
)


async def session_memory_update(
    ctx: agents.JobContext, context: RunContext, memory: str
) -> str:
    """Mettre à jour la mémoire de la session."""
    print("🔧 Exécution du tool: session_memory_update")
    print(json.dumps({"memory": memory}, indent=2, ensure_ascii=False))

    session_dir = Path(__file__).parent.parent

    try:
        with open(session_dir / "responses.json", "r", encoding="utf-8") as f:
            responses = json.load(f)
    except Exception as e:
        print(f"Erreur lors du chargement des réponses: {e}")
        raise ToolError("Mémoire non mise à jour.")

    tool_result = responses.get("session_memory_update", {})
    print("📤 Réponse du tool session_memory_update:")
    print(f"   {json.dumps(tool_result, indent=2, ensure_ascii=False)}")

    # Utiliser la nouvelle fonction utilitaire pour formater la réponse
    return format_tool_result(tool_result, "session_memory_update")

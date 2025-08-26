# Fonction utilitaire pour formater les réponses des tools
import importlib
import json
import logging
import sys

from pathlib import Path
from typing import Any, Dict

from livekit import agents
from livekit.agents import function_tool

logger = logging.getLogger(__name__)

# Configuration des outils avec leurs métadonnées
tools_def = {
    "feature_ask_knowledge_base_question": {"publish_data": False},
    "feature_search_products_search": {"publish_data": True},
    "feature_search_products_highlight": {"publish_data": True},
    "feature_product_presentation_display": {"publish_data": True},
    "feature_product_presentation_producer": {"publish_data": True},
    "feature_benchmark_products_compare": {"publish_data": True},
    "feature_benchmark_products_generate": {"publish_data": True},
    "data_bucket_selection_add": {"publish_data": True},
    "data_bucket_selection_remove": {"publish_data": True},
    "data_bucket_selection_replace": {"publish_data": True},
    "data_bucket_cart_add": {"publish_data": True},
    "data_bucket_cart_remove": {"publish_data": True},
    "data_bucket_cart_replace": {"publish_data": True},
    "feature_conclusion_finish": {"publish_data": False},
    "feature_conclusion_order": {"publish_data": True},
    "session_memory_update": {"publish_data": False},
}

("Use format_tool_result instead")


def format_tool_result(tool_result: Dict[str, Any], tool_name: str) -> str:
    """
    Formate le résultat d'un tool.
    """

    return {
        "state": tool_result.get("state", f"Tool {tool_name} exécuté avec succès."),
        "instruction": tool_result.get("instruction"),
        "data": tool_result.get("data", {}),
    }


# Middleware qui intercepte les fonctions tools, inject le JobContext et publie le résultat du tool au front
def handle_tool(fn, ctx: agents.JobContext, publish_data=False):
    import inspect
    from functools import wraps

    # Obtenir la signature originale de la fonction
    sig = inspect.signature(fn)

    # Créer une nouvelle signature sans le premier paramètre (ctx)
    params = list(sig.parameters.values())[1:]  # Exclure le premier paramètre (ctx)
    new_sig = sig.replace(parameters=params)

    @wraps(fn)
    async def handler(*args, **kwargs):
        result = await fn(ctx, *args, **kwargs)

        if publish_data:
            logger.info(
                f"📤 Envoi de la réponse au topic: tool:{fn.__name__} => {result}"
            )
            await ctx.room.local_participant.publish_data(
                # FIXME: standardize data format
                json.dumps(result.get("data", result)).encode("utf-8"),
                topic="tool:" + fn.__name__,
            )

        return f"""
        ## État

        {result["state"]}

        ## Instruction

        {result["instruction"]}

        ## Résultats

        ```json
        {json.dumps(result.get("data", {}), indent=2, ensure_ascii=False)}
        ```
        """

    # Appliquer la nouvelle signature au handler
    handler.__signature__ = new_sig

    return function_tool(handler)


# Load function tools basées sur tools.json
def load_function_tools(ctx: agents.JobContext):
    """Charge les function tools basées sur tools.json et tools_def"""
    tools = []

    # Lire tools.json pour connaître les outils disponibles
    try:
        with open(Path(__file__).parent / "tools.json", "r", encoding="utf-8") as f:
            tools_config = json.load(f)
    except Exception as e:
        logger.error(f"❌ Erreur lors du chargement de tools.json: {e}")
        print(
            f"❌ Erreur lors du chargement de tools.json: {e}",
            flush=True,
            file=sys.stderr,
        )
        return []

    logger.info(f"📋 Chargement de {len(tools_config)} outils depuis tools.json...")
    print(
        f"📋 Chargement de {len(tools_config)} outils depuis tools.json...", flush=True
    )

    for tool_def in tools_config:
        tool_name = list(tool_def.keys())[0]

        # Vérifier que l'outil est dans tools_def
        if tool_name not in tools_def:
            logger.warning(
                f"⚠️ Outil {tool_name} trouvé dans tools.json mais pas dans tools_def - ignoré"
            )
            continue

        # Import dynamique
        try:
            module = importlib.import_module(f"cognition.tools.{tool_name}")
            tool_function = getattr(module, tool_name)

            # Récupérer la configuration
            config = tools_def[tool_name]
            publish_data = config["publish_data"]

            # Appliquer handle_tool
            tools.append(handle_tool(tool_function, ctx, publish_data=publish_data))
            logger.info(f"✅ Outil {tool_name} chargé (publish_data={publish_data})")
            print(
                f"✅ Outil {tool_name} chargé (publish_data={publish_data})", flush=True
            )

        except Exception as e:
            logger.error(f"❌ Erreur lors du chargement de {tool_name}: {e}")
            continue

    logger.info(f"🎯 {len(tools)} outils chargés avec succès")
    print(f"🎯 {len(tools)} outils chargés avec succès", flush=True)

    return tools


# # Function to send custom events to frontend
# async def send_custom_event(ctx, event_type: str, data: dict):
#     try:
#         event = {
#             "type": event_type,
#             "timestamp": asyncio.get_event_loop().time(),
#             "data": data,
#         }
#         message = json.dumps(event)
#         await ctx.room.local_participant.publish_data(
#             message.encode("utf-8"), topic="custom_events"
#         )
#         print(f"Sent custom event: {event_type}")
#     except Exception as e:
#         print(f"Error sending custom event: {e}")

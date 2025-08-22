# before importing livekit
import env  # noqa: F401
import asyncio


from livekit import agents

from entrypoint import entrypoint, prewarm


async def app_entrypoint(ctx):
    import logging
    from health_server import start_health_server, set_ready

    logger = logging.getLogger(__name__)

    logger.info("Starting health server before main entrypoint...")

    try:
        # Lancer health server sans bloquer la boucle principale
        asyncio.create_task(start_health_server(port=8080))
        set_ready(True)
        logger.info("Health server marked as ready")
    except Exception as e:
        logger.error(f"Failed to start health server: {e}")

    logger.info("Starting main entrypoint...")
    await entrypoint(ctx)


if __name__ == "__main__":
    agents.cli.run_app(
        agents.WorkerOptions(entrypoint_fnc=app_entrypoint, prewarm_fnc=prewarm)
    )

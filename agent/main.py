# before importing livekit
import env  # noqa: F401
import asyncio
import logging
import threading

from livekit import agents

from entrypoint import entrypoint, prewarm
from health_server import start_health_server, set_ready


def start_health_server_thread():
    asyncio.run(start_health_server(port=8080))


if __name__ == "__main__":
    # logging.basicConfig(
    #     level=logging.INFO, format="%(asctime)s - %(levelname)s  %(name)s - %(message)s"
    # )
    logger = logging.getLogger(__name__)

    logger.info("Starting health server in background thread...")
    thread = threading.Thread(target=start_health_server_thread, daemon=True)
    thread.start()

    # TODO: improve it, set_ready should be called when the agent is ready
    set_ready(True)

    logger.info("Starting LiveKit agents main entrypoint...")
    agents.cli.run_app(
        agents.WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm)
    )

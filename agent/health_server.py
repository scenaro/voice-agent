import logging
from sanic import Sanic
from sanic.response import text
import health_state

logger = logging.getLogger(__name__)
# logging.basicConfig(
#     level=logging.INFO, format="%(asctime)s - %(levelname)s  %(name)s - %(message)s"
# )

# Créer l'app Sanic
app = Sanic("health-server")


@app.get("/api/sys/status/health")
async def health_handler(request):
    logger.info("Health check accessed")
    return text("OK!")


@app.get("/api/sys/status/ready")
async def ready_handler(request):
    current = health_state.is_ready()
    logger.info(f"Readiness check accessed, is_ready={health_state.is_ready()}")
    if current:
        return text("Ready!")
    else:
        return text("Not Ready", status=503)


def set_ready(ready: bool = True):
    """Marquer le service comme prêt ou non."""
    health_state.set_ready(ready)
    logger.info(f"Health server marked as {'ready' if ready else 'not ready'}")


async def start_health_server(port=8080):
    try:
        logger.info(f"Starting health server on 0.0.0.0:{port}")
        server = await app.create_server(
            host="0.0.0.0", port=port, return_asyncio_server=True
        )

        await server.startup()  # Appel obligatoire avant serve_forever
        logger.info("Health server started")

        await server.serve_forever()
    except Exception as e:
        logger.error(f"Failed to start health server: {e}")
        raise

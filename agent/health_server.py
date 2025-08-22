import logging
from sanic import Sanic
from sanic.response import text

logger = logging.getLogger(__name__)

# Créer l'app Sanic
app = Sanic("health-server")

# Variable pour l'état de readiness
is_ready = False


@app.get("/sys/status/health")
async def health_handler(request):
    logger.info("Health check accessed")
    return text("OK!")


@app.get("/sys/status/ready")
async def ready_handler(request):
    logger.info(f"Readiness check accessed, is_ready={is_ready}")
    if is_ready:
        return text("Ready!")
    else:
        return text("Not Ready", status=503)


def set_ready(ready: bool = True):
    """Marquer le service comme prêt ou non."""
    global is_ready
    is_ready = ready
    logger.info(f"Health server marked as {'ready' if ready else 'not ready'}")


async def start_health_server(port: int = 8080):
    """Démarrer le serveur HTTP."""
    try:
        logger.info(f"Attempting to start health server on 0.0.0.0:{port}")
        server = await app.create_server(
            host="0.0.0.0", port=port, return_asyncio_server=True
        )

        logger.info(f"Health server successfully started on port {port}")
        return server
    except Exception as e:
        logger.error(f"Failed to start health server: {e}")
        raise

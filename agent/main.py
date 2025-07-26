# before importing livekit
import env  # noqa: F401


from livekit import agents

from entrypoint import entrypoint, prewarm


if __name__ == "__main__":
    agents.cli.run_app(
        agents.WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm)
    )

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Python version check
if sys.version_info < (3, 13):
    print("❌ Python 3.13+ requis")
    sys.exit(1)

# Load environment mode (development, production)
env_mode = os.getenv("ENV_MODE")

if not env_mode:
    raise ValueError("ENV_MODE not found in environment variables")

env_file = Path(f".env.{env_mode}")

if not env_file.is_file():
    raise FileNotFoundError(f"File {env_file} not found")

load_dotenv(env_file, override=True)
print(f"Env Mode: {env_mode} -> {env_file} loaded")

# ------------------------------------------------------------------------------

# Configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
CARTESIA_API_KEY = os.getenv("CARTESIA_API_KEY")

if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY not found in environment variables")
if not CARTESIA_API_KEY:
    raise ValueError("CARTESIA_API_KEY not found in environment variables")

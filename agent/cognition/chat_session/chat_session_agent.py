# NOTE: what is this file for?

import json
import sys
from pathlib import Path
from typing import Any, Dict, List


class ChatSessionAgent:
    def __init__(self):
        """
        Initialise l'agent de session de chat avec ChatGPT.
        """
        # Configuration de session
        self.session_dir = Path(__file__).parent.parent

        # Vérifier que les fichiers requis existent
        self._validate_session_files()

        # System prompt et tools
        self.system_prompt = self._load_system_prompt()
        self.tools = self._load_tools()

        # Historique de conversation
        self.conversation_history = []
        self._load_conversation_history()

        # Suivi des tokens
        self.total_tokens_used = 0
        self.total_prompt_tokens = 0
        self.total_completion_tokens = 0
        self._last_token_count = 0

    def _validate_session_files(self):
        """Valide que tous les fichiers de session requis existent."""
        required_files = [
            "system_prompt.md",
            "tools.json",
            "session_memory.md",
            "responses.json",
        ]

        missing_files = []
        for file_name in required_files:
            if not (self.session_dir / file_name).exists():
                missing_files.append(file_name)

        if missing_files:
            raise FileNotFoundError(
                f"Fichiers de session manquants: {', '.join(missing_files)}"
            )

    def _load_system_prompt(self) -> str:
        """Charge le system prompt depuis le fichier."""
        try:
            with open(
                self.session_dir / "system_prompt.md", "r", encoding="utf-8"
            ) as f:
                return f.read().strip()
        except Exception as e:
            raise ValueError(f"Erreur lors du chargement du system prompt: {e}")

    def _load_tools(self) -> List[Dict[str, Any]]:
        """Charge les tools depuis le fichier JSON."""
        try:
            with open(self.session_dir / "tools.json", "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            raise ValueError(f"Erreur lors du chargement des tools: {e}")

    def _load_responses(self) -> Dict[str, Dict[str, Any]]:
        """Charge toutes les réponses mockées depuis le fichier responses.json."""
        try:
            with open(self.session_dir / "responses.json", "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            raise ValueError(f"Erreur lors du chargement des réponses: {e}")

    def _load_conversation_history(self):
        """Charge l'historique de conversation depuis le fichier."""
        history_path = self.session_dir / "conversation_history.json"
        if history_path.exists():
            try:
                with open(history_path, "r", encoding="utf-8") as f:
                    self.conversation_history = json.load(f)
            except json.JSONDecodeError:
                print(
                    f"Erreur de décodage JSON pour l'historique de conversation à {history_path}. Effacement du fichier.",
                    file=sys.stderr,
                )
                self.conversation_history = []
                history_path.unlink()  # Supprimer le fichier corrompu
            except Exception as e:
                print(
                    f"Erreur lors du chargement de l'historique de conversation: {e}",
                    file=sys.stderr,
                )
                self.conversation_history = []
        else:
            print(
                f"Aucun fichier d'historique trouvé à {history_path}. Création d'un nouveau fichier."
            )
            self.conversation_history = []

    def _load_tool_response(self, tool_name: str) -> Dict[str, Any]:
        """
        Charge la réponse mockée pour un tool spécifique depuis responses.json.
        """
        # Charger toutes les réponses
        responses = self._load_responses()

        # Chercher la réponse pour ce tool
        if tool_name in responses:
            return responses[tool_name]
        else:
            # Réponse par défaut si le tool n'existe pas
            return {"prompt": f"Tool {tool_name} exécuté avec succès."}

    def _save_conversation_history(self):
        """Sauvegarde l'historique de conversation."""
        history_path = self.session_dir / "conversation_history.json"
        with open(history_path, "w", encoding="utf-8") as f:
            json.dump(self.conversation_history, f, indent=2, ensure_ascii=False)

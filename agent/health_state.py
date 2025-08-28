import threading

_lock = threading.Lock()
_is_ready = False


def set_ready(value: bool):
    global _is_ready
    with _lock:
        _is_ready = value


def is_ready() -> bool:
    with _lock:
        return _is_ready

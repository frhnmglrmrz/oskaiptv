from slowapi import Limiter
from slowapi.util import get_remote_address

# Gunakan IP client sebagai kunci pembeda pengguna
limiter = Limiter(key_func=get_remote_address)

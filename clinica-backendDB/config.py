from passlib.context import CryptContext
from datetime import timedelta,datetime
import secrets
from jose import jwt

# Generación de una SECRET_KEY segura
SECRET_KEY = secrets.token_urlsafe(32)  # Genera una clave secreta aleatoria
ALGORITHM = "HS256"  # Algoritmo para firmar el token
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # Duración de validez del token en minutos

# Configuración para hashear contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(*, data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

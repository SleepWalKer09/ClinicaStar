import bcrypt

password = "secret".encode("utf-8")
hashed = bcrypt.hashpw(password, bcrypt.gensalt())
print(hashed)

assert bcrypt.checkpw(password, hashed), "La verificación de la contraseña falló"
print("La verificación de la contraseña fue exitosa")
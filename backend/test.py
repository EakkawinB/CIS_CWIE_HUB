from app.core.security import create_access_token, verify_token


token = create_access_token(
    user_id=1,
    email="student@test.com",
    role="student"
)


print("TOKEN:")
print(token)


payload = verify_token(token)

print("PAYLOAD:")
print(payload)
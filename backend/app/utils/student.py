def generate_student_code(email: str):
    username = email.split("@")[0]

    if username.startswith("s"):
        return username[1:]

    return username
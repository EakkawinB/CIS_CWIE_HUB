from app.utils.student import generate_student_code

def create_student(db, user):

    student = Student(
        user_id=user.user_id,
        student_code=generate_student_code(user.email)
    )

    db.add(student)
    db.commit()
    db.refresh(student)

    return student
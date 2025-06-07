from fastapi import FastAPI, HTTPException, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = "sqlite:///./users.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    position = Column(String)
    password = Column(String)
    cpf = Column(String, unique=True)
    email = Column(String, unique=True)
    phone = Column(String)

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    supervisor = Column(String)
    employee = Column(String)
    status = Column(String)

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    description = Column(String)
    user = Column(String)


Base.metadata.create_all(bind=engine)

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    position: str
    password: str
    cpf: str
    email: str
    phone: str

class CreateTaskRequest(BaseModel):
    name: str
    supervisor: str
    employee: str
    status: str

class UpdateTaskRequest(BaseModel):
    name: str
    supervisor: str
    employee: str
    status: str

class TaskFilterRequest(BaseModel):
    name: Optional[str] = None
    supervisor: Optional[str] = None
    employee: Optional[str] = None
    status: Optional[str] = None

class NotificationRequest(BaseModel):
    user: str
    description: str


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

logged_users = {}

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter_by(email=request.email, password=request.password).first()
    if user:
        logged_users["current"] = user.name
        return {"position": user.position}
    else:
        raise HTTPException(status_code=401, detail="Credenciais Inválidas")
    
@app.post("/register")
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter_by(name=request.name).first()
    if user:
        raise HTTPException(status_code=400, detail="Usuário já existe")
    new_user = User(name=request.name, position=request.position, password=request.password, cpf=request.cpf, email=request.email, phone=request.phone)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": f"Usuário {request.name} cadastrado com sucesso!"}

@app.post("/task/create")
def create_task(request: CreateTaskRequest, db: Session = Depends(get_db)):
    new_task = Task(name=request.name, supervisor=request.supervisor, employee=request.employee, status=request.status)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    notification = Notification(user=request.employee, description=f"Tarefa {request.name} atribuida para você")
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return {"message": "Tarefa criada com sucesso!"}

@app.post("/task/update/{task_id}")
def update_task(task_id: int, request: UpdateTaskRequest, db: Session = Depends(get_db)):
    task = db.query(Task).filter_by(id=task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    task.name = request.name
    task.supervisor = request.supervisor
    task.employee = request.employee
    task.status = request.status
    db.commit()
    db.refresh(task)
    return {"message": "Tarefa atualizada com sucesso!"}

@app.get("/task/get")
def get_tasks(db: Session = Depends(get_db)):
    tasks = db.query(Task).all()
    return [
        {
            "id": task.id,
            "name": task.name,
            "supervisor": task.supervisor,
            "employee": task.employee,
            "status": task.status
        }
        for task in tasks
    ]

@app.get("/task/{user_position}/{user_id}")
def get_tasks_filter(user_position: str, user_id: int, db: Session = Depends(get_db)):

    if user_id:
        user = db.query(User).filter_by(id=user_id).first()
        user_name = user.name
    else:
        raise HTTPException(status_code=404, detail="user_id é obrigatório")

    if user_position == "employee":
        tasks = db.query(Task).filter_by(employee=user_name).all()
    elif user_position == "supervisor":
        tasks = db.query(Task).filter_by(supervisor=user_name).all()
    else:
        raise HTTPException(status_code=404, detail="position está errada")
    
    return [
        {
            "id": task.id,
            "name": task.name,
            "supervisor": task.supervisor,
            "employee": task.employee,
            "status": task.status
        }
        for task in tasks
    ]

@app.get("/employee/get")
def get_employees(db: Session = Depends(get_db)):
    employess = db.query(User).filter_by(position="Funcionário").all()
    return [
        {
            "id": employee.id,
            "name": employee.name,
            "email": employee.email,
            "cpf": employee.cpf,
            "position": employee.position
        }
        for employee in employess
    ]

@app.post("/task/filter")
def get_tasks(filters: TaskFilterRequest = Body(default={}), db: Session = Depends(get_db)):
    query = db.query(Task)
    if filters.supervisor:
        query = query.filter(Task.supervisor == filters.supervisor)
    if filters.employee:
        query = query.filter(Task.employee == filters.employee)
    if filters.status:
        query = query.filter(Task.status == filters.status)
    if filters.name:
        query = query.filter(Task.name == filters.name)
    tasks = query.all()
    return [
        {
            "id": task.id,
            "name": task.name,
            "supervisor": task.supervisor,
            "employee": task.employee,
            "status": task.status
        }
        for task in tasks
    ]
    
@app.get("/user")
def get_user(db: Session = Depends(get_db)):
    name = logged_users.get("current")
    if not name:
        raise HTTPException(status_code=401, detail="Nenhum usuário logado")
    user = db.query(User).filter_by(name=name).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return {
        "id": user.id,
        "name": user.name,
        "position": user.position,
        "cpf": user.cpf,
        "email": user.email,
        "phone": user.phone
    }

@app.post("/notification")
def create_notification(request: NotificationRequest, db: Session = Depends(get_db)):
    new_notification = Notification(description=request.description, user=request.user)
    db.add(new_notification)
    db.commit()
    db.refresh(new_notification)
    return "Notificação criada com sucesso"

@app.get("/notification/{user_id}")
def get_notifications(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter_by(id=user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    user_name = user.name
    notifications = db.query(Notification).filter_by(user=user_name).all()
    if notifications:
        return [
            {
                "description": notification.description
            }
            for notification in notifications
        ]
    else:
        return []
    
@app.get("/task/finish/{task_id}")
def finish_task(task_id: int, db: Session = Depends(get_db)):

    task = db.query(Task).filter_by(id=task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    task.status = "Concluído"
    db.commit()
    db.refresh()
    notification = Notification(
        user=task.employee,
        description=f"{task.name} foi finalizada"
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return "Tarefa foi finalizada e notificação enviada"
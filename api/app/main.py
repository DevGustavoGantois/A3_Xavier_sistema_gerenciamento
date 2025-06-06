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

Base.metadata.create_all(bind=engine)

class LoginRequest(BaseModel):
    name: str
    position: str
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

class TaskFilterRequest(BaseModel):
    name: Optional[str] = None
    supervisor: Optional[str] = None
    employee: Optional[str] = None
    status: Optional[str] = None


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
    user = db.query(User).filter_by(name=request.name, position=request.position, password=request.password).first()
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
    return {"message": "Tarefa criada com sucesso!"}

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
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

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

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter_by(name=request.name, position=request.position, password=request.password).first()
    if user:
        return {"message": "Login realizado com sucesso!"}
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
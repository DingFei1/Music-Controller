# Music Controller
You can follow the instructions in the rest of this manual to build and run the program. If you encounter any problems during initialization or execution, feel free to contact [Fei Ding].<br><br>

## Initialise Project
#### Backend (Django)
From the root directory<br>
Create Virtual Environment:
```bash
python -m venv venv
```

Activate Virtual Environment(Windows CMD) (Optional):
```bash
venv\Scripts\activate
```

Activate Virtual Environment(Windows PowerShell) (Optional):
```bash
venv\Scripts\Activate.ps1
```

Activate Virtual Environment(Mac/Linux) (Optional):
```bash
source venv/bin/activate
```

Install Dependency:
```bash
pip install -r requirements.txt
```

Initialise Database:<br>
Then run:
```bash
python manage.py makemigrations
python manage.py migrate
```

#### Frontend (React)
Navigate to frontend directory and install dependencies:
```bash
cd frontend
npm install
```


## Run Project
#### Backend (Django)
From the root directory:
```bash
venv\Scripts\activate # Windows CMD, Optional
venv\Scripts\Activate.ps1 # Windows PowerShell, Optional
source venv/bin/activate # Mac/Linux, Optional
python manage.py runserver
```

#### Frontend (React)
```bash
cd frontend
npm start
npm run dev
```
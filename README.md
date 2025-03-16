# IndoorNav
A Simple Indoor Navigation System,

# Installation

```bash 
git clone --depth=1 https://github.com/mr0erek/IndoorHospitalNav.git; cd IndoorHospitalNav; python -m venv "venv"; pip install -r requirements.txt
```
- **[Enabling Virtual Environment]**
- For Linux : `source venv/Scripts/activate` 
- For Windows (Powershell): `.\venv\Scripts\activate`

### **Commands For Frontend**
- `cd IndoorHospitalNav/hospital-nav-frontend; npm install`
>[!NOTE]
>**Some of the Dependencies/Packages are vulnerable, Kindly Avoid for now.**

### **Commands For Backend (Django)**
- Change Directory to `hospitalnav`
- `python manage.py runserver`

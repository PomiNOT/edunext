# EduNext
A social-constructive learning tool.
Recreated in React + React-Bootstrap

Reference Website: https://fu-edunext.fpt.edu.vn

## User Requirements
Use Case diagram of main use cases:
![uc](https://github.com/user-attachments/assets/8dc9b33c-3da2-464e-823d-9d1e2e0b5a59)

| **Actor**  | **Description**                                                                |
|------------|--------------------------------------------------------------------------------|
| **Teacher**| Responsible for starting discussions, editing slots, and viewing students' answers and make comments if necessary. |
| **Student**| Engages in answering questions, voting on and commenting on answers made by others. |
| **Admin**  | Manages the creation of subjects, classes, slots, and assignment of teachers and students. |


## App UI designs
### Student and Teachers screens
![login](https://github.com/user-attachments/assets/df71cdb8-a028-4fc9-a837-9807fd6fda83)
![courses_list](https://github.com/user-attachments/assets/ca194108-77d0-4320-9105-c8a7a9044f74)
![slots_list](https://github.com/user-attachments/assets/63e524c7-4370-4f3f-9203-25eb1e005d1f)
![slot_control](https://github.com/user-attachments/assets/87935f8f-04ef-4c7b-a410-e3d69fbca584)
![import_activities](https://github.com/user-attachments/assets/113e4384-11d6-4f2c-97a7-2a93472fccd9)
![slot_detail](https://github.com/user-attachments/assets/400b7d57-ad21-4603-90d4-5986817931a5)
![rich_comments](https://github.com/user-attachments/assets/ae7a0801-6299-4529-808e-2afd4b46fbee)
![voting](https://github.com/user-attachments/assets/28b7c28f-be00-4c01-9031-c0d40f55fd1f)
![comment_tree](https://github.com/user-attachments/assets/7f9e2a9e-e017-4305-9f2f-a14e4f056922)
### Admin screens


![manage_users](https://github.com/user-attachments/assets/583814a3-2be3-4ed9-8845-bd15dd60d74e)
![manage_subjects](https://github.com/user-attachments/assets/af4c29d3-652f-4f97-b42b-65f3656b4a16)
![manage_classes](https://github.com/user-attachments/assets/2554d38b-4529-433b-a01b-224ead8fbb19)
![slot_edit_admin](https://github.com/user-attachments/assets/46e2ecfa-5353-4341-a766-e314f51eb21d)
![edit_slot](https://github.com/user-attachments/assets/10241712-f8d9-43dd-bdeb-0d8c1ec8e76e)
![create_class_info](https://github.com/user-attachments/assets/bf94bde7-9ef2-42f3-9f07-411816b12d93)
![assign_students](https://github.com/user-attachments/assets/db3b3000-52b6-45eb-82db-9a8ccb243715)

## How to run 
1. Clone this project
2. Install dependencies, run ```npm install```
3. Start json-server ```npx json-server --port 9999 --watch database.json```
4. Start Vite ```npm start```

## User Accounts

| **Username**   | **Role** | **Password** |
|----------------|----------|--------------|
| dungteacher    | Teacher  | password     |
| namstudent     | Student  | password     |
| admin          | Admin    | password     |

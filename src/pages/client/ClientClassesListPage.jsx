import { useContext, useEffect, useState } from "react";
import { Container, Card, Nav, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { faUserCircle, faIdCard, faSchool, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserContext } from "../../context/UserContextComponent";
import * as classesService from "../../services/classrooms";

function ClassroomCard({ classroom }) {
  return (
      <Card className="hover:shadow cursor-pointer">
        <Card.Body>
          <h1 className="font-bold mb-3 text-xl">{ classroom.subjectName }</h1>
          <div className="space-y-1 text-gray-500">
            <p>
              <FontAwesomeIcon icon={faSchool} className="mr-2" />
              {classroom.name}
            </p>
            <p>
              <FontAwesomeIcon icon={faUserCircle} className="mr-2" />
              {classroom.teacherName}
            </p>
            <p>
              <FontAwesomeIcon icon={faIdCard} className="mr-2" />
              No. Students: {classroom.studentCount}
            </p>
          </div>
        </Card.Body>
        <Card.Footer>
          <p className="text-blue-500">
            Go to course
            <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
          </p>
        </Card.Footer>
      </Card>
  );
}

async function fetchClassesListByUser(user) {
  switch (user.role) {
    case "student":
      return await classesService.getClassesForStudent(user.id);
    case "teacher":
      return await classesService.getClassesForTeacher(user.id);
    default:
      return [];
  }
}

function TopNav() {
  return (
    <div>
      <Nav variant="underline" defaultActiveKey="course">
        <Nav.Item>
          <Nav.Link eventKey="course">Courses</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="projects">Projects</Nav.Link>
        </Nav.Item>
      </Nav>

      <Form.Group className="mt-4 inline-block">
        <Form.Label>Semester</Form.Label>
        <Form.Select>
          <option>SUMMER2024</option>
        </Form.Select>
      </Form.Group>
    </div>
  );
}

export default function ClientClassesListPage() {
  const { user } = useContext(UserContext);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchClassesListByUser(user).then(setClasses);
  }, []);

  return (
    <>
      <Container className="mt-4">
        <TopNav />
        <h1 className="font-bold text-3xl my-4">Courses</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-3">
          {classes.map((classroom) => (
            <Link to={`/client/classes/${classroom.id}`} key={classroom.id}>
              <ClassroomCard key={classroom.id} classroom={classroom} />
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}

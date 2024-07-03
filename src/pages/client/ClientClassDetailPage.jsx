import { Breadcrumb, Form, FormControl, Button, Container, Row, Col } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import SlotListing from '../../components/SlotListing';
import { useState, useEffect } from 'react';
import * as activitiesService from '../../services/activities';
import * as classroomService from '../../services/classrooms';

function TopContent({ classroom }) {
  return (
    <Container className="mt-4">
      <Breadcrumb className='p-0'>
        <Breadcrumb.Item as={Link} to='/client/classes' href='/client/classes'>Home</Breadcrumb.Item>
        <Breadcrumb.Item>{ classroom?.subjectName }</Breadcrumb.Item>
      </Breadcrumb>

      <Row className='mx-0 align-items-end gap-2'>
        <Col md={2} className='g-0'>
          <Form.Group>
            <Form.Label>Filter</Form.Label>
            <Form.Select>
              <option>All Activities</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={2} className='g-0'>
          <Form.Group>
            <Form.Label>Jump slot</Form.Label>
            <Form.Select>
              <option>Slot: 1</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3} className='g-0'>
          <Form.Group>
            <Form.Label>Class name</Form.Label>
            <FormControl type="text" placeholder="Class name" value={classroom?.name} readOnly />
          </Form.Group>
        </Col>
        <Col md={2} className='g-0'>
          <Button variant="primary" className="w-full">Learning Materials</Button>
        </Col>
        <Col md={2} className='g-0'>
          <Button variant="primary" className="w-full">Assignments</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default function ClientClassDetailPage() {
  const { classId } = useParams();
  const [slots, setSlots] = useState([]);
  const [classroom, setClassroom] = useState(null);

  useEffect(() => {
    activitiesService.getAllActivitiesGroupedBySlotForClass(classId).then(setSlots);
    classroomService.getClassById(classId).then(setClassroom);
  }, []);

  return (
    <div>
      <TopContent classroom={classroom} />
      <Container className="mt-3 mb-6 space-y-3">
        {slots.map((slot) => (
          <SlotListing key={slot.id} slot={slot}>
            <Link to={`/client/slots/${classId}/${slot.id}`}>
              <Button variant="outline-primary">Settings Slot</Button>
            </Link>
          </SlotListing>
        ))}
      </Container>
    </div>
  );
}

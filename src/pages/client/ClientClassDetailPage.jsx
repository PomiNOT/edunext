import { Breadcrumb, Form, FormControl, Button, Container, Row, Col } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import SlotListing from '../../components/SlotListing';
import { useState, useEffect } from 'react';
import * as activitiesService from '../../services/activities';

function TopContent({ subjectName = 'Subject Name' }) {
  return (
    <Container className="mt-4">
      <Breadcrumb className='p-0'>
        <Breadcrumb.Item as={Link} to='/client/classes' href='/client/classes'>Home</Breadcrumb.Item>
        <Breadcrumb.Item>{ subjectName }</Breadcrumb.Item>
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
            <FormControl type="text" placeholder="Class name" value="SE1830-NJ-APHL-SUMMER2024" readOnly />
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
  const { id } = useParams();
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    activitiesService.getAllActivitiesGroupedBySlotForClass(id).then(setSlots);
  }, []);

  return (
    <div>
      <TopContent />
      <Container className='mt-3 mb-6 space-y-3'>
        {slots.map((slot) => <SlotListing key={slot.id} slot={slot} />)}
      </Container>
    </div>
  );
}

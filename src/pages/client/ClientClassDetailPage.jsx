import {
  Breadcrumb,
  Form,
  FormControl,
  Button,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import SlotListing from "../../components/SlotListing";
import { useContext, useState, useEffect, createContext } from "react";
import * as activitiesService from "../../services/activities";
import * as classroomService from "../../services/classrooms";
import { UserContext } from "../../context/UserContextComponent";
import ReactPaginate from "react-paginate";

const ClientClassDetailContext = createContext();

function TopContent({ classroom }) {
  const { filter, setFilter } = useContext(ClientClassDetailContext);
  return (
    <Container className="mt-4">
      <Breadcrumb className="p-0">
        <Breadcrumb.Item as={Link} to="/client/classes" href="/client/classes">
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item>{classroom?.subjectName}</Breadcrumb.Item>
      </Breadcrumb>
      <Row className="mx-0 align-items-end gap-2">
        <Col md={2} className="g-0">
          <Form.Group>
            <Form.Label>Filter</Form.Label>
            <Form.Select
              defaultValue={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Activities</option>
              <option value="on-going">On-going</option>
              <option value="not-started">Not started</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={2} className="g-0">
          <Form.Group>
            <Form.Label>Jump slot</Form.Label>
            <Form.Select>
              <option>Slot: 1</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3} className="g-0">
          <Form.Group>
            <Form.Label>Class name</Form.Label>
            <FormControl
              type="text"
              placeholder="Class name"
              value={classroom?.name}
              readOnly
            />
          </Form.Group>
        </Col>
        <Col md={2} className="g-0">
          <Button variant="primary" className="w-full truncate">
            Learning Materials
          </Button>
        </Col>
        <Col md={2} className="g-0">
          <Button variant="primary" className="w-full">
            Assignments
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
function Wrapper({ children }) {
  const [filter, setFilter] = useState("all");
  const [classroom, setClassroom] = useState(null);
  const [slots, setSlots] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { classId } = useParams();
  const itemsPerPage = 10;

  useEffect(() => {
    const started =
      filter === "on-going" ? true : filter === "not-started" ? false : "any";
    activitiesService
      .getAllActivitiesGroupedBySlotForClass(classId, started)
      .then((data) => {
        setSlots(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      });
  }, [filter, classId]);

  useEffect(() => {
    classroomService.getClassById(classId).then(setClassroom);
  }, [classId]);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const paginatedSlots = slots.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <ClientClassDetailContext.Provider
      value={{
        filter,
        setFilter,
        classroom,
        slots: paginatedSlots,
        currentPage,
        totalPages,
        handlePageChange,
      }}
    >
      {children}
    </ClientClassDetailContext.Provider>
  );
}

function MainContent() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { classroom, slots, currentPage, totalPages, handlePageChange } =
    useContext(ClientClassDetailContext);
  const { classId } = useParams();

  function handleActivitySelected(activity) {
    if (activity.started) {
      navigate(`/client/activity/${activity.id}`);
    }
  }

  return (
    <>
      <TopContent classroom={classroom} />
      <Container className="mt-3 mb-6 space-y-3">
        {slots.map((slot) => (
          <SlotListing
            key={slot.id}
            slot={slot}
            onItemSelected={handleActivitySelected}
          >
            {user.role === "teacher" && (
              <Link to={`/client/slots/${classId}/${slot.id}`}>
                <Button variant="outline-primary">Settings Slot</Button>
              </Link>
            )}
          </SlotListing>
        ))}
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={totalPages}
          onPageChange={handlePageChange}
          containerClassName={"pagination justify-content-center"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
          activeClassName={"active"}
        />
      </Container>
    </>
  );
}

export default function ClientClassDetailPage() {
  return (
    <Wrapper>
      <MainContent />
    </Wrapper>
  );
}

import {
  Breadcrumb,
  Container,
  Card,
  Tabs,
  Tab,
  Form,
  Button,
  DropdownButton,
  Dropdown,
  Modal
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useState, createContext, useContext, useEffect } from "react";
import { QuestionItem } from "../../components/QuestionItem";
import { UserContext } from "../../context/UserContextComponent";
import * as activitiesService from "../../services/activities";
import * as slotsService from "../../services/slots";
import * as classroomsService from "../../services/classrooms";
import * as commentsService from "../../services/comments";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import ReactPaginate from "react-paginate";

const ClientClassDetailContext = createContext();

function Wrapper({ children }) {
  const { activityId } = useParams();
  const [classroom, setClassroom] = useState(null);
  const [activity, setActivity] = useState(null);
  const [slot, setSlot] = useState(null);
  const [activities, setActivities] = useState([]);
  const [comments, setComments] = useState([]);
  const { user } = useContext(UserContext);

  async function fetchInformation() {
    const activity = await activitiesService.getActivityById(activityId);
    const classroom = await classroomsService.getClassById(activity.classId);
    const slot = await slotsService.getSlotById(activity.slotId);
    const activities = await activitiesService.getAllActivitiesForSlotByClass(
      slot.id,
      activity.classId
    );
    const comments = await commentsService.getCommentsForActivity(activityId);

    setActivity(activity);
    setClassroom(classroom);
    setSlot(slot);
    setActivities(activities);
    setComments(comments);
  }

  async function createComment(content) {
    const comment = await commentsService.createComment(
      user.id,
      activityId,
      content
    );
    setComments([comment, ...comments]);
  }

  async function deleteComment(commentId) {
    await commentsService.deleteComment(commentId);
    setComments(comments.filter((comment) => comment.id !== commentId));
  }

  async function updateComment(commentId, content) {
    const comment = await commentsService.editComment(commentId, content);
    setComments(comments.map((c) => (c.id === commentId ? comment : c)));
  }

  useEffect(() => {
    fetchInformation();
  }, []);

  return (
    <ClientClassDetailContext.Provider
      value={{
        classroom,
        activity,
        slot,
        activities,
        comments,
        createComment,
        deleteComment,
        updateComment
      }}
    >
      {children}
    </ClientClassDetailContext.Provider>
  );
}

function TableOfContents() {
  const { activities } = useContext(ClientClassDetailContext);

  return (
    <Card>
      <Card.Header>
        <Card.Title>Table of Contents</Card.Title>
      </Card.Header>
      <Card.Body className="space-y-3">
        {activities.map((activity) => (
          <QuestionItem key={activity.id} content={activity.content} />
        ))}
      </Card.Body>
    </Card>
  );
}

function TopContent() {
  const { classroom, activity, slot } = useContext(ClientClassDetailContext);
  const classLink = `/client/classes/${activity?.classId}`;
  const slotLink = `/client/slots/${activity?.classId}/${activity?.slotId}`;

  return (
    <>
      <Breadcrumb className="p-0 mt-4">
        <Breadcrumb.Item as={Link} to="/client/classes" href="/client/classes">
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item as={Link} to={classLink} href={classLink}>
          {classroom?.name}
        </Breadcrumb.Item>
        <Breadcrumb.Item as={Link} to={slotLink} href={slotLink}>
          Slot {slot?.slotNumber}
        </Breadcrumb.Item>
        <Breadcrumb.Item>{activity?.content}</Breadcrumb.Item>
      </Breadcrumb>

      <h1 className="text-2xl mb-3 font-bold">
        (Question) {activity?.content}
      </h1>
    </>
  );
}

function Comment({ comment }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { user } = useContext(UserContext);
  const { updateComment, deleteComment } = useContext(ClientClassDetailContext);

  const isCurrentUser = user.id === comment.userId;

  const handleEdit = () => {
    updateComment(comment.id, editedContent);
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteComment(comment.id);
    setShowDeleteModal(false);
  };

  const handleDropdownSelect = (eventKey) => {
    if (eventKey === 'edit') {
      setIsEditing(true);
    } else if (eventKey === 'delete') {
      setShowDeleteModal(true);
    }
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <div className="flex justify-between items-start">
          <div className="w-full">
            <h5 className="font-bold">{comment.username}</h5>
            <small className="text-muted">{comment.date}</small>
            {isEditing ? (
              <Form className="mt-2">
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full mb-2"
                />
                <div className="flex justify-end">
                  <Button variant="secondary" onClick={() => setIsEditing(false)} className="mr-2">
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleEdit}>
                    Save
                  </Button>
                </div>
              </Form>
            ) : (
              <p className="mt-2">{comment.content}</p>
            )}
          </div>
          {isCurrentUser && !isEditing && (
            <div className="flex flex-col items-center ml-2">
              <DropdownButton
                title={<FontAwesomeIcon icon={faEdit} />}
                onSelect={handleDropdownSelect}
              >
                <Dropdown.Header>Actions</Dropdown.Header>
                <Dropdown.Item eventKey="edit">Edit</Dropdown.Item>
                <Dropdown.Item eventKey="delete">Delete</Dropdown.Item>
              </DropdownButton>
            </div>
          )}
        </div>
        {!isEditing && (
          <div className="mt-2">
            <button className="text-blue-500">Reply</button>
            <button className="text-blue-500 ml-2">Vote</button>
          </div>
        )}
      </Card.Body>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this comment?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
}

function CommentBox({ onAddComment }) {
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      onAddComment(content);
      setContent("");
    }
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your comment here..."
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Post Comment
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

function MainContent() {
  const { activity, comments, createComment } = useContext(
    ClientClassDetailContext
  );
  const [currentPage, setCurrentPage] = useState(0);

  const handleVote = (id, increment) => {};

  const handleAddComment = (content) => {
    createComment(content);
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const commentsPerPage = 10;
  const pageCount = Math.ceil(comments.length / commentsPerPage);
  const offset = currentPage * commentsPerPage;
  const currentComments = comments.slice(offset, offset + commentsPerPage);

  return (
    <div className="space-y-3">
      <Card>
        <Card.Header>
          <Card.Title>Content</Card.Title>
        </Card.Header>
        <Card.Body>{activity?.content}</Card.Body>
      </Card>

      <p>
        Discussion time has been started.
        <br />
        Students can comment and vote for comments during this time.
      </p>

      <Tabs defaultActiveKey="discuss">
        <Tab eventKey="group" title="Group"></Tab>
        <Tab eventKey="discuss" title="Discuss">
          <div className="mt-3">
            <CommentBox onAddComment={handleAddComment} />
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              breakLabel={"..."}
              pageCount={pageCount}
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
            <div className="mb-3"></div>
            {currentComments.map((comment) => (
              <Comment key={comment.id} comment={comment} onVote={handleVote} />
            ))}
            <div className="my-5"></div>
          </div>
        </Tab>
        <Tab eventKey="grade" title="Grade"></Tab>
        <Tab eventKey="msg" title="Teacher's Message"></Tab>
      </Tabs>
    </div>
  );
}

export default function ClientClassActivityPage() {
  return (
    <Wrapper>
      <Container>
        <TopContent />
        <div className="grid grid-cols-4 gap-3">
          <div className="col-span-3">
            <MainContent />
          </div>
          <div>
            <TableOfContents />
          </div>
        </div>
      </Container>
    </Wrapper>
  );
}

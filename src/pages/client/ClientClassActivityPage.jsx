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
  Modal,
  OverlayTrigger,
  Popover,
  ToggleButtonGroup,
  ToggleButton
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
import { faEdit, faStar } from "@fortawesome/free-solid-svg-icons";
import ReactPaginate from "react-paginate";
import MDEditor from "@uiw/react-md-editor";
import MarkdownPreview from "@uiw/react-markdown-preview/nohighlight";

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
    return comment;
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

function VoteComponent({ vote, onVote }) {
  const popover = (
    <Popover>
      <Popover.Header>
        <h2 className="font-bold">Vote</h2>
      </Popover.Header>
      <Popover.Body className="p-0 popover-vote">
        <ToggleButtonGroup onChange={(value) => onVote(value)} type="radio" name="options" value={vote}>
          <ToggleButton id="tg4" value={4} variant="light">
            <FontAwesomeIcon color="red" icon={faStar} /> = 4 <FontAwesomeIcon color="orange" icon={faStar} />
          </ToggleButton>
          <ToggleButton id="tg3" value={3} variant="light">
            <FontAwesomeIcon color="blue" icon={faStar} /> = 3 <FontAwesomeIcon color="orange" icon={faStar} />
          </ToggleButton>
          <ToggleButton id="tg2" value={2} variant="light">
            <FontAwesomeIcon color="green" icon={faStar} /> = 2 <FontAwesomeIcon color="orange" icon={faStar} />
          </ToggleButton>
          <ToggleButton id="tg1" value={1} variant="light">
            <FontAwesomeIcon color="pink" icon={faStar} /> = 1 <FontAwesomeIcon color="orange" icon={faStar} />
          </ToggleButton>
        </ToggleButtonGroup>
      </Popover.Body>
    </Popover>
  );

  return (
    <OverlayTrigger trigger="click" placement="right" overlay={popover}>
      <button className="text-blue-500 ml-2">Vote</button>
    </OverlayTrigger>
  );
}

function Comment({ comment, onEditComment, onDeleteComment, freshReply = false }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [repliesLoadState, setRepliesLoadState] = useState('not yet');
  const { user } = useContext(UserContext);
  const { updateComment, deleteComment, activity } = useContext(ClientClassDetailContext);
  const [childComments, setChildComments] = useState([]);
  const [currentVote, setCurrentVote] = useState(0);
  const [myVote, setMyVote] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const { count } = await commentsService.getVoteForUser(comment.id, user.id);
      setMyVote(count ?? 0);
      setCurrentVote(count ?? 0);
    }

    fetchData();
  }, []);

  const isCurrentUser = user.id === comment.userId;

  const handleEditFromChild = (cmt) => {
    setChildComments(childComments.map((c) => (c.id === cmt.id ? cmt : c)));
  }

  const handleDeleteFromChild = (id) => {
    setChildComments(childComments.filter((c) => c.id !== id));
  }

  const handleEdit = async () => {
    const cmt = await updateComment(comment.id, editedContent);

    if (typeof onEditComment === "function") {
      onEditComment(cmt);
    }

    setIsEditing(false);
  };

  const handleDelete = async () => {
    await deleteComment(comment.id);

    if (typeof onDeleteComment === "function") {
      onDeleteComment(comment.id);
    }

    setShowDeleteModal(false);
  };

  const handleDropdownSelect = (eventKey) => {
    if (eventKey === 'edit') {
      setIsEditing(true);
    } else if (eventKey === 'delete') {
      setShowDeleteModal(true);
    }
  };

  const handlePostReply = async (content) => {
    const addedComment = await commentsService.createComment(user.id, activity.id, content, comment.id);
    addedComment.freshReply = true;
    setChildComments([addedComment, ...childComments]);
    setIsReplying(false);
  }

  const loadReplies = async () => {
    setRepliesLoadState('loading');

    try {
      const replies = await commentsService.getChildrenComments(comment.id);
      setChildComments(replies);
      setRepliesLoadState('loaded');
    } catch (e) {
      setRepliesLoadState('not yet');
      throw e;
    }
  }

  function getButton() {
    if (freshReply) return null;

    switch (repliesLoadState) {
      case 'not yet':
        return <Button variant="outline-secondary" className="w-full" onClick={loadReplies}>Load replies</Button>
      case 'loading':
        return <Button variant="outline-secondary" className="w-full" disabled>Loading...</Button>
      case 'loaded':
        return null;
      default:
        return null;
    }
  }

  const onVote = async (count) => {
    await commentsService.voteComment(comment.id, user.id, count);
    setCurrentVote(count);
  }

  return (
    <div>
      <Card className="mb-3">
        <Card.Body>
          <div className="flex justify-between items-start">
            <div className="w-full">
              <h5 className="font-bold">{comment.username}</h5>
              <small className="text-muted">{comment.date}</small>

              {isEditing ? (
                <EditEditor
                  editedContent={editedContent}
                  setEditedContent={setEditedContent}
                  setIsEditing={setIsEditing}
                  handleEdit={handleEdit}
                />
              ) : (
                <div className="my-3">
                  <MarkdownPreview source={comment.content} />
                </div>
              )}
            </div>

            <div className="px-1 py-1 rounded flex items-center space-x-1 bg-gray-100">
              <FontAwesomeIcon color="orange" icon={faStar} />
              <p className="font-bold">{comment.votes - myVote + currentVote}</p>
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
          {!isCurrentUser && !isEditing && (
            <div className="mt-2">
              <button
                className="text-blue-500"
                onClick={() => setIsReplying(!isReplying)}
              >
                Reply
              </button>

              <VoteComponent onVote={onVote} vote={currentVote} />
            </div>
          )}
        </Card.Body>

        <EditConfirmModal
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          handleDelete={handleDelete}
        />
      </Card>
      <div className="pl-8">
        {isReplying && <CommentBox onAddComment={handlePostReply} />}
        {childComments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            onEditComment={handleEditFromChild}
            onDeleteComment={handleDeleteFromChild}
            freshReply={comment.freshReply}
          />
        ))}
        <div className="mb-3">{getButton()}</div>
      </div>
    </div>
  );
}

function EditEditor({ editedContent, setEditedContent, setIsEditing, handleEdit }) {
  return <Form className="mt-2">
    <MDEditor value={editedContent} onChange={setEditedContent} />
    <div className="flex justify-end mt-3">
      <Button
        variant="secondary"
        onClick={() => setIsEditing(false)}
        className="mr-2"
      >
        Cancel
      </Button>
      <Button variant="primary" onClick={handleEdit}>
        Save
      </Button>
    </div>
  </Form>;
}

function EditConfirmModal({ showDeleteModal, setShowDeleteModal, handleDelete }) {
  return <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
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
  </Modal>;
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
            <MDEditor value={content} onChange={setContent} />
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
            <div className="space-y-3">
              {currentComments.map((comment) => (
                <Comment key={comment.id} comment={comment} />
              ))}
            </div>
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
        <div className="grid grid-cols-4 gap-3" data-color-mode="light">
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

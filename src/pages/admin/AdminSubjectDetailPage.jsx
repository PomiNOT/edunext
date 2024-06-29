import SlotListing from '../../components/SlotListing';
import { Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faBook, faAdd, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const fakeData = [
  {
    slotNumber: 1,
    description: "Slot 1",
    questions: [
      {
        content: "Question 1",
        started: true,
      },
      {
        content: "Question 2",
        started: false,
      },
      {
        content: "Question 3",
        started: false,
      },
    ],
  },
  {
    slotNumber: 2,
    description: "Slot 2",
    questions: [
      {
        content: "What is the meaning of life?",
        started: true,
      },
      {
        content: "How does the universe work?",
        started: false,
      },
      {
        content: "Is there a God?",
        started: false,
      },
    ],
  },
  {
    slotNumber: 3,
    description: "Slot 3",
    questions: [
      {
        content: "What is the best programming language?",
        started: true,
      },
      {
        content: "How do I improve my coding skills?",
        started: false,
      },
      {
        content: "Is Python the best language?",
        started: false,
      },
    ],
  },
  {
    slotNumber: 4,
    description: "Slot 4",
    questions: [
      {
        content: "What is the best way to learn a new language?",
        started: true,
      },
      {
        content: "How do I practice speaking a language?",
        started: false,
      },
      {
        content: "Is Duolingo effective?",
        started: false,
      },
    ],
  },
  {
    slotNumber: 5,
    description: "Slot 5",
    questions: [
      {
        content: "What is the most beautiful city in the world?",
        started: true,
      },
      {
        content: "How do I travel cheap?",
        started: false,
      },
      {
        content: "Is backpacking the best way to travel?",
        started: false,
      },
    ],
  },
  {
    slotNumber: 6,
    description: "Slot 6",
    questions: [
      {
        content: "What is the best way to get fit?",
        started: true,
      },
      {
        content: "How do I lose weight?",
        started: false,
      },
      {
        content: "Is running the best exercise?",
        started: false,
      },
    ],
  },
  {
    slotNumber: 7,
    description: "Slot 7",
    questions: [
      {
        content: "What is the best way to learn a new skill?",
        started: true,
      },
      {
        content: "How do I practice a new skill?",
        started: false,
      },
      {
        content: "Is YouTube the best way to learn?",
        started: false,
      },
    ],
  },
  {
    slotNumber: 8,
    description: "Slot 8",
    questions: [
      {
        content: "What is the best way to make money?",
        started: true,
      },
      {
        content: "How do I start a business?",
        started: false,
      },
      {
        content: "Is entrepreneurship the best way to make money?",
        started: false,
      },
    ],
  },
  {
    slotNumber: 9,
    description: "Slot 9",
    questions: [
      {
        content: "What is the best way to improve my memory?",
        started: true,
      },
      {
        content: "How do I improve my focus?",
        started: false,
      },
      {
        content: "Is meditation the best way to improve focus?",
        started: false,
      },
    ],
  },
  {
    slotNumber: 10,
    description: "Slot 10",
    questions: [
      {
        content: "What is the best way to improve my creativity?",
        started: true,
      },
      {
        content: "How do I improve my creativity?",
        started: false,
      },
      {
        content: "Is brainstorming the best way to improve creativity?",
        started: false,
      },
    ],
  },
];

function List() {
  function handleSettings(event) {
    event.stopPropagation();
    alert("Not implemented yet");
  }

  return <div className="space-y-3">
      {fakeData.map((data) => (
        <SlotListing
          key={data.slotNumber}
          slotNumber={data.slotNumber}
          content={data.description}
          questions={data.questions}
          showStatus={false}
        >
          <Button onClick={handleSettings} variant='outline-primary'>Settings Slot</Button>
        </SlotListing>
      ))}
    </div>
}

function Heading({ children }) {
  return <h1 className='text-xl font-bold text-uppercase'>{children}</h1>
}

export default function AdminSubjectDetailPage() {
  return (
    <>
      <Link to="/admin/subjects" className="text-blue-500">
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        Back
      </Link>
      <main className="mt-3 grid grid-cols-[1fr_3fr] items-start mb-4 gap-3">
        <Card>
          <Card.Header>
            <Heading>
              <FontAwesomeIcon icon={faCog} className="mr-2" />
              Menu
            </Heading>
          </Card.Header>
          <Card.Body></Card.Body>
        </Card>
        <Card>
          <Card.Header className="flex justify-between">
            <Heading>
              <FontAwesomeIcon icon={faBook} className="mr-2" />
              Slots
            </Heading>
            <Button variant="primary">
              <FontAwesomeIcon icon={faAdd} className="mr-2" />
              Add Slot
            </Button>
          </Card.Header>
          <Card.Body>
            <List />
          </Card.Body>
        </Card>
      </main>
    </>
  );
}

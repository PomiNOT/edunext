import { Accordion, Card } from 'react-bootstrap';


export function QuestionItem({
  content = "Question",
  started = false,
  showStatus,
}) {
  return (
    <div className="flex items-center space-x-3">
      <img src="/question.svg" alt="Question Logo"></img>
      <p className="flex-1">{content}</p>
      {showStatus ? <div>
        {started ? (
          <h2 className="rounded text-blue-500 bg-blue-300 p-2 font-bold inline-block">
            On-going
          </h2>
        ) : (
          <h2 className="rounded text-danger bg-red-300 p-2 font-bold inline-block">
            Not started
          </h2>
        )}
      </div> : null}
    </div>
  );
}

export default function SlotListing({
  slot,
  children,
  showStatus = true,
}) {
  return (
    <Accordion className="question-accordion">
      <Accordion.Item eventKey="0">
        <Accordion.Header className='relative'>
          <div className='absolute right-3 top-3'>
            {children}
          </div>
          <div className='flex-1'>
            <h2 className="rounded text-blue-500 bg-blue-200 p-2 font-bold inline-block">
              Slot {slot.slotNumber}
            </h2>
            { slot.description && <p className="font-bold text-justify mt-3 whitespace-pre-wrap">{slot.description}</p> }
            { !slot.description && <p className="italic mt-3">No description</p> }
          </div>
        </Accordion.Header>
        <Accordion.Body className="p-0">
          <Card className="rounded-0">
            <Card.Header className="text-uppercase text-gray-500 text-sm">
              Question
            </Card.Header>
            <Card.Body className="space-y-3">
              {slot.questions.map((question) => {
                if (typeof question === "string") {
                  return <QuestionItem
                    content={question}
                    started={false}
                    showStatus={false}
                  />;
                } else if (typeof question === "object") {
                  return <QuestionItem
                    content={question.content}
                    started={question.started}
                    showStatus={showStatus}
                  />;
                }
              })}
              {slot.questions.length === 0 && <p>No questions</p>}
            </Card.Body>
          </Card>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

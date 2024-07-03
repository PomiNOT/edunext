

export function QuestionItem({
  content = "Question", started = false, showStatus, onClick
}) {
  return (
    <div className="flex items-center space-x-3" onClick={onClick}>
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

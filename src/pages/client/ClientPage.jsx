import { Outlet } from "react-router-dom";
import { UserContext } from "../../context/UserContextComponent";
import { useContext, useState } from "react";
import { Button, Popover, OverlayTrigger } from "react-bootstrap";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faHome,
  faClipboard,
  faBoxOpen,
  faFilePdf,
  faQuestion,
  faContactCard,
} from "@fortawesome/free-solid-svg-icons";


function SidebarButton({ icon, label, onClick }) {
  return (
    <Button variant="outline-link" onClick={onClick} className="block py-[13px] w-64 text-left hover:bg-gray-200">
      <FontAwesomeIcon className="w-9 mr-3" icon={icon} />
      {label}
    </Button>
  );
}

function Sidebar() {
  const { user, logout } = useContext(UserContext);
  const [showSidebar, setShowSidebar] = useState(false);

  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">
        <FontAwesomeIcon icon={faUserCircle} className="mr-3" />
        {user.username} <b>({user.role})</b>
      </Popover.Header>
      <Popover.Body>
        <Button variant="outline-danger" className="w-full" onClick={logout}>Logout</Button>
      </Popover.Body>
    </Popover>
  );

  return (
    <aside
      className="w-64 overflow-hidden bg-gray-100 border-r"
      style={{ width: showSidebar ? null : "62px" }}
    >
      <img src="/school.png" alt="School Logo" className="w-100"></img>

      <OverlayTrigger trigger="click" placement="right" overlay={popover}>
        <Button
          variant="outline-link"
          className="block bg-gray-200 rounded-0 w-full"
        >
          <FontAwesomeIcon icon={faUserCircle} className="text-lg" />
          {showSidebar && <p className="text-xs -mt-1">{user.username}</p>}
        </Button>
      </OverlayTrigger>

      <SidebarButton
        icon={faBars}
        onClick={() => setShowSidebar(!showSidebar)}
      />
      <SidebarButton icon={faHome} label="Home" />
      <SidebarButton icon={faClipboard} label="Assignments" />
      <SidebarButton icon={faBoxOpen} label="Upcoming Slots" />
      <SidebarButton icon={faFilePdf} label="Read user guide" />
      <SidebarButton icon={faContactCard} label="Contact Support" />
      <SidebarButton icon={faQuestion} label="FAQ" />
    </aside>
  );
}

export default function ClientPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

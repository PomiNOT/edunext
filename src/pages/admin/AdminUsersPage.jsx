import {
  DatatableWrapper,
  Filter,
  Pagination,
  PaginationOptions,
  TableBody,
  TableHeader,
} from "react-bs-datatable";
import { useState, useEffect } from "react";
import { Col, Row, Table } from "react-bootstrap";
import { getAll } from "../../services/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Card } from "react-bootstrap";

const headers = [
  { title: "Username", prop: "username", isFiterable: true, isSortable: true },
  { title: "Role", prop: "role", isFilterable: true, isSortable: true },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAll().then(setUsers);
  }, []);

  return (
    <Card className="shadow min-h-[700px] max-h-[700px]">
      <Card.Header>
        <h1 className="font-bold text-2xl">
          <FontAwesomeIcon icon={faUser} className="mr-2" />
          Manage Users
        </h1>
      </Card.Header>
      <Card.Body>
        <DatatableWrapper
          body={users}
          headers={headers}
          paginationOptionsProps={{
            initialState: {
              rowsPerPage: 10,
              options: [5, 10, 20, 50],
            },
          }}
        >
          <Row className="mb-4 align-items-end">
            <Col xs={6}>
              <Filter />
            </Col>
            <Col xs={3}>
              <PaginationOptions />
            </Col>
            <Col xs={3}>
              <Pagination />
            </Col>
          </Row>
          <Table striped hover>
            <TableHeader />
            <TableBody />
          </Table>
        </DatatableWrapper>
      </Card.Body>
    </Card>
  );
}

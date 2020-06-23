import React, { Component } from "react";
import "./App.css";
import Container from "./Container";
import Footer from "./Footer";
import { render } from "@testing-library/react";
import { getAllStudents } from "./client.js";
import { Empty, Table, Avatar, Spin, Icon, Modal } from "antd";
import { errorNotification } from "./Notification";
import AddStudentForm from "./forms/AddStudentForm";

class App extends Component {
  state = {
    students: [],
    isFetching: false,
    isAddStudentModalVisible: false
  };

  componentDidMount() {
    this.fetchStudents();
  }

  openAddStudentModal = () => this.setState({ isAddStudentModalVisible: true });
  closeAddStudentModal = () =>
    this.setState({ isAddStudentModalVisible: false });

  fetchStudents = () => {
    this.setState({
      isFetching: true
    });
    getAllStudents()
      .then(res =>
        res.json().then(students => {
          console.log(students);
          this.setState({
            students,
            isFetching: false
          });
        })
      )
      .catch(error => {
        const message = error.error.message;
        const description = error.error.error;
        errorNotification(message, description);
        this.setState({
          isFetching: false
        });
      });
  };

  render() {
    const { students, isFetching, isAddStudentModalVisible } = this.state;

    const commonElements = () => (
      <div>
        <Modal
          title="Add new student"
          visible={isAddStudentModalVisible}
          onOk={this.closeAddStudentModal}
          onCancel={this.closeAddStudentModal}
          width={1000}
        >
          <AddStudentForm
            onSuccess={() => {
              this.closeAddStudentModal();
              this.fetchStudents();
            }}
          />
        </Modal>
        <Footer
          handleAddStudentClickEvent={this.openAddStudentModal}
          numberOfStudents={students.length}
        ></Footer>
      </div>
    );

    if (isFetching) {
      return (
        <Container>
          <Spin />
        </Container>
      );
    }

    if (students && students.length) {
      const columns = [
        {
          title: "",
          dataIndex: "avatar",
          render: (text, student) => (
            <Avatar size="large">
              {`${student.firstName
                .charAt(0)
                .toUpperCase()}${student.lastName.charAt(0).toUpperCase()}`}
            </Avatar>
          )
        },
        {
          title: "Student Id",
          dataIndex: "studentId",
          key: "studentId"
        },
        {
          title: "First Name",
          dataIndex: "firstName",
          key: "firstName"
        },
        {
          title: "Last Name",
          dataIndex: "lastName",
          key: "lastName"
        },
        {
          title: "Email",
          dataIndex: "email",
          key: "email"
        },
        {
          title: "Gender",
          dataIndex: "gender",
          key: "gender"
        }
      ];

      return (
        <Container>
          <Table
            style={{ marginBottom: "100px" }}
            dataSource={students}
            columns={columns}
            pagination={false}
            rowKey="studentID"
          />
          {commonElements()}
        </Container>
      );
    }

    return (
      <Container>
        <Empty description={<h1>No Students found</h1>} />
        {commonElements()}
      </Container>
    );
  }
}

export default App;

import React, { Component } from "react";
import "./App.css";
import Container from "./Container";
import Footer from "./Footer";
import { render } from "@testing-library/react";
import { getAllStudents } from "./client.js";
import { Table, Avatar, Spin, Icon, Modal } from "antd";
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
    getAllStudents().then(res =>
      res.json().then(students => {
        console.log(students);
        this.setState({
          students,
          isFetching: false
        });
      })
    );
  };

  render() {
    const { students, isFetching, isAddStudentModalVisible } = this.state;

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
        </Container>
      );
    }

    return <h1>No Student Found</h1>;
  }
}

export default App;

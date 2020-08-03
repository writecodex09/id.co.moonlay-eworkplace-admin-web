import React, { Component} from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
  CardTitle,
  FormGroup,
  Label,
  Input, InputGroup, InputGroupAddon, InputGroupText,
  Button
} from 'reactstrap';
import {Form } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import axios from 'axios';
import $ from 'jquery';
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from 'react-select';
import {urlDivision, urlAbsen, urlBlob, stateHeadDivision, appovedList, stateList } from '../../../../Constant'
//const $ = require('jquery');
const moment = require('moment');

class Tables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      loading: false,
      url: urlDivision,
      currentPage: 1,
      resultsPerPage: 40,
      rangePicker: {},
      show : false,
      selectedOption: {},
      selectedOptionAdmin : {},
      selectedOptionState : {},
      selectedOptionHeadDivision : {},
      selectedOptionApprovalHeadDivision : {},
      stream : null
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    this.setState({
      currentPage: Number(event.target.id),
    });
  }


  /* handle untuk form */
  handelsubmitform = () => {
    const Headers = {
      'accept' : 'application/json',
      'Authorization' : `Bearer ` + localStorage.getItem('token'),
      'Content-Type' : 'application/json-patch+json'
    };
    const Data = {
      "Code": this.state.Code,
      "Name": this.state.Name,
      "Description": this.state.Description,
    }

    axios({
      method: 'post',
      url: this.state.url,
      headers: Headers,
      data : Data
    })
      .then(data => {
        console.log(data);
        alert("berhasil");
       window.location.reload();
      })

      .catch(err => {
       alert(err)
      });

  }

  handleCode = (evt) => {
      this.setState ({
        Code : evt.target.value,
      });

  }

  handleName = (evt) => {
     this.setState ({
      Name : evt.target.value,
     });
 }

 handleDescription = (evt) => {
  this.setState ({
    Description : evt.target.value,
  });
}

  handleJS = () => {
   // function filterRows() {
    var from = $('#datefilterfrom').val();
    var to = $('#datefilterto').val();

    if (!from && !to) {
      // no value for from and to
      return;
    }

    from = from || '2020-02-25'; // default from to a old date if it is not set
    to = to || '2020-02-25';

    var dateFrom = moment(from);
    var dateTo = moment(to);

    $('#myTable tr').each(function(i, tr) {
      var val = $(tr)
        .find('td:nth-child(3)')
        .text();
      var dateVal = moment(val, 'YYYY/MM/DD');

      var visible = dateVal.isBetween(dateFrom, dateTo, null, []) ? '' : 'none'; // [] for inclusive
      $(tr).css('display', visible);

      console.log(dateVal);
    });

   // $('#datefilterfrom').on("change", filterRows);
   // $('#datefilterto').on("change", filterRows);
 // };
}
  componentDidMount() {
    //alert(urlBlob)
    const value = localStorage.getItem('token');
    this.setState({
      token: value,
    });
    const Header = {
      accept: 'application/json',
      Authorization : `Bearer ` + value,
      // 'Content-Type' : 'application/json-patch+json'
    };

    axios({
      method: 'get',
      url: this.state.url + '?page=1&size=25',
      headers: Header,
    })
      .then(data => {
        console.log(data.data.data)
        this.setState({
          results: data.data.data,
          loading: true,
        });
      })

      .catch(err => {
        console.log(err);
      });
  }

  handleDateChange = (event) =>{
    this.handleJS();
  }

  filterList = event => {
    //var updatedList = this.state.results;
    // updatedList = updatedList.filter(function(item){
    //   return item.toString().toLowerCase().search(
    //     event.target.value.toLowerCase()) !== -1;
    // });
    // this.setState({results: updatedList});
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById('myInput');
    filter = input.value.toUpperCase();
    table = document.getElementById('myTable');
    tr = table.getElementsByTagName('tr');

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName('td')[2];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = '';
        } else {
          tr[i].style.display = 'none';
        }
      }
    }
  };

  handleAddDivision = () => {
    this.setState({
      show : true
    })
  }


  handleClose = () => {
		this.setState({ show: false });
	}

	handleShow = () => {
		this.setState({ show: true });
  }

  handleSelect = range => {
    console.log(range);
    // An object with two keys,
    // 'startDate' and 'endDate' which are Momentjs objects.
  };

  deleteAbsensi(AbsensiId) {
    const Header = {
      accept: 'application/json',
      Authorization: `Bearer ` + this.state.token,
    };
    axios({
      method: 'delete',
      url: this.state.url + '/' + AbsensiId,
      headers: Header,
    })
      .then(data => {
        console.log(data);
        alert('berhasil dihapus');
        window.location.reload();
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const { results, currentPage, resultsPerPage } = this.state;
    const indexOfLastTodo = currentPage * resultsPerPage;
    const indexOfFirstTodo = indexOfLastTodo - resultsPerPage;
   const currentresults = results.slice(indexOfFirstTodo, indexOfLastTodo);
    const renderresults = currentresults.map((results, index) => {
      //return <li key={index}>{todo.username}</li>;

      return (
        <tr key={results.Id} data-category={results.Id}>
         <td>{results.Id}</td>
          <td>{results.Code}</td>
          <td>{results.Name}</td>
          <td>{results.Description}</td>
         {/* <td>
          <Button
              className="btn btn-danger"
              onClick={() => this.deleteAbsensi(results.Id)}>
              Delete
            </Button>
            </td> */}

        </tr>
      );
    });

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(results.length / resultsPerPage); i++) {
      pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.map(number => {
      return (
        <li
          key={number}
          id={number}
          onClick={this.handleClick}
          className="page-link">
          {number}
        </li>
      );
    });

    if (this.state.loading === false) {
      return <h2>Loading...</h2>;
    }
    return (
      <div>
        <Row>
      <Col sm="3">
        <Card body inverse style={{ backgroundColor: '#333', borderColor: '#333' }}>
          <CardTitle>Medical Reimbursement</CardTitle>
          <img src={'../../assets/img/avatars/rumahsakit.png'} className="img-avatar" alt="admin@bootstrapmaster.com" />
          <Button><Link to="/remburstment/dashboard/medical">See Reimbursement</Link></Button>

        </Card>
      </Col>
      <Col sm="3">
        <Card body inverse color="primary">
          <CardTitle>Transport Reimbursement</CardTitle>
         <img src={'../../assets/img/avatars/travel.png'} className="img-avatar" alt="admin@bootstrapmaster.com" />
          <Button><Link to="/remburstment/dashboard/travel">See Reimbursement</Link></Button>

        </Card>
      </Col>
      <Col sm="3">
        <Card body inverse color="warning">
          <CardTitle>Overtime Reimbursement</CardTitle>
          <img src={'../../assets/img/avatars/overtime.png'} className="img-avatar" alt="admin@bootstrapmaster.com" />
          <Button><Link to="/remburstment/dashboard/overtime">Overtime</Link></Button>

        </Card>
      </Col>
      <Col sm="3">
        <Card body inverse color="danger">
          <CardTitle>Other Reimbursement</CardTitle>
          <img src={'../../assets/img/avatars/other.png'} className="img-avatar" alt="admin@bootstrapmaster.com" />
          <Button><Link to="/remburstment/dashboard/other">See Reimbursement</Link></Button>

        </Card>
      </Col>
    </Row>
            	<Modal show={this.state.show} onHide={this.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Add Division</Modal.Title>
					</Modal.Header>
					<Modal.Body>

          <Form>

          Code
          <InputGroup className="mb-3">
          <Input type="text" onChange={this.handleCode} placeholder="Code" autoComplete="Username" />
          </InputGroup>

          Name
          <InputGroup className="mb-3">
          <Input type="text" onChange={this.handleName} placeholder="Name" autoComplete="Name" />
          </InputGroup>

          Description
          <InputGroup className="mb-3">
          <Input type="text" onChange={this.handleDescription} placeholder="Description" autoComplete="Name" />
          </InputGroup>

          </Form>
          </Modal.Body>
					<Modal.Footer>
						<Button className="btn btn-secondary" onClick={this.handleClose}>
							Close
            </Button>
						<Button className="btn btn-info" onClick={this.handelsubmitform}>
							Save Changes
            </Button>
					</Modal.Footer>
				</Modal>



        <div className="row">
          {/* <div class="col-md-3">
            <h4>Date from</h4>
            <input
              type="date"
              class="form-control"
              id="datefilterfrom"
              data-date-split-input="true"
              onChange={this.handleDateChange}
            />
          </div> */}
          {/* <div class="col-md-3">
            <h4>Date to</h4>
            <input
              type="date"
              class="form-control"
              id="datefilterto"
              data-date-split-input="true"
            />
          </div> */}
          {/* <div>
            <h4>Date to</h4>
            <button onClick={this.handleJS}>filter date</button>
          </div> */}
        </div>

        <div className="animated fadeIn">
          {this.state.loading && (
            <Row>
              <Col xs="12" lg="12">
                <Card>
                  <CardHeader>
                    <Row>
                      <Col>
                        <i className="fa fa-user" /> <b>&nbsp;Approval</b>
                      </Col>

                    </Row>
                  </CardHeader>
                   <CardHeader>
                    <Row>
                      <Col>
                        Status <b>&nbsp;<FormGroup>
        <Input type="select" name="select" id="exampleSelect">
          <option>All</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
        </Input>
      </FormGroup></b>
       Sort by <b>&nbsp;<FormGroup>
        <Input type="select" name="select" id="exampleSelect">
          <option>Newest to Oldest</option>
          <option>Oldest TO Newest</option>
        </Input>
      </FormGroup></b>
      <FormGroup>
        <Label for="exampleSelect">Month</Label>
        <Input type="select" name="select" id="exampleSelect">
          <option>June , 2020</option>
          <option>July , 2020</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
        </Input>
      </FormGroup>
                      </Col>

                    </Row>
                  </CardHeader>
                  <CardBody>
                    {/* <DateRange
              format="DD/MM/YYYY"
              startDate={rangePicker["startDate"]}
              endDate={rangePicker["endDate"]}
              linkedCalendars={true}
              disableDaysBeforeToday={true}
              date={now => now}
              onInit={this.handleChange}
              onChange={this.handleChange} /> */}

<Table striped>
      <thead>
        <tr>
          <th>Submitted</th>
          <th>Request ID #</th>
          <th>Name</th>
          <th>Reported Expanse</th>
          <th>Status</th>
          <th>Action</th>

        </tr>
      </thead>
      <tbody>

      </tbody>
    </Table>

                  </CardBody>
                </Card>
                <Button outline color="success">Export to Excel</Button>{' '}
              </Col>
            </Row>

          )}
        </div>
        {/* <Pagination>
                  <PaginationItem>
                  {renderPageNumbers}
                     </PaginationItem>
    </Pagination>
         */}
        <ul className="pagination">{renderPageNumbers}</ul>
      </div>
    );
  }
}

export default Tables;


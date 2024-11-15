import React, { useState } from 'react';
import './AccountManagement.css';

const AccountManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Dummy data for accounts
  const accounts = [
    { id: 1, name: 'User 1', email: 'user1@example.com', role: 'Admin', isLocked: false, dateCreated: '2024-10-01' },
    { id: 2, name: 'User 2', email: 'user2@example.com', role: 'Registered User', isLocked: true, dateCreated: '2024-09-25' },
    { id: 3, name: 'User 3', email: 'user3@example.com', role: 'Registered User', isLocked: true, dateCreated: '2024-09-25' },
    { id: 4, name: 'User 4', email: 'user4@example.com', role: 'Registered User', isLocked: true, dateCreated: '2024-09-25' },
    { id: 5, name: 'User 5', email: 'user5@example.com', role: 'Registered User', isLocked: true, dateCreated: '2024-09-25' },
    { id: 6, name: 'User 6', email: 'user6@example.com', role: 'Registered User', isLocked: true, dateCreated: '2024-09-25' },
    { id: 7, name: 'User 7', email: 'user7@example.com', role: 'Registered User', isLocked: true, dateCreated: '2024-09-25' },
    { id: 8, name: 'User 8', email: 'user8@example.com', role: 'Registered User', isLocked: true, dateCreated: '2024-09-25' },
    { id: 9, name: 'User 9', email: 'user9@example.com', role: 'Registered User', isLocked: true, dateCreated: '2024-09-25' },
    { id: 10, name: 'User 10', email: 'user10@example.com', role: 'Registered User', isLocked: true, dateCreated: '2024-09-25' },
    { id: 11, name: 'User 11', email: 'user11@example.com', role: 'Registered User', isLocked: true, dateCreated: '2024-09-25' },
    { id: 12, name: 'User 12', email: 'user12@example.com', role: 'Registered User', isLocked: true, dateCreated: '2024-09-25' },
    { id: 13, name: 'User 13', email: 'user13@example.com', role: 'Registered User', isLocked: true, dateCreated: '2024-09-25' },
    { id: 14, name: 'User 14', email: 'user14@example.com', role: 'Registered User', isLocked: true, dateCreated: '2024-09-25' },
    { id: 15, name: 'User 15', email: 'user15@example.com', role: 'Registered User', isLocked: true, dateCreated: '2024-09-25' },
    { id: 16, name: 'User 16', email: 'user16@example.com', role: 'Registered User', isLocked: true, dateCreated: '2024-09-25' },
    { id: 17, name: 'User 17', email: 'user17@example.com', role: 'Registered User', isLocked: true, dateCreated: '2024-09-25' },
    // Add more users here...
  ];

  // Pagination logic
  const itemsPerPage = 10;
  const totalPages = Math.ceil(accounts.length / itemsPerPage);
  const currentAccounts = accounts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleDeleteConfirm = () => {
    setIsDeleteConfirmOpen(!isDeleteConfirmOpen);
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Account Management</h2>
        <button className="btn btn-primary" onClick={toggleModal}>Add Account</button>
      </div>

      <div className='table-responsive'>
        <table className="table table-hover tabble-bordered rounded">
          <thead className="table-light">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
              <th scope="col">Date Created</th>
              <th>Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody className='align-middle'>
            {currentAccounts.map((account, index) => (
              <tr key={account.id}>
                <th scope="row">{(currentPage - 1) * itemsPerPage + index + 1}</th>
                <td>{account.name}</td>
                <td>{account.email}</td>
                <td>{account.role}</td>
                <td>{account.dateCreated}</td>
                <td>
                    <div className="form-check form-switch">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={accounts.isLocked} 
                        onChange={() => {}} 
                      />
                      <label className="form-check-label">{accounts.isLocked ? 'Locked' : 'Unlocked'}</label>
                    </div>
                  </td>
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={toggleModal}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={toggleDeleteConfirm}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <nav>
        <ul className="pagination justify-content-center">
          {Array.from({ length: totalPages }, (_, index) => (
            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <button className="page-link custom-focus" onClick={() => setCurrentPage(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Modal for adding/editing account */}
      {isModalOpen && (
        <div className="modal d-block" onClick={toggleModal}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header d-flex justify-content-between">
                <h5 className="modal-title">Add/Edit Account</h5>
                <button className="close btn text-dark fs-5 p-0 pe-1" onClick={toggleModal}>&times;</button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-floating mb-3">
                    <input type="text" className="form-control custom-focus" id="nameInput" placeholder="Name" />
                    <label htmlFor="nameInput">Name</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input type="email" className="form-control custom-focus" id="emailInput" placeholder="name@example.com" />
                    <label htmlFor="emailInput">Email</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input type="password" className="form-control custom-focus" id="passwordInput" placeholder="Password" />
                    <label htmlFor="passwordInput">Password</label>
                  </div>
                  <div className="form-floating">
                    <select className="form-select custom-focus" id="roleSelect" aria-label="Select Role">
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    <label htmlFor="roleSelect">Role</label>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={toggleModal}>Close</button>
                <button className="btn btn-primary">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Modal for confirm delete */}
      {isDeleteConfirmOpen && (
        <div className="modal d-block" onClick={toggleDeleteConfirm}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
              <div className="modal-header d-flex justify-content-between">
                <h5 className="modal-title">Confirm Delete</h5>
                <button className="close btn text-dark fs-5 p-0 pe-1" onClick={toggleDeleteConfirm}>&times;</button>
              </div>
              <div className="modal-body text-center ">
                <p></p>
                <p></p>
                <h5>Are you sure you want to delete this account?</h5>
                <p></p>
                <p></p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={toggleDeleteConfirm}>Cancel</button>
                <button className="btn btn-danger">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountManagement;

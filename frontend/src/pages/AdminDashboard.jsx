import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import * as adminApi from "../api/admin";
import { useAuth } from "../auth/AuthContext";
import Spinner from "../components/Spinner";
import Modal from "../components/Modal";
import styles from "./AdminDashboard.module.css";

const PAGE_LIMIT = 10;

const AdminDashboard = () => {
  const { user: adminUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    user: null,
    action: null,
  });

  const fetchUsers = useCallback(async (currentPage) => {
    setLoading(true);
    try {
      const response = await adminApi.getAllUsers(currentPage, PAGE_LIMIT);
      setUsers(response.data.users);
      setIsLastPage(response.data.users.length < PAGE_LIMIT);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to fetch users.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(page);
  }, [page, fetchUsers]);

  const openConfirmationModal = (user, action) => {
    if (user.id === adminUser.id && action === 'deactivate') {
      toast.error("You cannot deactivate yourself.");
      return;
    }
    setModalState({ isOpen: true, user, action });
  };

  const handleConfirmAction = async () => {
    const { user, action } = modalState;
    if (!user || !action) return;

    const apiCall = action === 'activate' ? adminApi.activateUser : adminApi.deactivateUser;
    const successMessage = `User ${user.full_name} has been ${action}d.`;
    const errorMessage = `Failed to ${action} user.`;

    try {
      await apiCall(user.id);
      toast.success(successMessage);
      fetchUsers(page);
    } catch (err) {
      toast.error(err.response?.data?.message || errorMessage);
    } finally {
      setModalState({ isOpen: false, user: null, action: null });
    }
  };
  
  const modalTitle = modalState.action 
    ? `Confirm ${modalState.action.charAt(0).toUpperCase() + modalState.action.slice(1)}`
    : 'Confirm Action';

  if (loading && users.length === 0) {
    return <Spinner fullPage={true} />;
  }

  return (
    <>
      <Modal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, user: null, action: null })}
        onConfirm={handleConfirmAction}
        title={modalTitle}
      >
        Are you sure you want to {modalState.action} the user '{modalState.user?.full_name}'?
      </Modal>

      <div className={styles.container}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        {users.length > 0 ? (
          <>
            <div className={styles.tableContainer}>
              {loading && <Spinner />}
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td data-label="Full Name">{user.full_name}</td>
                      <td data-label="Email">{user.email}</td>
                      <td data-label="Role">
                        <span className={`${styles.badge} ${styles[user.role]}`}>{user.role}</span>
                      </td>
                      <td data-label="Status">
                         <span className={`${styles.badge} ${styles[user.status]}`}>{user.status}</span>
                      </td>
                      <td data-label="Actions" className={styles.actions}>
                        {user.status === 'active' ? (
                          <button
                            className="button-danger"
                            onClick={() => openConfirmationModal(user, 'deactivate')}
                            disabled={user.id === adminUser.id}
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            className="button-primary"
                            onClick={() => openConfirmationModal(user, 'activate')}
                          >
                            Activate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={styles.pagination}>
              <button onClick={() => setPage(p => p - 1)} disabled={page <= 1} className="button-secondary">
                Previous
              </button>
              <span>Page {page}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={isLastPage} className="button-secondary">
                Next
              </button>
            </div>
          </>
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
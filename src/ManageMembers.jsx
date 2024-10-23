import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useUser } from './UserContext';
import HomeNavbar from './HomeNavbar';
import { getAuth, deleteUser } from 'firebase/auth';

function ManageMembers() {
  const { userId } = useUser();
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for the search term

  useEffect(() => {
    const fetchMembers = async () => {
      const membersRef = collection(db, 'users');
      const membersSnapshot = await getDocs(membersRef);
      const membersData = membersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMembers(membersData);
    };

    fetchMembers();
  }, []);

  const changeRole = async (memberId, newRole) => {
    const confirmChange = window.confirm("Are you sure you want to change this member's role?");
    if (confirmChange) {
      const memberRef = doc(db, 'users', memberId);
      await updateDoc(memberRef, { role: newRole });
      setMembers(members.map(member => member.id === memberId ? { ...member, role: newRole } : member));
    }
  };

  const removeMember = async (memberId) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this member?");
    if (confirmDelete) {
      const memberRef = doc(db, 'users', memberId);
      const memberDoc = await getDocs(memberRef);
      const auth = getAuth();

      await deleteDoc(memberRef);
      const user = auth.currentUser;

      if (user && user.uid === memberId) {
        alert("You cannot delete the currently signed-in user.");
        return;
      }

      try {
        await deleteUser(memberDoc.data().authUID);
      } catch (error) {
        console.error("Error deleting user from authentication:", error);
      }

      setMembers(members.filter(member => member.id !== memberId));
    }
  };

  const viewPractices = (memberId) => {
    alert(`Viewing practices for member with ID: ${memberId}`);
  };

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter members based on the search term
  const filteredMembers = members.filter(member => {
    const fullName = `${member.nameFirst} ${member.nameLast}`.toLowerCase();
    const email = member.email.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <HomeNavbar />
      <h2>Manage Club Members</h2>
      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: '20px', padding: '8px', width: '300px' }}
      />
      {filteredMembers.length === 0 ? (
        <p>No user found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Attended Practices</th>
              <th>Remaining Paid Practices</th>
              <th>Total Paid Practices</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map(member => {
              const attendedPracticesCount = member.practices ? member.practices.length : 0;
              const remainingPaidPractices = member.paidPractices - attendedPracticesCount;

              return (
                <tr key={member.id}>
                  <td>{member.nameFirst} {member.nameLast}</td>
                  <td>{member.email}</td>
                  <td>{attendedPracticesCount}</td>
                  <td>{member.paidPractices || 0}</td>
                  <td style={{ color: remainingPaidPractices >= 0 ? 'green' : 'red' }}>
                    {remainingPaidPractices >= 0 ? remainingPaidPractices : 0}
                  </td>
                  <td>
                    <select
                      value={member.role}
                      onChange={(e) => changeRole(member.id, e.target.value)}
                    >
                      <option value="Member">Member</option>
                      <option value="Officer">Officer</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => removeMember(member.id)}>Remove</button>
                    <button onClick={() => viewPractices(member.id)}>View Practices</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ManageMembers;
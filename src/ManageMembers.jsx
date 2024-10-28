// ManageMembers.js
import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs, doc, deleteDoc, updateDoc, arrayRemove, writeBatch } from 'firebase/firestore';
import { useUser } from './UserContext';
import HomeNavbar from './HomeNavbar';
import ViewUsersPastPractices from './ViewUsersPastPractices';
import "src/ManageMembers.css";

function ManageMembers() {
  const { userId } = useUser();
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [viewingPractices, setViewingPractices] = useState(false);

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

  const updatePaidPractices = async (memberId, newPaidPractices) => {
    const memberRef = doc(db, 'users', memberId);
    await updateDoc(memberRef, { paidPractices: newPaidPractices });
    setMembers(members.map(member => 
      member.id === memberId ? { ...member, paidPractices: newPaidPractices } : member
    ));
    setSelectedMember(prev => ({
      ...prev,
      paidPractices: newPaidPractices
    }));
  };

  const removeMember = async (memberId) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this member?");
    
    if (confirmDelete) {
      try {
        const memberRef = doc(db, 'users', memberId);
        await deleteDoc(memberRef);
        
        const batch = writeBatch(db);
        const practicesRef = collection(db, 'practices');
        const practicesSnapshot = await getDocs(practicesRef);
  
        practicesSnapshot.forEach((practiceDoc) => {
          const practiceData = practiceDoc.data();
  
          if (practiceData.members && practiceData.members.includes(memberId)) {
            const practiceRef = doc(db, 'practices', practiceDoc.id);
            batch.update(practiceRef, {
              members: arrayRemove(memberId)
            });
          }
        });
  
        await batch.commit();
  
        setMembers(members.filter(member => member.id !== memberId));
  
        console.log("Member and all related practice entries successfully removed.");
      } catch (error) {
        console.error("Error removing member from practices: ", error);
      }
    }
  };


  const viewPractices = (member) => {
    setSelectedMember(member);
    setViewingPractices(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredMembers = members.filter(member => {
    const fullName = `${member.nameFirst} ${member.nameLast}`.toLowerCase();
    const email = member.email.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
  });

  const openModal = (member) => {
    setSelectedMember(member);
  };

  const closeModal = () => {
    setSelectedMember(null);
    setViewingPractices(false);
  };

  return (
    <div>
      <HomeNavbar />
      <div className={`container2 ${selectedMember ? 'blurred' : ''}`}>
        <h1>Manage Club Members</h1>
        <div className="search">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        {filteredMembers.length === 0 ? (
          <p>No user found</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th className="responsive-hide">Attended Practices</th>
                  <th className="responsive-hide">Total Paid Practices</th>
                  <th className="responsive-hide">Remaining Paid Practices</th>
                  <th className="responsive-hide">Role</th>
                  <th className="responsive-hide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map(member => {
                  const attendedPracticesCount = member.practices ? member.practices.length : 0;
                  const remainingPaidPractices = member.paidPractices - attendedPracticesCount;

                  return (
                    <tr key={member.id}>
                      <td onClick={() => openModal(member)}>{member.nameFirst} {member.nameLast}</td>
                      <td onClick={() => openModal(member)}>{member.email}</td>
                      <td className="responsive-hide">{attendedPracticesCount}</td>
                      <td className="responsive-hide">
                        <input
                          type="number"
                          value={member.paidPractices || 0}
                          onChange={(e) => updatePaidPractices(member.id, parseInt(e.target.value))}
                          style={{ width: '60px' }}
                        />
                      </td>
                      <td className="responsive-hide" style={{ color: remainingPaidPractices >= 0 ? 'green' : 'red' }}>
                        {remainingPaidPractices}
                      </td>
                      <td className="responsive-hide">
                        <select
                          value={member.role}
                          onChange={(e) => changeRole(member.id, e.target.value)}
                        >
                          <option value="Member">Member</option>
                          <option value="Officer">Officer</option>
                        </select>
                      </td>
                      <td className="responsive-hide">
                        <button onClick={() => removeMember(member.id)}>Remove</button>
                        <button onClick={() => viewPractices(member)}>View Practices</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedMember && (
        <div className="overlay" onClick={closeModal}>
          <div className="modal2" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              {viewingPractices ? ( 
                <ViewUsersPastPractices userId={selectedMember.id} goBack={() => setViewingPractices(false)} /> 
              ) : (
                <>
                  <h2>{selectedMember.nameFirst} {selectedMember.nameLast}</h2>
                  <p><strong>Email:</strong> {selectedMember.email}</p>
                  <p><strong>Attended Practices:</strong> {selectedMember.practices ? selectedMember.practices.length : 0}</p>

                  <div className="modal-row">
                    <label><strong>Total Paid Practices:</strong></label>
                    <input
                      type="number"
                      value={selectedMember.paidPractices || 0}
                      onChange={(e) => {
                        const newPaidPractices = parseInt(e.target.value);
                        setSelectedMember({ ...selectedMember, paidPractices: newPaidPractices }); // Update selectedMember state
                        updatePaidPractices(selectedMember.id, newPaidPractices); // Update database and members list
                      }}
                      style={{ width: '60px', color: selectedMember.paidPractices - selectedMember.practices.length>= 0 ? 'green' : 'red' }}
                    />
                  </div>

                  <div className="modal-row">
                    <label><strong>Role:</strong></label>
                    <select
                      value={selectedMember.role}
                      onChange={(e) => changeRole(selectedMember.id, e.target.value)}
                    >
                      <option value="Member">Member</option>
                      <option value="Officer">Officer</option>
                    </select>
                  </div>

                  <div className="modal-row">
                    <button onClick={() => removeMember(selectedMember.id)}>Remove</button>
                    <button onClick={() => viewPractices(selectedMember)}>View Practices</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageMembers;
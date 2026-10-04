/* eslint-disable @typescript-eslint/no-explicit-any */
// serverActions.ts - Central export for all server action modules

import ServerActionUsers from "./userServerAction";
import ServerActionCenters from "./centerServerAction";
import ServerActionTeachers from "./teacherServerAction";
import ServerActionStudents from "./studentServerAction";
import ServerActionSubjects from "./subjectServerAction";
import ServerActionReceipts from "./receiptServerAction";
import ServerActionSchedules from "./scheduleServerAction";
import ServerActionDeleteRequests from "./deleteRequestServerAction";
import ServerActionAttendance from "./attendanceServerAction";

// ✅ Export all server actions for easy importing
export {
  ServerActionUsers,
  ServerActionCenters,
  ServerActionTeachers,
  ServerActionStudents,
  ServerActionSubjects,
  ServerActionReceipts,
  ServerActionSchedules,
  ServerActionDeleteRequests,
  ServerActionAttendance,
};

// ✅ Convenience function to sync all entities
export async function syncAllEntities() {
  const results = await Promise.allSettled([
    ServerActionUsers.Sync(),
    ServerActionCenters.Sync(),
    ServerActionTeachers.Sync(),
    ServerActionStudents.Sync(),
    ServerActionSubjects.Sync(),
    ServerActionReceipts.Sync(),
    ServerActionSchedules.Sync(),
    ServerActionAttendance.Sync(),
  ]);

  return {
    users: results[0],
    centers: results[1],
    teachers: results[2],
    students: results[3],
    subjects: results[4],
    receipts: results[5],
    schedules: results[6],
    attendance: results[7],
  };
}

// ✅ Convenience function to import all entities from server
export async function importAllFromServer() {
  const results = await Promise.allSettled([
    ServerActionUsers.ImportFromServer(),
    ServerActionCenters.ImportFromServer(),
    ServerActionTeachers.ImportFromServer(),
    ServerActionStudents.ImportFromServer(),
    ServerActionSubjects.ImportFromServer(),
    ServerActionReceipts.ImportFromServer(),
    ServerActionSchedules.ImportFromServer(),
    ServerActionAttendance.ImportFromServer(),
  ]);

  return {
    users: results[0],
    centers: results[1],
    teachers: results[2],
    students: results[3],
    subjects: results[4],
    receipts: results[5],
    schedules: results[6],
    attendance: results[7],
  };
}

// ✅ Role-aware sync function - includes users only for admins
export async function syncAllEntitiesForRole(isAdmin: boolean) {
  const syncPromises = [
    ServerActionCenters.Sync(),
    ServerActionTeachers.Sync(),
    ServerActionStudents.Sync(),
    ServerActionSubjects.Sync(),
    ServerActionReceipts.Sync(),
    ServerActionSchedules.Sync(),
    ServerActionAttendance.Sync(),
  ];

  // Only sync users and delete requests if admin
  if (isAdmin) {
    syncPromises.unshift(ServerActionUsers.Sync());
    syncPromises.push(ServerActionDeleteRequests.Sync());
  }

  const results = await Promise.allSettled(syncPromises);

  if (isAdmin) {
    return {
      users: results[0],
      centers: results[1],
      teachers: results[2],
      students: results[3],
      subjects: results[4],
      receipts: results[5],
      schedules: results[6],
      attendance: results[7],
      deleteRequests: results[8],
    };
  } else {
    return {
      centers: results[0],
      teachers: results[1],
      students: results[2],
      subjects: results[3],
      receipts: results[4],
      schedules: results[5],
      attendance: results[6],
    };
  }
}

// ✅ Role-aware import function - includes users only for admins
export async function importAllFromServerForRole(isAdmin: boolean) {
  const importPromises = [
    ServerActionCenters.ImportFromServer(),
    ServerActionTeachers.ImportFromServer(),
    ServerActionStudents.ImportFromServer(),
    ServerActionSubjects.ImportFromServer(),
    ServerActionReceipts.ImportFromServer(),
    ServerActionSchedules.ImportFromServer(),
    ServerActionAttendance.ImportFromServer(),
  ];

  // Only import users if admin
  if (isAdmin) {
    importPromises.unshift(ServerActionUsers.ImportFromServer());
  }

  const results = await Promise.allSettled(importPromises);

  if (isAdmin) {
    return {
      users: results[0],
      centers: results[1],
      teachers: results[2],
      students: results[3],
      subjects: results[4],
      receipts: results[5],
      schedules: results[6],
      attendance: results[7],
    };
  } else {
    return {
      centers: results[0],
      teachers: results[1],
      students: results[2],
      subjects: results[3],
      receipts: results[4],
      schedules: results[5],
      attendance: results[6],
    };
  }
}


"use client";

import StudentReceiptTable from "@/components/centermanagementcomponents/studentReceiptTable";
import StudentsTable from "@/components/centermanagementcomponents/studentsPresentation";

export default function ManagerStudentsClient() {
  return (
    <>
      <StudentsTable />
      <StudentReceiptTable />
    </>
  );
}

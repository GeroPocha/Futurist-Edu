import React, { useState } from "react";
import { StudentItem } from "./StudentItem";

export const StudentList = ({ students }) => {
    const [visibleCount, setVisibleCount] = useState(5);

    const showMore = () => {
        setVisibleCount(students.length);
				console.log(students.length)
    };

    const showLess = () => {
        setVisibleCount(5);
    };

    return (
      <>
        <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
            {students.slice(0, visibleCount).map((student) => (
                <StudentItem student={student} key={student.id} />
            ))}
        </ul>
        {students.length > 5 && visibleCount < students.length && (
            <button 
                className="mt-4 px-4 py-2 bg-gray-400 focus:outline-none dark:bg-gray-700 text-white font-semibold rounded hover:bg-blue-700 dark:hover:bg-blue-700"
                onClick={showMore}
            >
                Expand
            </button>
        )}
        {visibleCount >= students.length && students.length > 5 && (
            <button 
                className="mt-4 px-4 py-2 bg-gray-400 focus:outline-none dark:bg-gray-700 text-white font-semibold rounded hover:bg-blue-700 dark:hover:bg-blue-700"
                onClick={showLess}
            >
                Condense
            </button>
        )}
      </>
    );
};

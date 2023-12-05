import React from 'react';

const CourseCard = ({ coursename, coursesubject, courseID }) => {
    const colors = ['green', 'blue', 'red', 'orange', 'yellow', 'purple'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const navigateToCourse = () => {
        // Diese Funktion leitet zum Kurs mit der angegebenen ID weiter.
        window.location.href = `/course/${courseID}`;
    };

    return (
        <div onClick={navigateToCourse} className={`cursor-pointer flex gap-3 bg-${randomColor}-500 border border-gray-300 rounded-xl overflow-hidden items-center justify-start p-4`}>
            <div className="flex flex-col gap-2 py-2">
                <p className="text-xl font-bold text-white">{coursename}</p>
                <p className="text-gray-200">{coursesubject}</p>
                <span className="text-gray-200">
                    <a>{courseID}</a>
                </span>
            </div>
        </div>
    );
};

export default CourseCard;

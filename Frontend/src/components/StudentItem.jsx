import React from "react";

export const StudentItem = ({ student }) => {
    const getColorClass = (correctAnswers) => {
        if (correctAnswers >= 50) return "text-blue-500";
        if (correctAnswers >= 20) return "text-green-500";
        if (correctAnswers >= 1) return "text-yellow-500";
        return "text-red-500";
    };

    const colorClass = getColorClass(student.correctAnsweredQuestions);

    return (
        <li className="py-3 sm:py-4">
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                    <svg className={`w-6 h-6 ${colorClass}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                    </svg>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate dark:text-white">
                        {student.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                        {student.mail}
                    </p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                    {student.correctAnsweredQuestions} Correct Flashcards
                </div>
            </div>
        </li>
    );
};

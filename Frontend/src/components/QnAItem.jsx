import React from "react";

export const QnAItem = ({ qna }) => {
    const getColorClass = (percentage) => {
        if (percentage > 90) return "text-blue-500 dark:text-blue-500";
        if (percentage > 70) return "text-green-500 dark:text-green-500";
        if (percentage > 60) return "text-yellow-500 dark:text-yellow-500";
        return "text-red-500 dark:text-red-500";
    };

    const percentage = Number(qna.percentage.slice(0, -1));
    const displayPercentage = isNaN(percentage) ? "No Data" : `${percentage.toFixed(2)}%`;
    const colorClass = getColorClass(percentage);

    return (
        <li className="py-3 sm:py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center min-w-0">
                    <div className="ml-3">
                        <p className="font-medium text-gray-900 dark:text-white ">
                            {qna.question}
                        </p>
                        <div
                            className={`flex items-center justify-start flex-1 text-sm`}
                        >
                            <span className="ml-2 text-gray-500">{qna.answer}</span>
                        </div>
                    </div>
                </div>
                <div
                    className={`inline-flex items-center text-base font-semibold ${colorClass}`}
                >
                    {displayPercentage}
                </div>
            </div>
        </li>
    );
};

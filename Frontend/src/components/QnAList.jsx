import React, { useState } from "react";
import { QnAItem } from "./QnAItem";

export const QnAList = ({ qnas }) => {
    const [visibleCount, setVisibleCount] = useState(5);

    const showMore = () => {
        setVisibleCount(qnas.length);
				console.log(qnas.length)
    };

    const showLess = () => {
        setVisibleCount(5);
    };

    const sortQnA = (qnaList) => {
        return qnaList.sort((a, b) => {
            const percentageA = Number(a.percentage);
            const percentageB = Number(b.percentage);
            if (isNaN(percentageA)) return 1;
            if (isNaN(percentageB)) return -1;
            return percentageB - percentageA;
        });
    };

    const sortedQnAs = sortQnA([...qnas]);

    return (
        <>
            <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                {sortedQnAs.slice(0, visibleCount).map((qna) => (
                    <QnAItem qna={qna} key={qna.id} />
                ))}
            </ul>
            {visibleCount < qnas.length && (
                <button 
                    className="mt-4 px-4 py-2 bg-gray-400 focus:outline-none dark:bg-gray-700 text-white font-semibold rounded hover:bg-blue-700 dark:hover:bg-blue-700"
                    onClick={showMore}
                >
                    Expand
                </button>
            )}
            {visibleCount >= qnas.length && qnas.length > 5 && (
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

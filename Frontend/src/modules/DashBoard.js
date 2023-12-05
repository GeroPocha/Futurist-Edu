export const getBackendMainChartData = async (courseId, days) => {
	try {
			const response = await fetch(`https://futurist-edu-functions.azurewebsites.net/api/gettotalanswercountpercourse/${courseId}/${days}?code=935BxzUi_b-RQTbFfshe4grW7hQZ7ZiR7Nv2G0YrKZ_WAzFuvfM6Kg%3D%3D`);
			if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
			}
			const data = await response.json();
			const reversedData = data.reverse();
			reversedData.shift();
			const dates = reversedData.map(item => item.Date);
			const answerCounts = reversedData.map(item => item.AnswerCount.toString());
			const correctAnswerCounts = reversedData.map(item => item.CorrectAnswerCount.toString());

			const sumOfAnswerCounts = answerCounts.reduce((total, count) => total + parseInt(count), 0);
			setAmountOfFlashcards(sumOfAnswerCounts);
			const flashcardAverage = Math.round(sumOfAnswerCounts / days);
			setFlashcardAverage(flashcardAverage);
			return { dates, answerCounts, correctAnswerCounts };
	} catch (error) {
			console.error('Error fetching chart data:', error);
			return { dates: [], answerCounts: [], correctAnswerCounts: [] };
	}
};

export const getBackendDonutChartData = async (courseId) => {
	try {
			const response = await fetch(`https://futurist-edu-functions.azurewebsites.net/api/getcoursestudentquestioncounts/${courseId}?code=5d6zMfkb9ZkjfY1frhDosmB3ulSdjk1I4kqcICk254m0AzFuy8Sy3A%3D%3D`);
			if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
			}
			const data = await response.json();
			if ((data.ZeroAnswers + data.OneToNineteenAnswers + data.TwentyToFiftyAnswers + data.FiftyPlusAnswers) >= 1 ) {
					return [data.ZeroAnswers, data.OneToNineteenAnswers, data.TwentyToFiftyAnswers, data.FiftyPlusAnswers];
			} else {
					return [0, 0, 0, 0];
			}
	} catch (error) {
			console.error('Error fetching donut chart data:', error);
			return [0, 0, 0, 0];
	}
};

export const getFlashcardsPerformance = async (courseId) => {
	try {
			const response = await fetch(`https://futurist-edu-functions.azurewebsites.net/api/questionsuccessrates/${courseId}?code=v7o7M3uDsw6rxJ53X5jziZoQrFT7tG7vsyrRliRgcov2AzFuyFRj5A%3D%3D`);
			if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
			}
			const data = await response.json();

			const qna = data.map(item => ({
					id: item.QuestionID,
					question: item.Question,
					answer: item.Answer, 
					percentage: item.SuccessRate + '%' 
			}));
			
			console.log(qna)
			return qna;
	} catch (error) {
			console.error('Error fetching student performance data:', error);
			return []; 
	}
};

export const getBackendStudentsPerformance = async (courseId) => {
	try {
			const response = await fetch(`https://futurist-edu-functions.azurewebsites.net/api/getstudentsperformancebycourse/${courseId}?code=vP-F_QGSjyKxW7J4cct5b5zy0eZhgLt5wvx8aysG9uBeAzFukR0xdg%3D%3D`);
			if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
			}
			const students = await response.json();
			return students;
	} catch (error) {
			console.error('Error fetching student performance data:', error);
			return [];
	}
};


export const getBackendDocumentUploadDates = async (courseId) => {
	try {
		const response = await fetch(`https://futurist-edu-functions.azurewebsites.net/api/getcoursequestionsdailystatus/${courseId}?code=fsw0XywB0R2EBKL3TiXlmo_THbVLBaQE9MG4Kn0yL3bmAzFutKcOLA%3D%3D`);
		if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
		}
		const data = await response.json();
		const reversedData = data.reverse();


		const uploadStatus = reversedData.map(item => ({
				date: item.Date,
				uploaded: item.Status == 'Questions created'
		}));

		return uploadStatus;
} catch (error) {
		console.error('Error fetching document upload dates:', error);
		return [];
}};


export function setAmountOfStudentsEnrolled(courseId) {
	const element = document.getElementById('amountOfStudentsEnrolled');
	if (element) {
			fetch(`https://futurist-edu-functions.azurewebsites.net/api/coursestudentcount/${courseId}?code=ehBX323yJEmadrw-LJ4y4zGYzTUxsg5cKXO4ItT8C8bvAzFuw9rsoA%3D%3D`)
					.then(response => {
							if (!response.ok) {
									throw new Error(`HTTP error! Status: ${response.status}`);
							}
							return response.json();
					})
					.then(data => {
							element.textContent = data.studentCount;
					})
					.catch(error => {
							console.error('Error fetching student count:', error);
							element.textContent = 'Error';
					});
	} else {
			console.error('Error');
	}
}


 function setAmountOfFlashcards(amount) {
	const element = document.getElementById('amountOfFlashcards');
	if (element) {
			element.textContent = amount;
	} else {
			console.error('Element nicht gefunden');
	}
}

function setFlashcardAverage(amount) {
	const element = document.getElementById('flashcardAverage');
	if (element) {
			element.textContent = "On Average " + amount + " Flashcards Daily";
	} else {
			console.error('Element nicht gefunden');
	}
}

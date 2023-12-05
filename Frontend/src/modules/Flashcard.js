// JavaScript zum Aktualisieren der Frage
function updateQuestionText(newText) {
	document.getElementById('questionText').textContent = newText;
}

function updateFlashcardCount(newCount) {
	document.getElementById('flashcard-count').textContent = newCount;
}

function updateFlashcardCourse(newCourse) {
	document.getElementById('flashcard-course').textContent = newCourse;
}

function hideFlashcardModal() {
	const flashcardModal = document.getElementById('flashcard-modal');
	flashcardModal.classList.add('hidden');
}

function hideSubmitButton() {
	const submitButton = document.getElementById('submit-answer-button');
	submitButton.classList.add('hidden');
}

function updateFlashcardHeader(newHeader) {
	document.getElementById('flashcard-header').textContent = newHeader;
}

function updateQuestionID(newID){
	document.getElementById('questionID').textContent = newID;
}

function updateResultHeader(Result) {
	const resultHeader = document.getElementById('flashcard-result-header');

	if (Result) {
			resultHeader.textContent = "Correct Answer";
			resultHeader.classList.add('dark:text-green-500', 'text-green-400');
			resultHeader.classList.remove('text-red-500', 'text-gray-900','dark:text-white', 'dark:text-red-500' );

	} else {
			resultHeader.textContent = "Incorrect Answer";
			resultHeader.classList.add('dark:text-red-500', 'text-red-500');
			resultHeader.classList.remove('text-green-400', 'dark:text-green-500');
			resultHeader.classList.remove('dark:text-white');

	}
}

function updateResultCaption(Result) {
	const resultCaption = document.getElementById('flashcard-result-caption');

	if (Result) {
			resultCaption.textContent = "The AI found your Answer to match the intended Answer!";
	} else {
		resultCaption.textContent = "The AI found your Answer to not match the intended Answer!";
	}
}

function updateResultModal(Result) {
	const resultModal = document.getElementById('flashcard-result-modal');

	if (Result) {
		resultModal.classList.add('border-2', 'border-green-400', 'dark:border-green-500');
		resultModal.classList.remove('border-red-500', 'dark:border-red-500')
	} else {
		resultModal.classList.add('border-2', 'border-red-500', 'dark:border-red-500');
		resultModal.classList.remove('border-green-400', 'dark:border-green-500')

	}
}

function updateResultTexts(question, intendedAnswer, userAnswer) {
	const resultQuestion = document.getElementById('flashcard-result-questionText');
	const resultIntendedAnswer = document.getElementById('flashcard-result-intendedAnswerText');
	const resultUserAnswer = document.getElementById('flashcard-result-userAnswerText');

	resultQuestion.textContent = question;
	resultIntendedAnswer.textContent = intendedAnswer;
	resultUserAnswer.textContent = userAnswer;
}

function updateResult(Result) {
	updateResultHeader(Result)
	updateResultCaption(Result)
	updateResultModal(Result)
}

function getCourseIdFromUrl() {
	const pathArray = window.location.pathname.split('/');
	const courseId = pathArray[3]; 
	return courseId;
}

function resetInput(){
 document.getElementById('answerInput').value = '';

}

async function getFlashcardAPIData(userId) {
	const courseId = getCourseIdFromUrl();
	const url = `https://futurist-edu-functions.azurewebsites.net/api/getsingularreviewquestionsforuser/${userId}/${courseId}?code=icf5lMmwqCnn59Opiv0XltNgemIlwfKbWnrM-VZ3ujhTAzFuYDSb_w%3D%3D`;

	try {
			const response = await fetch(url);
			if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
			}
			const data = await response.json();
			console.log(data)
			return data;
	} catch (error) {
			console.error('Error fetching review questions: ', error.message);
			return null;
	}
}

async function prepareFlashcard() {
	const data = await getFlashcardAPIData(26);//Currently Hardcoded, as the Login is not yet enabled
	if(data.openQuestionCount>=1){
		updateFlashcardCount(data.openQuestionCount);
		updateQuestionText(data.question.Content);
		updateFlashcardCourse(data.question.CourseName);
		updateQuestionID(data.question.QuestionID);
		resetInput()
	}else{
		updateFlashcardHeader("You have revised all flashcards. There will be more shortly.");
		hideFlashcardModal();
		hideSubmitButton();
	}
}

async function handleSubmitAnswer(){
	const loadingIndicator = document.getElementById('loading-indicator');
	loadingIndicator.classList.remove('hidden');

	const questionID = document.getElementById('questionID').textContent;
	const userAnswer = document.getElementById('answerInput').value;
	let correctness;
	let correctAnswer;

	const submitButton = document.getElementById('submit-answer-button');
  const nextButton = document.getElementById('next-flashcard-button');
	const flashcard = document.getElementById('flashcard');
	const flashcardResult = document.getElementById('flashcard-result');

	fetch('https://futurist-edu-functions.azurewebsites.net/api/submituseranswer?code=1KeIRRBZ8QsuWZyHrgFM4hpIM7LQkQsV-lSDQsVUmpuLAzFuf-ByEw%3D%3D', { 
			method: 'POST',
			headers: {
					'Content-Type': 'application/json'
			},
			body: JSON.stringify({
					UserID: '26', //Currently Hardcoded, as Login is not yet enabled.
					AnswerGiven: userAnswer,
					QuestionID: questionID
			})
	})
	.then(response => response.json())
	.then(data => {
    	correctness = data.correctness === "Correct Answer";
			correctAnswer = data.correctAnswer;
			const questionText = document.getElementById('questionText').textContent
			updateResult(correctness);
			updateResultTexts(questionText, correctAnswer, userAnswer);
			prepareFlashcard(); 
			submitButton.classList.add('hidden');
				flashcard.classList.add('hidden')
				flashcardResult.classList.remove('hidden')
        nextButton.classList.remove('hidden');
	})
	.catch(error => console.error('Error:', error))
	.finally(() => {
			loadingIndicator.classList.add('hidden');
	});
}


document.addEventListener('DOMContentLoaded', function() {
	prepareFlashcard()

	const submitButton = document.getElementById('submit-answer-button');
  const nextButton = document.getElementById('next-flashcard-button');
	const flashcard = document.getElementById('flashcard');
	const flashcardResult = document.getElementById('flashcard-result');


    submitButton.addEventListener('click', function() {
				handleSubmitAnswer();
    });

    nextButton.addEventListener('click', function() {
			submitButton.classList.remove('hidden');
			nextButton.classList.add('hidden');
			flashcard.classList.remove('hidden')
			flashcardResult.classList.add('hidden')
    });
});

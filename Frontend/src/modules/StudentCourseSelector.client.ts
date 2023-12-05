export async function fetchStudentCourses(userId) {
	const url = `https://futurist-edu-functions.azurewebsites.net/api/getcoursesforstudent/${userId}?code=LoeIWCuxMDIheYpmOEXcID1Zq7TTiL7j4Wi1O3nLTXuzAzFuNgKogQ%3D%3D`;

	try {
			const response = await fetch(url);
			if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
			}
			const courses = await response.json();
			return courses;
	} catch (error) {
			console.error('Error fetching courses: ', error.message);
			return null;
	}
}

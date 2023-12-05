export async function fetchTeacherCourses(userId) {
	const url = `https://futurist-edu-functions.azurewebsites.net/api/getcoursesforteacher/${userId}?code=Ik7K-56ckQBAOiKG8meuoAJq-Sq1-cqkQ7a3A2eO1G_JAzFufwXJoQ%3D%3D`;

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

export async function fetchStudentName(userId) {
	const url = `https://futurist-edu-functions.azurewebsites.net/api/getusernameforuser/${userId}?code=Ox2Kf2OFClAFSdzDOg_0I3if-gr7Rqq-zFmkcAWQMz1LAzFuyaiheQ%3D%3D`;

	try {
			const response = await fetch(url);
			if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
			}
			const data = await response.json();
			return data.username;
	} catch (error) {
			console.error('Error fetching data: ', error.message);
			return null;
	}
}

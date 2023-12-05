const modalEl = document.getElementById('info-popup');
const privacyModal = new Modal(modalEl, {
    placement: 'center'
});

privacyModal.show();
triggerDatabase();

const closeModalEl = document.getElementById('close-modal');
closeModalEl.addEventListener('click', function() {
    privacyModal.hide();
});

const acceptPrivacyEl = document.getElementById('confirm-button');
acceptPrivacyEl.addEventListener('click', function() {
    privacyModal.hide();
});
async function triggerDatabase() {
	try {
			const response = await fetch(`https://futurist-edu-functions.azurewebsites.net/api/triggerdatabase?code=fMNvyVtQjk_v5rjLeFfhHIvb-BW_MQUHMwNjc02F6TUCAzFuJ9-5xg%3D%3D`);
			if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
			}
			const result = await response.text();
			console.log(result);
	} catch (error) {
			console.error('Error triggering database:', error);
	}
}

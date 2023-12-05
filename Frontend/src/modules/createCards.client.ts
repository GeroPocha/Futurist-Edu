export function toggleModal(event: MouseEvent): void {
    const button = event.target as HTMLButtonElement;
    const modalId = button.dataset.modalToggle;
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.toggle('hidden');
    }
  }
  
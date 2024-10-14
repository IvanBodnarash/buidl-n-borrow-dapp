export function showAlert(message) {
    const alertContainer = document.getElementById("custom-alert");
    const alertBox = document.getElementById("alertBox");
    const alertMessage = document.getElementById("alert-message");
    
    alertMessage.textContent = message;
    
    alertContainer.classList.remove("hidden");
    
    setTimeout(() => {
        alertContainer.classList.add("opacity-100", "bg-opacity-50");
        alertContainer.classList.remove("opacity-0", "bg-opacity-0");
    }, 10);
    
    setTimeout(() => {
        alertBox.classList.add("scale-100", "opacity-100");
        alertBox.classList.remove("scale-90", "opacity-0");
    }, 100);
}

export function closeAlert() {
    const alertContainer = document.getElementById("custom-alert");
    const alertBox = document.getElementById("alertBox");
    
    alertBox.classList.add("scale-90", "opacity-0");
    alertBox.classList.remove("scale-100", "opacity-100");
    
    setTimeout(() => {
        alertContainer.classList.add("opacity-0", "bg-opacity-0");
        alertContainer.classList.remove("opacity-100", "bg-opacity-50");
    }, 300);
    
    setTimeout(() => {
        alertContainer.classList.add("hidden");
    }, 500);
}
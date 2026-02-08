document.getElementById('registrationForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Inputs (get values)
    const firstName = document.getElementById('firstName').value.trim();
    const middleName = document.getElementById('middleName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const idNumber = document.getElementById('idNumber').value.trim();
    const program = document.getElementById('program').value;
    const yearLevel = document.getElementById('yearLevel').value;
    const guardianContact = document.getElementById('guardianContactNumber').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Password length
    if (password.length < 8) {
        Swal.fire({
            icon: "error",
            title: "Weak Password",
            text: "Password must be at least 8 characters long."
        });
        return;
    }

    // Password match
    if (password !== confirmPassword) {
        Swal.fire({
            icon: "error",
            title: "Password Mismatch",
            text: "Passwords do not match."
        });
        return;
    }

    // Data object to send
    const payload = {
        firstName,
        middleName,
        lastName,
        email,
        idNumber,
        program,
        yearLevel,
        guardianContact,
        password
    };

    try {
        const res = await fetch('http://localhost:3000/api/v1/authentication/student_registration', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const response = await res.json();

        if(res.ok && response.ok) {

            localStorage.setItem('device_id', response.device_id)

            Swal.fire({
                icon: "success",
                title: response.message,
                text: `Welcome, ${firstName}!`,
                confirmButtonColor: "#3085d6"
            });

        } else {
            Swal.fire({
                icon: "error",
                title: "Registration Failed",
                text: response.message || "Unknown error occurred"
            });
        }
    } catch(err) {
        Swal.fire({
            icon: 'error',
            title: 'Network or Server Error',
            text: err.message || err
        });
    }

    // Reset inputs value
    document.getElementById('registrationForm').reset();

});

async function loadProgramsDropdown() {
    const programSelect = document.getElementById('program');

    try {
        const response = await fetch('http://localhost:3000/api/v1/programs/program_get_data');
        
        const data = await response.json();

        console.log(data)

        if (!response.ok) {
            throw new Error(data.message || 'Failed to load programs');
        }

        programSelect.innerHTML = '<option value="">Select Program</option>';

        data.content.forEach(program => {
            const option = document.createElement('option');
            
            option.value = program.program_name; 
            option.textContent = program.program_name;
            
            programSelect.appendChild(option);
        });

    } catch (error) {
        console.error('Error loading programs:', error);
        // Optional: Show an error option
        const errorOption = document.createElement('option');
        errorOption.textContent = "Error loading programs";
        programSelect.appendChild(errorOption);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadProgramsDropdown()
});

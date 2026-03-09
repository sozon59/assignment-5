let allIssues = [];

/**
 * LogIn Page
 */
function handleLogin() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (user === 'admin' && pass === 'admin123') {
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('main-content').classList.remove('hidden');
        fetchAllIssues();
    } else {
        alert(" Wrong passwprd or username ! use demo.");
    }
}

/**
 * Data Fetching
 */
async function fetchAllIssues() {
    toggleLoading(true);
    try {
        const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
        const data = await res.json();
        allIssues = data.data; 
        displayIssues(allIssues);
    } catch (err) {
        console.error("error data load:", err);
    }
    toggleLoading(false);
}


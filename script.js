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

/**
 * Card 
 */
function displayIssues(issues) {
    const container = document.getElementById('issues-container');
    const countLabel = document.getElementById('issue-count');
    container.innerHTML = "";
    countLabel.innerText = issues.length;

    issues.forEach(issue => {
        // Challange Part
        const borderColor = issue.status === 'open' ? 'border-t-green-500' : 'border-t-purple-500';
        
        const card = document.createElement('div');
        card.className = `bg-white p-6 shadow-sm border border-t-4 ${borderColor} rounded-xl flex flex-col hover:shadow-lg transition-all cursor-pointer group`;
        card.onclick = () => showDetails(issue.id);
        
        card.innerHTML = `
            <div class="flex-grow">
                <div class="flex justify-between items-start mb-3">
                    <span class="text-[10px] font-black uppercase px-2 py-0.5 bg-gray-100 rounded text-gray-500 group-hover:bg-primary group-hover:text-white transition-colors">
                        ${issue.priority}
                    </span>
                    <span class="text-xs text-gray-400">${new Date(issue.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 class="font-bold text-gray-800 text-lg mb-2 line-clamp-2">${issue.title}</h3>
                <p class="text-sm text-gray-500 line-clamp-3 mb-4">${issue.description}</p>
            </div>
            
            <div class="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-bold text-indigo-600">
                        ${issue.author[0].toUpperCase()}
                    </div>
                    <div>
                        <p class="text-[11px] font-bold text-gray-700">${issue.author}</p>
                        <p class="text-[10px] text-gray-400">${issue.label}</p>
                    </div>
                </div>
                <div class="text-lg">➔</div>
            </div>
        `;
        container.appendChild(card);
    });
}

/**
 * Search Option
 */
async function handleSearch() {
    const query = document.getElementById('search-input').value;
    if (!query) {
        displayIssues(allIssues);
        return;
    }

    toggleLoading(true);
    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${query}`);
        const data = await res.json();
        displayIssues(data.data);
    } catch (err) {
        console.error("Search Problem:", err);
    }
    toggleLoading(false);
}


function filterData(status, element) {
    // Tab Style
    document.querySelectorAll('#btn-all, #btn-open, #btn-closed').forEach(btn => {
        btn.classList.remove('active-tab');
        btn.classList.add('text-gray-500');
    });
    element.classList.add('active-tab');
    element.classList.remove('text-gray-500');

    if (status === 'all') {
        displayIssues(allIssues);
    } else {
        const filtered = allIssues.filter(issue => issue.status === status);
        displayIssues(filtered);
    }
}


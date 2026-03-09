let allIssues = [];

/**
 * 🔐 লগইন হ্যান্ডেলার
 */
function handleLogin() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (user === 'admin' && pass === 'admin123') {
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('main-content').classList.remove('hidden');
        fetchAllIssues();
    } else {
        alert("ভুল ইউজারনেম বা পাসওয়ার্ড! ডেমো ব্যবহার করুন।");
    }
}

/**
 * 📡 ডাটা ফেচিং
 */
async function fetchAllIssues() {
    toggleLoading(true);
    try {
        const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
        const data = await res.json();
        allIssues = data.data; 
        displayIssues(allIssues);
    } catch (err) {
        console.error("ডাটা লোড করতে সমস্যা হয়েছে:", err);
    }
    toggleLoading(false);
}

/**
 * 🎨 কার্ড ডিসপ্লে লজিক (৪-কলাম এবং টপ বর্ডার)
 */
function displayIssues(issues) {
    const container = document.getElementById('issues-container');
    const countLabel = document.getElementById('issue-count');
    container.innerHTML = "";
    countLabel.innerText = issues.length;

    issues.forEach(issue => {
        // রিকোয়ারমেন্ট অনুযায়ী চ্যালেঞ্জ পার্ট: ওপেন গ্রিন, ক্লোজড পার্পল
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
 * 🔍 সার্চ ফাংশনালিটি
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
        console.error("সার্চ করতে সমস্যা হয়েছে:", err);
    }
    toggleLoading(false);
}

/**
 * 🔘 ফিল্টার লজিক
 */
function filterData(status, element) {
    // ট্যাব স্টাইল পরিবর্তন
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

/**
 * 🖼️ ডিটেইলস মোডাল
 */
async function showDetails(id) {
    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
    const data = await res.json();
    const issue = data.data;

    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = `
        <div class="h-2 w-full ${issue.status === 'open' ? 'bg-green-500' : 'bg-purple-500'}"></div>
        <div class="p-8">
            <div class="flex justify-between items-center mb-6">
                <span class="badge badge-ghost uppercase font-bold text-[10px]">${issue.label}</span>
                <button onclick="document.getElementById('issue_modal').close()" class="btn btn-sm btn-circle btn-ghost">✕</button>
            </div>
            <h3 class="font-black text-3xl mb-4 text-gray-800">${issue.title}</h3>
            <p class="text-gray-600 leading-relaxed mb-8 border-l-4 border-gray-200 pl-4 italic">${issue.description}</p>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-t border-b border-gray-100 mb-6">
                <div>
                    <p class="text-xs text-gray-400 uppercase font-bold">Status</p>
                    <p class="font-bold text-gray-700 capitalize">${issue.status}</p>
                </div>
                <div>
                    <p class="text-xs text-gray-400 uppercase font-bold">Priority</p>
                    <p class="font-bold text-gray-700 capitalize">${issue.priority}</p>
                </div>
                <div>
                    <p class="text-xs text-gray-400 uppercase font-bold">Reporter</p>
                    <p class="font-bold text-gray-700">${issue.author}</p>
                </div>
                <div>
                    <p class="text-xs text-gray-400 uppercase font-bold">Date</p>
                    <p class="font-bold text-gray-700">${new Date(issue.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
            <div class="flex justify-end">
                <button onclick="document.getElementById('issue_modal').close()" class="btn btn-primary px-8 text-white">Close Details</button>
            </div>
        </div>
    `;
    document.getElementById('issue_modal').showModal();
}

function toggleLoading(isLoading) {
    const loader = document.getElementById('loading');
    const container = document.getElementById('issues-container');
    loader.classList.toggle('hidden', !isLoading);
    container.classList.toggle('hidden', isLoading);
}
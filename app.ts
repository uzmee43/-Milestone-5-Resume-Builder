// Generate a unique ID for the resume link
function GenerateUniqueID(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// Save the resume data to localStorage with a unique ID
function saveResumeData(id: string, data: any): void {
    localStorage.setItem(id, JSON.stringify(data));
}

// Retrieve the resume data by its unique ID
function GetResumeData(id: string): any | null {
    const data = localStorage.getItem(id);
    return data ? JSON.parse(data) : null;
}

// Fetch query parameters from the URL
function GetQueryParam(param: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form') as HTMLFormElement;
    const resumeOutput = document.getElementById('resume-output') as HTMLDivElement;
    const profilePicInput = document.getElementById('profilePic') as HTMLInputElement;
    const shareableLinkDiv = document.getElementById('shareable-link') as HTMLDivElement;
    const shareableUrl = document.getElementById('shareable-url') as HTMLAnchorElement;
    const downloadPDFButton = document.getElementById('download-pdf') as HTMLButtonElement;

    // Check if there's a query param with a unique ID to load a resume
    const resumeID = GetQueryParam('id');
    if (resumeID) {
        const savedData = GetResumeData(resumeID);
        if (savedData) {
            RenderResume(savedData);
            downloadPDFButton.style.display = 'block';
        }
    }

    // Handle form submission
    form.addEventListener('submit', (event: Event) => {
        event.preventDefault();

        // Generate a unique ID for the resume
        const uniqueID = GenerateUniqueID();

        // Extract form values
        const name = (document.getElementById('name') as HTMLInputElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const phone = (document.getElementById('phone') as HTMLInputElement).value;
        const address = (document.getElementById('address') as HTMLInputElement).value;
        const education = (document.getElementById('education') as HTMLTextAreaElement).value;
        const experience = (document.getElementById('experience') as HTMLTextAreaElement).value;
        const skills = (document.getElementById('skills') as HTMLTextAreaElement).value;

        // Check for profile picture upload
        const profilePicFile = profilePicInput.files?.[0];

        const resumeData = {
            name,
            email,
            phone,
            address,
            education,
            experience,
            skills,
            profilePic: ''
        };

        if (profilePicFile) {
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target && e.target.result) {
                    resumeData.profilePic = e.target.result as string;
                    saveResumeData(uniqueID, resumeData);
                    RenderResume(resumeData);
                    displayShareableLink(uniqueID);
                    downloadPDFButton.style.display = 'block';
                }
            };
            reader.readAsDataURL(profilePicFile);
        } else {
            saveResumeData(uniqueID, resumeData);
            RenderResume(resumeData);
            displayShareableLink(uniqueID);
            downloadPDFButton.style.display = 'block';
        }
    });

    // Function to render the resume on the page
    function RenderResume(data: any): void {
        let imageHTML = '';
        if (data.profilePic) {
            imageHTML = `<img src="${data.profilePic}" alt="Profile Picture" style="width:150px;height:150px;border-radius:50%;"><br><br>`;
        }

        const resumeHTML = `
            ${imageHTML}
            <h2>${data.name}</h2>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <p><strong>address:</strong> ${data.address}</p>

            <h3>Education</h3>
            <p>${data.education}</p>

            <h3>Experience</h3>
            <p>${data.experience}</p>

            <h3>Skills</h3>
            <p>${data.skills}</p>
        `;

        resumeOutput.innerHTML = resumeHTML;
    }

    // Display the shareable link
    function displayShareableLink(id: string): void {
        const currentUrl = window.location.href.split('?')[0];
        const shareableURL = `${currentUrl}?id=${id}`;
        shareableUrl.href = shareableURL;
        shareableUrl.textContent = shareableURL;
        shareableLinkDiv.style.display = 'block';
    }

    // Handle PDF download functionality
    downloadPDFButton.addEventListener('click', () => {
        window.print();
    });
});

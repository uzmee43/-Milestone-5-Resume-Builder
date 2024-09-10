// Generate a unique ID for the resume link
function GenerateUniqueID() {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}
// Save the resume data to localStorage with a unique ID
function SaveResumeData(id, data) {
    localStorage.setItem(id, JSON.stringify(data));
}
// Retrieve the resume data by its unique ID
function GetResumeData(id) {
    var data = localStorage.getItem(id);
    return data ? JSON.parse(data) : null;
}
// Fetch query parameters from the URL
function GetQueryParam(param) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
// Event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('form');
    var resumeOutput = document.getElementById('resume-output');
    var profilePicInput = document.getElementById('profilePic');
    var shareableLinkDiv = document.getElementById('shareable-link');
    var shareableUrl = document.getElementById('shareable-url');
    var downloadPDFButton = document.getElementById('download-pdf');
    // Check if there's a query param with a unique ID to load a resume
    var resumeID = GetQueryParam('id');
    if (resumeID) {
        var savedData = GetResumeData(resumeID);
        if (savedData) {
            renderResume(savedData);
            downloadPDFButton.style.display = 'block';
        }
    }
    // Handle form submission
    form.addEventListener('submit', function (event) {
        var _a;
        event.preventDefault();
        // Generate a unique ID for the resume
        var uniqueID = GenerateUniqueID();
        // Extract form values
        var name = document.getElementById('name').value;
        var email = document.getElementById('email').value;
        var phone = document.getElementById('phone').value;
        var education = document.getElementById('education').value;
        var experience = document.getElementById('experience').value;
        var skills = document.getElementById('skills').value;
        // Check for profile picture upload
        var profilePicFile = (_a = profilePicInput.files) === null || _a === void 0 ? void 0 : _a[0];
        var resumeData = {
            name: name,
            email: email,
            phone: phone,
            education: education,
            experience: experience,
            skills: skills,
            profilePic: ''
        };
        if (profilePicFile) {
            var reader = new FileReader();
            reader.onload = function (e) {
                if (e.target && e.target.result) {
                    resumeData.profilePic = e.target.result;
                    SaveResumeData(uniqueID, resumeData);
                    renderResume(resumeData);
                    displayShareableLink(uniqueID);
                    downloadPDFButton.style.display = 'block';
                }
            };
            reader.readAsDataURL(profilePicFile);
        }
        else {
            SaveResumeData(uniqueID, resumeData);
            renderResume(resumeData);
            displayShareableLink(uniqueID);
            downloadPDFButton.style.display = 'block';
        }
    });
    // Function to render the resume on the page
    function renderResume(data) {
        var imageHTML = '';
        if (data.profilePic) {
            imageHTML = "<img src=\"".concat(data.profilePic, "\" alt=\"Profile Picture\" style=\"width:150px;height:150px;border-radius:50%;\"><br><br>");
        }
        var resumeHTML = "\n            ".concat(imageHTML, "\n            <h2>").concat(data.name, "</h2>\n            <p><strong>Email:</strong> ").concat(data.email, "</p>\n            <p><strong>Phone:</strong> ").concat(data.phone, "</p>\n\n            <h3>Education</h3>\n            <p>").concat(data.education, "</p>\n\n            <h3>Experience</h3>\n            <p>").concat(data.experience, "</p>\n\n            <h3>Skills</h3>\n            <p>").concat(data.skills, "</p>\n        ");
        resumeOutput.innerHTML = resumeHTML;
    }
    // Display the shareable link
    function displayShareableLink(id) {
        var currentUrl = window.location.href.split('?')[0];
        var shareableURL = "".concat(currentUrl, "?id=").concat(id);
        shareableUrl.href = shareableURL;
        shareableUrl.textContent = shareableURL;
        shareableLinkDiv.style.display = 'block';
    }
    // Handle PDF download functionality
    downloadPDFButton.addEventListener('click', function () {
        window.print();
    });
});

// main.js
document.addEventListener('DOMContentLoaded', () => {
  // Variables to store data
  let projects = [];
  let employees = [];
  let operations = [];
  let workLogs = [];

  // Load data from localStorage
  function loadData() {
    projects = JSON.parse(localStorage.getItem('projects')) || [];
    employees = JSON.parse(localStorage.getItem('employees')) || [];
    operations = JSON.parse(localStorage.getItem('operations')) || [];
    workLogs = JSON.parse(localStorage.getItem('workLogs')) || [];

    // Load settings
    const primaryColor = localStorage.getItem('primaryColor');
    if (primaryColor) {
      document.documentElement.style.setProperty('--primary-color', primaryColor);
      document.getElementById('theme-color').value = primaryColor;
    }

    const accentColor = localStorage.getItem('accentColor');
    if (accentColor) {
      document.documentElement.style.setProperty('--accent-color', accentColor);
      document.getElementById('accent-color').value = accentColor;
    }

    const fontFamily = localStorage.getItem('fontFamily');
    if (fontFamily) {
      document.documentElement.style.setProperty('--font-family', fontFamily);
      document.getElementById('font-select').value = fontFamily;
    }

    const layoutStyle = localStorage.getItem('layoutStyle') || 'grid';
    document.getElementById('layout-select').value = layoutStyle;

    const enableNotifications = localStorage.getItem('enableNotifications') === 'true';
    const enableNotificationsInput = document.getElementById('enable-notifications');
    if (enableNotificationsInput) {
      enableNotificationsInput.checked = enableNotifications;
    }

    const defaultPriority = localStorage.getItem('defaultPriority') || 'medium';
    document.getElementById('default-priority').value = defaultPriority;

    const defaultEmployees = JSON.parse(localStorage.getItem('defaultEmployees')) || [];
    const defaultEmployeesSelect = document.getElementById('default-employees');
    loadEmployeesToSelect(defaultEmployeesSelect);
    Array.from(defaultEmployeesSelect.options).forEach((option) => {
      option.selected = defaultEmployees.includes(option.value);
    });
  }

  // Save data to localStorage
  function saveData() {
    localStorage.setItem('projects', JSON.stringify(projects));
    localStorage.setItem('employees', JSON.stringify(employees));
    localStorage.setItem('operations', JSON.stringify(operations));
    localStorage.setItem('workLogs', JSON.stringify(workLogs));

    // Save settings
    const primaryColor = document.getElementById('theme-color').value;
    localStorage.setItem('primaryColor', primaryColor);

    const accentColor = document.getElementById('accent-color').value;
    localStorage.setItem('accentColor', accentColor);

    const fontFamily = document.getElementById('font-select').value;
    localStorage.setItem('fontFamily', fontFamily);

    const layoutStyle = document.getElementById('layout-select').value;
    localStorage.setItem('layoutStyle', layoutStyle);

    const enableNotifications = document.getElementById('enable-notifications').checked;
    localStorage.setItem('enableNotifications', enableNotifications);

    const defaultPriority = document.getElementById('default-priority').value;
    localStorage.setItem('defaultPriority', defaultPriority);

    const defaultEmployees = Array.from(document.getElementById('default-employees').selectedOptions).map(
      (option) => option.value
    );
    localStorage.setItem('defaultEmployees', JSON.stringify(defaultEmployees));

    // Apply font and layout changes
    document.documentElement.style.setProperty('--font-family', fontFamily);
    renderProjects();
  }

  // Initial data load
  loadData();

  // Apply initial font family
  document.documentElement.style.setProperty('--font-family', localStorage.getItem('fontFamily') || "'Poppins', sans-serif");

  // Toggle Side Menu
  const menuIcon = document.getElementById('menu-icon');
  const sideMenu = document.getElementById('side-menu');

  menuIcon.addEventListener('click', () => {
    sideMenu.classList.toggle('active');
  });

  // Close Side Menu when clicking outside
  document.addEventListener('click', (event) => {
    if (!sideMenu.contains(event.target) && !menuIcon.contains(event.target)) {
      sideMenu.classList.remove('active');
    }
  });

  // Show and Hide Content Sections
  const showProjectListBtn = document.getElementById('show-project-list-btn');
  const showEmployeeListBtn = document.getElementById('show-employee-list-btn');
  const showWorkLogBtn = document.getElementById('show-work-log-btn');
  const showSettingsBtn = document.getElementById('show-settings-btn');

  const projectListSection = document.getElementById('project-list');
  const employeeListSection = document.getElementById('employee-list');
  const workLogSection = document.getElementById('work-log');
  const settingsPage = document.getElementById('settings-page');

  function showSection(section) {
    document.querySelectorAll('.content').forEach((content) => {
      content.classList.remove('active');
    });
    section.classList.add('active');
    sideMenu.classList.remove('active');
  }

  showProjectListBtn.addEventListener('click', () => {
    showSection(projectListSection);
    renderProjects();
  });

  showEmployeeListBtn.addEventListener('click', () => {
    showSection(employeeListSection);
    renderEmployees();
  });

  showWorkLogBtn.addEventListener('click', () => {
    showSection(workLogSection);
    renderWorkLogs();
  });

  showSettingsBtn.addEventListener('click', () => {
    showSection(settingsPage);
    renderOperations();
    loadEmployeesToSelect(document.getElementById('default-employees'));
  });

  // Initially show the project list section
  showSection(projectListSection);
  renderProjects();

  // Modals
  const projectModal = document.getElementById('project-modal');
  const closeProjectModalBtn = document.getElementById('close-project-modal');
  const addProjectBtn = document.getElementById('add-project-btn');
  const saveProjectBtn = document.getElementById('save-project-btn');
  const projectForm = document.getElementById('project-form');

  const employeeModal = document.getElementById('employee-modal');
  const closeEmployeeModalBtn = document.getElementById('close-employee-modal');
  const addEmployeeBtn = document.getElementById('add-employee-btn');
  const saveEmployeeBtn = document.getElementById('save-employee-btn');
  const employeeForm = document.getElementById('employee-form');

  const operationModal = document.getElementById('operation-modal');
  const closeOperationModalBtn = document.getElementById('close-operation-modal');
  const startOperationBtn = document.getElementById('start-operation-btn');
  const operationForm = document.getElementById('operation-form');

  const projectDetailsModal = document.getElementById('project-details-modal');
  const closeProjectDetailsModalBtn = document.getElementById('close-project-details-modal');
  const projectDetailsContent = document.getElementById('project-details-content');

  // Add Project Modal
  addProjectBtn.addEventListener('click', () => {
    loadEmployeesToSelect(document.getElementById('project-employees'));
    const defaultEmployees = JSON.parse(localStorage.getItem('defaultEmployees')) || [];
    const projectEmployeesSelect = document.getElementById('project-employees');
    Array.from(projectEmployeesSelect.options).forEach((option) => {
      option.selected = defaultEmployees.includes(option.value);
    });
    const defaultPriority = localStorage.getItem('defaultPriority') || 'medium';
    document.getElementById('project-priority').value = defaultPriority;
    projectModal.style.display = 'block';
  });

  closeProjectModalBtn.addEventListener('click', () => {
    projectModal.style.display = 'none';
    projectForm.reset();
  });

  saveProjectBtn.addEventListener('click', () => {
    const projectData = {
      id: generateId(),
      name: document.getElementById('project-name').value,
      purchaseOrder: document.getElementById('purchase-order').value,
      partNumber: document.getElementById('part-number').value,
      jobNumber: document.getElementById('job-number').value,
      dueDate: document.getElementById('due-date').value,
      quantity: document.getElementById('quantity').value,
      notes: document.getElementById('notes').value,
      assignedEmployees: Array.from(document.getElementById('project-employees').selectedOptions).map(
        (option) => option.value
      ),
      priority: document.getElementById('project-priority').value,
      status: 'Not Started',
      originalProjectId: null, // Set originalProjectId to null for new projects
    };

    projects.push(projectData);
    saveData();
    renderProjects();
    projectModal.style.display = 'none';
    projectForm.reset();
  });

  // Add Employee Modal
  addEmployeeBtn.addEventListener('click', () => {
    employeeModal.style.display = 'block';
  });

  closeEmployeeModalBtn.addEventListener('click', () => {
    employeeModal.style.display = 'none';
    employeeForm.reset();
  });

  saveEmployeeBtn.addEventListener('click', () => {
    const employeeName = document.getElementById('employee-name').value.trim();
    if (employeeName) {
      employees.push({ name: employeeName });
      saveData();
      renderEmployees();
      employeeModal.style.display = 'none';
      employeeForm.reset();
    } else {
      alert('Please enter a valid employee name.');
    }
  });

  // Operation Modal
  closeOperationModalBtn.addEventListener('click', () => {
    operationModal.style.display = 'none';
    operationForm.reset();
  });

  startOperationBtn.addEventListener('click', () => {
    const operation = document.getElementById('operation-select').value;
    const selectedEmployees = Array.from(document.getElementById('operation-employees').selectedOptions).map(
      (option) => option.value
    );
    if (operation && selectedEmployees.length > 0) {
      const projectId = operationModal.getAttribute('data-project-id');
      selectedEmployees.forEach((employeeName) => {
        startEmployeeOperation(projectId, employeeName, operation);
      });
      operationModal.style.display = 'none';
      operationForm.reset();
    } else {
      alert('Please select an operation and at least one employee.');
    }
  });

  function showEmployeeOperationModal(projectId) {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      operationModal.style.display = 'block';
      operationModal.setAttribute('data-project-id', projectId);
      loadOperationsToSelect();
      loadAssignedEmployeesToOperationSelect(project.assignedEmployees);
    }
  }

  function loadOperationsToSelect() {
    const operationSelect = document.getElementById('operation-select');
    operationSelect.innerHTML = '';
    operations.forEach((op) => {
      const option = document.createElement('option');
      option.value = op;
      option.textContent = op;
      operationSelect.appendChild(option);
    });
  }

  function loadAssignedEmployeesToOperationSelect(assignedEmployees) {
    const operationEmployeesSelect = document.getElementById('operation-employees');
    operationEmployeesSelect.innerHTML = '';
    assignedEmployees.forEach((employeeName) => {
      const option = document.createElement('option');
      option.value = employeeName;
      option.textContent = employeeName;
      operationEmployeesSelect.appendChild(option);
    });
  }

  // Project Details Modal
  closeProjectDetailsModalBtn.addEventListener('click', () => {
    projectDetailsModal.style.display = 'none';
    projectDetailsContent.innerHTML = '';
  });

  // Settings Page
  const themeColorInput = document.getElementById('theme-color');
  const accentColorInput = document.getElementById('accent-color');
  const fontSelect = document.getElementById('font-select');
  const enableNotificationsInput = document.getElementById('enable-notifications');
  const defaultPrioritySelect = document.getElementById('default-priority');
  const layoutSelect = document.getElementById('layout-select');

  themeColorInput.addEventListener('input', () => {
    document.documentElement.style.setProperty('--primary-color', themeColorInput.value);
    saveData();
  });

  accentColorInput.addEventListener('input', () => {
    document.documentElement.style.setProperty('--accent-color', accentColorInput.value);
    saveData();
  });

  fontSelect.addEventListener('change', () => {
    const fontFamily = fontSelect.value;
    document.documentElement.style.setProperty('--font-family', fontFamily);
    saveData();
  });

  layoutSelect.addEventListener('change', () => {
    saveData();
  });

  enableNotificationsInput.addEventListener('change', () => {
    saveData();
  });

  defaultPrioritySelect.addEventListener('change', () => {
    saveData();
  });

  document.getElementById('default-employees').addEventListener('change', () => {
    saveData();
  });

  const addOperationBtn = document.getElementById('add-operation-btn');
  const newOperationInput = document.getElementById('new-operation-input');
  const operationsList = document.getElementById('operations-list');

  addOperationBtn.addEventListener('click', () => {
    const operationName = newOperationInput.value.trim();
    if (operationName) {
      operations.push(operationName);
      saveData();
      renderOperations();
      newOperationInput.value = '';
    } else {
      alert('Please enter a valid operation name.');
    }
  });

  function renderOperations() {
    operationsList.innerHTML = '';
    operations.forEach((operation, index) => {
      const li = document.createElement('li');
      li.textContent = operation;
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.classList.add('btn-danger');
      deleteBtn.addEventListener('click', () => {
        operations.splice(index, 1);
        saveData();
        renderOperations();
      });
      li.appendChild(deleteBtn);
      operationsList.appendChild(li);
    });
  }

  // Close modals when clicking outside of them
  window.addEventListener('click', (event) => {
    if (event.target === projectModal) {
      projectModal.style.display = 'none';
      projectForm.reset();
    }
    if (event.target === employeeModal) {
      employeeModal.style.display = 'none';
      employeeForm.reset();
    }
    if (event.target === operationModal) {
      operationModal.style.display = 'none';
      operationForm.reset();
    }
    if (event.target === projectDetailsModal) {
      projectDetailsModal.style.display = 'none';
      projectDetailsContent.innerHTML = '';
    }
  });

  // Render Projects
  function renderProjects(filteredProjects = null) {
    const projectsContainer = document.getElementById('projects');
    projectsContainer.innerHTML = '';

    const layoutStyle = localStorage.getItem('layoutStyle') || 'grid';
    if (layoutStyle === 'list') {
      projectsContainer.classList.add('list-view');
    } else {
      projectsContainer.classList.remove('list-view');
    }

    const projectsToRender = filteredProjects || projects;

    // Group projects by originalProjectId
    const projectGroups = {};
    projectsToRender.forEach((project) => {
      const groupId = project.originalProjectId || project.id;
      if (!projectGroups[groupId]) {
        projectGroups[groupId] = [];
      }
      projectGroups[groupId].push(project);
    });

    for (const groupId in projectGroups) {
      const groupProjects = projectGroups[groupId];
      const groupContainer = document.createElement('div');
      groupContainer.classList.add('project-group');

      // Display group title (original project name)
      const originalProject = projects.find((p) => p.id === groupId) || groupProjects[0];
      const groupTitle = document.createElement('div');
      groupTitle.classList.add('project-group-title');
      groupTitle.textContent = originalProject.name;
      groupContainer.appendChild(groupTitle);

      const projectCardsContainer = document.createElement('div');
      projectCardsContainer.classList.add('project-cards-container');
      projectCardsContainer.style.display = 'flex';
      projectCardsContainer.style.flexWrap = 'wrap';
      projectCardsContainer.style.gap = '20px';

      groupProjects.forEach((project) => {
        const projectCard = createProjectCard(project);
        projectCardsContainer.appendChild(projectCard);
      });

      groupContainer.appendChild(projectCardsContainer);
      projectsContainer.appendChild(groupContainer);
    }
  }

  function createProjectCard(project) {
    const projectCard = document.createElement('div');
    projectCard.classList.add('project-card');
    projectCard.setAttribute('data-project-id', project.id);

    let timersHTML = '';
    if (project.activeOperations) {
      timersHTML = '<div class="employee-timers">';
      for (const [employeeName, timerData] of Object.entries(project.activeOperations)) {
        const duration = Date.now() - timerData.logEntry.startTime;
        timersHTML += `<div class="employee-timer" data-employee-name="${employeeName}">
          ${employeeName}: ${formatDuration(duration)}
          <button class="stop-employee-btn btn-secondary" data-employee-name="${employeeName}">Stop</button>
        </div>`;
      }
      timersHTML += '</div>';
    }

    projectCard.innerHTML = `
      <h3>${project.name}</h3>
      <div class="project-details">
        <p><strong>Purchase Order:</strong> ${project.purchaseOrder}</p>
        <p><strong>Part Number:</strong> ${project.partNumber}</p>
        <p><strong>Job Number:</strong> ${project.jobNumber}</p>
        <p><strong>Due Date:</strong> ${project.dueDate}</p>
        <p><strong>Quantity:</strong> ${project.quantity}</p>
        <p><strong>Notes:</strong> ${project.notes}</p>
        <p><strong>Assigned Employees:</strong> ${project.assignedEmployees.join(', ')}</p>
        <p><strong>Priority:</strong> ${project.priority}</p>
        <p><strong>Status:</strong> ${project.status}</p>
        ${timersHTML}
      </div>
      <div class="action-buttons">
        <button class="start-employee-btn">Start Operation</button>
        <button class="view-details-btn">View Details</button>
        <button class="print-btn">Print</button>
        <button class="copy-btn">Copy</button>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;

    // Event Listeners for Project Actions
    const startEmployeeBtn = projectCard.querySelector('.start-employee-btn');
    const stopEmployeeBtns = projectCard.querySelectorAll('.stop-employee-btn');
    const viewDetailsBtn = projectCard.querySelector('.view-details-btn');
    const printBtn = projectCard.querySelector('.print-btn');
    const copyBtn = projectCard.querySelector('.copy-btn');
    const editBtn = projectCard.querySelector('.edit-btn');
    const deleteBtn = projectCard.querySelector('.delete-btn');

    startEmployeeBtn.addEventListener('click', () => {
      showEmployeeOperationModal(project.id);
    });

    stopEmployeeBtns.forEach((btn) => {
      const employeeName = btn.getAttribute('data-employee-name');
      btn.addEventListener('click', () => {
        stopEmployeeOperation(project.id, employeeName);
      });
    });

    viewDetailsBtn.addEventListener('click', () => {
      showProjectDetails(project);
    });

    printBtn.addEventListener('click', () => {
      printProjectDetails(project);
    });

    copyBtn.addEventListener('click', () => {
      copyProject(project);
    });

    editBtn.addEventListener('click', () => {
      editProject(project);
    });

    deleteBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this project?')) {
        // Stop all active operations
        if (project.activeOperations) {
          for (const employeeName of Object.keys(project.activeOperations)) {
            stopEmployeeOperation(project.id, employeeName);
          }
        }
        projects = projects.filter((p) => p.id !== project.id);
        saveData();
        renderProjects();
      }
    });

    return projectCard;
  }

  // Start Employee Operation Timer
  function startEmployeeOperation(projectId, employeeName, operation) {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      if (!project.activeOperations) {
        project.activeOperations = {};
      }
      if (!project.activeOperations[employeeName]) {
        const logEntry = {
          projectId: project.id,
          projectName: project.name,
          operation,
          employee: employeeName,
          startTime: Date.now(),
          endTime: null,
          duration: 0,
        };
        workLogs.push(logEntry);
        project.activeOperations[employeeName] = {
          intervalId: null,
          logEntry: logEntry,
        };

        // Update project status
        project.status = 'In Progress';

        saveData();
        renderProjects();

        // Start timer
        project.activeOperations[employeeName].intervalId = setInterval(() => {
          const now = Date.now();
          logEntry.duration = now - logEntry.startTime;
          saveData();
          updateEmployeeTimerDisplay(projectId, employeeName, logEntry.duration);
        }, 1000);
      }
    }
  }

  // Stop Employee Operation Timer
  function stopEmployeeOperation(projectId, employeeName) {
    const project = projects.find((p) => p.id === projectId);
    if (project && project.activeOperations && project.activeOperations[employeeName]) {
      const timer = project.activeOperations[employeeName];
      clearInterval(timer.intervalId);
      timer.logEntry.endTime = Date.now();
      timer.logEntry.duration = timer.logEntry.endTime - timer.logEntry.startTime;

      saveData();
      renderProjects();
      renderWorkLogs();

      // Remove from active operations
      delete project.activeOperations[employeeName];

      // If no more active operations, update project status
      if (Object.keys(project.activeOperations).length === 0) {
        delete project.activeOperations;
        project.status = 'Not Started';
      }
    }
  }

  // Update the timer display for an employee on the project card
  function updateEmployeeTimerDisplay(projectId, employeeName, duration) {
    const timerDisplay = document.querySelector(
      `.project-card[data-project-id="${projectId}"] .employee-timer[data-employee-name="${employeeName}"]`
    );
    if (timerDisplay) {
      timerDisplay.childNodes[0].nodeValue = `${employeeName}: ${formatDuration(duration)}`;
    }
  }

  // Render Employees
  function renderEmployees(filteredEmployees = null) {
    const employeesContainer = document.getElementById('employees');
    employeesContainer.innerHTML = '';

    const employeesToRender = filteredEmployees || employees;

    employeesToRender.forEach((employee, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="employee-name">${employee.name}</span>
        <button class="delete-btn btn-danger">Delete</button>
      `;

      const deleteBtn = li.querySelector('.delete-btn');
      deleteBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this employee?')) {
          employees.splice(index, 1);
          saveData();
          renderEmployees();
        }
      });

      employeesContainer.appendChild(li);
    });
  }

  // Render Work Logs
  function renderWorkLogs(filteredLogs = null) {
    const workLogEntries = document.getElementById('work-log-entries');
    workLogEntries.innerHTML = '';

    const logsToRender = filteredLogs || workLogs;

    logsToRender.forEach((log, index) => {
      const entry = document.createElement('div');
      entry.classList.add('work-log-entry');

      entry.innerHTML = `
        <h4>${log.projectName}</h4>
        <p><strong>Operation:</strong> ${log.operation}</p>
        <p><strong>Employee:</strong> ${log.employee}</p>
        <p><strong>Start Time:</strong> ${new Date(log.startTime).toLocaleString()}</p>
        <p><strong>End Time:</strong> ${log.endTime ? new Date(log.endTime).toLocaleString() : 'In Progress'}</p>
        <p><strong>Duration:</strong> ${formatDuration(log.duration)}</p>
        <button class="delete-log-btn btn-danger">Delete</button>
      `;

      const deleteLogBtn = entry.querySelector('.delete-log-btn');
      deleteLogBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this log entry?')) {
          workLogs.splice(index, 1);
          saveData();
          renderWorkLogs();
        }
      });

      workLogEntries.appendChild(entry);
    });
  }

  // Helper Functions
  function generateId() {
    return 'id-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  }

  function loadEmployeesToSelect(selectElement) {
    selectElement.innerHTML = '';
    employees.forEach((employee) => {
      const option = document.createElement('option');
      option.value = employee.name;
      option.textContent = employee.name;
      selectElement.appendChild(option);
    });
  }

  function formatDuration(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  // Edit Project
  function editProject(project) {
    loadEmployeesToSelect(document.getElementById('project-employees'));

    document.getElementById('project-name').value = project.name;
    document.getElementById('purchase-order').value = project.purchaseOrder;
    document.getElementById('part-number').value = project.partNumber;
    document.getElementById('job-number').value = project.jobNumber;
    document.getElementById('due-date').value = project.dueDate;
    document.getElementById('quantity').value = project.quantity;
    document.getElementById('notes').value = project.notes;
    document.getElementById('project-priority').value = project.priority;

    const projectEmployeesSelect = document.getElementById('project-employees');
    Array.from(projectEmployeesSelect.options).forEach((option) => {
      option.selected = project.assignedEmployees.includes(option.value);
    });

    projectModal.style.display = 'block';

    saveProjectBtn.removeEventListener('click', saveNewProject);
    saveProjectBtn.addEventListener('click', saveEditedProject);

    function saveEditedProject() {
      project.name = document.getElementById('project-name').value;
      project.purchaseOrder = document.getElementById('purchase-order').value;
      project.partNumber = document.getElementById('part-number').value;
      project.jobNumber = document.getElementById('job-number').value;
      project.dueDate = document.getElementById('due-date').value;
      project.quantity = document.getElementById('quantity').value;
      project.notes = document.getElementById('notes').value;
      project.assignedEmployees = Array.from(projectEmployeesSelect.selectedOptions).map(
        (option) => option.value
      );
      project.priority = document.getElementById('project-priority').value;

      saveData();
      renderProjects();
      projectModal.style.display = 'none';
      projectForm.reset();

      saveProjectBtn.removeEventListener('click', saveEditedProject);
      saveProjectBtn.addEventListener('click', saveNewProject);
    }

    function saveNewProject() {
      // Placeholder for adding a new project
    }
  }

  // Replace the saveProjectBtn event listener with saveNewProject after editing
  function saveNewProject() {
    // Placeholder for adding a new project
  }

  // Show Project Details
  function showProjectDetails(project) {
    projectDetailsModal.style.display = 'block';
    projectDetailsContent.innerHTML = `
      <h2>Project Details: ${project.name}</h2>
      <p><strong>Purchase Order:</strong> ${project.purchaseOrder}</p>
      <p><strong>Part Number:</strong> ${project.partNumber}</p>
      <p><strong>Job Number:</strong> ${project.jobNumber}</p>
      <p><strong>Due Date:</strong> ${project.dueDate}</p>
      <p><strong>Quantity:</strong> ${project.quantity}</p>
      <p><strong>Notes:</strong> ${project.notes}</p>
      <p><strong>Assigned Employees:</strong> ${project.assignedEmployees.join(', ')}</p>
      <p><strong>Priority:</strong> ${project.priority}</p>
      <p><strong>Status:</strong> ${project.status}</p>
      <!-- Add any additional project details you want to include -->
    `;
  }

  // Copy Project
  function copyProject(originalProject) {
    const newProject = { ...originalProject, id: generateId(), name: originalProject.name + ' (Copy)' };
    newProject.originalProjectId = originalProject.originalProjectId || originalProject.id;
    projects.push(newProject);
    saveData();
    renderProjects();
  }

  // Print Project Details
  function printProjectDetails(project) {
    const printWindow = window.open('', '_blank');
    const projectDetailsHTML = `
      <html>
      <head>
        <title>Print Project Details</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: ${getComputedStyle(document.documentElement).getPropertyValue('--primary-color')}; }
          p { font-size: 14px; }
        </style>
      </head>
      <body>
        <h1>Project Details: ${project.name}</h1>
        <p><strong>Purchase Order:</strong> ${project.purchaseOrder}</p>
        <p><strong>Part Number:</strong> ${project.partNumber}</p>
        <p><strong>Job Number:</strong> ${project.jobNumber}</p>
        <p><strong>Due Date:</strong> ${project.dueDate}</p>
        <p><strong>Quantity:</strong> ${project.quantity}</p>
        <p><strong>Notes:</strong> ${project.notes}</p>
        <p><strong>Assigned Employees:</strong> ${project.assignedEmployees.join(', ')}</p>
        <p><strong>Priority:</strong> ${project.priority}</p>
        <p><strong>Status:</strong> ${project.status}</p>
        <!-- Add any additional project details you want to include -->
      </body>
      </html>
    `;
    printWindow.document.write(projectDetailsHTML);
    printWindow.document.close();
    printWindow.print();
  }

  // Clear Data
  const clearDataBtn = document.getElementById('clear-data-btn');
  clearDataBtn.addEventListener('click', () => {
    const password = prompt('Enter the password to clear all data:');
    if (password === 'YourPasswordHere') {
      localStorage.clear();
      projects = [];
      employees = [];
      operations = [];
      workLogs = [];
      saveData();
      renderProjects();
      renderEmployees();
      renderWorkLogs();
      alert('All data has been cleared.');
    } else {
      alert('Incorrect password. Data not cleared.');
    }
  });

  // Export Data
  const exportDataBtn = document.getElementById('export-data-btn');
  exportDataBtn.addEventListener('click', () => {
    const data = {
      projects,
      employees,
      operations,
      workLogs,
    };
    const dataStr = JSON.stringify(data);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  // Import Data
  const importDataBtn = document.getElementById('import-data-btn');
  const fileInput = document.getElementById('file-input');

  importDataBtn.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          projects = data.projects || [];
          employees = data.employees || [];
          operations = data.operations || [];
          workLogs = data.workLogs || [];
          saveData();
          renderProjects();
          renderEmployees();
          renderWorkLogs();
          alert('Data imported successfully.');
        } catch (error) {
          alert('Invalid data file.');
        }
      };
      reader.readAsText(file);
    } else {
      alert('Please select a valid JSON file.');
    }
  });

  // Search Projects
  const projectSearchInput = document.getElementById('project-search-input');
  projectSearchInput.addEventListener('input', () => {
    const searchTerm = projectSearchInput.value.toLowerCase();
    const filteredProjects = projects.filter((project) =>
      project.name.toLowerCase().includes(searchTerm)
    );
    renderProjects(filteredProjects);
  });

  // Search Employees
  const employeeSearchInput = document.getElementById('employee-search-input');
  employeeSearchInput.addEventListener('input', () => {
    const searchTerm = employeeSearchInput.value.toLowerCase();
    const filteredEmployees = employees.filter((employee) =>
      employee.name.toLowerCase().includes(searchTerm)
    );
    renderEmployees(filteredEmployees);
  });

  // Search Work Logs
  const workLogSearchInput = document.getElementById('work-log-search-input');
  workLogSearchInput.addEventListener('input', () => {
    const searchTerm = workLogSearchInput.value.toLowerCase();
    const filteredLogs = workLogs.filter((log) =>
      log.projectName.toLowerCase().includes(searchTerm)
    );
    renderWorkLogs(filteredLogs);
  });
});

// Check authentication
function checkAuth() {
  const isAuthenticated = sessionStorage.getItem('admin_auth') === 'true';
  if (!isAuthenticated) {
    window.location.href = '/admin-login.html';
  }
}

// Logout function
function logout() {
  sessionStorage.removeItem('admin_auth');
  window.location.href = '/admin-login.html';
}

// Tab management
function initTabs() {
  const tabList = document.querySelector('[role="tablist"]');
  const tabs = document.querySelectorAll('[role="tab"]');
  const panels = document.querySelectorAll('[role="tabpanel"]');

  // Handle tab clicks
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      switchTab(tab);
    });

    // Handle keyboard navigation
    tab.addEventListener('keydown', (e) => {
      let targetTab = null;

      if (e.key === 'ArrowRight') {
        targetTab = tab.nextElementSibling || tabs[0];
      } else if (e.key === 'ArrowLeft') {
        targetTab = tab.previousElementSibling || tabs[tabs.length - 1];
      } else if (e.key === 'Home') {
        targetTab = tabs[0];
      } else if (e.key === 'End') {
        targetTab = tabs[tabs.length - 1];
      }

      if (targetTab) {
        e.preventDefault();
        switchTab(targetTab);
        targetTab.focus();
      }
    });
  });

  function switchTab(newTab) {
    const target = newTab.getAttribute('aria-controls');

    // Update all tabs
    tabs.forEach(tab => {
      const isSelected = tab === newTab;
      tab.setAttribute('aria-selected', isSelected);
      tab.setAttribute('tabindex', isSelected ? '0' : '-1');
    });

    // Update all panels
    panels.forEach(panel => {
      const isVisible = panel.id === target;
      panel.setAttribute('aria-hidden', !isVisible);
    });

    // Load projects when switching to manage tab
    if (target === 'manage-projects-panel') {
      loadProjects();
    }
  }
}

// Alert management
function showAlert(message, type = 'info') {
  const container = document.getElementById('alert-container');
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;

  container.innerHTML = '';
  container.appendChild(alert);

  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    alert.remove();
  }, 5000);

  // Announce to screen readers
  container.setAttribute('aria-live', 'assertive');
  setTimeout(() => {
    container.setAttribute('aria-live', 'polite');
  }, 100);
}

// Load available tags
async function loadTags() {
  try {
    const response = await fetch('/api/getTagOptions');
    const data = await response.json();

    const container = document.getElementById('tag-checkboxes');
    container.innerHTML = '';

    if (data.tagOptions && data.tagOptions.length > 0) {
      data.tagOptions.forEach(tag => {
        const label = document.createElement('label');
        label.className = 'tag-checkbox';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'tags';
        checkbox.value = tag.name;
        checkbox.id = `tag-${tag.name.replace(/\s+/g, '-')}`;

        const span = document.createElement('span');
        span.textContent = tag.name;

        label.appendChild(checkbox);
        label.appendChild(span);
        container.appendChild(label);
      });
    } else {
      container.innerHTML = '<p class="help-text">No tags available</p>';
    }
  } catch (error) {
    console.error('Error loading tags:', error);
    showAlert('Failed to load tags', 'error');
  }
}

// Handle add project form submission
async function handleAddProject(e) {
  e.preventDefault();

  const form = e.target;
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;

  // Disable button and show loading state
  submitButton.disabled = true;
  submitButton.textContent = 'Adding...';
  submitButton.setAttribute('aria-busy', 'true');

  try {
    // Gather form data
    const formData = new FormData(form);
    const tags = Array.from(formData.getAll('tags'));

    // Get content from Markdown editor
    const content = addContentEditor ? addContentEditor.value() : formData.get('content');

    const projectData = {
      name: formData.get('name'),
      slug: formData.get('slug'),
      description: formData.get('description'),
      content: content,
      type: formData.get('type'),
      titleImage: formData.get('titleImage'),
      ordering: formData.get('ordering') || null,
      tags: tags
    };

    // Send to API
    const response = await fetch('/api/addProject', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(projectData)
    });

    const result = await response.json();

    if (response.ok && result.success) {
      showAlert('Project added successfully!', 'success');
      form.reset();

      // Announce success to screen readers
      submitButton.setAttribute('aria-label', 'Project added successfully');
      setTimeout(() => {
        submitButton.setAttribute('aria-label', 'Add Project');
      }, 3000);
    } else {
      throw new Error(result.error || 'Failed to add project');
    }
  } catch (error) {
    console.error('Error adding project:', error);
    showAlert(`Error: ${error.message}`, 'error');
  } finally {
    // Re-enable button
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
    submitButton.setAttribute('aria-busy', 'false');
  }
}

// Load and display projects
async function loadProjects() {
  const container = document.getElementById('projects-list');
  container.setAttribute('aria-busy', 'true');
  container.innerHTML = '<div class="loading">Loading projects...</div>';

  try {
    const response = await fetch('/api/fetchNotion');
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      container.innerHTML = '<p>No projects found.</p>';
      container.setAttribute('aria-busy', 'false');
      return;
    }

    // Sort by ordering
    const projects = data.results.sort((a, b) => {
      const orderA = a.properties.ordering?.number || 999;
      const orderB = b.properties.ordering?.number || 999;
      return orderA - orderB;
    });

    // Store projects globally for editing
    allProjects = projects;

    container.innerHTML = '';

    projects.forEach(project => {
      const card = createProjectCard(project);
      container.appendChild(card);
    });

    container.setAttribute('aria-busy', 'false');
  } catch (error) {
    console.error('Error loading projects:', error);
    container.innerHTML = '<p class="alert alert-error">Failed to load projects. Please try again.</p>';
    container.setAttribute('aria-busy', 'false');
  }
}

// Create project card element
function createProjectCard(project) {
  const card = document.createElement('article');
  card.className = 'project-card';
  card.setAttribute('aria-labelledby', `project-title-${project.id}`);

  const title = project.properties.Name?.title?.[0]?.plain_text || 'Untitled';
  const description = project.properties.description?.rich_text?.[0]?.plain_text || 'No description';
  const type = project.properties.type?.select?.name || 'Project';
  const ordering = project.properties.ordering?.number || 'N/A';
  const status = project.properties.Status?.status?.name || 'unknown';
  const tags = project.properties.tag?.multi_select || [];

  card.innerHTML = `
    <h3 id="project-title-${project.id}">${title}</h3>
    <p><strong>Type:</strong> ${type}</p>
    <p><strong>Status:</strong> ${status}</p>
    <p><strong>Order:</strong> ${ordering}</p>
    <p><strong>Description:</strong> ${description}</p>
    ${tags.length > 0 ? `<p><strong>Tags:</strong> ${tags.map(t => t.name).join(', ')}</p>` : ''}
    <div class="project-actions">
      <button
        class="btn-secondary"
        onclick="editProject('${project.id}')"
        aria-label="Edit ${title}"
      >
        Edit
      </button>
      <button
        class="btn-danger"
        onclick="deleteProject('${project.id}', '${title.replace(/'/g, "\\'")}')"
        aria-label="Delete ${title}"
      >
        Delete
      </button>
    </div>
  `;

  return card;
}

// Store all projects for editing
let allProjects = [];

// Markdown editors
let addContentEditor = null;
let editContentEditor = null;

// Edit project
window.editProject = async function(projectId) {
  // Find the project data
  const project = allProjects.find(p => p.id === projectId);

  if (!project) {
    showAlert('Project not found', 'error');
    return;
  }

  // Populate the edit form
  const title = project.properties.Name?.title?.[0]?.plain_text || '';
  const slug = project.properties.slug?.rich_text?.[0]?.plain_text || '';
  const description = project.properties.description?.rich_text?.[0]?.plain_text || '';
  const type = project.properties.type?.select?.name || '';
  const titleImage = project.properties.titleImage?.files?.[0]?.external?.url ||
                     project.properties.titleImage?.files?.[0]?.file?.url || '';
  const ordering = project.properties.ordering?.number || '';
  const status = project.properties.Status?.status?.name || 'done';
  const tags = project.properties.tag?.multi_select || [];

  // Set form values
  document.getElementById('edit-project-id').value = projectId;
  document.getElementById('edit-project-name').value = title;
  document.getElementById('edit-project-slug').value = slug;
  document.getElementById('edit-project-description').value = description;
  document.getElementById('edit-project-type').value = type;
  document.getElementById('edit-project-title-image').value = titleImage;
  document.getElementById('edit-project-ordering').value = ordering;
  document.getElementById('edit-project-status').value = status;

  // Fetch page content from blocks
  try {
    const contentResponse = await fetch(`/api/getPageContent?pageId=${projectId}`);
    const contentData = await contentResponse.json();

    const content = contentData.success ? contentData.content : '';

    // Set Markdown editor value for content
    if (editContentEditor) {
      editContentEditor.value(content);
    } else {
      document.getElementById('edit-project-content').value = content;
    }
  } catch (error) {
    console.error('Error fetching page content:', error);
    // Set empty content if fetch fails
    if (editContentEditor) {
      editContentEditor.value('');
    } else {
      document.getElementById('edit-project-content').value = '';
    }
  }

  // Load tags for edit form
  await loadEditTags(tags);

  // Open modal
  openEditModal();

  // Announce to screen readers
  showAlert(`Editing project: ${title}`, 'info');
};

// Open edit modal
function openEditModal() {
  const modal = document.getElementById('edit-modal');
  modal.setAttribute('aria-hidden', 'false');

  // Focus the first input
  setTimeout(() => {
    document.getElementById('edit-project-name').focus();
  }, 100);

  // Trap focus in modal
  modal.addEventListener('keydown', handleModalKeydown);
}

// Close edit modal
window.closeEditModal = function() {
  const modal = document.getElementById('edit-modal');
  modal.setAttribute('aria-hidden', 'true');
  modal.removeEventListener('keydown', handleModalKeydown);
};

// Handle modal keyboard navigation
function handleModalKeydown(e) {
  if (e.key === 'Escape') {
    closeEditModal();
  }
}

// Load tags for edit form
async function loadEditTags(selectedTags) {
  try {
    const response = await fetch('/api/getTagOptions');
    const data = await response.json();

    const container = document.getElementById('edit-tag-checkboxes');
    container.innerHTML = '';

    if (data.tagOptions && data.tagOptions.length > 0) {
      data.tagOptions.forEach(tag => {
        const label = document.createElement('label');
        label.className = 'tag-checkbox';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'tags';
        checkbox.value = tag.name;
        checkbox.id = `edit-tag-${tag.name.replace(/\s+/g, '-')}`;

        // Check if this tag is selected
        if (selectedTags.some(t => t.name === tag.name)) {
          checkbox.checked = true;
        }

        const span = document.createElement('span');
        span.textContent = tag.name;

        label.appendChild(checkbox);
        label.appendChild(span);
        container.appendChild(label);
      });
    }
  } catch (error) {
    console.error('Error loading tags for edit:', error);
  }
}

// Handle update project
window.handleUpdateProject = async function() {
  const form = document.getElementById('edit-project-form');
  const formData = new FormData(form);

  const updateButton = event.target;
  const originalText = updateButton.textContent;

  updateButton.disabled = true;
  updateButton.textContent = 'Updating...';
  updateButton.setAttribute('aria-busy', 'true');

  try {
    // Gather checked tags
    const tags = Array.from(document.querySelectorAll('#edit-tag-checkboxes input[type="checkbox"]:checked'))
      .map(cb => cb.value);

    // Get content from Markdown editor
    const content = editContentEditor ? editContentEditor.value() : formData.get('content');

    const projectData = {
      pageId: formData.get('pageId'),
      name: formData.get('name'),
      slug: formData.get('slug'),
      description: formData.get('description'),
      content: content,
      type: formData.get('type'),
      titleImage: formData.get('titleImage'),
      ordering: formData.get('ordering') || null,
      status: formData.get('status'),
      tags: tags
    };

    const response = await fetch('/api/updateProject', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(projectData)
    });

    const result = await response.json();

    if (response.ok && result.success) {
      showAlert('Project updated successfully!', 'success');
      closeEditModal();
      loadProjects(); // Reload the projects list
    } else {
      throw new Error(result.error || 'Failed to update project');
    }
  } catch (error) {
    console.error('Error updating project:', error);
    showAlert(`Error: ${error.message}`, 'error');
  } finally {
    updateButton.disabled = false;
    updateButton.textContent = originalText;
    updateButton.setAttribute('aria-busy', 'false');
  }
};

// Delete project
window.deleteProject = async function(projectId, projectName) {
  const confirmDelete = confirm(`Are you sure you want to delete "${projectName}"? This action cannot be undone.`);

  if (!confirmDelete) {
    return;
  }

  try {
    const response = await fetch('/api/deleteProject', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ pageId: projectId })
    });

    const result = await response.json();

    if (response.ok && result.success) {
      showAlert(`"${projectName}" has been deleted successfully.`, 'success');
      loadProjects(); // Reload the list
    } else {
      throw new Error(result.error || 'Failed to delete project');
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    showAlert(`Error deleting project: ${error.message}`, 'error');
  }
};

// Initialize Markdown editors
function initMarkdownEditors() {
  // Initialize add project content editor
  if (document.getElementById('project-content')) {
    addContentEditor = new EasyMDE({
      element: document.getElementById('project-content'),
      spellChecker: false,
      placeholder: 'Write your full project content using Markdown...\n\n## Example Heading\n\nYou can use **bold**, *italic*, and more!',
      toolbar: [
        'bold', 'italic', 'heading', '|',
        'quote', 'unordered-list', 'ordered-list', '|',
        'link', 'image', '|',
        'code', 'table', 'horizontal-rule', '|',
        'preview', 'side-by-side', 'fullscreen', '|',
        'guide'
      ],
      status: ['lines', 'words', 'cursor'],
      hideIcons: ['guide'],
      showIcons: ['code', 'table'],
      minHeight: '400px',
      renderingConfig: {
        singleLineBreaks: false,
        codeSyntaxHighlighting: true
      }
    });
  }

  // Initialize edit project content editor
  if (document.getElementById('edit-project-content')) {
    editContentEditor = new EasyMDE({
      element: document.getElementById('edit-project-content'),
      spellChecker: false,
      placeholder: 'Write your full project content using Markdown...',
      toolbar: [
        'bold', 'italic', 'heading', '|',
        'quote', 'unordered-list', 'ordered-list', '|',
        'link', 'image', '|',
        'code', 'table', 'horizontal-rule', '|',
        'preview', 'side-by-side', 'fullscreen', '|',
        'guide'
      ],
      status: ['lines', 'words', 'cursor'],
      hideIcons: ['guide'],
      showIcons: ['code', 'table'],
      minHeight: '400px',
      renderingConfig: {
        singleLineBreaks: false,
        codeSyntaxHighlighting: true
      }
    });
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Check authentication first
  checkAuth();

  initTabs();
  loadTags();

  // Initialize Markdown editors after page load
  setTimeout(initMarkdownEditors, 100);

  // Setup form submission
  const addProjectForm = document.getElementById('add-project-form');
  addProjectForm.addEventListener('submit', handleAddProject);

  // Setup refresh button
  const refreshButton = document.getElementById('refresh-projects');
  refreshButton.addEventListener('click', loadProjects);

  // Auto-generate slug from name
  const nameInput = document.getElementById('project-name');
  const slugInput = document.getElementById('project-slug');

  nameInput.addEventListener('input', (e) => {
    if (!slugInput.value) {
      const slug = e.target.value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      slugInput.value = slug;
    }
  });
});

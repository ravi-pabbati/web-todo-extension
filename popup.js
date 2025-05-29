// Function to save TODO
async function saveTodo() {
  const priority = document.getElementById('priority').value;
  
  // Get current tab URL and title
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab.url;
  const title = tab.title || ''; // Get the page title
  
  // Get existing todos
  const { todos = [] } = await chrome.storage.local.get('todos');
   // Add new todo with hostname for favicon and title
  const hostname = new URL(url).hostname;
  todos.unshift({ 
    url, 
    priority, 
    id: Date.now(),
    hostname,
    title
  });

  // Save updated todos
  await chrome.storage.local.set({ todos });
  
  // Switch to the corresponding tab
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  // Remove active class from all tabs and contents
  tabs.forEach(tab => tab.classList.remove('active'));
  tabContents.forEach(content => content.classList.remove('active'));
  
  // Activate the corresponding tab and content
  const newTab = document.querySelector(`[data-priority="${priority}"]`);
  const newContent = document.getElementById(`${priority}List`);
  newTab.classList.add('active');
  newContent.classList.add('active');
  
  // Refresh the display
  displayTodos();
}

// Function to delete TODO
async function deleteTodo(id) {
  const { todos = [] } = await chrome.storage.local.get('todos');
  const updatedTodos = todos.filter(todo => todo.id !== id);
  await chrome.storage.local.set({ todos: updatedTodos });
  displayTodos();
}

// Function to display TODOs
async function displayTodos() {
  const { todos = [] } = await chrome.storage.local.get('todos');
  
  // Clear all lists
  ['P1', 'P2', 'P3'].forEach(priority => {
    document.getElementById(`${priority}List`).innerHTML = '';
  });
  
  // Group todos by priority
  const todosByPriority = todos.reduce((acc, todo) => {
    if (!acc[todo.priority]) {
      acc[todo.priority] = [];
    }
    acc[todo.priority].push(todo);
    return acc;
  }, {});
  
  // Update count for each priority
  ['P1', 'P2', 'P3'].forEach(priority => {
    const count = (todosByPriority[priority] || []).length;
    const countSpan = document.querySelector(`[data-priority="${priority}"] .tab-count`);
    if (countSpan) {
      countSpan.textContent = count;
    }
  });
  
  // Display todos in their respective tabs
  Object.entries(todosByPriority).forEach(([priority, priorityTodos]) => {
    const priorityList = document.getElementById(`${priority}List`);
    
    priorityTodos.forEach(todo => {
      const todoItem = document.createElement('div');
      todoItem.className = 'todo-item';
      
      const link = document.createElement('a');
      link.href = todo.url;
      link.className = 'todo-link';
      
      // Create favicon image
      const favicon = document.createElement('img');
      favicon.className = 'favicon';
      favicon.src = `https://www.google.com/s2/favicons?domain=${todo.hostname}&sz=16`;
      favicon.alt = '';
      
      // Create container for text
      const textContainer = document.createElement('span');
      textContainer.className = 'todo-text';
      
      // Add title and hostname
      const titleText = document.createElement('span');
      titleText.className = 'todo-title';
      titleText.textContent = todo.title || todo.hostname;
      
      const hostnameText = document.createElement('span');
      hostnameText.className = 'todo-hostname';
      hostnameText.textContent = ` - ${todo.hostname}`;
      
      // Combine all elements
      textContainer.appendChild(titleText);
      textContainer.appendChild(hostnameText);
      link.appendChild(favicon);
      link.appendChild(textContainer);
      
      link.addEventListener('click', (e) => {
        e.preventDefault();
        chrome.tabs.create({ url: todo.url });
      });
      
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => deleteTodo(todo.id));
      
      todoItem.appendChild(link);
      todoItem.appendChild(deleteButton);
      priorityList.appendChild(todoItem);
    });
  });
}

// Function to switch tabs
function switchTab(event) {
  // Always get the parent tab element
  const tabElement = event.target.closest('.tab');
  if (!tabElement) return; // Safety check

  // Remove active class from all tabs and content
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

  // Add active class to clicked tab and corresponding content
  tabElement.classList.add('active');
  const priority = tabElement.dataset.priority;
  const priorityList = document.getElementById(`${priority}List`);

  if (priorityList) {
    priorityList.classList.add('active');
  } else {
    console.error(`No element found for ID: ${priority}List`);
  }
}


// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Save button listener
  document.getElementById('saveButton').addEventListener('click', saveTodo);
  
  // Tab switching listeners
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', switchTab);
  });
  
  // Initial display
  displayTodos();
});

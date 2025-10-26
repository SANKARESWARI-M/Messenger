

const username = localStorage.getItem('ml_username');
const myStatus = localStorage.getItem('ml_status') || '';
if (!username) {
  window.location.href = 'index.html';
}

const contacts = [
  { id: 'Amar', name: 'Amar', status: 'Online' },
  { id: 'Stella', name: 'Stella ', status: 'Away' },
  { id: 'Riya', name: 'Riya', status: 'Busy' },
  { id: 'sana', name: 'Sana Khan', status: 'Online' }
];


let activeContact = null;

const meNameEl = document.getElementById('meName');
const meStatusEl = document.getElementById('meStatus');
const contactsListEl = document.getElementById('contactsList');
const messagesEl = document.getElementById('messages');
const chatNameEl = document.getElementById('chatName');
const chatStatusEl = document.getElementById('chatStatus');
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const contactSearch = document.getElementById('contactSearch');
const darkToggle = document.getElementById('darkToggle');
const logoutBtn = document.getElementById('logoutBtn');
const callBtn = document.getElementById('callBtn');
const videoBtn = document.getElementById('videoBtn');
const fileInput = document.getElementById('fileInput');

// Profile modal
const profileModal = document.getElementById('profileModal');
const closeModal = document.getElementById('closeModal');
const profilePic = document.querySelector('.avatar');
const profileNameEl = document.getElementById('profileName');
const profileStatusEl = document.getElementById('profileStatus');
const profileImageInput = document.getElementById('profileImageInput');
const profileImagePreview = document.getElementById('profileImagePreview');
const saveProfileBtn = document.getElementById('saveProfile');


meNameEl.textContent = username;
meStatusEl.textContent = myStatus;


if (localStorage.getItem('ml_dark') === '1') document.body.classList.add('dark');
darkToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('ml_dark', document.body.classList.contains('dark') ? '1' : '0');
});

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('ml_username');
  localStorage.removeItem('ml_status');
  window.location.href = 'login.html';
});

callBtn.addEventListener('click', () => alert('calling..'));
videoBtn.addEventListener('click', () => alert('Video calling..'));


function loadMessages(contactId) {
  return JSON.parse(localStorage.getItem('ml_messages_' + contactId) || '[]');
}
function saveMessages(contactId, arr) {
  localStorage.setItem('ml_messages_' + contactId, JSON.stringify(arr));
}

function renderContacts(filter = '') {
  contactsListEl.innerHTML = '';
  const f = filter.trim().toLowerCase();
  contacts.forEach(c => {
    if (f && !c.name.toLowerCase().includes(f)) return;
    const container = document.createElement('div');
    container.className = 'contact-item';
    container.dataset.id = c.id;

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = c.name.split(' ').map(s => s[0]).slice(0,2).join('');

    const meta = document.createElement('div');
    meta.style.flex = '1';
    const title = document.createElement('div');
    title.className = 'name';
    title.textContent = c.name;
    const last = document.createElement('div');
    last.className = 'last small muted';

    const msgs = loadMessages(c.id);
    if (msgs.length) {
      const lastMsg = msgs[msgs.length-1];
      last.textContent = (lastMsg.from === username ? 'You: ' : '') + (lastMsg.text.slice(0,30)) + (lastMsg.text.length>30 ? '…' : '');
    } else {
      last.textContent = 'No messages yet';
    }

    meta.appendChild(title);
    meta.appendChild(last);

    const right = document.createElement('div');
    right.className = 'contact-meta';
    const t = document.createElement('div');
    t.textContent = c.status;
    right.appendChild(t);

    container.appendChild(avatar);
    container.appendChild(meta);
    container.appendChild(right);

    container.addEventListener('click', () => openChat(c.id));

    contactsListEl.appendChild(container);
  });
}


function openChat(contactId) {
  activeContact = contacts.find(c => c.id === contactId);
  chatNameEl.textContent = activeContact.name;
  chatStatusEl.textContent = activeContact.status;
  renderMessages();
}


function renderMessages() {
  if (!activeContact) {
    messagesEl.innerHTML = `<div class="small muted" style="padding:20px">Select a contact to start chatting</div>`;
    return;
  }
  const msgs = loadMessages(activeContact.id);
  messagesEl.innerHTML = '';
  msgs.forEach(m => {
    const el = document.createElement('div');
    el.className = 'message ' + (m.from === username ? 'user' : 'other');
    const txt = document.createElement('div');
    txt.textContent = m.text;
    const time = document.createElement('span');
    time.className = 'time';
    time.textContent = new Date(m.time).toLocaleTimeString();
    el.appendChild(txt);
    el.appendChild(time);
    messagesEl.appendChild(el);
  });
 
  messagesEl.scrollTop = messagesEl.scrollHeight;
  renderContacts(contactSearch.value || '');
}

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  sendMessage();
});

function sendMessage(textOverride) {
  if (!activeContact) return alert('Select a contact');
  const text = (textOverride !== undefined) ? textOverride : messageInput.value.trim();
  if (!text) return;
  const msgs = loadMessages(activeContact.id);
  const m = { from: username, text: text, time: Date.now() };
  msgs.push(m);
  saveMessages(activeContact.id, msgs);
  messageInput.value = '';
  renderMessages();

  setTimeout(() => {
    fakeReply(activeContact.id);
  }, 900 + Math.random()*800);
}

function fakeReply(contactId) {
  const contact = contacts.find(c => c.id === contactId);
  if (!contact) return;
  const replies = [
    'Okay!',
    'Thanks — I will check.',
    'Sounds good ',
    'Let me get back to you on that.',
    'Got it.'
  ];
  const replyText = replies[Math.floor(Math.random()*replies.length)];
  const msgs = loadMessages(contactId);
  msgs.push({ from: contact.name, text: replyText, time: Date.now() });
  saveMessages(contactId, msgs);
  if (activeContact && activeContact.id === contactId) renderMessages();
}

messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});


contactSearch.addEventListener('input', () => renderContacts(contactSearch.value));


fileInput.addEventListener('change', (e) => {
  const f = e.target.files && e.target.files[0];
  if (!f) return;
  const name = f.name;
  sendMessage('[file] ' + name);
  fileInput.value = '';
});

renderContacts();
renderMessages();


(function seedDemo() {
  const seedId = contacts[0].id;
  const existing = loadMessages(seedId);
  if (!existing.length) {
    saveMessages(seedId, [
      { from: contacts[0].name, text: 'Hi! This is a demo conversation. Say hi!', time: Date.now() - 60000 },
      { from: username, text: 'Hello! I am testing the messenger.', time: Date.now() - 30000 }
    ]);
  }
})();



profilePic.addEventListener('click', () => {
  profileModal.style.display = 'block';
  profileNameEl.textContent = username;
  profileStatusEl.textContent = myStatus;
  profileImagePreview.src = localStorage.getItem('ml_profile_image') || 'https://via.placeholder.com/100';
});


closeModal.addEventListener('click', () => profileModal.style.display = 'none');
window.addEventListener('click', (e) => {
  if (e.target === profileModal) profileModal.style.display = 'none';
});

profileImageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    profileImagePreview.src = reader.result;
  };
  reader.readAsDataURL(file);
});

saveProfileBtn.addEventListener('click', () => {
  localStorage.setItem('ml_profile_image', profileImagePreview.src);
  profileModal.style.display = 'none';
  profilePic.style.backgroundImage = `url(${profileImagePreview.src})`;
});

const sidebarAvatar = document.getElementById('sidebarAvatar');
const deleteProfilePhoto = document.getElementById('deleteProfilePhoto');


function loadAvatar() {
  const img = localStorage.getItem('ml_profile_image');
  if (img) {
    sidebarAvatar.style.backgroundImage = `url(${img})`;
    sidebarAvatar.textContent = ''; 
    deleteProfilePhoto.style.display = 'flex';
  } else {
    sidebarAvatar.style.backgroundImage = '';
    sidebarAvatar.textContent = '👤';
    deleteProfilePhoto.style.display = 'none';
  }
}
loadAvatar();

sidebarAvatar.addEventListener('click', () => {
  profileModal.style.display = 'block';
  profileNameEl.textContent = username;
  profileStatusEl.textContent = myStatus;
  profileImagePreview.src = localStorage.getItem('ml_profile_image') || 'https://via.placeholder.com/100';
});

saveProfileBtn.addEventListener('click', () => {
  localStorage.setItem('ml_profile_image', profileImagePreview.src);
  profileModal.style.display = 'none';
  loadAvatar(); 
});
deleteProfilePhoto.addEventListener('click', (e) => {
  e.stopPropagation();
  localStorage.removeItem('ml_profile_image');
  loadAvatar();
});

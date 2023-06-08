let userId = window.localStorage.getItem('userId')
let secret_chat_enable = false;
let secret_chat_view = false;

var modal = document.getElementById("modal");
var openModalBtn = document.getElementById("openModalBtn");
var closeBtn = document.getElementsByClassName("close-modal")[0];

const socket = io('http://localhost:4200', {
    transports: [
        'websocket'
    ],
    query: {
        userId
    }
})

_base_point_private_key.value =  Math.floor(Math.random(userId) * 9) + 1;

if (!token) window.location = '/login'
let selectedUser

const chatsList = document.querySelector('.chats-list')

const usersFetch = async () => {
    let users = await request('/users', 'GET')
    users = await users.json()
    usersRenderer(users)
}

const usersRenderer = (users) => {
    let string = ''
    users.forEach(user => {
        if (user.user_id != userId) {
            string += `
                <li class="chats-item" data-id="${user.user_id}">
                    <img src="./img/man-user.svg" alt="profile-picture" />
                    <p>${user.username}</p>
                    <span class="onlineStatus" style="margin-left: auto; color: rgb(0, 0, 0);"></span>
                    <span class="unreadMessages">24</span>
                </li>
            `
        }
        else {
            profileName.textContent = user.username
            contact.textContent = user.contact
        }
    })
    chatsList.innerHTML = string
    let lists = document.querySelectorAll('.chats-item')
    lists.forEach(list => {
        list.onclick = async () => {
            lists.forEach(list => list.classList.remove('active'))
            currentUser.innerHTML = list.childNodes[3].textContent
            selectedUser = list.dataset.id
            list.classList.add('active')
            if (message_exchange_block.classList.contains('message-exchange__visible')) {
                message_exchange_block.classList.remove('message-exchange__visible')
            }
            let messages = await request(`/messages?receiverId=${list.dataset.id}`, 'GET')
            messages = await messages.json()
            messagesRenderer(messages)
        }
    })
} 

const messagesRenderer = (messages) => {
    let string = ''
    messages.forEach((message) => {
      let message_text = message.message_text
      if (secret_chat_view && message.is_secret) {
        message_text = viewDecryption(message_text)
      }
      string += `
          <div class="msg-wrapper ${message.sender_id == userId ? "msg-from" : ""}">
              <img src="./img/man-user.svg" alt="profile-picture" />
              <div class="msg-text">
                  <p class="msg-author">${message.sender_id == userId ? profileName.textContent : currentUser.textContent}</p>
                  <p class="msg ${message.is_secret ? "msg-spoiler" : ""}">${message_text}</p>
                  <p class="time">${message.time}</p>
              </div>
          </div>
      `
  })
    chatMain.innerHTML = string
}

usersFetch()

function viewDecryption(messageText) {
  var key = window.localStorage.getItem('encriptionKey')
  return CryptoJS.AES.decrypt(messageText, key).toString(CryptoJS.enc.Utf8);
}

form.onsubmit = async (e) => {
    e.preventDefault()
    let messageText = textInput.value
    var key = window.localStorage.getItem('encriptionKey'); 
    if (secret_chat_enable) {
      messageText = CryptoJS.AES.encrypt(messageText, key).toString();      
    }

    let response = await request('/messages', 'POST', {
        text: messageText,
        sender_id: userId,
        receiverId: selectedUser,
        isSecret: secret_chat_enable,
        time: getDate()
    })

    socket.emit('create message', selectedUser)

    let messages = await request(`/messages?receiverId=${selectedUser}`, 'GET')
    messages = await messages.json()
    messagesRenderer(messages)
    textInput.value = ''
}

const getMessages = async (receiverId) => {
    let messages = await request(`/messages?receiverId=${receiverId}`, 'GET')
    messages = await messages.json()
    messagesRenderer(messages)
}

close_btn.onclick = () => {
	window.localStorage.removeItem('token')
	window.localStorage.removeItem('userId')
	setTimeout( () => {
		window.location = '/login'
	}, 500)
}

message_exchange_enable_btn.onclick = () => {
    window.localStorage.setItem('privateKeyA', _base_point_private_key.value)
    secret_chat_enable = !secret_chat_enable
    if(secret_chat_enable) {
        message_exchange_enable_btn.innerHTML = 'O\'chirish'
    } else {
        message_exchange_enable_btn.innerHTML = 'Yoqish' 
    }
    socket.emit('invite secret chat', {receiverId: selectedUser, status: secret_chat_enable, encryptionInfo: getEncryptionInfo()})
}

message_exchange_view_message.onclick = async() => {
  secret_chat_view = !secret_chat_view
  if(secret_chat_view) {
    message_exchange_view_message.innerHTML = 'Yashirish'
  } else {
    message_exchange_view_message.innerHTML = 'Ko\'rish' 
  }
  let messages = await request(`/messages?receiverId=${selectedUser}`, 'GET')
  messages = await messages.json()
  messagesRenderer(messages)
}

message_exchange_enable_btn2.onclick = () => {
  window.localStorage.setItem('privateKeyA', _base_point_private_key.value)
  secret_chat_enable = !secret_chat_enable
  message_exchange_enable_btn.innerHTML = 'O\'chirish' 
  generate(+window.localStorage.getItem('privateKeyA'), +window.localStorage.getItem('privateKeyB'))
  socket.emit('confirm secret chat', {receiverId: selectedUser, status: secret_chat_enable, encryptionInfo: getEncryptionInfo()})
  modal.style.display = "none";
}

closeBtn.onclick = function() {
  modal.style.display = "none";
}

const getDate = () => {
    date = new Date()
    hour = date.getHours() > 10 ? date.getHours() : '0' + date.getHours() 
    minute = date.getMinutes() > 10 ? date.getMinutes() : '0' + date.getMinutes() 
    return hour + ":" + minute
}

if (selectedUser == undefined) {
    message_exchange_block.classList.add('message-exchange__visible')
} else if (message_exchange_block.classList.contains('message-exchange__visible')) {
    message_exchange_block.classList.remove('message-exchange__visible')
}

socket.on('online users', (users) => {
    let usersElements = document.querySelectorAll('.chats-item')
    for (let user in users) {
        usersElements.forEach(usersElement => {
            if (usersElement.dataset.id == user && users[user]) {
                usersElement.childNodes[5].textContent = 'online'
            } else {
                usersElement.childNodes[5].textContent = ''
            }
        })
    }
})

base_point_odd_number.innerHTML = _base_point_odd_number.value
base_point_coff_b.innerHTML = _base_point_coff_b.value
base_point_coff_a.innerHTML = _base_point_coff_a.value

_base_point_odd_number.onchange = (event) => {
    base_point_odd_number.innerHTML = event.target.value
}

_base_point_coff_a.onchange = (event) => {
    base_point_coff_a.innerHTML = event.target.value
}

_base_point_coff_b.onchange = (event) => {
    base_point_coff_b.innerHTML = event.target.value
}

socket.on('new message', (userobj) => {
    getMessages(userobj.senderId)
})

socket.on('invite secret chat', async (info) => {
    let users = await request('/users', 'GET')
    users = await users.json()
    var inviteUser = users.find(user => user.user_id == info.senderId)
    if (inviteUser) {
      window.localStorage.setItem('privateKeyB', info.encryptionInfo.private_key)
      modal_title_text.innerHTML = inviteUser.username + ' sizga maxfiy chat so\'rovini yubordi. '
      modal_content_text.innerHTML = 'Maxfiy chatni boshlash uchun Confirm tugmasini bosing';
      modal.style.display = "block";
      message_exchange_enable_btn2.style.display = "block"
    }
})

socket.on('start secret chat', async(info) => {
  let users = await request('/users', 'GET')
  users = await users.json()
  var confirmUser = users.find(user => user.user_id == info.senderId)
  if (confirmUser) {
    window.localStorage.setItem('privateKeyB', info.encryptionInfo.private_key)
    modal_title_text.innerHTML = confirmUser.username + ' maxfiy chat so\'rovini qabul qildi. '
    modal_content_text.innerHTML = 'Manfiy chat rejimi yoqildi';
    modal.style.display = "block";
    message_exchange_enable_btn2.style.display = "none"
    generate(+window.localStorage.getItem('privateKeyA'), +window.localStorage.getItem('privateKeyB'))
  }
})

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users/";

const userList = [];

const userCardContainer = document.querySelector("#user-card-container");
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

function renderUserCard(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `
    <div class="card m-2" id="user-card">
      <img src="${item.avatar
      }" class="card-img-top" id="user-photo" data-bs-toggle="modal" data-bs-target="#user-modal" data-id="${item.id
      }" alt="User Photo">
      <p class="card-text" id="user-name">${item.name + ' ' + item.surname}</p>
    </div>
    `;
  });
  userCardContainer.innerHTML = rawHTML;
}

function showUserModal(id) {
  const modalName = document.querySelector("#user-modal-name");
  const modalImg = document.querySelector("#user-modal-img");
  const modalInfo = document.querySelector("#user-modal-info");

  modalName.textContent = "";
  modalImg.src = "";
  modalInfo.textContent = "";

  axios.get(INDEX_URL + id).then((response) => {
    const user = response.data;
    modalName.textContent = user.name + ' ' + user.surname;
    modalImg.src = user.avatar;
    modalInfo.innerHTML = `
      <p>Gender: ${user.gender}</p>
      <p>Birthday (Age): ${user.birthday} (${user.age})</p>
      <p>Region: ${user.region}</p>
      <p>Email: ${user.email}</p>
    `;
  });
}

userCardContainer.addEventListener("click", function onImgClicked(event) {
  if (event.target.matches(".card-img-top")) {
    showUserModal(event.target.dataset.id);
  }
});

searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  let filteredUsers = []
  filteredUsers = userList.filter((user) => (user.name + user.surname).toLowerCase().includes(keyword)
  )
  if (filteredUsers.length === 0) {
    return alert(`您輸入的關鍵字：${keyword}沒有符合的用戶`)
  }
  renderUserCard(filteredUsers)
})

axios
  .get(INDEX_URL)
  .then((response) => {
    userList.push(...response.data.results);
    renderUserCard(userList);
  })
  .catch((err) => console.log(err));

const API_URL = "https://api.github.com/users/";
const form = document.querySelector("#form");
const profile_card = document.querySelector("#profile-card");
const search_field = document.querySelector("#search");

const create_user_card = (user_data) => {
    const user_id = user_data.name || user_data.login;
    const profile_image = user_data.avatar_url;
    const user_bio = user_data.bio ? user_data.bio : "";
    const card_model = `
    <div id="card" class="card">
        <img src="${profile_image}" alt="Github profile photo." />
        <div class="user-info">
            <h2>${user_id}</h2>
            <p>${user_bio}</p>
            <ul>
            <li>${user_data.followers} <strong>Followers</strong></li>
            <li>${user_data.following} <strong>Following</strong></li>
            <li>${user_data.public_repos} <strong>Repos</strong></li>
            </ul>
        </div>
        <div id="repositories"></div>
    </div>
    `;
    profile_card.innerHTML = card_model;
};

const set_repo_list = (repositories) => {
    const repos_list = document.querySelector("#repositories");

    repositories.slice(0, 5).forEach((repository) => {
        const repository_link = document.createElement("a");
        repository_link.href = repository.html_url;
        repository_link.target = "_blank";
        repository_link.innerText = repository.name;
        repos_list.appendChild(repository_link);
    });
};

const get_repository_list = async (username) => {
    const response = await fetch(API_URL + `${username}/repos`);
    let repositories = await response.json();
    set_repo_list(repositories);
};

const get_user_info = async (username) => {
    try {
        const response = await fetch(API_URL + username);
        let user_data = await response.json();
        if (response.status === 404) throw new Error("404 User not Found!");
        create_user_card(user_data);
        get_repository_list(username);
    } catch (error) {
        alert("Invalid username");
    }
};

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = search_field.value;
    if (username) {
        get_user_info(username);
    }
    search_field.value = "";
});

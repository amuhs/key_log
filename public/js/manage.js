async function handleDelete(event) {
    const selectedKeys = document.getElementsByClassName("selected");
    const selectedKeyIDs = Array.prototype.map.call(selectedKeys, key => key.id);
    const deleteResult = await fetch("/keys", {
        method: "DELETE",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            ids: selectedKeyIDs
        })
    }).then(response => response.json());
    console.log(deleteResult);
    getKeys();
}

async function handleClick(event) {
  let key = document.getElementById(event.target.id);
  key.classList.add("selected");
}

async function getKeys() {
  let keys = await fetch("/keys").then((response) => response.json());
  keys = keys.data.sort();
  const root = document.getElementById("root");

  for (key of keys) {
    let newButton = document.createElement("span");
    newButton.className = "key";
    newButton.textContent = `${key.label}`;
    newButton.id = key._id;
    newButton.onclick = (e) => {
      handleClick(e);
    };

    if (!key.available) {
      newButton.classList.add("checked-out");
    }

    root.append(newButton);
  }
}

getKeys();

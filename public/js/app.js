async function handleClick(event) {
  const isCheckedOut = event.target.classList.contains("checked-out");
  
  const putResult = await fetch(`/keys/${event.target.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      label: event.target.textContent,
      available: isCheckedOut,
    }),
  }).then((response) => response.json());

  const root = document.getElementById("root");
  while (root.firstChild) {
    root.removeChild(root.lastChild);
  }
  getKeys();
}

async function getKeys() {
  let keys = await fetch("/keys").then((response) => response.json());
  keys = keys.data.sort();
  const root = document.getElementById("root");

  for (key of keys) {
    let newButton = document.createElement("span");
    newButton.className = "key";
    newButton.type = "button";
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

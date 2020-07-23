async function getKeys() {
    let keys = await fetch("/api/v1/key").then(response => response.json());
    keys = keys.sort((a, b) => a.created_ms < b.created_ms);
    const keys_in = document.getElementById("keys-in");
    const keys_out = document.getElementById("keys-out");
    for (key of keys) {
        let newDiv = document.createElement("div");
        newDiv.className = "item hover"
        newDiv.onclick = (el) => {
            if (el.target.childElementCount === 0) {
                console.log(el.target.parentElement);
            } else {
                console.log(el.target);
            }
        };

        let newH2 = document.createElement("h2");
        newH2.textContent = `#${key.key_id}`;
        newDiv.appendChild(newH2);
        if (key.key_avail) {
            keys_in.appendChild(newDiv);
        } else {
            keys_out.appendChild(newDiv);
        }
    }
}

getKeys();
async function handleSubmit() {
    const keyId = document.getElementById("key-id");
    const keyDesc = document.getElementById("key-desc");
    const addP = document.getElementById("add-result");

    if (!Number.isInteger(parseInt(keyId.value))) {
        alert("A Key ID can only be a number greater than or equal to 0.");
        return;
    }

    const alreadyExists = await fetch(`/api/v1/key/exists/${keyId.value}`).then(response => response.json());
    if (!alreadyExists.keyExists) {
        const data = {  
            id: keyId.value,
            desc: keyDesc.value
        }
        const postResult = await fetch("/api/v1/key/add", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then(response => response.json());
        
        if (postResult.status === "SUCCESS") {
            addP.textContent = `Created key: ${postResult.newKey.key_id}`;
        } else {
            addP.textContent = `A key with the id of ${postResult.newKey.key_id} already exists.`;
        }
    } else {
        addP.textContent = `A key with the id of ${keyId.value} already exists.`;
    }

    keyId.value = "";
    keyDesc.value = "";
    keyId.focus();
}
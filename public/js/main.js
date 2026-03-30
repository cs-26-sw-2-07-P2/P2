fetch('/api/users')
  .then(res => res.json())
  .then(users => {
    const ul = document.createElement('ul');
    users.forEach(u => {
      const li = document.createElement('li');
      li.textContent = `${u.name} (${u.email})`;
      ul.appendChild(li);
    });
    document.body.appendChild(ul);
  })
  .catch(err => console.error(err));
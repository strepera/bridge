export default async function getGist(patch) {
    if (!patch) {
        const response = await fetch(`https://api.github.com/gists/${process.env.gistId}`, {
            method: 'GET',
            headers: {
                'Authorization': `token ${process.env.gistKey}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        const gistData = await response.json();
        global.usersData = JSON.parse(gistData.files['users.json'].content);
        const users = JSON.parse(gistData.files['users.json'].content);
        global.usersData = users;
        return users;
    }
    else {
        await fetch(`https://api.github.com/gists/${process.env.gistId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `token ${process.env.gistKey}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                files: {
                    'users.json': {
                        content: patch
                    }
                }
            })
        });

        const response0 = await fetch(`https://api.github.com/gists/${process.env.gistId}`, {
            method: 'GET',
            headers: {
                'Authorization': `token ${process.env.gistKey}`,
                'Accept': 'application/vnd.github.v3+json'
            }
          });
          const gistData0 = await response0.json();
          global.usersData = JSON.parse(gistData0.files['users.json'].content);
    }
}
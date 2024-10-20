const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter your Local username: ', (username) => {
  rl.close();
  
  // Guardar el nombre de usuario en un archivo JSON
  const userData = { userName: username };
  fs.writeFileSync('user_config.json', JSON.stringify(userData));
  
  console.log(`Nombre de usuario guardado: ${username}`);
});

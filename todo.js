const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Create interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ensure files directory exists
if (!fs.existsSync('files')) {
  fs.mkdirSync('files');
}

// Ensure todo.json exists
if (!fs.existsSync('todo.json')) {
  fs.writeFileSync('todo.json', '[]');
}

// Main menu
function showMenu() {
  console.log(`
  🎮 CLI File Manager & TODO App 🎮
  ================================
  1. 📂 List files
  2. ➕ Create file
  3. ❌ Delete file
  4. 📝 View file
  5. ✅ Add TODO item
  6. 📋 List TODOs
  7. 🗑️ Remove TODO
  8. 🚪 Exit
  `);

  rl.question('Choose an option (1-8): ', (choice) => {
    switch(choice) {
      case '1': listFiles(); break;
      case '2': createFile(); break;
      case '3': deleteFile(); break;
      case '4': viewFile(); break;
      case '5': addTodo(); break;
      case '6': listTodos(); break;
      case '7': removeTodo(); break;
      case '8': rl.close(); break;
      default: 
        console.log('❌ Invalid choice!');
        showMenu();
    }
  });
}

// File operations
function listFiles() {
  console.log('\n📂 Files in directory:');
  fs.readdirSync('files').forEach(file => {
    console.log(`- ${file}`);
  });
  showMenu();
}

function createFile() {
  rl.question('Enter filename: ', (filename) => {
    rl.question('Enter content: ', (content) => {
      fs.writeFileSync(path.join('files', filename), content);
      console.log(`✅ File ${filename} created!`);
      showMenu();
    });
  });
}

function deleteFile() {
  rl.question('Enter filename to delete: ', (filename) => {
    try {
      fs.unlinkSync(path.join('files', filename));
      console.log(`✅ File ${filename} deleted!`);
    } catch {
      console.log('❌ File not found!');
    }
    showMenu();
  });
}

function viewFile() {
  rl.question('Enter filename to view: ', (filename) => {
    try {
      const content = fs.readFileSync(path.join('files', filename), 'utf8');
      console.log(`\n📄 Content of ${filename}:\n${content}`);
    } catch {
      console.log('❌ File not found!');
    }
    showMenu();
  });
}

// TODO operations
function addTodo() {
  rl.question('Enter new TODO item: ', (todo) => {
    const todos = JSON.parse(fs.readFileSync('todo.json'));
    todos.push(todo);
    fs.writeFileSync('todo.json', JSON.stringify(todos));
    console.log('✅ TODO added!');
    showMenu();
  });
}

function listTodos() {
  const todos = JSON.parse(fs.readFileSync('todo.json'));
  console.log(todos)
  console.log('\n📋 TODO List:');
  todos.forEach((todo, index) => {
    console.log(`${index + 1}. ${todo}`);
  });
  showMenu();
}

function removeTodo() {
  const todos = JSON.parse(fs.readFileSync('todo.json'));
// listTodos(); // Show list first
    todos.forEach((todo, index) => {
        console.log(`${index + 1}. ${todo}`);
    });
  
  rl.question('Enter number to remove: ', (num) => {
    const index = parseInt(num) - 1;
    if (index >= 0 && index < todos.length) {
      todos.splice(index, 1);
      fs.writeFileSync('todo.json', JSON.stringify(todos));
      console.log('✅ TODO removed!');
    } else {
      console.log('❌ Invalid number!');
    }
    showMenu();
  });
}

// Start the app
showMenu();

// Handle exit
rl.on('close', () => {
  console.log('\n👋 Goodbye!');
  process.exit(0);
});


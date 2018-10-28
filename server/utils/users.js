// an array of objects
[{
  id: '/#12hjwjhwfcydg',
  name: 'Ashish',
  room: 'The Office Fans'
}]

// We're going to have four methods to manipulate the array
class Users {
  constructor(){	//	A constructor function is automatically fires, and lets you initialize the instance of your class.
    this.users = [];
  }
  addUser(id, name, room){
    var user = {id, name, room};
    this.users.push(user);
    return user;
  }

  removeUser(id){
    var user = this.getUser(id);

    if(user) {
      this.users = this.users.filter((user) => user.id !== id);
    }

    return user;
  }

  getUser(id){
    return this.users.filter((user) => user.id === id)[0]
  }

  getUserList(room){
      var users = this.users.filter((user) => user.room === room);
      var namesArray = users.map((user) => user.name);	//	convert array of objects to an array of strings

      return namesArray;
  }
}

module.exports = {Users};

// class Person{
//   constructor(name, age){
//     this.name = name;
//     this.age = age;
//   }
//   getUserDescription(){
//     return `${this.name} is ${this.age} year(s) old.`;
//   }
// }
// var me = new Person('Ashish', 25);
// var description = me.getUserDescription();
// console.log(description);

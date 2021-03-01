const fileService = require('./fileService')

exports.register = (credential)=>{

   const {email} = {...credential}
   let users = fileService.getFileContents('../data/users.json');

   const passedUser =  users.reduce((authObj, user)=>{
     
    if(user.email !== email){
      authObj.validEmail = true;
    } else {
      authObj.validEmail = false;
    }

    if(authObj.validEmail===true){
      authObj.user = user;
    } else {
      authObj.user = null;
    }
         
    return authObj

   }, {validEmail:false, user:null})
   return passedUser
}

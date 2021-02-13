const AccessControl = require("accesscontrol");
const ac = new AccessControl();
 
exports.roles = (function() {
ac.grant("User")
 .readOwn("profile")
 .updateOwn("profile"),
  
ac.grant("Admin")
 .extend("User")
 .readAny("profile")
 .updateAny("profile")
 .deleteAny("profile")
 
return ac;
})();

// // Access controls roles
// const AccessControl = require("accesscontrol");

// let grantsObject = {
//     Admin: {
//         profile : {
//             "read:any": ["*"],
//             "update:any": ["*"],
//             "delete:any": ["*"]
//         }
//     },
//     User: {
//         profile: {
//             "read:own": ["*"],
//             "update:own": ["*"]
//         }
//     }
// };

// // Init
// const accessCtrl = new AccessControl();

// // Roles access
// // Here adding the access rules and to what we give access to a specific role
// // Basic, Moderator, Admin
// // Admin => Read/Write full powers
// // Moderator => Read access everywhere
// // Basic => Read/write own information
// exports.roles = (() => {
//     accessCtrl.setGrants(grantsObject);

//     return accessCtrl;
// })();

